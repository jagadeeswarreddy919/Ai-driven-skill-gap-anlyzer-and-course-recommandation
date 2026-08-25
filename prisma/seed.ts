import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SkillGap AI database...");

  const skillsData = [
    { slug: "javascript", name: "JavaScript", category: "Programming" },
    { slug: "typescript", name: "TypeScript", category: "Programming" },
    { slug: "python", name: "Python", category: "Programming" },
    { slug: "java", name: "Java", category: "Programming" },
    { slug: "go", name: "Go (Golang)", category: "Programming" },
    { slug: "kotlin", name: "Kotlin", category: "Programming" },
    { slug: "swift", name: "Swift", category: "Programming" },
    { slug: "cpp", name: "C++", category: "Programming" },
    { slug: "ruby", name: "Ruby", category: "Programming" },
    { slug: "react", name: "React", category: "Frontend" },
    { slug: "nextjs", name: "Next.js", category: "Frontend" },
    { slug: "vuejs", name: "Vue.js", category: "Frontend" },
    { slug: "angular", name: "Angular", category: "Frontend" },
    { slug: "svelte", name: "Svelte", category: "Frontend" },
    { slug: "html-css", name: "HTML5 & CSS3", category: "Frontend" },
    { slug: "tailwind", name: "Tailwind CSS", category: "Frontend" },
    { slug: "sass", name: "SASS/SCSS", category: "Frontend" },
    { slug: "redux", name: "Redux / Zustand", category: "Frontend" },
    { slug: "react-query", name: "React Query / TanStack", category: "Frontend" },
    { slug: "graphql-client", name: "GraphQL (Client)", category: "Frontend" },
    { slug: "webassembly", name: "WebAssembly", category: "Frontend" },
    { slug: "web-performance", name: "Web Performance Optimization", category: "Frontend" },
    { slug: "react-native", name: "React Native", category: "Frontend" },
    { slug: "flutter", name: "Flutter", category: "Frontend" },
    { slug: "nodejs", name: "Node.js", category: "Backend" },
    { slug: "express", name: "Express.js", category: "Backend" },
    { slug: "nestjs", name: "NestJS", category: "Backend" },
    { slug: "fastapi", name: "FastAPI", category: "Backend" },
    { slug: "django", name: "Django", category: "Backend" },
    { slug: "spring-boot", name: "Spring Boot", category: "Backend" },
    { slug: "graphql-server", name: "GraphQL (Server)", category: "Backend" },
    { slug: "rest-apis", name: "REST API Design", category: "Backend" },
    { slug: "grpc", name: "gRPC", category: "Backend" },
    { slug: "microservices", name: "Microservices Architecture", category: "Backend" },
    { slug: "message-queues", name: "Message Queues (RabbitMQ/Kafka)", category: "Backend" },
    { slug: "websockets", name: "WebSockets & Real-time", category: "Backend" },
    { slug: "postgresql", name: "PostgreSQL", category: "Database" },
    { slug: "mysql", name: "MySQL", category: "Database" },
    { slug: "mongodb", name: "MongoDB", category: "Database" },
    { slug: "redis", name: "Redis", category: "Database" },
    { slug: "elasticsearch", name: "Elasticsearch", category: "Database" },
    { slug: "prisma", name: "Prisma ORM", category: "Database" },
    { slug: "database-design", name: "Database Design", category: "Database" },
    { slug: "vector-db", name: "Vector Databases (Pinecone/Weaviate)", category: "Database" },
    { slug: "sql", name: "SQL & Query Optimization", category: "Database" },
    { slug: "aws", name: "AWS", category: "Cloud" },
    { slug: "gcp", name: "Google Cloud (GCP)", category: "Cloud" },
    { slug: "azure", name: "Microsoft Azure", category: "Cloud" },
    { slug: "vercel", name: "Vercel", category: "Cloud" },
    { slug: "s3", name: "AWS S3 / Object Storage", category: "Cloud" },
    { slug: "lambda", name: "Serverless / Lambda Functions", category: "Cloud" },
    { slug: "ec2", name: "EC2 / VMs", category: "Cloud" },
    { slug: "firebase", name: "Firebase", category: "Cloud" },
    { slug: "cdn", name: "CDN & Edge Networks", category: "Cloud" },
    { slug: "docker", name: "Docker", category: "DevOps" },
    { slug: "kubernetes", name: "Kubernetes", category: "DevOps" },
    { slug: "terraform", name: "Terraform (IaC)", category: "DevOps" },
    { slug: "ci-cd", name: "CI/CD Pipelines", category: "DevOps" },
    { slug: "github-actions", name: "GitHub Actions", category: "DevOps" },
    { slug: "jenkins", name: "Jenkins", category: "DevOps" },
    { slug: "monitoring", name: "Prometheus & Grafana", category: "DevOps" },
    { slug: "linux", name: "Linux Administration", category: "DevOps" },
    { slug: "bash", name: "Bash Scripting", category: "DevOps" },
    { slug: "nginx", name: "Nginx / Web Servers", category: "DevOps" },
    { slug: "ansible", name: "Ansible", category: "DevOps" },
    { slug: "helm", name: "Helm Charts", category: "DevOps" },
    { slug: "pytorch", name: "PyTorch", category: "AI/ML" },
    { slug: "tensorflow", name: "TensorFlow", category: "AI/ML" },
    { slug: "scikit-learn", name: "Scikit-learn", category: "AI/ML" },
    { slug: "pandas", name: "Pandas & NumPy", category: "AI/ML" },
    { slug: "llm-apis", name: "LLM APIs (OpenAI/Gemini)", category: "AI/ML" },
    { slug: "langchain", name: "LangChain / LlamaIndex", category: "AI/ML" },
    { slug: "huggingface", name: "Hugging Face Transformers", category: "AI/ML" },
    { slug: "ml-deployment", name: "Model Deployment", category: "AI/ML" },
    { slug: "feature-engineering", name: "Feature Engineering", category: "AI/ML" },
    { slug: "mlops", name: "MLOps & Experiment Tracking", category: "AI/ML" },
    { slug: "nlp", name: "NLP", category: "AI/ML" },
    { slug: "spark", name: "Apache Spark", category: "AI/ML" },
    { slug: "data-pipelines", name: "Data Pipelines (Airflow/dbt)", category: "AI/ML" },
    { slug: "statistics", name: "Statistics & Probability", category: "AI/ML" },
    { slug: "jest", name: "Jest & Unit Testing", category: "Testing" },
    { slug: "playwright", name: "Playwright / E2E Testing", category: "Testing" },
    { slug: "cypress", name: "Cypress", category: "Testing" },
    { slug: "tdd", name: "TDD / BDD", category: "Testing" },
    { slug: "api-testing", name: "API Testing (Postman/Supertest)", category: "Testing" },
    { slug: "load-testing", name: "Load Testing (k6/JMeter)", category: "Testing" },
    { slug: "oauth", name: "OAuth 2.0 & JWT", category: "Security" },
    { slug: "owasp", name: "OWASP / Web Security", category: "Security" },
    { slug: "penetration-testing", name: "Penetration Testing", category: "Security" },
    { slug: "ssl-tls", name: "SSL/TLS & HTTPS", category: "Security" },
    { slug: "secrets-management", name: "Secrets Management", category: "Security" },
    { slug: "git", name: "Git & Version Control", category: "Tools" },
    { slug: "jira", name: "Jira / Project Management", category: "Tools" },
    { slug: "figma", name: "Figma / UI Design", category: "Tools" },
    { slug: "postman", name: "Postman / API Tools", category: "Tools" },
    { slug: "webpack", name: "Webpack / Vite / Build Tools", category: "Tools" },
    { slug: "stripe", name: "Payment Integration", category: "Tools" },
    { slug: "tableau", name: "Tableau / Power BI", category: "Tools" },
    { slug: "system-design", name: "System Design", category: "System Design" },
    { slug: "distributed-systems", name: "Distributed Systems", category: "System Design" },
    { slug: "caching-strategies", name: "Caching Strategies", category: "System Design" },
    { slug: "api-design", name: "API Design Patterns", category: "System Design" },
    { slug: "high-availability", name: "High Availability & Scalability", category: "System Design" },
    { slug: "design-patterns", name: "Design Patterns (GoF)", category: "System Design" },
    { slug: "ddd", name: "Domain-Driven Design (DDD)", category: "System Design" },
    { slug: "communication", name: "Technical Communication", category: "Soft Skills" },
    { slug: "agile", name: "Agile / Scrum", category: "Soft Skills" },
    { slug: "code-review", name: "Code Review & Mentoring", category: "Soft Skills" },
    { slug: "problem-solving", name: "Problem Solving & Algorithms", category: "Soft Skills" },
    { slug: "documentation", name: "Technical Documentation", category: "Soft Skills" },
  ];

  for (const skill of skillsData) {
    await prisma.skill.upsert({ where: { slug: skill.slug }, update: {}, create: skill });
  }
  console.log(`Created ${skillsData.length} skills`);

  const rolesData = [
    { slug: "fullstack-developer", title: "Full Stack Developer", category: "Software Development", description: "Builds both frontend and backend of web applications." },
    { slug: "frontend-developer", title: "Frontend Developer", category: "Web Engineering", description: "Specializes in building user interfaces and web experiences." },
    { slug: "backend-developer", title: "Backend Developer", category: "Software Development", description: "Builds server-side APIs, databases, and application logic." },
    { slug: "software-engineer", title: "Software Engineer", category: "Software Development", description: "General-purpose engineering role across the full stack." },
    { slug: "data-analyst", title: "Data Analyst", category: "Data & Analytics", description: "Analyzes data to support business decisions." },
    { slug: "data-scientist", title: "Data Scientist", category: "Data & Analytics", description: "Builds ML models and extracts insights from data." },
    { slug: "ml-engineer", title: "ML Engineer", category: "Artificial Intelligence", description: "Deploys and scales machine learning models in production." },
    { slug: "ai-engineer", title: "AI Engineer", category: "Artificial Intelligence", description: "Builds AI-powered products using LLMs and AI APIs." },
    { slug: "devops-engineer", title: "DevOps Engineer", category: "Infrastructure", description: "Builds CI/CD pipelines and manages infrastructure." },
    { slug: "cloud-engineer", title: "Cloud Engineer", category: "Infrastructure", description: "Architects and manages cloud infrastructure." },
    { slug: "security-engineer", title: "Cybersecurity Engineer", category: "Security", description: "Secures systems, networks, and applications." },
    { slug: "mobile-developer", title: "Mobile Developer", category: "Mobile Development", description: "Builds native or cross-platform mobile applications." },
    { slug: "solutions-architect", title: "Solutions Architect", category: "Architecture", description: "Designs scalable, distributed system architectures." },
    { slug: "qa-engineer", title: "QA Engineer", category: "Quality Assurance", description: "Ensures software quality through automated testing." },
    { slug: "product-manager", title: "Product Manager", category: "Product", description: "Defines product strategy and manages the roadmap." },
    { slug: "ui-ux-designer", title: "UI/UX Designer", category: "Design", description: "Designs intuitive user interfaces and experiences." },
    { slug: "frontend-architect", title: "Frontend Architect", category: "Web Engineering", description: "Leads frontend architecture, performance, and design systems." },
    { slug: "platform-engineer", title: "Platform Engineer", category: "Infrastructure", description: "Builds internal developer platforms and tooling." },
    { slug: "site-reliability-engineer", title: "Site Reliability Engineer (SRE)", category: "Infrastructure", description: "Applies software engineering to operations and reliability." },
    { slug: "data-engineer", title: "Data Engineer", category: "Data & Analytics", description: "Builds data pipelines and data infrastructure." },
  ];

  for (const role of rolesData) {
    await prisma.role.upsert({ where: { slug: role.slug }, update: {}, create: role });
  }
  console.log(`Created ${rolesData.length} roles`);

  const mappings: Record<string, Array<{ slug: string; weight: number; required: boolean }>> = {
    "fullstack-developer": [
      { slug: "javascript", weight: 3, required: true }, { slug: "typescript", weight: 3, required: true },
      { slug: "react", weight: 3, required: true }, { slug: "nodejs", weight: 3, required: true },
      { slug: "rest-apis", weight: 3, required: true }, { slug: "postgresql", weight: 2, required: true },
      { slug: "git", weight: 3, required: true }, { slug: "html-css", weight: 2, required: true },
      { slug: "express", weight: 2, required: true }, { slug: "docker", weight: 2, required: false },
      { slug: "ci-cd", weight: 2, required: false }, { slug: "redis", weight: 1, required: false },
      { slug: "system-design", weight: 2, required: false }, { slug: "jest", weight: 1, required: false },
      { slug: "nextjs", weight: 2, required: false },
    ],
    "frontend-developer": [
      { slug: "javascript", weight: 3, required: true }, { slug: "typescript", weight: 3, required: true },
      { slug: "react", weight: 3, required: true }, { slug: "html-css", weight: 3, required: true },
      { slug: "tailwind", weight: 2, required: true }, { slug: "git", weight: 2, required: true },
      { slug: "nextjs", weight: 2, required: true }, { slug: "redux", weight: 2, required: false },
      { slug: "react-query", weight: 2, required: false }, { slug: "jest", weight: 2, required: false },
      { slug: "web-performance", weight: 2, required: false }, { slug: "webpack", weight: 1, required: false },
    ],
    "backend-developer": [
      { slug: "nodejs", weight: 3, required: true }, { slug: "typescript", weight: 3, required: true },
      { slug: "rest-apis", weight: 3, required: true }, { slug: "postgresql", weight: 3, required: true },
      { slug: "git", weight: 3, required: true }, { slug: "express", weight: 2, required: true },
      { slug: "redis", weight: 2, required: true }, { slug: "docker", weight: 2, required: true },
      { slug: "mongodb", weight: 2, required: false }, { slug: "message-queues", weight: 2, required: false },
      { slug: "microservices", weight: 2, required: false }, { slug: "oauth", weight: 2, required: false },
    ],
    "software-engineer": [
      { slug: "javascript", weight: 3, required: true }, { slug: "typescript", weight: 2, required: true },
      { slug: "git", weight: 3, required: true }, { slug: "problem-solving", weight: 3, required: true },
      { slug: "rest-apis", weight: 2, required: true }, { slug: "database-design", weight: 2, required: true },
      { slug: "design-patterns", weight: 2, required: false }, { slug: "agile", weight: 2, required: false },
      { slug: "docker", weight: 1, required: false }, { slug: "system-design", weight: 2, required: false },
    ],
    "data-analyst": [
      { slug: "python", weight: 3, required: true }, { slug: "sql", weight: 3, required: true },
      { slug: "pandas", weight: 3, required: true }, { slug: "statistics", weight: 3, required: true },
      { slug: "tableau", weight: 2, required: true }, { slug: "postgresql", weight: 2, required: true },
    ],
    "data-scientist": [
      { slug: "python", weight: 3, required: true }, { slug: "pandas", weight: 3, required: true },
      { slug: "scikit-learn", weight: 3, required: true }, { slug: "statistics", weight: 3, required: true },
      { slug: "sql", weight: 2, required: true }, { slug: "pytorch", weight: 2, required: false },
      { slug: "feature-engineering", weight: 3, required: true }, { slug: "mlops", weight: 2, required: false },
    ],
    "ml-engineer": [
      { slug: "python", weight: 3, required: true }, { slug: "pytorch", weight: 3, required: true },
      { slug: "scikit-learn", weight: 2, required: true }, { slug: "mlops", weight: 3, required: true },
      { slug: "docker", weight: 2, required: true }, { slug: "kubernetes", weight: 2, required: false },
      { slug: "ml-deployment", weight: 3, required: true }, { slug: "feature-engineering", weight: 2, required: true },
    ],
    "ai-engineer": [
      { slug: "python", weight: 3, required: true }, { slug: "llm-apis", weight: 3, required: true },
      { slug: "langchain", weight: 3, required: true }, { slug: "vector-db", weight: 3, required: true },
      { slug: "rest-apis", weight: 2, required: true }, { slug: "docker", weight: 2, required: true },
      { slug: "huggingface", weight: 2, required: false },
    ],
    "devops-engineer": [
      { slug: "docker", weight: 3, required: true }, { slug: "kubernetes", weight: 3, required: true },
      { slug: "terraform", weight: 3, required: true }, { slug: "ci-cd", weight: 3, required: true },
      { slug: "linux", weight: 3, required: true }, { slug: "bash", weight: 2, required: true },
      { slug: "aws", weight: 2, required: true }, { slug: "monitoring", weight: 2, required: true },
      { slug: "github-actions", weight: 2, required: false }, { slug: "ansible", weight: 2, required: false },
      { slug: "helm", weight: 2, required: false },
    ],
    "cloud-engineer": [
      { slug: "aws", weight: 3, required: true }, { slug: "terraform", weight: 3, required: true },
      { slug: "docker", weight: 3, required: true }, { slug: "kubernetes", weight: 2, required: true },
      { slug: "linux", weight: 2, required: true }, { slug: "monitoring", weight: 2, required: true },
      { slug: "s3", weight: 2, required: true }, { slug: "ec2", weight: 2, required: true },
    ],
    "security-engineer": [
      { slug: "owasp", weight: 3, required: true }, { slug: "penetration-testing", weight: 3, required: true },
      { slug: "linux", weight: 2, required: true }, { slug: "oauth", weight: 2, required: true },
      { slug: "ssl-tls", weight: 2, required: true }, { slug: "secrets-management", weight: 3, required: true },
    ],
    "mobile-developer": [
      { slug: "react-native", weight: 3, required: true }, { slug: "javascript", weight: 3, required: true },
      { slug: "typescript", weight: 2, required: true }, { slug: "rest-apis", weight: 2, required: true },
      { slug: "git", weight: 2, required: true }, { slug: "firebase", weight: 2, required: false },
    ],
    "solutions-architect": [
      { slug: "system-design", weight: 3, required: true }, { slug: "distributed-systems", weight: 3, required: true },
      { slug: "aws", weight: 3, required: true }, { slug: "microservices", weight: 3, required: true },
      { slug: "high-availability", weight: 3, required: true }, { slug: "api-design", weight: 2, required: true },
      { slug: "caching-strategies", weight: 2, required: false }, { slug: "message-queues", weight: 2, required: false },
    ],
    "qa-engineer": [
      { slug: "jest", weight: 3, required: true }, { slug: "playwright", weight: 3, required: true },
      { slug: "api-testing", weight: 3, required: true }, { slug: "tdd", weight: 3, required: true },
      { slug: "git", weight: 2, required: true }, { slug: "cypress", weight: 2, required: false },
    ],
    "product-manager": [
      { slug: "agile", weight: 3, required: true }, { slug: "communication", weight: 3, required: true },
      { slug: "jira", weight: 2, required: true }, { slug: "documentation", weight: 2, required: true },
    ],
    "ui-ux-designer": [
      { slug: "figma", weight: 3, required: true }, { slug: "html-css", weight: 2, required: true },
      { slug: "communication", weight: 2, required: true },
    ],
    "frontend-architect": [
      { slug: "react", weight: 3, required: true }, { slug: "typescript", weight: 3, required: true },
      { slug: "nextjs", weight: 3, required: true }, { slug: "redux", weight: 2, required: true },
      { slug: "web-performance", weight: 3, required: true }, { slug: "webpack", weight: 2, required: true },
      { slug: "playwright", weight: 2, required: true }, { slug: "design-patterns", weight: 2, required: false },
    ],
    "platform-engineer": [
      { slug: "kubernetes", weight: 3, required: true }, { slug: "terraform", weight: 3, required: true },
      { slug: "ci-cd", weight: 3, required: true }, { slug: "docker", weight: 3, required: true },
      { slug: "helm", weight: 3, required: true }, { slug: "linux", weight: 2, required: true },
      { slug: "monitoring", weight: 2, required: true }, { slug: "bash", weight: 2, required: true },
    ],
    "site-reliability-engineer": [
      { slug: "linux", weight: 3, required: true }, { slug: "monitoring", weight: 3, required: true },
      { slug: "kubernetes", weight: 2, required: true }, { slug: "docker", weight: 2, required: true },
      { slug: "bash", weight: 2, required: true }, { slug: "python", weight: 2, required: true },
      { slug: "high-availability", weight: 3, required: true },
    ],
    "data-engineer": [
      { slug: "python", weight: 3, required: true }, { slug: "sql", weight: 3, required: true },
      { slug: "spark", weight: 3, required: true }, { slug: "data-pipelines", weight: 3, required: true },
      { slug: "aws", weight: 2, required: true }, { slug: "message-queues", weight: 2, required: false },
    ],
  };

  let mappingCount = 0;
  for (const [roleSlug, skills] of Object.entries(mappings)) {
    const role = await prisma.role.findUnique({ where: { slug: roleSlug } });
    if (!role) continue;
    for (const s of skills) {
      const skillRecord = await prisma.skill.findUnique({ where: { slug: s.slug } });
      if (!skillRecord) continue;
      await prisma.roleSkill.upsert({
        where: { roleId_skillId: { roleId: role.id, skillId: skillRecord.id } },
        update: {},
        create: { roleId: role.id, skillId: skillRecord.id, weight: s.weight, isRequired: s.required },
      });
      mappingCount++;
    }
  }
  console.log(`Created ${mappingCount} role-skill mappings`);

  const resourcesData = [
    { skillSlug: "javascript", title: "The Modern JavaScript Tutorial", url: "https://javascript.info", level: "Beginner", hours: 20, provider: "javascript.info" },
    { skillSlug: "javascript", title: "JavaScript30", url: "https://javascript30.com", level: "Intermediate", hours: 15, provider: "Wes Bos" },
    { skillSlug: "typescript", title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/", level: "Beginner", hours: 10, provider: "TypeScript.org" },
    { skillSlug: "typescript", title: "Total TypeScript", url: "https://www.totaltypescript.com", level: "Intermediate", hours: 20, provider: "Total TypeScript" },
    { skillSlug: "react", title: "React Official Docs", url: "https://react.dev/learn", level: "Beginner", hours: 12, provider: "React" },
    { skillSlug: "react", title: "Epic React", url: "https://epicreact.dev", level: "Advanced", hours: 40, provider: "Kent C. Dodds" },
    { skillSlug: "nextjs", title: "Next.js Official Learn", url: "https://nextjs.org/learn", level: "Beginner", hours: 8, provider: "Vercel" },
    { skillSlug: "nodejs", title: "Node.js Official Guide", url: "https://nodejs.org/en/learn", level: "Beginner", hours: 10, provider: "Node.js" },
    { skillSlug: "nodejs", title: "NodeJS — The Complete Guide", url: "https://www.udemy.com/course/nodejs-the-complete-guide", level: "Intermediate", hours: 40, provider: "Udemy" },
    { skillSlug: "express", title: "Express.js Official Guide", url: "https://expressjs.com/en/guide/routing.html", level: "Beginner", hours: 8, provider: "Express.js" },
    { skillSlug: "postgresql", title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com", level: "Beginner", hours: 12, provider: "postgresqltutorial.com" },
    { skillSlug: "postgresql", title: "Use The Index, Luke!", url: "https://use-the-index-luke.com", level: "Advanced", hours: 15, provider: "Markus Winand" },
    { skillSlug: "docker", title: "Docker Official Getting Started", url: "https://docs.docker.com/get-started", level: "Beginner", hours: 8, provider: "Docker" },
    { skillSlug: "docker", title: "Docker & Kubernetes: The Practical Guide", url: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide", level: "Intermediate", hours: 30, provider: "Udemy" },
    { skillSlug: "kubernetes", title: "Kubernetes Official Tutorial", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics", level: "Beginner", hours: 10, provider: "Kubernetes" },
    { skillSlug: "terraform", title: "Terraform Get Started (AWS)", url: "https://developer.hashicorp.com/terraform/tutorials/aws-get-started", level: "Beginner", hours: 10, provider: "HashiCorp" },
    { skillSlug: "python", title: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial", level: "Beginner", hours: 12, provider: "Python.org" },
    { skillSlug: "python", title: "Automate the Boring Stuff with Python", url: "https://automatetheboringstuff.com", level: "Intermediate", hours: 20, provider: "Al Sweigart" },
    { skillSlug: "pytorch", title: "PyTorch Official Tutorials", url: "https://pytorch.org/tutorials", level: "Intermediate", hours: 20, provider: "PyTorch" },
    { skillSlug: "scikit-learn", title: "Scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html", level: "Intermediate", hours: 15, provider: "scikit-learn" },
    { skillSlug: "aws", title: "AWS Skill Builder", url: "https://skillbuilder.aws", level: "Beginner", hours: 20, provider: "AWS" },
    { skillSlug: "system-design", title: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer", level: "Intermediate", hours: 20, provider: "Donne Martin" },
    { skillSlug: "system-design", title: "Designing Data-Intensive Applications", url: "https://dataintensive.net", level: "Advanced", hours: 30, provider: "O'Reilly" },
    { skillSlug: "git", title: "Pro Git Book", url: "https://git-scm.com/book/en/v2", level: "Beginner", hours: 8, provider: "Scott Chacon" },
    { skillSlug: "ci-cd", title: "GitHub Actions Official Docs", url: "https://docs.github.com/en/actions", level: "Beginner", hours: 8, provider: "GitHub" },
    { skillSlug: "rest-apis", title: "REST API Design Best Practices", url: "https://restfulapi.net", level: "Beginner", hours: 6, provider: "restfulapi.net" },
    { skillSlug: "sql", title: "SQLZoo Interactive SQL Tutorial", url: "https://sqlzoo.net", level: "Beginner", hours: 10, provider: "SQLZoo" },
    { skillSlug: "pandas", title: "Pandas Getting Started", url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials", level: "Beginner", hours: 8, provider: "Pandas" },
    { skillSlug: "langchain", title: "LangChain Official Docs", url: "https://python.langchain.com/docs/get_started/introduction", level: "Intermediate", hours: 15, provider: "LangChain" },
    { skillSlug: "llm-apis", title: "OpenAI Quickstart Guide", url: "https://platform.openai.com/docs/quickstart", level: "Beginner", hours: 5, provider: "OpenAI" },
    { skillSlug: "vector-db", title: "Pinecone Learning Center", url: "https://www.pinecone.io/learn", level: "Beginner", hours: 8, provider: "Pinecone" },
    { skillSlug: "jest", title: "Jest Official Documentation", url: "https://jestjs.io/docs/getting-started", level: "Beginner", hours: 8, provider: "Jest" },
    { skillSlug: "playwright", title: "Playwright Official Docs", url: "https://playwright.dev/docs/intro", level: "Beginner", hours: 10, provider: "Microsoft" },
    { skillSlug: "react-native", title: "React Native Official Docs", url: "https://reactnative.dev/docs/getting-started", level: "Beginner", hours: 12, provider: "Meta" },
    { skillSlug: "mongodb", title: "MongoDB University", url: "https://learn.mongodb.com", level: "Beginner", hours: 10, provider: "MongoDB" },
    { skillSlug: "redis", title: "Redis Official Getting Started", url: "https://redis.io/docs/get-started", level: "Beginner", hours: 6, provider: "Redis" },
    { skillSlug: "html-css", title: "The Odin Project (HTML & CSS)", url: "https://www.theodinproject.com/paths/foundations/courses/foundations", level: "Beginner", hours: 20, provider: "The Odin Project" },
    { skillSlug: "tailwind", title: "Tailwind CSS Official Docs", url: "https://tailwindcss.com/docs/installation", level: "Beginner", hours: 6, provider: "Tailwind CSS" },
    { skillSlug: "linux", title: "Linux Journey (Interactive)", url: "https://linuxjourney.com", level: "Beginner", hours: 10, provider: "linuxjourney.com" },
    { skillSlug: "bash", title: "Bash Guide for Beginners", url: "https://tldp.org/LDP/Bash-Beginners-Guide/html", level: "Beginner", hours: 8, provider: "TLDP" },
    { skillSlug: "oauth", title: "OAuth 2.0 Simplified", url: "https://www.oauth.com", level: "Intermediate", hours: 6, provider: "Aaron Parecki" },
    { skillSlug: "owasp", title: "OWASP Top 10 Guide", url: "https://owasp.org/www-project-top-ten", level: "Intermediate", hours: 8, provider: "OWASP" },
    { skillSlug: "microservices", title: "Microservices.io Patterns", url: "https://microservices.io/patterns", level: "Advanced", hours: 15, provider: "Chris Richardson" },
    { skillSlug: "figma", title: "Figma Official Beginner Course", url: "https://www.figma.com/resources/learn-design", level: "Beginner", hours: 6, provider: "Figma" },
    { skillSlug: "monitoring", title: "Prometheus Official Getting Started", url: "https://prometheus.io/docs/prometheus/latest/getting_started", level: "Intermediate", hours: 8, provider: "Prometheus" },
    { skillSlug: "statistics", title: "StatQuest with Josh Starmer", url: "https://www.youtube.com/@statquest", level: "Beginner", hours: 15, provider: "YouTube" },
    { skillSlug: "spark", title: "Apache Spark Quick Start", url: "https://spark.apache.org/docs/latest/quick-start.html", level: "Intermediate", hours: 15, provider: "Apache" },
    { skillSlug: "data-pipelines", title: "Airflow Official Tutorial", url: "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html", level: "Intermediate", hours: 10, provider: "Apache" },
    { skillSlug: "problem-solving", title: "Neetcode 150", url: "https://neetcode.io/practice", level: "Intermediate", hours: 40, provider: "Neetcode" },
    { skillSlug: "design-patterns", title: "Refactoring Guru Design Patterns", url: "https://refactoring.guru/design-patterns", level: "Intermediate", hours: 12, provider: "Refactoring Guru" },
    { skillSlug: "message-queues", title: "RabbitMQ Tutorials", url: "https://www.rabbitmq.com/tutorials", level: "Intermediate", hours: 8, provider: "RabbitMQ" },
  ];

  let resourceCount = 0;
  for (const r of resourcesData) {
    const skillRecord = await prisma.skill.findUnique({ where: { slug: r.skillSlug } });
    if (!skillRecord) continue;
    await prisma.learningResource.create({
      data: { skillId: skillRecord.id, title: r.title, url: r.url, level: r.level, durationHours: r.hours, provider: r.provider },
    });
    resourceCount++;
  }
  console.log(`Created ${resourceCount} learning resources`);
  console.log("Seed complete!");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
