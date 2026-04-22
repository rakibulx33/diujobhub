// ── Job Role Definitions ──────────────────────────────────────────────

export interface JobRole {
  id: string;
  title: string;
  description: string;
  requiredCourses: string[];
  preferredSkills: string[];
  minSemester: number;
  defaultThreshold: number;
}

export const jobRoles: JobRole[] = [
  {
    id: "app-developer",
    title: "App Developer",
    description: "Build native and cross-platform mobile applications for iOS and Android.",
    requiredCourses: [
      "Programming Fundamentals",
      "Object Oriented Programming",
      "Data Structures",
      "Algorithms",
      "Database Management",
      "Mobile App Development",
      "UI/UX Design",
      "Software Engineering",
    ],
    preferredSkills: ["Flutter", "React Native", "Swift", "Kotlin", "Dart", "Firebase", "REST API", "Git"],
    minSemester: 5,
    defaultThreshold: 60,
  },
  {
    id: "web-developer",
    title: "Web Developer",
    description: "Design and develop responsive, modern web applications and services.",
    requiredCourses: [
      "Programming Fundamentals",
      "Object Oriented Programming",
      "Data Structures",
      "Database Management",
      "Web Technologies",
      "Software Engineering",
      "Computer Networks",
    ],
    preferredSkills: ["React", "Next.js", "TypeScript", "Node.js", "HTML/CSS", "Tailwind CSS", "MongoDB", "Git"],
    minSemester: 4,
    defaultThreshold: 55,
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "Analyze complex data sets to derive actionable insights using statistical and ML methods.",
    requiredCourses: [
      "Programming Fundamentals",
      "Data Structures",
      "Algorithms",
      "Statistics & Probability",
      "Linear Algebra",
      "Machine Learning",
      "Database Management",
      "Data Mining",
    ],
    preferredSkills: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "SQL", "Jupyter", "Tableau"],
    minSemester: 6,
    defaultThreshold: 65,
  },
  {
    id: "ml-engineer",
    title: "ML Engineer",
    description: "Design, build, and deploy machine learning models at scale.",
    requiredCourses: [
      "Programming Fundamentals",
      "Data Structures",
      "Algorithms",
      "Linear Algebra",
      "Statistics & Probability",
      "Machine Learning",
      "Deep Learning",
      "Artificial Intelligence",
    ],
    preferredSkills: ["Python", "PyTorch", "TensorFlow", "MLOps", "Docker", "AWS/GCP", "Kubernetes", "Git"],
    minSemester: 7,
    defaultThreshold: 70,
  },
  {
    id: "qa-engineer",
    title: "QA Engineer",
    description: "Ensure software quality through manual and automated testing strategies.",
    requiredCourses: [
      "Programming Fundamentals",
      "Object Oriented Programming",
      "Software Engineering",
      "Software Testing",
      "Database Management",
      "Web Technologies",
    ],
    preferredSkills: ["Selenium", "Jest", "Cypress", "Postman", "JIRA", "Git", "CI/CD", "Agile"],
    minSemester: 4,
    defaultThreshold: 50,
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    description: "Build robust server-side APIs, microservices, and database architectures.",
    requiredCourses: [
      "Programming Fundamentals",
      "Object Oriented Programming",
      "Data Structures",
      "Algorithms",
      "Database Management",
      "Computer Networks",
      "Operating Systems",
      "Software Engineering",
    ],
    preferredSkills: ["Node.js", "Python", "Java", "Express", "PostgreSQL", "MongoDB", "Docker", "REST API"],
    minSemester: 5,
    defaultThreshold: 60,
  },
  {
    id: "uiux-designer",
    title: "UI/UX Designer",
    description: "Create intuitive, beautiful user interfaces and experiences for digital products.",
    requiredCourses: [
      "UI/UX Design",
      "Human Computer Interaction",
      "Web Technologies",
      "Computer Graphics",
      "Software Engineering",
    ],
    preferredSkills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing", "Design Systems", "HTML/CSS"],
    minSemester: 4,
    defaultThreshold: 50,
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    description: "Streamline development workflows with CI/CD, infrastructure, and cloud automation.",
    requiredCourses: [
      "Programming Fundamentals",
      "Operating Systems",
      "Computer Networks",
      "Database Management",
      "Software Engineering",
      "Cloud Computing",
      "Distributed Systems",
    ],
    preferredSkills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "Bash", "Git"],
    minSemester: 6,
    defaultThreshold: 65,
  },
];

// ── Course Catalog ────────────────────────────────────────────────────

export const courseCatalog: string[] = [
  "Programming Fundamentals",
  "Object Oriented Programming",
  "Data Structures",
  "Algorithms",
  "Database Management",
  "Software Engineering",
  "Web Technologies",
  "Mobile App Development",
  "Computer Networks",
  "Operating Systems",
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "Statistics & Probability",
  "Linear Algebra",
  "Discrete Mathematics",
  "Digital Logic Design",
  "Computer Architecture",
  "UI/UX Design",
  "Human Computer Interaction",
  "Computer Graphics",
  "Software Testing",
  "Data Mining",
  "Cloud Computing",
  "Distributed Systems",
  "Cyber Security",
  "Compiler Design",
  "Theory of Computation",
  "Numerical Methods",
  "Technical Writing",
];

// ── Grading System ────────────────────────────────────────────────────

export const gradeScale: { grade: string; points: number }[] = [
  { grade: "A+", points: 4.0 },
  { grade: "A", points: 3.75 },
  { grade: "A-", points: 3.5 },
  { grade: "B+", points: 3.25 },
  { grade: "B", points: 3.0 },
  { grade: "B-", points: 2.75 },
  { grade: "C+", points: 2.5 },
  { grade: "C", points: 2.25 },
  { grade: "C-", points: 2.0 },
  { grade: "D+", points: 1.75 },
  { grade: "D", points: 1.5 },
  { grade: "F", points: 0.0 },
];

export const departments = [
  "Computer Science & Engineering (CSE)",
  "Software Engineering (SWE)",
  "Information Technology (IT)",
  "Electrical & Electronic Engineering (EEE)",
  "Electronics & Telecommunication (ETE)",
  "Business Administration (BBA)",
  "Other",
];

// ── Skill Categories ──────────────────────────────────────────────────

export interface Skill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export const skillCategories: { category: string; skills: string[] }[] = [
  {
    category: "Languages",
    skills: ["Python", "JavaScript", "TypeScript", "Java", "C++", "C", "Dart", "Swift", "Kotlin", "Go", "Rust", "PHP", "Ruby"],
  },
  {
    category: "Frameworks",
    skills: ["React", "Next.js", "Angular", "Vue.js", "Flutter", "React Native", "Express", "Django", "Spring Boot", "FastAPI", "Laravel"],
  },
  {
    category: "Databases",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis", "SQLite", "Oracle", "SQL Server"],
  },
  {
    category: "Tools & Platforms",
    skills: ["Git", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Linux", "CI/CD", "Terraform", "Postman", "JIRA", "Figma"],
  },
  {
    category: "Soft Skills",
    skills: ["Communication", "Teamwork", "Problem Solving", "Leadership", "Time Management", "Critical Thinking", "Adaptability"],
  },
];

// ── Student Profile ───────────────────────────────────────────────────

export interface CourseEntry {
  id: string;
  name: string;
  credit: number;
  grade: string;
}

export interface StudentProfile {
  university: string;
  department: string;
  semester: number;
  cgpa: number;
  courses: CourseEntry[];
  skills: string[];
  experience: string;
}

// ── Scoring Engine ────────────────────────────────────────────────────

export interface ScoreBreakdown {
  relevantCourses: number;  // out of 40
  cgpa: number;             // out of 20
  courseGrades: number;      // out of 20
  skillsMatch: number;      // out of 10
  semesterReadiness: number; // out of 10
}

export interface EligibilityResult {
  score: number;
  breakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  eligible: boolean;
  threshold: number;
}

export function calculateEligibilityScore(
  profile: StudentProfile,
  role: JobRole,
  customThreshold?: number
): EligibilityResult {
  const threshold = customThreshold ?? role.defaultThreshold;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  // ── 1. Relevant Courses (40 pts) ─────────────────────────────────
  const studentCourseNames = profile.courses.map((c) => c.name.toLowerCase());
  const matchedCourses = role.requiredCourses.filter((rc) =>
    studentCourseNames.includes(rc.toLowerCase())
  );
  const courseRatio = role.requiredCourses.length > 0
    ? matchedCourses.length / role.requiredCourses.length
    : 0;
  const relevantCourses = Math.round(courseRatio * 40);

  if (courseRatio >= 0.75) {
    strengths.push(`Strong course coverage (${matchedCourses.length}/${role.requiredCourses.length} required courses completed)`);
  } else if (courseRatio >= 0.5) {
    strengths.push(`Decent course coverage (${matchedCourses.length}/${role.requiredCourses.length} courses)`);
  } else {
    weaknesses.push(`Low course relevance — only ${matchedCourses.length} of ${role.requiredCourses.length} required courses completed`);
  }

  const missingCourses = role.requiredCourses.filter(
    (rc) => !studentCourseNames.includes(rc.toLowerCase())
  );
  if (missingCourses.length > 0 && missingCourses.length <= 4) {
    recommendations.push(`Consider taking: ${missingCourses.join(", ")}`);
  } else if (missingCourses.length > 4) {
    recommendations.push(`You're missing ${missingCourses.length} key courses. Prioritize: ${missingCourses.slice(0, 3).join(", ")}`);
  }

  // ── 2. CGPA (20 pts) ─────────────────────────────────────────────
  const cgpaRatio = Math.min(profile.cgpa / 4.0, 1);
  const cgpaScore = Math.round(cgpaRatio * 20);

  if (profile.cgpa >= 3.5) {
    strengths.push(`Excellent CGPA (${profile.cgpa.toFixed(2)})`);
  } else if (profile.cgpa >= 3.0) {
    strengths.push(`Good CGPA (${profile.cgpa.toFixed(2)})`);
  } else if (profile.cgpa >= 2.5) {
    weaknesses.push(`Average CGPA (${profile.cgpa.toFixed(2)}) — aim for 3.0+`);
    recommendations.push("Focus on improving your GPA in remaining semesters");
  } else {
    weaknesses.push(`Low CGPA (${profile.cgpa.toFixed(2)}) — may limit opportunities`);
    recommendations.push("Prioritize academic improvement alongside skill development");
  }

  // ── 3. Course Grades (20 pts) ─────────────────────────────────────
  const matchedCourseEntries = profile.courses.filter((c) =>
    role.requiredCourses.some((rc) => rc.toLowerCase() === c.name.toLowerCase())
  );
  let avgGradePoints = 0;
  if (matchedCourseEntries.length > 0) {
    const totalPoints = matchedCourseEntries.reduce((sum, c) => {
      const gp = gradeScale.find((g) => g.grade === c.grade)?.points ?? 0;
      return sum + gp;
    }, 0);
    avgGradePoints = totalPoints / matchedCourseEntries.length;
  }
  const gradeRatio = Math.min(avgGradePoints / 4.0, 1);
  const courseGrades = Math.round(gradeRatio * 20);

  if (avgGradePoints >= 3.5 && matchedCourseEntries.length > 0) {
    strengths.push(`Excellent grades in relevant courses (avg ${avgGradePoints.toFixed(2)} GPA)`);
  } else if (avgGradePoints >= 3.0 && matchedCourseEntries.length > 0) {
    strengths.push(`Good grades in technical courses (avg ${avgGradePoints.toFixed(2)} GPA)`);
  } else if (matchedCourseEntries.length > 0) {
    weaknesses.push(`Grades in relevant courses could be stronger (avg ${avgGradePoints.toFixed(2)} GPA)`);
  }

  // ── 4. Skills Match (10 pts) ──────────────────────────────────────
  const studentSkillsLower = profile.skills.map((s) => s.toLowerCase());
  const matchedSkills = role.preferredSkills.filter((s) =>
    studentSkillsLower.includes(s.toLowerCase())
  );
  const skillRatio = role.preferredSkills.length > 0
    ? matchedSkills.length / role.preferredSkills.length
    : 0;
  const skillsMatch = Math.round(skillRatio * 10);

  if (skillRatio >= 0.5) {
    strengths.push(`Good skill match (${matchedSkills.length} of ${role.preferredSkills.length} preferred skills)`);
  } else if (matchedSkills.length > 0) {
    weaknesses.push(`Limited skill match (${matchedSkills.length}/${role.preferredSkills.length})`);
  } else {
    weaknesses.push("No matching skills listed for this role");
    recommendations.push(`Develop skills in: ${role.preferredSkills.slice(0, 4).join(", ")}`);
  }

  // ── 5. Semester Readiness (10 pts) ────────────────────────────────
  let semesterReadiness = 0;
  if (profile.semester >= role.minSemester) {
    semesterReadiness = 10;
    strengths.push(`Semester ${profile.semester} — meets or exceeds minimum (${role.minSemester})`);
  } else if (profile.semester >= role.minSemester - 1) {
    semesterReadiness = 7;
    weaknesses.push(`Semester ${profile.semester} — almost at recommended level (${role.minSemester})`);
  } else {
    semesterReadiness = Math.round((profile.semester / role.minSemester) * 10);
    weaknesses.push(`Semester ${profile.semester} — below recommended (${role.minSemester})`);
    recommendations.push("Consider applying after gaining more academic experience");
  }

  // ── Extra experience bonus ────────────────────────────────────────
  if (profile.experience.trim().length > 20) {
    strengths.push("Relevant work experience mentioned");
  } else if (profile.experience.trim().length === 0) {
    recommendations.push("Add internships, projects, or freelance experience to strengthen your profile");
  }

  // ── Total ─────────────────────────────────────────────────────────
  const score = Math.min(
    relevantCourses + cgpaScore + courseGrades + skillsMatch + semesterReadiness,
    100
  );

  return {
    score,
    breakdown: {
      relevantCourses,
      cgpa: cgpaScore,
      courseGrades,
      skillsMatch,
      semesterReadiness,
    },
    strengths,
    weaknesses,
    recommendations,
    eligible: score >= threshold,
    threshold,
  };
}

// ── Recommended Jobs ──────────────────────────────────────────────────

export interface RecommendedJob {
  role: JobRole;
  score: number;
  topMatches: string[];
}

export function getRecommendedJobs(profile: StudentProfile): RecommendedJob[] {
  return jobRoles
    .map((role) => {
      const result = calculateEligibilityScore(profile, role);
      const studentCourseNames = profile.courses.map((c) => c.name.toLowerCase());
      const topMatches = role.requiredCourses
        .filter((rc) => studentCourseNames.includes(rc.toLowerCase()))
        .slice(0, 4);
      return { role, score: result.score, topMatches };
    })
    .sort((a, b) => b.score - a.score);
}
