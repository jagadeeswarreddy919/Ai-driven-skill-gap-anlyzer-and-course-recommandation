import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./db";

const SESSION_COOKIE = "skillgap_session_token";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.session.create({
    data: {
      sessionToken: token,
      userId,
      expires,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });

  return token;
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!session || session.expires < new Date()) {
      return null;
    }

    return session.user;
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
