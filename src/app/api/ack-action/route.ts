import { NextRequest, NextResponse } from "next/server";
import { db } from "../admin-setup";
import { messageStatusKeys } from "@/constants";

export async function POST(request: NextRequest) {
  const { uid, messageKey }: { uid: string; messageKey: string } =
    await request.json();

  let success = false;
  await db
    .ref(`messages/${uid}/${messageKey}`)
    .update({
      status: messageStatusKeys.ACKNOWLEDGED,
      read: false,
    })
    .then((result) => {
      console.log("quick action update to ACK", result);
      success = true;
    })
    .catch((error) => {
      console.error("quick action update error", error);
    });

  return new NextResponse(null, { status: success ? 204 : 500 });
}
