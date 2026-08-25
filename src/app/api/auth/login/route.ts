import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { comparePasswords, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      return NextResponse.json(
        { success: false, message: "Validation error", errors: fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password. Please try again.",
        },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePasswords(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password. Please try again.",
        },
        { status: 401 }
      );
    }

    // Create session cookie
    await createSession(user.id);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "We couldn't connect to the server. Please try again." },
      { status: 500 }
    );
  }
}
