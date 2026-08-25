import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password, confirmPassword } = body;

    const validation = resetPasswordSchema.safeParse({ password, confirmPassword });

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

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetTokenRecord || resetTokenRecord.expires < new Date()) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { email: resetTokenRecord.email },
      data: { passwordHash },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json(
      { success: true, message: "Password updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "We couldn't connect to the server. Please try again." },
      { status: 500 }
    );
  }
}
