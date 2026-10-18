/* ==========================================================================
   Q-Lab — Project data (js/projects.js)
   --------------------------------------------------------------------------
   Single source of truth for all Q-Lab projects. Used by activities.html via
   js/activities.js to render project cards dynamically.

   Edit this file to add, edit, or remove projects. Do not duplicate project
   information elsewhere in the project.

   Sample entries below are clearly marked and should be replaced with real
   projects before launch. When there are no projects, the Projects tab shows
   a "Coming soon" state automatically. Projects do not expire.

   Fields:
     id         - unique identifier (string)
     title      - project title shown on the card (string)
     image      - relative path to a project image; broken/missing images
                  fall back to an "[Image not available]" notice (string)
     summary    - short project summary (string)
     technologies - array of technology names shown as tags (array of strings,
                    optional — can be empty [])
     link       - optional external link. Rendered as a "View project" button
                  only when a valid link is supplied; use null or omit the
                  field when there is no link (string or null)

   Projects do not expire and are always displayed regardless of date.
   ========================================================================== */

const qLabProjects = [
  {
    id: "proj-sample-quantum-simulator-2027",
    title: "Quantum Circuit Simulator",
    image: "assets/images/projects/quantum-simulator-project.png",
    summary: "A browser-based simulator for small quantum circuits with visual state-vector output.",
    technologies: ["JavaScript", "HTML5 Canvas", "Web APIs"],
    link: "https://example.com/qcircuit-sim",
  },
  {
    id: "proj-sample-qiskit-guide-2027",
    title: "Qiskit Getting-Started Guide",
    image: "assets/images/projects/qiskit-guide-project.png",
    summary: "A step-by-step guide for running your first quantum program on IBM Quantum.",
    technologies: ["Qiskit", "Python"],
    link: null,
  },
  {
    id: "proj-sample-bb84-demo-2027",
    title: "Quantum Key Distribution Demo",
    image: "assets/images/projects/bb84-demo-project.png",
    summary: "An educational demonstration of the BB84 quantum key distribution protocol.",
    technologies: ["Python", "Matplotlib"],
    link: "https://example.com/bb84-demo",
  },
];

/* [SAMPLE DATA — all projects above are placeholders; replace with real
   projects before launch. Keep image paths, summaries, and links accurate
   to actual projects. Do not fabricate project details.] */
