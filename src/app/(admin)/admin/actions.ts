"use server";

import { signOut } from "@/auth";

export async function logoutAction(_formData?: FormData): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
