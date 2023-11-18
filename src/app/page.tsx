"use client";

import LoginLogoutButton from "@/components/LoginLogoutButton";
import { useData } from "@/context/DataContext";

export default function Home() {
  const { isAdmin } = useData();

  return (
    <>
      {isAdmin ? "admin" : "pleb"}
      <LoginLogoutButton />
    </>
  );
}
