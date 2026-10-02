/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every visible word, link and tag on the site comes from this file.
 *  Components never hard-code copy — edit here and the site updates.
 *
 *  Anything marked TODO is a placeholder you still need to fill in.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── Types ──────────────────────────────────────────────────────────────── */

export type SocialId = "email" | "phone" | "linkedin" | "github" | "leetcode";

export interface Social {
  id: SocialId;
  label: string;
  /** Full URL. Use "#" as a placeholder until you have the real link. */
  href: string;
  /** Text shown next to the icon, e.g. "@deepdave". */
  handle: string;
}

export interface SkillGroup {
  /** Heading for the group, e.g. "AI/ML & GenAI". */
  title: string;
  /** One line explaining what this cluster is for. */
  caption: string;
  skills: string[];
  /** `true` renders the group in accent colour as the headline skill set. */
  primary?: boolean;
}

export interface Role {
  company: string;
  title: string;
  /** e.g. "Dec 2025" */
  start: string;
  /** e.g. "Present" */
  end: string;
  location: string;
  /** One line framing the role before the bullets. */
  summary: string;
  bullets: string[];
  /** Technologies used, rendered as monospace tags. */
  stack: string[];
  /** `true` draws the timeline marker as a live/pulsing node. */
  current?: boolean;
}

export interface Project {
  /** Stable key used for React lists and anchors. */
  id: string;
  title: string;
  /** Shown under the title — keep to ~2 lines. */
  description: string;
  /** Optional status pill, e.g. "In progress". Omit to hide. */
  status?: string;
  tech: string[];
  /** Repository URL, or "#" placeholder. */
  github: string;
  /** Live demo URL. Omit or leave "" to hide the button. */
  demo?: string;
  /** `true` promotes the project to the large card at the top of the grid. */
  featured?: boolean;
  /** Optional headline metrics rendered inside the featured card. */
  highlights?: { value: string; label: string }[];
}

export interface Certification {
  name: string;
  issuer: string;
  /** Optional year, e.g. "2026". Omit to hide. */
  year?: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  university: string;
  period: string;
  grade: string;
}

export interface NavItem {
  /** Section id, must match the `id` rendered on the <section>. */
  id: string;
  label: string;
}

/* ── Identity ───────────────────────────────────────────────────────────── */

export const person = {
  name: "Deep Dave",
  /** Shown as the role line in the hero and in page metadata. */
  title: "AI/ML Engineer",
  /** Secondary roles, cycled in the hero's monospace strip. */
  focus: ["LLM / GenAI Engineer", "Applied ML", "AI Agents"],
  location: "Pune, India",
  /** The 30-second pitch. Keep it to one sentence. */
  pitch:
    "I build LLM-powered applications and AI agents on Google Cloud — turning Gemini models, prompt engineering and production infrastructure into tools people actually use.",
  /** Short, human intro for the About section. 3–4 lines. */
  about: [
    "I'm an AI/ML engineer who got here by way of data. A CS degree in 2025, then months inside US healthcare analytics where I learned that a model is only as good as the messy, regulated data underneath it.",
    "Now I build with the other half of the stack: Gemini models, prompt engineering, agent frameworks and the GCP infrastructure to run them. I like problems where a language model is the interesting part but not the whole answer.",
    "Currently at Evonence, shipping internal AI tooling and doing R&D on agent-based systems — and still reaching for SQL and Power BI whenever the fastest path to an answer is a query, not a model.",
  ],
  /** The three steps rendered in the About sidebar. Last one is highlighted. */
  journey: [
    { year: "2025", label: "CS graduate" },
    { year: "2025", label: "Healthcare data analytics" },
    { year: "Now", label: "AI/ML engineering" },
  ],
  /** Three facts shown as a strip under the hero. */
  stats: [
    { value: "2025", label: "B.E. Computer Science" },
    { value: "3", label: "Engineering roles" },
    { value: "6", label: "Certifications" },
  ],
} as const;

/* ── Links ──────────────────────────────────────────────────────────────── */

export const email = "deepdave.work@gmail.com";

/** Digits only, with country code — used to build the tel: link. */
export const phone = "+919637280435";
/** How the number is displayed. */
export const phoneDisplay = "+91 96372 80435";

export const socials: Social[] = [
  { id: "email", label: "Email", href: `mailto:${email}`, handle: email },
  { id: "phone", label: "Phone", href: `tel:${phone}`, handle: phoneDisplay },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/deep-dave-38837119b/",
    handle: "/in/deep-dave",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/deepdave22",
    handle: "@deepdave22",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    href: "https://leetcode.com/u/deepdave22/",
    handle: "@deepdave22",
  },
];

/** TODO: drop your real PDF at public/resume.pdf — this path is already wired up. */
export const resumeHref = "/resume.pdf";

/**
 * Hero portrait. Leave `photo` empty to use the illustrated figure in
 * Avatar.tsx; set it to a file in /public (e.g. "/deep.jpg") to use a
 * photograph instead. Nothing else needs to change.
 */
export const avatar: { photo?: string } = {
  photo: "",
};

/* ── Navigation ─────────────────────────────────────────────────────────── */

export const navItems: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

/* ── Skills ─────────────────────────────────────────────────────────────── */

export const skillGroups: SkillGroup[] = [
  {
    title: "AI/ML & GenAI",
    caption: "Where I spend most of my time.",
    primary: true,
    skills: [
      "LLMs",
      "Gemini Models",
      "Prompt Engineering",
      "RAG",
      "Hybrid Search",
      "Embeddings",
      "Vector Databases",
      "AI Agents (Google ADK)",
      "Scikit-learn",
      "LSTM",
      "Random Forest",
      "Pandas",
      "NumPy",
    ],
  },
  {
    title: "Cloud & MLOps",
    caption: "Getting models off the laptop and into production.",
    skills: ["Google Cloud Platform", "Terraform", "Git / GitHub"],
  },
  {
    title: "Languages & Data",
    caption: "The layer everything else sits on.",
    skills: [
      "Python",
      "SQL",
      "PL/SQL",
      "Java",
      "C++",
      "MS SQL Server",
      "Snowflake",
    ],
  },
  {
    title: "Analytics & BI",
    caption: "How I earned my data instincts.",
    skills: ["Power BI", "DAX", "Power Query", "Excel"],
  },
];

/* ── Experience ─────────────────────────────────────────────────────────── */

export const experience: Role[] = [
  {
    company: "Evonence",
    title: "Junior AI/ML Engineer Trainee",
    start: "Dec 2025",
    end: "Present",
    location: "Pune, India",
    current: true,
    summary:
      "Building internal AI tooling on Google Cloud and running R&D on agent-based systems.",
    bullets: [
      "Engineered Gemini prompts for an internal AI Diagram Generator, improving diagram accuracy and cutting generation time.",
      "Ran R&D on Elis.ai, an agent-based chatbot — evaluating LLM responses and driving up answer quality and consistency.",
      "Provisioned and managed Google Cloud infrastructure as code with Terraform.",
      "Earned Google Cloud Digital Leader and Data Engineering certifications alongside delivery work.",
    ],
    stack: ["Gemini", "Prompt Engineering", "AI Agents", "GCP", "Terraform"],
  },
  {
    company: "AArete",
    title: "Data Analyst Intern",
    start: "Apr 2025",
    end: "Sep 2025",
    location: "Remote",
    summary:
      "Healthcare claims analytics under HIPAA, from SQL Server through to executive dashboards.",
    bullets: [
      "Analysed 1,000+ US healthcare claims per month under strict HIPAA compliance.",
      "Built Power BI dashboards on MS SQL Server tracking approval rates, rejection reasons and processing times.",
      "Modelled and transformed claims data using Power Query, SQL and DAX.",
    ],
    stack: ["Power BI", "MS SQL Server", "SQL", "DAX", "Power Query", "HIPAA"],
  },
  {
    company: "NoQ's Digital",
    title: "Data Analyst Intern",
    start: "Jan 2024",
    end: "Feb 2024",
    location: "Pune, India",
    summary: "HR analytics reporting for internal stakeholders.",
    bullets: [
      "Built a Power BI HR analytics dashboard covering attrition, tenure and training effectiveness.",
      "Implemented Row-Level Security and Incremental Refresh for safe, efficient stakeholder access.",
    ],
    stack: ["Power BI", "Row-Level Security", "Incremental Refresh"],
  },
];

/* ── Projects ───────────────────────────────────────────────────────────── */

/** TODO: swap the remaining "#" links for real repo / demo URLs as each project goes public. */
export const projects: Project[] = [
  {
    id: "aerospace-rag",
    title: "Aerospace Hybrid RAG",
    description:
      "A production-oriented RAG chatbot over aviation manuals. Semantic and BM25 search run side by side, get fused with Reciprocal Rank Fusion and reranked — so answers stay grounded and cite the page they came from.",
    status: "In progress",
    featured: true,
    tech: [
      "RAG",
      "Hybrid Retrieval",
      "BM25",
      "Reranking",
      "Vector DB",
      "LLMs",
      "Python",
      "Docker",
    ],
    github: "https://github.com/deepdave22/aerospace-rag",
    highlights: [
      { value: "Semantic + BM25", label: "Retrieval" },
      { value: "RRF + rerank", label: "Fusion" },
      { value: "Page-cited", label: "Answers" },
    ],
  },
  {
    id: "ai-sql-analyst",
    title: "AI SQL Analyst",
    description:
      "A natural-language-to-SQL agent built on Google's Agent Development Kit. Ask a question in plain English; the agent inspects the schema, writes the query, runs it and explains the result.",
    status: "In progress",
    featured: true,
    tech: ["Google ADK", "Gemini", "Python", "SQL", "AI Agents"],
    github: "#",
    highlights: [
      { value: "ADK", label: "Agent framework" },
      { value: "NL → SQL", label: "Core capability" },
      { value: "Gemini", label: "Reasoning model" },
    ],
  },
  {
    id: "stock-market-analysis",
    title: "Stock Market Analysis",
    description:
      "Price forecasting that pits Linear Regression against an LSTM, with live market data pulled through an API. The sequence model lifted accuracy by 20%.",
    tech: ["Python", "LSTM", "Linear Regression", "Pandas", "REST API"],
    github: "#",
  },
  {
    id: "bangalore-house-price",
    title: "Bangalore House Price Prediction",
    description:
      "A regression model reaching 87% accuracy on Bangalore property data, wrapped in a Flask web app so anyone can price a listing from the browser.",
    tech: ["Python", "Scikit-learn", "Regression", "Flask"],
    github: "#",
  },
  {
    id: "customer-churn-analysis",
    title: "Customer Churn Analysis",
    description:
      "End-to-end churn pipeline: SQL Server ETL into Power BI dashboards, then a Random Forest classifier to rank which customers retention should call first.",
    tech: ["SQL Server", "ETL", "Power BI", "Random Forest", "Python"],
    github: "#",
  },
];

/* ── Certifications ─────────────────────────────────────────────────────── */

export const certifications: Certification[] = [
  { name: "Cloud Digital Leader", issuer: "Google Cloud" },
  { name: "Data Engineering on Google Cloud", issuer: "Google Cloud" },
  { name: "Machine Learning with Python", issuer: "IBM" },
  { name: "PL/SQL", issuer: "Oracle" },
  { name: "Introduction to Data Science", issuer: "Infosys" },
  { name: "HIPAA Compliance", issuer: "AArete" },
];

/* ── Education ──────────────────────────────────────────────────────────── */

export const education: Education = {
  degree: "B.E.",
  field: "Computer Science",
  institution: "AISSMS Institute of Information Technology",
  university: "Savitribai Phule Pune University",
  period: "2021 — 2025",
  grade: "CGPA 7.9",
};

/* ── Section headings ───────────────────────────────────────────────────── */

export interface SectionCopy {
  /** The section headline. */
  title: string;
  /** Optional sentence under the headline. Omit to hide. */
  intro?: string;
}

/** Every section's heading block. The Contact section's copy lives in `contact`. */
export const sections: Record<
  "about" | "skills" | "experience" | "projects" | "credentials",
  SectionCopy
> = {
  about: {
    title: "Data taught me. Models pulled me in.",
  },
  skills: {
    title: "The stack I build with",
    intro: "Ordered by where I spend my time, not by how long I've known them.",
  },
  experience: {
    title: "Where I've shipped",
  },
  projects: {
    title: "Things I've built",
    intro:
      "Retrieval and agents are where I'm pushing hardest right now — the rest is the applied ML and analytics work that got me here.",
  },
  credentials: {
    title: "Certifications & education",
  },
};

/* ── Site metadata (SEO) ────────────────────────────────────────────────── */

/** TODO: set this to your real domain once deployed — it drives OG tags + sitemap. */
export const siteUrl = "https://deepdave.dev";

export const seo = {
  title: `${person.name} — ${person.title}`,
  description:
    "Deep Dave is an AI/ML Engineer in Pune, India, building LLM-powered applications and AI agents on Google Cloud with Gemini, prompt engineering and Terraform.",
  keywords: [
    "AI Engineer",
    "ML Engineer",
    "LLM Engineer",
    "GenAI Engineer",
    "Applied Machine Learning",
    "Google Cloud",
    "Gemini",
    "AI Agents",
    "Prompt Engineering",
    "Pune",
  ],
};

/* ── Contact section copy ───────────────────────────────────────────────── */

export const contact = {
  heading: "Let's build something",
  blurb:
    "I'm open to AI/ML Engineer, LLM/GenAI Engineer and Applied ML roles — and always happy to talk about agents, evaluation or anything Gemini-shaped.",
  /** Default subject line prefilled in the mailto form. */
  subjectPrefix: "Portfolio enquiry",
  availability: "Open to new opportunities",
};
