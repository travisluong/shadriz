"use server";

import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface SignInState {
  message?: string;
}

export async function signInAction(
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  "use server";
  try {
    await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password"),
    });
  } catch (error) {
    return {
      message: "Sign in failed.",
    };
  }
  redirect("/dashboard");
}
