import type { Metadata } from "next";
import AuthScreen from "@/components/AuthScreen";

export const metadata: Metadata = {
  title: "Sign Up | TWIN AI",
  description: "Create a TWIN AI account.",
};

export default function SignupPage() {
  return <AuthScreen mode="signup" />;
}
