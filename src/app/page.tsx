"use client";

import WithLogin from "@/components/WithLogin";
import FormAndButton from "@/components/FormAndButton";

export default function Home() {
  return (
    <WithLogin>
      <FormAndButton />
    </WithLogin>
  );
}
