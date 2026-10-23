/* ==========================================================================
   Q-Lab — Project data (js/projects.js)
   --------------------------------------------------------------------------
   Single source of truth for all Q-Lab projects. Used by activities.html via
   js/activities.js to render project cards dynamically.

   Add only approved Q-Lab projects. Do not add sample or placeholder projects
   to this file.

   Fields:
     id           - unique identifier (string)
     title        - project title shown on the card (string)
     image        - relative path to a project image; broken/missing files fall
                    back to an "[Image not available]" notice (string)
     summary      - short project summary (string)
     technologies - array of technology names shown as tags (array of strings,
                    optional — can be empty [])
     link         - optional external link. Rendered as a "View project" button
                    only when a valid link is supplied; use null or omit the
                    field when there is no link (string or null)

   Projects do not expire and are always displayed regardless of date.
   ========================================================================== */

const qLabProjects = [
  // Add approved Q-Lab projects here using the field schema above.
];
