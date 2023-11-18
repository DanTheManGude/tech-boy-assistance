"use client";

import WithLogin from "@/components/WithLogin";
import FormAndButton from "@/components/FormAndButton";
import MessageList from "@/components/MessageList";

export default function Home() {
  return (
    <WithLogin>
      <MessageList />
      <FormAndButton />
    </WithLogin>
  );
}
