import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const host = request.headers.get("host") || url.host;
  const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
    ? (process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`)
    : `${protocol}://${host}`;

  if (error || !code) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(`${baseUrl}/login?oauth_error=access_denied`);
  }

  // Validate state
  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  if (!savedState || savedState !== state) {
    console.error("State mismatch in Google OAuth callback");
    return NextResponse.redirect(`${baseUrl}/login?oauth_error=invalid_state`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/login?oauth_error=not_configured`);
  }

  try {
    // Exchange auth code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.redirect(`${baseUrl}/login?oauth_error=token_failed`);
    }

    // Get Google user info
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userInfoRes.json();

    if (!userInfoRes.ok || !googleUser.email) {
      console.error("Fetching user info failed:", googleUser);
      return NextResponse.redirect(`${baseUrl}/login?oauth_error=user_info_failed`);
    }

    const email = googleUser.email.toLowerCase();

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name: googleUser.name || email.split("@")[0],
          image: googleUser.picture || null,
        },
      });
    } else if (!user.image && googleUser.picture) {
      // Update image if not set
      user = await prisma.user.update({
        where: { id: user.id },
        data: { image: googleUser.picture },
      });
    }

    // Upsert Account record
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: googleUser.id,
        },
      },
      update: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        expires_at: tokenData.expires_in ? Math.floor(Date.now() / 1000) + tokenData.expires_in : null,
        id_token: tokenData.id_token || null,
        scope: tokenData.scope || null,
      },
      create: {
        userId: user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: googleUser.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        expires_at: tokenData.expires_in ? Math.floor(Date.now() / 1000) + tokenData.expires_in : null,
        id_token: tokenData.id_token || null,
        scope: tokenData.scope || null,
      },
    });

    // Create app session cookie
    await createSession(user.id);

    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (err) {
    console.error("Google OAuth handling error:", err);
    return NextResponse.redirect(`${baseUrl}/login?oauth_error=server_error`);
  }
}
