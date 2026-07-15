import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createSessionToken, getAuthCookieOptions } from "@/lib/auth";
import { getUsersCollection, toSessionUser } from "@/lib/users";

export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: "MongoDB or JWT configuration is missing." },
      { status: 503 },
    );
  }

  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return jsonError("Invalid request body.");
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return jsonError("Email and password are required.");
  }

  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ email });

    if (!user || !user.isActive) {
      return jsonError("Invalid email or password.", 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return jsonError("Invalid email or password.", 401);
    }

    const now = new Date();
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          updatedAt: now,
          lastLoginAt: now,
        },
      },
    );

    const sessionUser = toSessionUser(user);
    const response = NextResponse.json({ user: sessionUser });
    response.cookies.set(AUTH_COOKIE_NAME, createSessionToken(sessionUser), getAuthCookieOptions());

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
