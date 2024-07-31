"use server";
import { signIn, signOut } from "@/auth";

export const signInGitHub = async () => {
  await signIn('github');
};

export const signInGoogle = async () => {
  await signIn('google');
};

export const signInUser = async (username: string, password: string) => {
  try {
    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      console.error("Sign-in error:", res.error);
      return { error: "Invalid credentials" };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error during sign-in:", error);
    return { error: "An unexpected error occurred" };
  }
};

export const signOutUser = async () => {
  await signOut({ redirect: false });
};
