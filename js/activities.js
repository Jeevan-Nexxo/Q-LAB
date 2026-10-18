/* ==========================================================================
   Q-Lab — Activities page behaviour (js/activities.js)
   --------------------------------------------------------------------------
   Handles the Events / Projects tabs on activities.html.

   - Renders event cards from qLabEvents (defined in js/events.js),
     classifying each event as Upcoming (end time in the future) or Past
     (end time already passed) based on comparison with the current time.
   - Renders project cards from qLabProjects (defined in js/projects.js).
     Projects do not expire.
   - Provides accessible tab behaviour (keyboard + mouse).
   - Shows empty states when a section has no entries.
   - No sample data is hardcoded in this file; all content comes from
     js/events.js and js/projects.js.

   Future CMS integration: replace the data files or fetch data from a CMS
   API and populate the same qLabEvents / qLabProjects structures. The
   rendering functions here will work unchanged.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */

  function escapeHtml(text) {
    if (text == null) return "";
    return String(text).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function parseISO(value) {
    // ISO 8601 strings such as "2027-03-15T10:00:00+05:30" (IST)
    return new Date(value);
  }

  function formatDateTime(value) {
    var date = parseISO(value);
    if (Number.isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function emptyElement(message) {
    var div = document.createElement("div");
    div.className = "empty-state";
    div.textContent = message;
    return div;
  }

  function renderImage(imageDiv, imagePath, altText) {
    var img = document.createElement("img");
    img.src = imagePath;
    img.alt = altText;
    img.addEventListener("error", function () {
      img.style.display = "none";
      var fallback = document.createElement("span");
      fallback.textContent = "[Image not available]";
      fallback.style.cssText =
        "width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:0.85rem;color:var(--color-text-light)";
      imageDiv.appendChild(fallback);
    });
    imageDiv.appendChild(img);
  }

  /* ---------- Event classification ----------
     Display-only: records are never deleted. Compared against current time
     on every page load / refresh.
   ---------- */

  function classifyEvents(events) {
    var now = new Date();

    var upcoming = events
      .filter(function (e) {
        return parseISO(e.end) > now;
      })
      .sort(function (a, b) {
        return parseISO(a.start) - parseISO(b.start); // soonest start first
      });

    var past = events
      .filter(function (e) {
        return parseISO(e.end) <= now;
      })
      .sort(function (a, b) {
        return parseISO(b.end) - parseISO(a.end); // most recent end first
      });

    return { upcoming: upcoming, past: past };
  }

  function renderEventCard(container, event) {
    var article = document.createElement("article");
    article.className = "card event-card";

    var imageDiv = document.createElement("div");
    imageDiv.className = "card-image";
    imageDiv.setAttribute("aria-hidden", "true");
    renderImage(imageDiv, event.image, escapeHtml(event.title));
    article.appendChild(imageDiv);

    var dates = document.createElement("div");
    dates.className = "event-dates";
    dates.textContent =
      formatDateTime(event.start) + " \u2013 " + formatDateTime(event.end) + " IST";
    article.appendChild(dates);

    var venue = document.createElement("div");
    venue.className = "event-venue";
    venue.textContent = escapeHtml(event.venue);
    article.appendChild(venue);

    var title = document.createElement("h3");
    title.textContent = escapeHtml(event.title);
    article.appendChild(title);

    var description = document.createElement("p");
    description.textContent = escapeHtml(event.description);
    article.appendChild(description);

    container.appendChild(article);
  }

  function renderEvents() {
    var classified = classifyEvents(
      typeof qLabEvents !== "undefined" ? qLabEvents : []
    );
    var upcomingContainer = document.getElementById("upcoming-list");
    var pastContainer = document.getElementById("past-list");

    if (!upcomingContainer || !pastContainer) return;

    upcomingContainer.innerHTML = "";
    pastContainer.innerHTML = "";

    if (classified.upcoming.length === 0) {
      upcomingContainer.appendChild(emptyElement("No upcoming events."));
    } else {
      classified.upcoming.forEach(function (e) {
        renderEventCard(upcomingContainer, e);
      });
    }

    if (classified.past.length === 0) {
      pastContainer.appendChild(emptyElement("No past events."));
    } else {
      classified.past.forEach(function (e) {
        renderEventCard(pastContainer, e);
      });
    }
  }

  /* ---------- Projects rendering ---------- */

  function renderProjects() {
    var container = document.getElementById("projects-list");
    if (!container) return;

    var projects =
      typeof qLabProjects !== "undefined" ? qLabProjects : [];
    container.innerHTML = "";

    if (projects.length === 0) {
      container.appendChild(emptyElement("No projects listed."));
      return;
    }

    projects.forEach(function (p) {
      var article = document.createElement("article");
      article.className = "card project-card";

      var imageDiv = document.createElement("div");
      imageDiv.className = "card-image";
      imageDiv.setAttribute("aria-hidden", "true");
      renderImage(imageDiv, p.image, escapeHtml(p.title));
      article.appendChild(imageDiv);

      var title = document.createElement("h3");
      title.textContent = escapeHtml(p.title);
      article.appendChild(title);

      var summary = document.createElement("p");
      summary.textContent = escapeHtml(p.summary);
      article.appendChild(summary);

      if ((p.technologies || []).length > 0) {
        var tech = document.createElement("div");
        tech.className = "tech-list";
        (p.technologies || []).forEach(function (t) {
          var tag = document.createElement("span");
          tag.className = "tech-tag";
          tag.textContent = escapeHtml(t);
          tech.appendChild(tag);
        });
        article.appendChild(tech);
      }

      // Optional link: rendered only when a valid link is supplied
      if (p.link) {
        var link = document.createElement("a");
        link.className = "card-link";
        link.href = p.link;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "View project \u2192";
        article.appendChild(link);
      }

      container.appendChild(article);
    });
  }

  /* ---------- Accessible tabs ---------- */

  function initTabs() {
    var tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;

    var tabs = Array.prototype.slice.call(
      tablist.querySelectorAll('[role="tab"]')
    );
    var panels = tabs.map(function (tab) {
      return document.getElementById(tab.getAttribute("aria-controls"));
    });

    function showTab(index) {
      tabs.forEach(function (tab, i) {
        var active = i === index;
        tab.setAttribute("aria-selected", String(active));
        tab.setAttribute("tabindex", active ? "0" : "-1");

        // Use a class instead of the hidden attribute so opacity can transition
        if (active) {
          panels[i].classList.remove("hidden");
        } else {
          panels[i].classList.add("hidden");
        }
      });
      tabs[index].focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        showTab(index);
      });

      tab.addEventListener("keydown", function (e) {
        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            showTab((index + 1) % tabs.length);
            break;
          case "ArrowLeft":
            e.preventDefault();
            showTab((index - 1 + tabs.length) % tabs.length);
            break;
          case "Home":
            e.preventDefault();
            showTab(0);
            break;
          case "End":
            e.preventDefault();
            showTab(tabs.length - 1);
            break;
          case " ":
          case "Enter":
            e.preventDefault();
            showTab(index);
            break;
        }
      });
    });

    showTab(0);
  }

  /* ---------- Initialise ---------- */

  renderEvents();
  renderProjects();
  initTabs();
})();
