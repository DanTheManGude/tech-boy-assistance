import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Message } from "firebase-admin/messaging";
import { Message as AssistanceMessage, messageStatusKeys } from "@/constants";
import Data from "./payloadType";
import { messaging, db } from "./setup";

export async function POST(request: NextRequest) {
  const data: Data = await request.json();
  const { fromName, reason, fcmToken } = data;

  console.log(fromName, reason, fcmToken);

  const ref = db.ref("messages");

  let messagesData: { [uid: string]: { [key: string]: AssistanceMessage } } =
    {};
  await ref.once("value", (data) => {
    messagesData = data.val();
  });

  const fullMessagCount = Object.values(messagesData)
    .reduce((acc, messagesForOneAccountMap) => {
      return (
        acc +
        Object.values(messagesForOneAccountMap).filter(
          (message) => message.status === messageStatusKeys.SUBMITTED
        ).length
      );
    }, 0)
    .toString();

  console.log(fullMessagCount);

  const payload: Message = {
    notification: {
      title: `New request by ${fromName}`,
      body: `${reason}`,
    },
    data: { fullMessagCount },
    token: fcmToken,
  };

  let success = false;
  await messaging
    .send(payload)
    .then((result) => {
      console.log("messaging send result", result);
      success = true;
    })
    .catch((error) => {
      console.error("messaging send error", error);
    });

  return new NextResponse(null, { status: success ? 204 : 500 });
}
