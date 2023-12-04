"use client";

import WithLogin from "@/components/WithLogin";
import FormAndButton from "@/components/FormAndButton";
import MessageList from "@/components/MessageList";
import PermissionButton from "@/components/PermissionButton";

export default function Home() {
  return (
    <WithLogin>
      <PermissionButton />
      <MessageList />
      <FormAndButton />
    </WithLogin>
  );
}
