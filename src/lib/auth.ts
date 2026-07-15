import { sign, verify, type JwtPayload } from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "twin-ai-session";
export const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export function createSessionToken(user: SessionUser) {
  return sign(
    {
      email: user.email,
      name: user.name,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: AUTH_SESSION_MAX_AGE_SECONDS,
      subject: user.id,
    },
  );
}

export function verifySessionToken(token: string): SessionUser {
  const payload = verify(token, getJwtSecret()) as JwtPayload & {
    email?: string;
    name?: string;
    role?: string;
  };

  if (
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.name !== "string" ||
    typeof payload.role !== "string"
  ) {
    throw new Error("Invalid session token");
  }

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
  };
}

export function getClearedAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  };
}
