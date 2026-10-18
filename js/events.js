/* ==========================================================================
   Q-Lab — Event data (js/events.js)
   --------------------------------------------------------------------------
   Single source of truth for all Q-Lab events. Used by activities.html via
   js/activities.js to render event cards dynamically.

   Edit this file to add, edit, or remove events. Do not duplicate event
   information elsewhere in the project.

   Sample entries below are clearly marked and should be replaced with real
   events before launch. When there are no events, the Events tab shows a
   "Coming soon" state automatically.

   Fields (all required unless noted):
     id       - unique identifier (string)
     title    - event title shown on the card (string)
     image    - relative path to an event image; broken/missing images fall
                back to an "[Image not available]" notice (string)
     start    - start date/time, ISO 8601 with offset, e.g.
                "2027-03-15T10:00:00+05:30" (use +05:30 for India) (string)
     end      - end date/time, ISO 8601 with offset. Used to classify the
                event as Upcoming (end in the future) or Past (end already
                passed) (string)
     venue    - event venue (string)
     description - short description shown on the card (string)

   Date/time rule: All dates use ISO 8601 strings with the +05:30 offset for
   Indian Standard Time (IST), e.g. "2027-03-15T10:00:00+05:30". The page
   compares each event's end time against the current time on every load to
   classify it as Upcoming or Past. Records are never deleted automatically.
   ========================================================================== */

const qLabEvents = [
  {
    id: "evt-sample-quantum-workshop-2027",
    title: "Introduction to Quantum Computing Workshop",
    image: "assets/images/events/quantum-workshop-2027.jpg",
    start: "2027-03-15T10:00:00+05:30",
    end: "2027-03-15T16:00:00+05:30",
    venue: "Seminar Hall, Main Building, Government College of Engineering, Erode",
    description: "A hands-on beginner workshop covering qubits, superposition, and basic quantum gates.",
  },
  {
    id: "evt-sample-guest-lecture-2027",
    title: "Guest Lecture: Quantum Algorithms",
    image: "assets/images/events/guest-lecture-2027.jpg",
    start: "2027-04-05T14:00:00+05:30",
    end: "2027-04-05T16:00:00+05:30",
    venue: "Lecture Hall 3, Government College of Engineering, Erode",
    description: "Overview of Shor's and Grover's algorithms followed by an open discussion.",
  },
  {
    id: "evt-sample-inauguration-2026",
    title: "Q-Lab Club Inauguration",
    image: "assets/images/events/inauguration-2026.jpg",
    start: "2026-09-10T11:00:00+05:30",
    end: "2026-09-10T13:00:00+05:30",
    venue: "Auditorium, Government College of Engineering, Erode",
    description: "Official launch of Q-Lab, the quantum computing club of GCE Erode.",
  },
];

/* [SAMPLE DATA — all events above are placeholders; replace with real events
   before launch. Keep image paths, dates, and venues accurate to actual
   events. Do not fabricate event details.] */
