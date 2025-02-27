"use client";

import SignUpForm from "@/components/SignUpForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { redirect } from "next/navigation";

export default function SignupPage() {
  const currentUser = useCurrentUser();

  if (currentUser) {
    redirect("/items");
  }

  return (
    <div className="min-h-full bg-cloud-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SignUpForm />
    </div>
  );
}
