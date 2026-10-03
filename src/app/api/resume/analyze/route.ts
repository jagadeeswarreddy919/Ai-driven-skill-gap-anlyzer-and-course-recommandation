import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription/access";
import { canUseResumeAnalysis } from "@/lib/subscription/permissions";
import { prisma } from "@/lib/db";
import { extractText } from "unpdf";

// Regex rules mapping to canonical skill slugs or names
const SKILL_RULES: Array<{
  slug: string;
  name: string;
  patterns: RegExp[];
}> = [
  // Programming Languages
  { slug: "python", name: "Python", patterns: [/\bpython(3)?\b/i] },
  { slug: "javascript", name: "JavaScript", patterns: [/\b(javascript|js|es6|es20\d\d|ecmascript)\b/i] },
  { slug: "typescript", name: "TypeScript", patterns: [/\b(typescript|ts)\b/i] },
  { slug: "java", name: "Java", patterns: [/\bjava\b(?!\s*script)/i] },
  { slug: "go", name: "Go (Golang)", patterns: [/\bgolang\b/i, /\bgo\s*(?:language|programming|developer|backend)\b/i] },
  { slug: "kotlin", name: "Kotlin", patterns: [/\bkotlin\b/i] },
  { slug: "swift", name: "Swift", patterns: [/\bswift\b/i] },
  { slug: "cpp", name: "C++", patterns: [/\b(c\+\+|cpp)\b/i] },
  { slug: "ruby", name: "Ruby", patterns: [/\bruby(\s*on\s*rails)?\b/i] },

  // Frontend
  { slug: "react", name: "React", patterns: [/\breact(\.js|js)?\b(?!\s*native)/i] },
  { slug: "nextjs", name: "Next.js", patterns: [/\bnext(\.js|js)?\b/i] },
  { slug: "vuejs", name: "Vue.js", patterns: [/\bvue(\.js|js)?\b/i] },
  { slug: "angular", name: "Angular", patterns: [/\bangular(\.js|js)?\b/i] },
  { slug: "svelte", name: "Svelte", patterns: [/\bsvelte\b/i] },
  { slug: "html-css", name: "HTML5 & CSS3", patterns: [/\b(html5?|css3?|html\s*(?:and|&)?\s*css)\b/i] },
  { slug: "tailwind", name: "Tailwind CSS", patterns: [/\btailwind(\s*css)?\b/i] },
  { slug: "sass", name: "SASS/SCSS", patterns: [/\b(sass|scss)\b/i] },
  { slug: "redux", name: "Redux / Zustand", patterns: [/\b(redux|zustand|mobx)\b/i] },
  { slug: "react-query", name: "React Query / TanStack", patterns: [/\b(react\s*query|tanstack)\b/i] },
  { slug: "graphql-client", name: "GraphQL (Client)", patterns: [/\b(graphql|apollo\s*client)\b/i] },
  { slug: "react-native", name: "React Native", patterns: [/\breact\s*native\b/i] },
  { slug: "flutter", name: "Flutter", patterns: [/\bflutter\b/i] },
  { slug: "full-stack", name: "Full Stack Development", patterns: [/\bfull\s*stack\b/i] },

  // Backend
  { slug: "nodejs", name: "Node.js", patterns: [/\bnode(\.js|js)?\b/i] },
  { slug: "express", name: "Express.js", patterns: [/\bexpress(\.js|js)?\b/i] },
  { slug: "nestjs", name: "NestJS", patterns: [/\bnest(\.js|js)?\b/i] },
  { slug: "fastapi", name: "FastAPI", patterns: [/\bfastapi\b/i] },
  { slug: "django", name: "Django", patterns: [/\bdjango\b/i] },
  { slug: "spring-boot", name: "Spring Boot", patterns: [/\bspring(\s*boot)?\b/i] },
  { slug: "rest-apis", name: "REST API Design", patterns: [/\b(rest(\s*apis?|\s*ful)?|restful\s*apis?|apis?)\b/i] },
  { slug: "grpc", name: "gRPC", patterns: [/\bgrpc\b/i] },
  { slug: "microservices", name: "Microservices Architecture", patterns: [/\bmicroservices?\b/i] },
  { slug: "message-queues", name: "Message Queues (RabbitMQ/Kafka)", patterns: [/\b(rabbitmq|kafka|message\s*queues?)\b/i] },
  { slug: "websockets", name: "WebSockets & Real-time", patterns: [/\b(websockets?|socket\.io)\b/i] },

  // Database
  { slug: "postgresql", name: "PostgreSQL", patterns: [/\b(postgresql|postgres|psql)\b/i] },
  { slug: "mysql", name: "MySQL", patterns: [/\bmysql\b/i] },
  { slug: "mongodb", name: "MongoDB", patterns: [/\b(mongodb|mongo)\b/i] },
  { slug: "redis", name: "Redis", patterns: [/\bredis\b/i] },
  { slug: "elasticsearch", name: "Elasticsearch", patterns: [/\belasticsearch\b/i] },
  { slug: "prisma", name: "Prisma ORM", patterns: [/\bprisma(\s*orm)?\b/i] },
  { slug: "database-design", name: "Database Design", patterns: [/\b(database\s*design|schema\s*design|relational\s*database)\b/i] },
  { slug: "vector-db", name: "Vector Databases (Pinecone/Weaviate)", patterns: [/\b(vector\s*db|pinecone|weaviate|chromadb|faiss|qdrant)\b/i] },
  { slug: "sql", name: "SQL & Query Optimization", patterns: [/\b(sql|rdbms|query\s*optimization)\b/i] },

  // Cloud & DevOps
  { slug: "aws", name: "AWS", patterns: [/\b(aws|amazon\s*web\s*services|aws\s*cloud)\b/i] },
  { slug: "gcp", name: "Google Cloud (GCP)", patterns: [/\b(gcp|google\s*cloud)\b/i] },
  { slug: "azure", name: "Microsoft Azure", patterns: [/\b(azure|microsoft\s*azure)\b/i] },
  { slug: "vercel", name: "Vercel", patterns: [/\bvercel\b/i] },
  { slug: "s3", name: "AWS S3 / Object Storage", patterns: [/\b(s3|aws\s*s3|blob\s*storage)\b/i] },
  { slug: "lambda", name: "Serverless / Lambda Functions", patterns: [/\b(aws\s*lambda|serverless\s*functions?|lambda)\b/i] },
  { slug: "ec2", name: "EC2 / VMs", patterns: [/\b(ec2|aws\s*ec2)\b/i] },
  { slug: "firebase", name: "Firebase", patterns: [/\bfirebase\b/i] },
  { slug: "docker", name: "Docker", patterns: [/\bdocker\b/i] },
  { slug: "kubernetes", name: "Kubernetes", patterns: [/\b(kubernetes|k8s)\b/i] },
  { slug: "terraform", name: "Terraform (IaC)", patterns: [/\bterraform\b/i] },
  { slug: "ci-cd", name: "CI/CD Pipelines", patterns: [/\b(ci\/cd|ci-cd|continuous\s*integration)\b/i] },
  { slug: "github-actions", name: "GitHub Actions", patterns: [/\bgithub\s*actions\b/i] },
  { slug: "jenkins", name: "Jenkins", patterns: [/\bjenkins\b/i] },
  { slug: "monitoring", name: "Prometheus & Grafana", patterns: [/\b(prometheus|grafana|datadog)\b/i] },
  { slug: "linux", name: "Linux Administration", patterns: [/\b(linux|ubuntu|centos|debian|redhat)\b/i] },
  { slug: "bash", name: "Bash Scripting", patterns: [/\b(bash|shell\s*script(ing)?)\b/i] },
  { slug: "nginx", name: "Nginx / Web Servers", patterns: [/\bnginx\b/i] },

  // AI / ML
  { slug: "machine-learning", name: "Machine Learning", patterns: [/\b(machine\s*learning|ml)\b/i] },
  { slug: "deep-learning", name: "Deep Learning", patterns: [/\b(deep\s*learning|neural\s*networks?)\b/i] },
  { slug: "generative-ai", name: "Generative AI", patterns: [/\b(generative\s*ai|gen\s*ai|genai|llms?|large\s*language\s*models?)\b/i] },
  { slug: "pytorch", name: "PyTorch", patterns: [/\bpytorch\b/i] },
  { slug: "tensorflow", name: "TensorFlow", patterns: [/\b(tensorflow|keras)\b/i] },
  { slug: "scikit-learn", name: "Scikit-learn", patterns: [/\b(scikit-learn|sklearn)\b/i] },
  { slug: "pandas", name: "Pandas & NumPy", patterns: [/\b(pandas|numpy)\b/i] },
  { slug: "llm-apis", name: "LLM APIs (OpenAI/Gemini)", patterns: [/\b(openai|gemini|anthropic|claude|llm\s*apis?)\b/i] },
  { slug: "langchain", name: "LangChain / LlamaIndex", patterns: [/\b(langchain|llamaindex)\b/i] },
  { slug: "huggingface", name: "Hugging Face Transformers", patterns: [/\b(hugging\s*face|transformers)\b/i] },
  { slug: "mlops", name: "MLOps & Experiment Tracking", patterns: [/\b(mlops|wandb|mlflow)\b/i] },
  { slug: "nlp", name: "NLP", patterns: [/\b(nlp|natural\s*language\s*processing)\b/i] },
  { slug: "spark", name: "Apache Spark", patterns: [/\b(apache\s*spark|pyspark|spark)\b/i] },
  { slug: "statistics", name: "Statistics & Probability", patterns: [/\b(statistics|probability)\b/i] },

  // Testing & Security
  { slug: "jest", name: "Jest & Unit Testing", patterns: [/\b(jest|unit\s*testing|vitest|mocha)\b/i] },
  { slug: "playwright", name: "Playwright / E2E Testing", patterns: [/\b(playwright|e2e\s*testing)\b/i] },
  { slug: "cypress", name: "Cypress", patterns: [/\bcypress\b/i] },
  { slug: "oauth", name: "OAuth 2.0 & JWT", patterns: [/\b(oauth|oauth\s*2\.0|jwt|json\s*web\s*token)\b/i] },
  { slug: "owasp", name: "OWASP / Web Security", patterns: [/\b(owasp|web\s*security)\b/i] },

  // Tools & System Design
  { slug: "git", name: "Git & Version Control", patterns: [/\b(git|github|gitlab|version\s*control)\b/i] },
  { slug: "jira", name: "Jira / Project Management", patterns: [/\bjira\b/i] },
  { slug: "figma", name: "Figma / UI Design", patterns: [/\bfigma\b/i] },
  { slug: "postman", name: "Postman / API Tools", patterns: [/\bpostman\b/i] },
  { slug: "webpack", name: "Webpack / Vite / Build Tools", patterns: [/\b(webpack|vite|turbo)\b/i] },
  { slug: "tableau", name: "Tableau / Power BI", patterns: [/\b(tableau|power\s*bi)\b/i] },
  { slug: "ms-excel", name: "MS Excel & Spreadsheets", patterns: [/\b(ms\s*excel|excel|spreadsheets?)\b/i] },
  { slug: "system-design", name: "System Design", patterns: [/\bsystem\s*design\b/i] },
  { slug: "distributed-systems", name: "Distributed Systems", patterns: [/\bdistributed\s*systems?\b/i] },
  { slug: "agile", name: "Agile / Scrum", patterns: [/\b(agile|scrum|kanban)\b/i] },
  { slug: "problem-solving", name: "Problem Solving & Algorithms", patterns: [/\b(problem\s*solving|algorithms|data\s*structures)\b/i] },

  // Hardware / ECE
  { slug: "digital-electronics", name: "Digital Electronics", patterns: [/\bdigital\s*electronics\b/i] },
  { slug: "circuit-design", name: "Circuit Design", patterns: [/\bcircuit\s*design\b/i] },
  { slug: "microcontrollers", name: "Microprocessors & Microcontrollers", patterns: [/\b(microprocessors?|microcontrollers?|embedded\s*systems?)\b/i] },
  { slug: "communication-signals", name: "Communication Signals", patterns: [/\b(communication\s*signals?|signals\s*and\s*systems|dsp)\b/i] },
];

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const sub = await getUserSubscription(user.id);
    const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan as "FREE" | "STANDARD" | "PRO" : "FREE";
    if (!canUseResumeAnalysis(plan)) return NextResponse.json({ message: "Pro plan required" }, { status: 403 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ message: "File too large (max 10MB)" }, { status: 400 });

    let text = "";
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      try {
        const buffer = await file.arrayBuffer();
        const pdfResult = await extractText(new Uint8Array(buffer), { mergePages: true });
        text = Array.isArray(pdfResult.text) ? pdfResult.text.join("\n") : (pdfResult.text || "");
      } catch (pdfErr) {
        console.error("PDF extraction error:", pdfErr);
        // Fallback to text decoding
        const buffer = await file.arrayBuffer();
        text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
      }
    } else {
      text = await file.text();
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ message: "Could not extract readable text from resume." }, { status: 400 });
    }

    // Load all skills from DB
    const allDbSkills = await prisma.skill.findMany();
    const dbSkillBySlug = new Map(allDbSkills.map(s => [s.slug.toLowerCase(), s]));
    const dbSkillByName = new Map(allDbSkills.map(s => [s.name.toLowerCase(), s]));

    const matchedSkillSlugs = new Set<string>();
    const matchedSkillNames = new Set<string>();
    const detectedDbSkillIds = new Set<string>();

    // 1. Match via structured rule patterns
    for (const rule of SKILL_RULES) {
      for (const pattern of rule.patterns) {
        if (pattern.test(text)) {
          matchedSkillSlugs.add(rule.slug);
          matchedSkillNames.add(rule.name);
          const dbSkill = dbSkillBySlug.get(rule.slug.toLowerCase());
          if (dbSkill) {
            detectedDbSkillIds.add(dbSkill.id);
          }
          break;
        }
      }
    }

    // 2. Dynamic word boundary check for any remaining DB skills
    for (const dbSkill of allDbSkills) {
      if (detectedDbSkillIds.has(dbSkill.id)) continue;
      // Skip very short generic names like "C" or "R" unless exact
      if (dbSkill.name.length < 3) continue;

      const escapedName = dbSkill.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const nameRegex = new RegExp(`\\b${escapedName}\\b`, "i");
      if (nameRegex.test(text)) {
        matchedSkillNames.add(dbSkill.name);
        detectedDbSkillIds.add(dbSkill.id);
      }
    }

    // Auto-save detected skills to user's profile/skills
    for (const skillId of detectedDbSkillIds) {
      await prisma.userSkill.upsert({
        where: { userId_skillId: { userId: user.id, skillId } },
        update: {},
        create: { userId: user.id, skillId },
      });
    }

    // Save resume record
    const detectedList = Array.from(matchedSkillNames);
    await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: file.name,
        extractedText: text.slice(0, 10000),
        extractedSkills: JSON.stringify(detectedList),
      },
    });

    // Update usage tracking
    const month = new Date().toISOString().slice(0, 7);
    await prisma.usage.upsert({
      where: { userId_month: { userId: user.id, month } },
      update: { resumeAnalyses: { increment: 1 } },
      create: { userId: user.id, month, resumeAnalyses: 1 },
    });

    return NextResponse.json({
      skills: detectedList,
      count: detectedList.length,
      savedToProfile: detectedDbSkillIds.size,
      textSnippet: text.slice(0, 300),
    });
  } catch (error: any) {
    console.error("Resume analyze error:", error);
    return NextResponse.json({ message: error?.message || "Failed to analyze resume" }, { status: 500 });
  }
}