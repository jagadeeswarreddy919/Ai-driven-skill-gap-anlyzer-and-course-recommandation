import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          email: user.email,
          token,
          expires,
        },
      });
    }

    // Always return generic message to prevent email enumeration
    return NextResponse.json(
      {
        success: true,
        message: "If an account exists for this email, you'll receive instructions to reset your password.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "We couldn't connect to the server. Please try again." },
      { status: 500 }
    );
  }
}
