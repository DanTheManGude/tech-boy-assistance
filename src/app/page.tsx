"use client";

import { AuthContextProvider } from "@/context/AuthContext";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <AuthContextProvider>
      <main className="m-0 bg-gradient-to-br from-primary-color to-blue-400 px-4">
        <LoginButton />
      </main>
    </AuthContextProvider>
  );
}
