/* ==========================================================================
   Q-Lab — Shared behaviour (js/main.js)
   --------------------------------------------------------------------------
   Loaded on every page. Handles:
   - HTML escaping for data rendered into the page
   - Responsive mobile navigation (keyboard + touch friendly)
   - Member profile rendering for About Us and Our Members pages
   - Scroll-reveal animation for member cards (Intersection Observer)
   - Reduced-motion detection
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */

  function initials(name) {
    return String(name)
      .split(/\s+/)
      .filter(Boolean)
      .map(function (part) {
        return part.charAt(0);
      })
      .join("")
      .toUpperCase() || "?";
  }

  /* ---------- Mobile navigation ---------- */

  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var menu = document.getElementById("nav-links");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      if (!expanded) {
        menu.classList.add("mobile-open");
      } else {
        menu.classList.remove("mobile-open");
      }
    });

    // Close the menu when a navigation link is clicked
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("mobile-open");
      });
    });
  }

  /* ---------- Scroll-reveal for member cards ---------- */

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initScrollReveal() {
    // If reduced motion is preferred, show all cards immediately without animation
    if (prefersReducedMotion()) {
      document.querySelectorAll(".reveal-card").forEach(function (card) {
        card.classList.add("reveal-visible");
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      });
      return;
    }

    // Intersection Observer is not available: show all cards immediately
    if (!window.IntersectionObserver) {
      document.querySelectorAll(".reveal-card").forEach(function (card) {
        card.classList.add("reveal-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, index) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal-card").forEach(function (card, index) {
      // Staggered delay: each card reveals slightly after the previous one
      card.style.transitionDelay = index * 80 + "ms";
      observer.observe(card);
    });
  }

  /* ---------- Member profile rendering ---------- */

  function renderMemberCard(member) {
    var article = document.createElement("article");
    article.className = "card profile-card reveal-card";

    var imageDiv = document.createElement("div");
    imageDiv.className = "card-image";
    imageDiv.setAttribute("aria-hidden", "true");

    var img = document.createElement("img");
    img.src = member.image;
    img.alt = "Profile photograph of " + member.name;
    img.addEventListener("error", function () {
      img.style.display = "none";
      var fallback = document.createElement("span");
      fallback.textContent = initials(member.name);
      fallback.style.cssText =
        "width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.25rem;color:var(--color-text-light)";
      imageDiv.appendChild(fallback);
    });
    imageDiv.appendChild(img);

    var name = document.createElement("h3");
    name.textContent = member.name;

    var role = document.createElement("p");
    role.className = "card-role";
    role.textContent = member.role;

    var department = document.createElement("p");
    department.className = "card-department";
    department.textContent =
      member.department +
      (member.year ? " · " + member.year : "") +
      (member.designation ? " · " + member.designation : "");

    var contribution = document.createElement("p");
    contribution.className = "card-contribution";
    contribution.textContent = member.contribution;

    article.appendChild(imageDiv);
    article.appendChild(name);
    article.appendChild(role);
    article.appendChild(department);
    article.appendChild(contribution);

    return article;
  }

  function renderMemberGroup(containerId, members) {
    var container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    members.forEach(function (member) {
      container.appendChild(renderMemberCard(member));
    });
  }

  function renderMembers() {
    if (typeof qLabMembers === "undefined") return;

    // Our Members page — separate student and faculty grids
    renderMemberGroup("student-list", qLabMembers.students);
    renderMemberGroup("faculty-list", qLabMembers.faculty);

    // Initialise scroll-reveal after rendering cards
    initScrollReveal();
  }

  /* ---------- Initialise ---------- */

  initMobileNav();
  renderMembers();
})();
