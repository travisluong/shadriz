"use server";

import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface AdminLoginState {
  message?: string;
}

export async function adminLogin(
  prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  "use server";
  try {
    await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password"),
    });
  } catch (error) {
    return {
      message: "Login failed.",
    };
  }
  redirect("/admin");
}
