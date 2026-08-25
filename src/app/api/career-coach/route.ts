import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription/access";
import { canUseCareerCoach } from "@/lib/subscription/permissions";
import { prisma } from "@/lib/db";

const SKILL_DATABASE: Record<string, { summary: string; topics: string[]; project: string; resource: string }> = {
  python: {
    summary: "Python is essential for Data Science, AI/ML, and Backend Development.",
    topics: ["Data Structures & OOP", "Pandas & NumPy Dataframes", "FastAPI / Django REST Framework", "AsyncIO & Multiprocessing"],
    project: "Build a RESTful API or Automated Data Pipeline using FastAPI and Pandas.",
    resource: "Python Docs (docs.python.org) & RealPython.com"
  },
  javascript: {
    summary: "JavaScript is the core language of modern Web Development.",
    topics: ["ES6+ Features (Promises, Async/Await)", "DOM Manipulation & Event Loop", "Closure & Prototypes", "Fetch API & JSON Parsing"],
    project: "Build an interactive single-page app or Chrome extension.",
    resource: "MDN Web Docs (developer.mozilla.org)"
  },
  typescript: {
    summary: "TypeScript adds static typing to JS, essential for scalable enterprise codebases.",
    topics: ["Interfaces & Type Aliases", "Generics & Utility Types", "Strict Null Checks", "TS Config & Build Integration"],
    project: "Migrate a JavaScript project to strict TypeScript with custom type definitions.",
    resource: "TypeScript Official Handbook (typescriptlang.org)"
  },
  react: {
    summary: "React is the leading UI library for web and mobile frontends.",
    topics: ["Hooks (useState, useEffect, useMemo, useCallback)", "Context API & State Management", "Component Composition", "Performance Optimization"],
    project: "Build a real-time dashboard with charts, filters, and dark mode.",
    resource: "React.dev (Official Documentation)"
  },
  "next.js": {
    summary: "Next.js is the React framework for production with Server Components & SSR.",
    topics: ["App Router & Server Actions", "Server-side Rendering (SSR) & Static Generation (SSG)", "API Routes & Middleware", "SEO & Turbopack Optimization"],
    project: "Build a full-stack SaaS platform with database integration and authentication.",
    resource: "Next.js Documentation (nextjs.org/docs)"
  },
  node: {
    summary: "Node.js runs JavaScript on the server for fast, non-blocking asynchronous APIs.",
    topics: ["Event Loop & EventEmitters", "Express.js / NestJS API Routes", "Streams & Buffer Operations", "Authentication (JWT & OAuth)"],
    project: "Build a REST API microservice with rate-limiting, authentication, and database ORM.",
    resource: "Nodejs.org Guides & ExpressJS Docs"
  },
  sql: {
    summary: "SQL is fundamental for relational database querying and management.",
    topics: ["Complex JOINs & Subqueries", "Indexing & Execution Plans", "Transactions & ACID Compliance", "Group By & Aggregate Window Functions"],
    project: "Design an E-commerce relational schema and optimize complex analytical queries.",
    resource: "PostgreSQL Tutorial & Mode Analytics SQL Guide"
  },
  postgresql: {
    summary: "PostgreSQL is an advanced, enterprise-grade open source relational database.",
    topics: ["JSONB Data Types", "Indexing Strategies (B-Tree, GIN)", "Prisma / Drizzle ORM Integration", "DB Migration Tools"],
    project: "Build a high-performance backend database with JSON operations and full-text search.",
    resource: "Postgresql.org Docs & Prisma Docs"
  },
  docker: {
    summary: "Docker containerizes applications for consistent environment deployment.",
    topics: ["Dockerfile Instructions", "Multi-stage Builds", "Docker Compose Multi-container Config", "Networking & Volumes"],
    project: "Containerize a Full Stack App (Frontend + Node Backend + Postgres DB) using Docker Compose.",
    resource: "Docker Docs (docs.docker.com)"
  },
  kubernetes: {
    summary: "Kubernetes orchestrates container deployment, scaling, and management.",
    topics: ["Pods, Services & Deployments", "ConfigMaps & Secrets", "Ingress Controllers", "Helm Charts"],
    project: "Deploy a microservice cluster with automated auto-scaling and load balancing.",
    resource: "Kubernetes.io Interactive Tutorials"
  },
  aws: {
    summary: "AWS is the leading cloud infrastructure platform.",
    topics: ["EC2 & S3", "Lambda & Serverless", "IAM Roles & Security Groups", "RDS & DynamoDB"],
    project: "Host a serverless REST API using API Gateway, AWS Lambda, and DynamoDB.",
    resource: "AWS Skill Builder & Documentation"
  },
  "system design": {
    summary: "System Design is critical for designing scalable, high-availability architecture.",
    topics: ["Load Balancing & Caching (Redis)", "Database Sharding & Replication", "Message Queues (Kafka/RabbitMQ)", "API Gateway & Rate Limiting"],
    project: "Design high-level architecture diagrams for URL Shortener or Messaging App.",
    resource: "System Design Primer (GitHub) & ByteByteGo"
  },
  git: {
    summary: "Git is the industry-standard distributed version control system.",
    topics: ["Branching Strategies (GitFlow)", "Rebase vs Merge", "Cherry-picking & Stash", "GitHub Actions CI/CD Integration"],
    project: "Set up automated GitHub Actions workflow to run tests and deploy on pull request.",
    resource: "Git-scm.com Documentation"
  },
};

function generateAIResponse(message: string, history: Array<{ role: string; content: string }>, context: { roleName: string; score: number; label: string; matched: string[]; gaps: Array<{ name: string; priority: string }> }): string {
  const msg = message.toLowerCase().trim();
  const role = context.roleName;
  const score = context.score;
  const matchedStr = context.matched.slice(0, 4).join(", ") || "fundamental skills";
  const topGaps = context.gaps.map(g => g.name);
  const primaryGap = topGaps[0] ?? "advanced technical concepts";
  const secondaryGap = topGaps[1] ?? "system architecture";

  // Check if message mentions specific skill
  for (const [key, info] of Object.entries(SKILL_DATABASE)) {
    if (msg.includes(key)) {
      return "### 💡 Deep Dive: **" + key.toUpperCase() + "** Guide for " + role + "\n\n" + info.summary + "\n\n**🎯 Core Topics to Master:**\n" + info.topics.map(t => "- " + t).join("\n") + "\n\n**🛠️ Recommended Project Idea:**\n" + info.project + "\n\n**📖 Recommended Resource:**\n" + info.resource + "\n\n**Interview Tip:** Be prepared to explain how you apply " + key + " in real production environments!";
    }
  }

  // 1. Affirmative follow-ups ("yes", "yeah", "sure", "ok", "please", "go ahead")
  if (/^(yes|yeah|sure|ok|okay|please|go ahead|tell me more|do it|next)$/i.test(msg) || (msg.length <= 5 && (msg.includes("yes") || msg.includes("sure") || msg.includes("ok")))) {
    return "Great! Let us focus on your **#1 Critical Skill Gap**: **" + primaryGap + "** for your goal as a **" + role + "**.\n\n### 🚀 3-Step Action Plan for " + primaryGap + ":\n\n1. **Core Practice (Days 1–3)**:\n   Spend 45 minutes daily reviewing official documentation and completing hands-on tutorials on **" + primaryGap + "**.\n\n2. **Mini Project (Days 4–7)**:\n   Build a small standalone project implementing **" + primaryGap + "** alongside your existing skills (**" + matchedStr + "**).\n\n3. **Benchmark Check**:\n   Once complete, rerun your Skill Gap Analysis on the platform to update your readiness score beyond **" + score + "%**!\n\nWould you like a specific tutorial link or project idea for **" + primaryGap + "**?";
  }

  // 2. Project & Portfolio Questions
  if (msg.includes("project") || msg.includes("portfolio") || msg.includes("build") || msg.includes("idea")) {
    return "### 🛠️ Top 3 Portfolio Projects for **" + role + "**:\n\n1. **Full-Featured " + role + " Portal**:\n   Build a production app combining your matched skills (**" + matchedStr + "**) with key gaps like **" + primaryGap + "**.\n\n2. **Automated API & Integration Engine**:\n   Create a REST or GraphQL service with authentication, rate-limiting, and test coverage.\n\n3. **Performance Optimized Dashboard**:\n   Build an analytics interface featuring real-time charts, dark mode, and optimized database queries.\n\n**Tip:** Host these on GitHub with a clean README and live demo link! Which project would you like to build first?";
  }

  // 3. Interview Preparation Questions
  if (msg.includes("interview") || msg.includes("prepare") || msg.includes("dsa") || msg.includes("coding") || msg.includes("questions")) {
    return "### 📋 Technical Interview Prep Plan for **" + role + "**:\n\n1. **Coding & Problem Solving (40%)**:\n   Focus on Arrays, Strings, Hash Maps, and Binary Search. Practice 1–2 Medium problems daily.\n\n2. **Role-Specific Core Skills (40%)**:\n   Be ready for deep-dive questions on **" + matchedStr + "** and demonstrate awareness of **" + primaryGap + "**.\n\n3. **System Architecture & Behavioral (20%)**:\n   Practice explaining past project trade-offs using the **STAR method** (Situation, Task, Action, Result).\n\nWould you like mock interview questions for **" + role + "**?";
  }

  // 4. Salary & Career Growth
  if (msg.includes("salary") || msg.includes("pay") || msg.includes("compensation") || msg.includes("worth") || msg.includes("growth")) {
    return "### 💼 Salary & Career Insights for **" + role + "**:\n\n- **Entry Level / Junior**: ₹6L – ₹12L INR / year ($60k – $85k USD)\n- **Mid Level (2–4 yrs)**: ₹14L – ₹25L INR / year ($90k – $130k USD)\n- **Senior / Lead (5+ yrs)**: ₹28L – ₹50L+ INR / year ($140k – $200k+ USD)\n\n**Career Acceleration Tip:** Reaching 85%+ readiness score in your skill gap analysis places you in the top 15% of candidates for " + role + " positions!";
  }

  // 5. Schedule & Study Plan
  if (msg.includes("schedule") || msg.includes("hours") || msg.includes("time") || msg.includes("plan") || msg.includes("how long")) {
    return "### 📅 Recommended Daily Study Schedule for **" + role + "**:\n\n- **Daily Target**: 90 Minutes / day\n- **Phase 1 (45 mins)**: Structured learning of **" + primaryGap + "** and **" + secondaryGap + "**.\n- **Phase 2 (45 mins)**: Hands-on coding and mini-project building.\n- **Weekly Goal**: Close 1 skill gap every 7–10 days.\n\nAt this pace, your readiness score will grow from **" + score + "%** to **85%+** in 4 to 6 weeks!";
  }

  // 6. Generic / Fallback Response with Dynamic Context
  return "Thank you for your question! As a candidate aiming for **" + role + "** (current readiness score: **" + score + "% - " + context.label + "**):\n\n- **Skills Mastered**: " + matchedStr + "\n- **Top Priority Gap**: **" + primaryGap + "**\n\nTo give you the most accurate answer, would you like advice on:\n1. 📖 How to master **" + primaryGap + "**\n2. 🛠️ Project ideas for **" + role + "**\n3. 📋 Interview preparation guide\n4. 📅 4-Week study roadmap";
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan as "FREE" | "STANDARD" | "PRO" : "FREE";

  if (!canUseCareerCoach(plan)) {
    return NextResponse.json({ message: "Pro plan required" }, { status: 403 });
  }

  const { message, history } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ message: "Invalid message" }, { status: 400 });
  }

  const latestAssessment = await prisma.assessment.findFirst({
    where: { userId: user.id },
    include: {
      role: true,
      assessmentSkills: { where: { matched: true }, include: { skill: true } },
      skillGaps: { include: { skill: true }, orderBy: { priority: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const context = {
    roleName: latestAssessment?.role.title ?? "Software Engineer",
    score: latestAssessment?.score ?? 50,
    label: latestAssessment?.label ?? "Developing",
    matched: latestAssessment?.assessmentSkills.map(s => s.skill.name) ?? ["JavaScript", "HTML/CSS"],
    gaps: latestAssessment?.skillGaps.map(g => ({ name: g.skill.name, priority: g.priority })) ?? [
      { name: "System Design", priority: "Critical" },
      { name: "Docker", priority: "High" },
    ],
  };

  const reply = generateAIResponse(message, history ?? [], context);
  return NextResponse.json({ reply });
}