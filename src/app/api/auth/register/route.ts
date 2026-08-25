import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);

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

    const { name, email, password } = validation.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
          errors: { email: "An account with this email already exists." },
        },
        { status: 400 }
      );
    }

    // Hash password & create user
    const passwordHash = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
    });

    // Create session cookie
    await createSession(newUser.id);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "We couldn't connect to the server. Please try again." },
      { status: 500 }
    );
  }
}
