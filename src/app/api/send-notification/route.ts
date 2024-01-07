import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Message } from "firebase-admin/messaging";
import {
  Message as AssistanceMessage,
  messageStatusKeys,
  notificationType,
} from "@/constants";
import Data from "./payloadType";
import { messaging, db } from "./setup";

export async function POST(request: NextRequest) {
  const data: Data = await request.json();
  const { fromName, reason, fcmToken, type } = data;

  console.log(fromName, reason, fcmToken, type);

  const ref = db.ref("messages");

  let messagesData: { [uid: string]: { [key: string]: AssistanceMessage } } =
    {};
  await ref.once("value", (data) => {
    if (data.exists()) {
      messagesData = data.val();
    }
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

  let title = "";
  switch (type) {
    case notificationType.NEW:
      title = `New request by ${fromName}`;
      break;
    case notificationType.DELETE:
      title = `Request deleted by ${fromName}`;
      break;
  }

  const payload: Message = {
    notification: {
      title: title,
      body: reason,
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
