/* ==========================================================================
   Q-Lab — Event data (js/events.js)
   --------------------------------------------------------------------------
   Single source of truth for all Q-Lab events. Used by activities.html via
   js/activities.js to render event cards dynamically.

   Add only approved institutional events. Do not add sample or placeholder
   events to this file.

   Fields (all required):
     id          - unique identifier (string)
     title       - event title shown on the card (string)
     image       - relative path to an event image; broken/missing files fall
                   back to an "[Image not available]" notice (string)
     start       - start date/time, ISO 8601 with a timezone offset, e.g.
                   "2027-03-15T10:00:00+05:30" (string)
     end         - end date/time, ISO 8601 with a timezone offset. An event is
                   Upcoming while this instant is in the future and Past once
                   it has passed. Multi-day events remain Upcoming until their
                   end date/time (string)
     venue       - event venue (string)
     description - short description shown on the card (string)

   Date/time rule: Use ISO 8601 with an explicit offset. For India use
   "+05:30". Zulu timestamps ("...Z") are also accepted. Dates without a
   timezone offset are rejected so classification is never browser-local.

   Validation: js/activities.js validates every record on each render. Invalid
   records are not displayed or classified and are reported in the browser
   console for developer correction. Records are never deleted automatically.
   ========================================================================== */

const qLabEvents = [
  // Add approved Q-Lab events here using the field schema above.
];
