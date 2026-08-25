import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";

const SESSION_COOKIE = "skillgap_session_token";
const SECRET = process.env.SESSION_SECRET || "skillgap_ai_session_secret_key_2026_super_secure";

function signToken(payload: object): string {
  const jsonStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(base64Payload)
    .digest("base64url");
  return `${base64Payload}.${signature}`;
}

function verifyToken(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [base64Payload, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", SECRET)
      .update(base64Payload)
      .digest("base64url");

    if (signature !== expectedSig) return null;

    const jsonStr = Buffer.from(base64Payload, "base64url").toString("utf8");
    return JSON.parse(jsonStr);
  } catch (err) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payload = {
    userId,
    email: user?.email || "",
    name: user?.name || "",
    isAdmin: user?.isAdmin || false,
    exp: expiresAt,
  };

  const token = signToken(payload);

  // Save to DB if possible (swallowing container sync errors)
  await prisma.session.create({
    data: {
      sessionToken: token,
      userId,
      expires: new Date(expiresAt),
    },
  }).catch(() => {});

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  });

  return token;
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    // Verify token signature & expiration
    const payload = verifyToken(token);
    if (!payload || !payload.userId || !payload.exp) {
      return null;
    }

    if (payload.exp < Date.now()) {
      return null;
    }

    // Try finding user in current container's DB
    let user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user && payload.email) {
      user = await prisma.user.findUnique({
        where: { email: payload.email.toLowerCase() },
      });
    }

    // If user not in container DB yet (e.g. fresh serverless instance), auto-create in container DB
    if (!user && payload.email) {
      try {
        user = await prisma.user.create({
          data: {
            id: payload.userId,
            email: payload.email.toLowerCase(),
            name: payload.name || payload.email.split("@")[0],
            isAdmin: Boolean(payload.isAdmin),
          },
        });
      } catch (err) {
        user = await prisma.user.findUnique({
          where: { email: payload.email.toLowerCase() },
        });
      }
    }

    if (user) {
      return user;
    }

    // Return fallback user object synthesized from verified token
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name || "User",
      passwordHash: null,
      image: null,
      isAdmin: Boolean(payload.isAdmin),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.delete({ where: { sessionToken: token } }).catch(() => {});
  }

  cookieStore.delete(SESSION_COOKIE);
}
