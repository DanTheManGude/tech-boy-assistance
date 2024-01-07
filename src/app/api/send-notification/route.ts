import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Message } from "firebase-admin/messaging";
import { MessagesData, notificationType } from "@/constants";
import Data from "./payloadType";
import { messaging, db } from "./setup";
import { calculateNewMessageCount } from "@/utils";

export async function POST(request: NextRequest) {
  const data: Data = await request.json();
  const { fromName, reason, fcmToken, type } = data;

  console.log(fromName, reason, fcmToken, type);

  const ref = db.ref("messages");

  let messagesData: MessagesData = {};
  await ref.once("value", (data) => {
    if (data.exists()) {
      messagesData = data.val();
    }
  });

  const newBadgeCount = calculateNewMessageCount(messagesData).toString();

  console.log(newBadgeCount);

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
    data: { newBadgeCount },
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
