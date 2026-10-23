/* ==========================================================================
   Q-Lab — Activities page behaviour (js/activities.js)
   --------------------------------------------------------------------------
   Handles the Events / Projects tabs on activities.html.

   - Validates event records and rejects missing fields, missing/invalid dates,
     dates without a timezone offset, and end times earlier than start times.
   - Renders event cards from qLabEvents (defined in js/events.js),
     classifying each valid event as Upcoming (end time in the future) or Past
     (end time already passed) based on the absolute instant represented by the
     ISO 8601 end timestamp. Multi-day events stay Upcoming until their end.
   - Renders project cards from qLabProjects (defined in js/projects.js).
     Projects do not expire.
   - Provides accessible tab behaviour (keyboard + mouse).
   - Shows empty states when a section has no entries.
   - Reports invalid event records in the browser console for developer
     correction; invalid records are never silently classified.
   - No event or project data is hardcoded in this file.

   Future CMS integration: replace the data files or fetch data from a CMS
   API and populate the same qLabEvents / qLabProjects structures. The
   validation and rendering functions here will work unchanged.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */

  var ISO_WITH_TIMEZONE =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2})$/;

  var REQUIRED_EVENT_FIELDS = [
    "id",
    "title",
    "image",
    "start",
    "end",
    "venue",
    "description",
  ];

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function daysInMonth(year, month) {
    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isLeapYear(year)) return 29;
    return days[month - 1];
  }

  function parseISO(value) {
    if (typeof value !== "string") return null;

    var match = ISO_WITH_TIMEZONE.exec(value);
    if (!match) return null;

    var year = Number(match[1]);
    var month = Number(match[2]);
    var day = Number(match[3]);
    var hour = Number(match[4]);
    var minute = Number(match[5]);
    var second = match[6] ? Number(match[6]) : 0;
    var zone = match[8];

    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > daysInMonth(year, month) ||
      hour > 23 ||
      minute > 59 ||
      second > 59
    ) {
      return null;
    }

    if (zone !== "Z") {
      var offsetHour = Number(zone.slice(1, 3));
      var offsetMinute = Number(zone.slice(4, 6));
      if (offsetHour > 23 || offsetMinute > 59) return null;
    }

    var date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function isNonEmptyString(value) {
    return typeof value === "string" && value.trim() !== "";
  }

  function formatDateTime(value) {
    var date = parseISO(value);
    if (!date) return "Invalid date";
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

  /* ---------- Event validation ----------
     Required fields and date/time rules are documented in js/events.js and
     README.md. Invalid records are excluded from both event groups and logged
     for developer correction rather than being guessed at.
   ---------- */

  function validateEvent(event) {
    var errors = [];

    if (!event || typeof event !== "object" || Array.isArray(event)) {
      return {
        valid: false,
        errors: ["Record must be an object."],
        start: null,
        end: null,
      };
    }

    REQUIRED_EVENT_FIELDS.forEach(function (field) {
      if (!isNonEmptyString(event[field])) {
        errors.push("Missing or empty required field: " + field + ".");
      }
    });

    var start = null;
    var end = null;

    if (isNonEmptyString(event.start)) {
      start = parseISO(event.start);
      if (!start) {
        errors.push(
          'Invalid start date "' +
            event.start +
            '"; expected ISO 8601 with a timezone offset.'
        );
      }
    }

    if (isNonEmptyString(event.end)) {
      end = parseISO(event.end);
      if (!end) {
        errors.push(
          'Invalid end date "' +
            event.end +
            '"; expected ISO 8601 with a timezone offset.'
        );
      }
    }

    if (start && end && end.getTime() < start.getTime()) {
      errors.push("End time is earlier than start time.");
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      start: start,
      end: end,
    };
  }

  function reportInvalidEvent(event, index, errors) {
    var identifier =
      event && isNonEmptyString(event.id) ? event.id : "record at index " + index;
    console.error(
      "[Q-Lab] Invalid event (" +
        identifier +
        "): " +
        errors.join(" ") +
        " Fix js/events.js before launch.",
      event
    );
  }

  /* ---------- Event classification ----------
     Display-only: records are never deleted. Compared against the current
     instant on every page load / refresh. ISO timestamps include an explicit
     offset, so comparison uses the represented absolute instant; display is
     formatted in Asia/Kolkata time.
   ---------- */

  function classifyEvents(events) {
    if (!Array.isArray(events)) {
      console.error(
        "[Q-Lab] qLabEvents must be an array. No events can be displayed."
      );
      return { upcoming: [], past: [], invalid: [] };
    }

    var now = new Date();
    var upcoming = [];
    var past = [];
    var invalid = [];

    events.forEach(function (event, index) {
      var result = validateEvent(event);

      if (!result.valid) {
        invalid.push({ event: event, errors: result.errors });
        reportInvalidEvent(event, index, result.errors);
        return;
      }

      var item = {
        event: event,
        start: result.start,
        end: result.end,
      };

      if (result.end.getTime() > now.getTime()) {
        upcoming.push(item);
      } else {
        past.push(item);
      }
    });

    upcoming.sort(function (a, b) {
      return a.start.getTime() - b.start.getTime(); // soonest start first
    });

    past.sort(function (a, b) {
      return b.end.getTime() - a.end.getTime(); // most recent end first
    });

    return { upcoming: upcoming, past: past, invalid: invalid };
  }

  function renderEventCard(container, event) {
    var article = document.createElement("article");
    article.className = "card event-card";

    var imageDiv = document.createElement("div");
    imageDiv.className = "card-image";
    imageDiv.setAttribute("aria-hidden", "true");
    renderImage(imageDiv, event.image, event.title);
    article.appendChild(imageDiv);

    var dates = document.createElement("div");
    dates.className = "event-dates";
    dates.textContent =
      formatDateTime(event.start) + " \u2013 " + formatDateTime(event.end) + " IST";
    article.appendChild(dates);

    var venue = document.createElement("div");
    venue.className = "event-venue";
    venue.textContent = event.venue;
    article.appendChild(venue);

    var title = document.createElement("h3");
    title.textContent = event.title;
    article.appendChild(title);

    var description = document.createElement("p");
    description.textContent = event.description;
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
      upcomingContainer.appendChild(
        emptyElement("No upcoming events scheduled.")
      );
    } else {
      classified.upcoming.forEach(function (item) {
        renderEventCard(upcomingContainer, item.event);
      });
    }

    if (classified.past.length === 0) {
      pastContainer.appendChild(emptyElement("No past events to display."));
    } else {
      classified.past.forEach(function (item) {
        renderEventCard(pastContainer, item.event);
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
      renderImage(imageDiv, p.image, p.title);
      article.appendChild(imageDiv);

      var title = document.createElement("h3");
      title.textContent = p.title;
      article.appendChild(title);

      var summary = document.createElement("p");
      summary.textContent = p.summary;
      article.appendChild(summary);

      if ((p.technologies || []).length > 0) {
        var tech = document.createElement("div");
        tech.className = "tech-list";
        (p.technologies || []).forEach(function (t) {
          var tag = document.createElement("span");
          tag.className = "tech-tag";
          tag.textContent = t;
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

    function showTab(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var active = i === index;
        tab.setAttribute("aria-selected", String(active));
        tab.setAttribute("tabindex", active ? "0" : "-1");

        if (!panels[i]) return;

        if (active) {
          panels[i].classList.remove("hidden");
          panels[i].removeAttribute("aria-hidden");
        } else {
          panels[i].classList.add("hidden");
          panels[i].setAttribute("aria-hidden", "true");
        }
      });

      if (moveFocus) tabs[index].focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        showTab(index, true);
      });

      tab.addEventListener("keydown", function (e) {
        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            showTab((index + 1) % tabs.length, true);
            break;
          case "ArrowLeft":
            e.preventDefault();
            showTab((index - 1 + tabs.length) % tabs.length, true);
            break;
          case "Home":
            e.preventDefault();
            showTab(0, true);
            break;
          case "End":
            e.preventDefault();
            showTab(tabs.length - 1, true);
            break;
          case " ":
          case "Enter":
            e.preventDefault();
            showTab(index, true);
            break;
        }
      });
    });

    showTab(0, false);
  }

  /* ---------- Initialise ---------- */

  renderEvents();
  renderProjects();
  initTabs();
})();
