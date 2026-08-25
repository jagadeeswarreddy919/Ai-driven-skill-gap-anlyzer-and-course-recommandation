import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    return process.env.DATABASE_URL;
  }

  // If running on Vercel or in serverless production
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const tmpDbPath = path.join("/tmp", "skillgap.db");

    if (!fs.existsSync(tmpDbPath)) {
      const templateDbPath = path.join(process.cwd(), "prisma", "template.db");
      const devDbPath = path.join(process.cwd(), "prisma", "dev.db");

      const sourceDb = fs.existsSync(templateDbPath)
        ? templateDbPath
        : fs.existsSync(devDbPath)
        ? devDbPath
        : null;

      if (sourceDb) {
        try {
          fs.copyFileSync(sourceDb, tmpDbPath);
          console.log(`[DB] Copied database from ${sourceDb} to ${tmpDbPath}`);
        } catch (err) {
          console.error("[DB] Failed to copy database template to /tmp:", err);
        }
      }
    }

    return `file:${tmpDbPath}`;
  }

  return process.env.DATABASE_URL || "file:./dev.db";
}

const activeDbUrl = getDatabaseUrl();
process.env.DATABASE_URL = activeDbUrl;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
