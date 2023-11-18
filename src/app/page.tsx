"use client";

import WithLogin from "@/components/WithLogin";
import { useData } from "@/context/DataContext";

export default function Home() {
  const { isAdmin } = useData();

  return (
    <WithLogin>
      <>{isAdmin ? "admin" : "pleb"}</>
    </WithLogin>
  );
}
