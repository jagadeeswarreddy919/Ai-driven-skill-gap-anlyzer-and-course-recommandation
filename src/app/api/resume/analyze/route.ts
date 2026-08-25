import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription/access";
import { canUseResumeAnalysis } from "@/lib/subscription/permissions";
import { prisma } from "@/lib/db";

const SKILL_KEYWORDS = [
  "JavaScript","TypeScript","Python","Java","Go","Kotlin","React","Next.js","Vue.js",
  "Angular","Node.js","Express","NestJS","FastAPI","Django","Spring Boot",
  "PostgreSQL","MySQL","MongoDB","Redis","Docker","Kubernetes","Terraform",
  "AWS","GCP","Azure","Firebase","GraphQL","REST API","Microservices",
  "PyTorch","TensorFlow","Scikit-learn","Pandas","NumPy","LangChain",
  "MLOps","NLP","Apache Spark","SQL","Git","Linux","Bash","CI/CD",
  "Jest","Playwright","OAuth","JWT","WebSockets","Flutter","React Native",
  "Figma","Agile","Scrum","System Design","Tailwind","Redux","Webpack","Nginx",
];

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan as "FREE" | "STANDARD" | "PRO" : "FREE";
  if (!canUseResumeAnalysis(plan)) return NextResponse.json({ message: "Pro plan required" }, { status: 403 });
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ message: "File too large" }, { status: 400 });
  const text = await file.text();
  const textLower = text.toLowerCase();
  const detected = SKILL_KEYWORDS.filter(skill => textLower.includes(skill.toLowerCase()));
  await prisma.resume.create({ data: { userId: user.id, fileName: file.name, extractedText: text.slice(0, 5000), extractedSkills: JSON.stringify(detected) } });
  return NextResponse.json({ skills: detected });
}