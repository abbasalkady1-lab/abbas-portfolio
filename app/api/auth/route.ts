import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const REQUIRED_PASSWORDS = [
  "Guines55",
  process.env.ADMIN_PASSWORD,
].filter(Boolean) as string[];

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (sessionToken && sessionToken.startsWith("authenticated_")) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const isPasswordValid =
      REQUIRED_PASSWORDS.includes(password) ||
      password === "Guines55";

    // Username can be admin, abbas, or any provided username as long as password matches
    const isUserValid =
      Boolean(username && username.trim().length > 0) ||
      username === "admin" ||
      username === "abbas";

    if (isPasswordValid && isUserValid) {
      const sessionToken = `authenticated_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const response = NextResponse.json({ success: true, message: "Authenticated" });
      
      response.cookies.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
