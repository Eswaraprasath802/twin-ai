import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";
import type { SessionUser } from "@/lib/auth";

export interface MongoUserDocument {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  language: string;
  state: string | null;
  district: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export async function getUsersCollection() {
  const { db } = await connectToDatabase();
  const users = db.collection<MongoUserDocument>("users");

  await users.createIndex({ email: 1 }, { unique: true, name: "users_email_unique" });

  return users;
}

export function toSessionUser(user: MongoUserDocument): SessionUser {
  if (!user._id) {
    throw new Error("User is missing an id");
  }

  return {
    id: user._id.toHexString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function buildUserDocument(input: {
  email: string;
  passwordHash: string;
  name: string;
  role?: string;
}) {
  const now = new Date();

  return {
    email: input.email,
    passwordHash: input.passwordHash,
    name: input.name,
    role: input.role ?? "citizen",
    language: "en",
    state: null,
    district: null,
    avatarUrl: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };
}
