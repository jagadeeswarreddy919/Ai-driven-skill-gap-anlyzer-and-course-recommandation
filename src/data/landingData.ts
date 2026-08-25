export interface RoleSkillData {
  id: string;
  roleTitle: string;
  category: string;
  readinessScore: number;
  skillsHave: { name: string; icon?: string }[];
  skillsMissing: { name: string; impact: 'High' | 'Medium' | 'Critical' }[];
}

export const TARGET_ROLES_DATA: RoleSkillData[] = [
  {
    id: "fullstack",
    roleTitle: "Full Stack Developer",
    category: "Software Development",
    readinessScore: 72,
    skillsHave: [
      { name: "React" },
      { name: "JavaScript" },
      { name: "Git" },
      { name: "HTML5 / CSS3" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
    ],
    skillsMissing: [
      { name: "Node.js & Express", impact: "Critical" },
      { name: "PostgreSQL & Prisma", impact: "High" },
      { name: "Docker & Containerization", impact: "Medium" },
      { name: "CI/CD Pipelines", impact: "High" },
    ],
  },
  {
    id: "ai-engineer",
    roleTitle: "AI & Machine Learning Engineer",
    category: "Artificial Intelligence",
    readinessScore: 65,
    skillsHave: [
      { name: "Python" },
      { name: "PyTorch" },
      { name: "Data Processing (Pandas/NumPy)" },
      { name: "Git & Version Control" },
      { name: "RESTful APIs" },
    ],
    skillsMissing: [
      { name: "Vector Databases (Pinecone/Weaviate)", impact: "Critical" },
      { name: "LLM Fine-tuning & Quantization", impact: "Critical" },
      { name: "LangChain / LlamaIndex", impact: "High" },
      { name: "Model Deployment (Triton/vLLM)", impact: "High" },
    ],
  },
  {
    id: "devops",
    roleTitle: "DevOps & Cloud Engineer",
    category: "Infrastructure",
    readinessScore: 58,
    skillsHave: [
      { name: "Linux Administration" },
      { name: "Docker" },
      { name: "Bash Scripting" },
      { name: "Git" },
    ],
    skillsMissing: [
      { name: "Kubernetes Orchestration", impact: "Critical" },
      { name: "Terraform (IaC)", impact: "Critical" },
      { name: "AWS / GCP Cloud Architecture", impact: "High" },
      { name: "Prometheus & Grafana Monitoring", impact: "Medium" },
    ],
  },
  {
    id: "frontend-arch",
    roleTitle: "Frontend Architect",
    category: "Web Engineering",
    readinessScore: 84,
    skillsHave: [
      { name: "React & Next.js" },
      { name: "TypeScript Advanced" },
      { name: "State Management (Zustand/Redux)" },
      { name: "Web Performance Optimization" },
      { name: "Micro-frontends" },
    ],
    skillsMissing: [
      { name: "WebAssembly (Wasm)", impact: "Medium" },
      { name: "Design System Tokens Automation", impact: "High" },
      { name: "End-to-End Testing (Playwright)", impact: "High" },
    ],
  },
];

export const STATS_DATA = [
  { label: "Target Career Roles", value: 20, suffix: "+" },
  { label: "Skills Indexed", value: 150, suffix: "+" },
  { label: "Skill Categories", value: 6, suffix: "" },
  { label: "Clear Career Goal", value: 1, suffix: "" },
];

export const PROBLEM_CARDS = [
  {
    id: "reqs",
    title: "Too Many Requirements",
    description: "Job descriptions list dozens of technologies, frameworks, tools, and requirements.",
    iconName: "FileSpreadsheet",
  },
  {
    id: "gaps",
    title: "Unclear Skill Gaps",
    description: "You may know some tools well, but struggle to measure how closely your current knowledge matches expectations.",
    iconName: "Target",
  },
  {
    id: "direction",
    title: "No Clear Direction",
    description: "Choosing what technology to learn next feels overwhelming without data-driven feedback.",
    iconName: "Compass",
  },
];

export const SOLUTION_STEPS = [
  { step: "01", title: "Your Skills", desc: "Select or import your current tech stack." },
  { step: "02", title: "Target Role", desc: "Define your dream role or target job market." },
  { step: "03", title: "Skill Comparison", desc: "AI engine cross-references job requirements." },
  { step: "04", title: "Readiness Score", desc: "Get an instant precise percentage match score." },
  { step: "05", title: "Missing Skills", desc: "Uncover high-impact missing topics to study next." },
];

export const FEATURES_DATA = [
  {
    id: "target-analysis",
    title: "Target Role Analysis",
    description: "Choose from 20+ in-demand roles across technology and business domains.",
    iconName: "Briefcase",
    detail: "Real-time industry role definitions",
  },
  {
    id: "skill-profile",
    title: "Skill Profile",
    description: "Select and manage the skills, frameworks, and languages you already master with effortless tagging.",
    iconName: "UserCheck",
    detail: "Instant skill inventory management",
  },
  {
    id: "gap-detection",
    title: "Skill Gap Detection",
    description: "AI-powered analysis to identify exactly which skills you're missing for your target role.",
    iconName: "SearchCheck",
    detail: "Precision gap breakdown",
  },
  {
    id: "readiness-score",
    title: "Readiness Score",
    description: "Understand how closely your current skills match your target role with a dynamic scoring metric.",
    iconName: "Gauge",
    detail: "Percentage readiness indicator",
  },
  {
    id: "skill-map",
    title: "Visual Skill Map",
    description: "Explore your strengths, partial matches, and critical gaps visually through high-precision indicators.",
    iconName: "Network",
    detail: "Interactive skill node matrix",
  },
  {
    id: "learning-direction",
    title: "Learning Direction",
    description: "Get personalized learning paths and resources to fill your skill gaps effectively.",
    iconName: "Sparkles",
    detail: "Prioritized learning roadmap",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up in seconds and tell us what technologies and concepts you already know.",
  },
  {
    number: "02",
    title: "Choose Your Target",
    description: "Select the specific engineering, data, or technical role you want to pursue.",
  },
  {
    number: "03",
    title: "Select Your Skills",
    description: "Check off your current skills or let our smart wizard detect your proficiencies.",
  },
  {
    number: "04",
    title: "Analyze Your Gap",
    description: "Receive your career readiness score instantly alongside a breakdown of missing skills.",
  },
];

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    priceINR: "₹0",
    period: "forever free",
    description: "Perfect for students & beginners exploring their current skill readiness.",
    isPopular: false,
    ctaText: "Start Free",
    ctaHref: "/signup",
    features: [
      "3 Target Role Analyzers per month",
      "Basic Readiness Score (0-100%)",
      "Top 5 Missing Skills List",
      "Skill Profile Management",
      "Standard Community Support",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    priceINR: "₹499",
    period: "per month",
    description: "Ideal for developers actively preparing for upcoming job applications.",
    isPopular: true,
    ctaText: "Get Standard Plan",
    ctaHref: "/signup?plan=standard",
    features: [
      "Unlimited Target Role Analyzers",
      "Complete Readiness Score & Deep Breakdown",
      "All Missing Skills & Priority Impact Alerts",
      "Visual Skill Map & Node Matrix",
      "Personalized Learning Direction Roadmap",
      "Priority Email Support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceINR: "₹1,499",
    period: "per month",
    description: "For career switchers & senior engineers needing AI-driven roadmaps.",
    isPopular: false,
    ctaText: "Get Pro Plan",
    ctaHref: "/signup?plan=pro",
    features: [
      "Everything in Standard Plan",
      "Custom Job Description Text & URL Parsing",
      "AI Course & Resource Recommendations",
      "1-on-1 AI Career Coach Assistant",
      "Career Growth History & Progress Analytics",
      "24/7 VIP Priority Support",
    ],
  },
];

export const AUDIENCE_DATA = [
  {
    title: "Students",
    description: "Understand which real-world skills employers expect beyond academic computer science theory.",
    iconName: "GraduationCap",
    badge: "Entry Level",
  },
  {
    title: "Developers",
    description: "Identify key technical gaps before applying for senior or specialized engineering roles.",
    iconName: "Code2",
    badge: "Mid & Senior",
  },
  {
    title: "Career Switchers",
    description: "Discover exactly what foundational and domain-specific skills you need to transition into tech.",
    iconName: "ArrowLeftRight",
    badge: "Pivot & Transition",
  },
  {
    title: "Professionals",
    description: "Stay aligned with evolving industry requirements and future-proof your technical career path.",
    iconName: "TrendingUp",
    badge: "Career Growth",
  },
];

export const WHY_PRINCIPLES = [
  {
    title: "Relevant",
    description: "Focus purely on skills directly connected to active job roles and real engineering teams.",
  },
  {
    title: "Clear",
    description: "Understand your strengths, partial overlaps, and key missing topics instantly without visual clutter.",
  },
  {
    title: "Actionable",
    description: "Know what exact technology to study next to move your readiness score closer to 100%.",
  },
];

export const FAQ_DATA = [
  {
    question: "What is SkillGap AI?",
    answer: "SkillGap AI is an intelligent skill analysis platform designed to help students, developers, and professionals compare their technical skill set against specific target job roles to identify missing skills and readiness scores.",
  },
  {
    question: "How is my readiness score calculated?",
    answer: "Your readiness score is calculated by cross-referencing your selected skills against the essential, high-impact, and supporting requirements defined for your target role in our benchmark role dataset.",
  },
  {
    question: "Can I choose different career roles?",
    answer: "Yes! You can explore multiple career tracks—from Full Stack Engineering and AI/ML Engineering to DevOps, Cloud Architecture, and Frontend Leadership—and compare your profile across each.",
  },
  {
    question: "Do I need a resume?",
    answer: "No resume is required. You can manually select your skills through our intuitive skill selector or build your profile step-by-step in under two minutes.",
  },
  {
    question: "Can I change my skills later?",
    answer: "Absolutely. As you learn new technologies and complete projects, you can update your skill profile anytime to watch your readiness score increase dynamically.",
  },
  {
    question: "Is SkillGap AI only for developers?",
    answer: "While we have deep coverage for software engineering and data roles, SkillGap AI supports a wide variety of technology, infrastructure, product engineering, and technical leadership roles.",
  },
  {
    question: "Can I analyze a custom job description?",
    answer: "Custom job description parsing via AI is available on our Pro plan, allowing you to paste any job listing URL or text to extract custom skill gaps.",
  },
];
