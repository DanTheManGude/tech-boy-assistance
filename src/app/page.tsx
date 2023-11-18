"use client";

import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  if (!user || !user.uid) {
    return <LoginButton />;
  }

  return <LogoutButton />;
}
