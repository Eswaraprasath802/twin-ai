import type { Metadata } from "next";
import AuthScreen from "@/components/AuthScreen";

export const metadata: Metadata = {
  title: "Login | TWIN AI",
  description: "Sign in to the TWIN AI platform.",
};

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
