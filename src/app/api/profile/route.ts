import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, comparePasswords, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserSubscription } from "@/lib/subscription/access";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan : "FREE";

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name || "",
      email: user.email,
      image: user.image || null,
      isAdmin: Boolean(user.isAdmin),
      createdAt: user.createdAt,
      plan,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, email, currentPassword, newPassword } = body;

    const updateData: Record<string, any> = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (email && email.trim() && email.toLowerCase() !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (existing && existing.id !== user.id) {
        return NextResponse.json(
          { success: false, message: "Email is already taken by another account." },
          { status: 400 }
        );
      }
      updateData.email = email.trim().toLowerCase();
    }

    // Password change verification
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: "Current password is required to set a new password." },
          { status: 400 }
        );
      }

      if (user.passwordHash) {
        const isValid = await comparePasswords(currentPassword, user.passwordHash);
        if (!isValid) {
          return NextResponse.json(
            { success: false, message: "Current password is incorrect." },
            { status: 400 }
          );
        }
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: "New password must be at least 6 characters." },
          { status: 400 }
        );
      }

      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}