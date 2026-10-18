/* ==========================================================================
   Q-Lab — Member data (js/members.js)
   --------------------------------------------------------------------------
   Single source of truth for all Q-Lab members. Used by the Our Members page
   via js/main.js.

   Edit this file to add, remove, or update members. Do not duplicate member
   information elsewhere in the project.

   Image files: Real member photographs should be placed in
   assets/images/members/ using the naming convention below. Until the owner
   supplies real images, the paths reference placeholder filenames that do not
   yet exist; missing images fall back to the member's initials.

   Suggested image filenames (lowercase, hyphenated):
     assets/images/members/suryaprakash-b.jpg
     assets/images/members/vikash-v.jpg
     assets/images/members/arun-vasudev-c.jpg
     assets/images/members/kamali-r-c.jpg
     assets/images/members/yuvaasri-s.jpg
     assets/images/members/dr-k-balamurugan.jpg
     assets/images/members/dr-sathyakala-m.jpg
     assets/images/members/dr-sumithra-t-r.jpg

   Fields:
     id           - unique identifier (string)
     name         - member name (string)
     group        - "students" or "faculty" (string)
     image        - relative path to a profile photograph; broken/missing
                    images fall back to the member's initials (string)
     role         - designation or role shown on the card (string)
                     Examples: "President", "Faculty Mentor"
     department   - academic department (string)
     year         - year of study for students, e.g. "III Year" (string,
                    optional — faculty entries may omit this)
     designation  - job title for faculty, e.g. "Professor & Head" (string,
                    optional — student entries may omit this)
     contribution - member-supplied description of their role/work (string)

   Data accuracy rule: Preserve the supplied names, roles, departments, and
   contributions exactly. Do not invent missing information.
   ========================================================================== */

const qLabMembers = {
  students: [
    {
      id: "stu-suryaprakash-b",
      name: "Suryaprakash B",
      group: "students",
      image: "assets/images/members/suryaprakash-b.jpg",
      role: "President",
      department: "Mechanical Engineering",
      year: "III Year",
      contribution:
        "I lead the team in planning and coordinating technical activities, promoting innovation, and encouraging teamwork. I strive to create opportunities for students to develop practical engineering skills and transform creative ideas into impactful projects.",
    },
    {
      id: "stu-vikash-v",
      name: "Vikash V",
      group: "students",
      image: "assets/images/members/vikash-v.jpg",
      role: "Vice President",
      department: "Information Technology",
      year: "IV Year",
      contribution:
        "I help coordinate technical events, workshops, and student-led initiatives. I like to teach, share and collaborate with the team to turn ideas into action and create more opportunities for students to explore and build with technology.",
    },
    {
      id: "stu-arun-vasudev-c",
      name: "Arun Vasudev C",
      group: "students",
      image: "assets/images/members/arun-vasudev-c.jpg",
      role: "Secretary",
      department: "Mechanical Engineering",
      year: "II Year",
      contribution:
        "I Plan and coordinate events. I am passionate about emerging technologies, innovation, and interdisciplinary learning. Through QLab, I aim to encourage students to explore quantum computing.",
    },
    {
      id: "stu-kamali-r-c",
      name: "Kamali R C",
      group: "students",
      image: "assets/images/members/kamali-r-c.jpg",
      role: "Joint Secretary",
      department: "EEE",
      year: "II Year",
      contribution:
        "Supporting club operations, coordinating technical events and workshops, and promoting student engagement, collaborative learning, and innovation in quantum computing and emerging technologies.",
    },
    {
      id: "stu-yuvaasri-s",
      name: "Yuvaasri S",
      group: "students",
      image: "assets/images/members/yuvaasri-s.jpg",
      role: "Treasurer",
      department: "Automobile Engineering",
      year: "I Year",
      contribution:
        "Treasurer, Q-Lab I help maintain financial records and ensure the smooth organization of Q-Lab activities. I look forward to work with the team, exploring quantum technology, and contributing to initiatives that encourage students to discover new ideas and turn them into meaningful innovations.",
    },
  ],
  faculty: [
    {
      id: "fac-dr-k-balamurugan",
      name: "Dr. K. Balamurugan",
      group: "faculty",
      image: "assets/images/members/dr-k-balamurugan.jpg",
      role: "Faculty Mentor",
      department: "Mechanical Engineering",
      designation: "Professor & Head",
      contribution:
        "Promoting the learning and practical application of quantum concepts with a particular focus on solving industrial engineering challenges through student engagement, hands-on workshops, and project-based learning.",
    },
    {
      id: "fac-dr-sathyakala-m",
      name: "Dr. Sathyakala M",
      group: "faculty",
      image: "assets/images/members/dr-sathyakala-m.jpg",
      role: "Faculty Mentor",
      department: "Information Technology",
      designation: "Assistant Professor",
      contribution:
        "Learning alongside students to explore cutting-edge quantum concepts and algorithms as a team. My goal is to foster an open environment where students feel motivated to ask bold questions, run experiments, and turn curiosity into real-world projects.",
    },
    {
      id: "fac-dr-sumithra-t-r",
      name: "Dr. Sumithra T R",
      group: "faculty",
      image: "assets/images/members/dr-sumithra-t-r.jpg",
      role: "Faculty Mentor",
      department: "EEE",
      designation: "Assistant Professor",
      contribution:
        "Act as a catalytic support to apply quantum algorithms for classical challenges in multidisciplinary projects.",
    },
  ],
};
