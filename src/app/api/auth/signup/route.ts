import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createSessionToken, getAuthCookieOptions } from "@/lib/auth";
import { buildUserDocument, getUsersCollection, toSessionUser } from "@/lib/users";

export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

type SignupBody = {
  name?: string;
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

  let body: SignupBody;

  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return jsonError("Invalid request body.");
  }

  const name = body.name?.trim().replace(/\s+/g, " ") ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (name.length < 2) {
    return jsonError("Name must be at least 2 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError("Enter a valid email address.");
  }

  if (password.length < 8) {
    return jsonError("Password must be at least 8 characters.");
  }

  try {
    const users = await getUsersCollection();
    const passwordHash = await bcrypt.hash(password, 12);
    const userDoc = buildUserDocument({ email, passwordHash, name, role: "citizen" });
    const result = await users.insertOne(userDoc);
    const user = {
      id: result.insertedId.toHexString(),
      email,
      name,
      role: "citizen",
    };

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(AUTH_COOKIE_NAME, createSessionToken(toSessionUser({ ...userDoc, _id: result.insertedId })), getAuthCookieOptions());

    return response;
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && (error as { code?: number }).code === 11000) {
      return jsonError("An account with that email already exists.", 409);
    }

    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
