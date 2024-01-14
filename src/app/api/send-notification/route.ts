import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Message, WebpushNotification } from "firebase-admin/messaging";
import { MessagesData, messageStatusMap, notificationType } from "@/constants";
import Data from "./payloadType";
import { messaging, db } from "../admin-setup";
import { calculateNewMessageCount } from "@/utils";
import { ValueOf } from "next/dist/shared/lib/constants";

export async function POST(request: NextRequest) {
  const data: Data = await request.json();
  const { fromName, reason, status, uid, fcmToken, type, key } = data;

  console.log(uid, reason, fcmToken, type);

  let newBadgeCount: number = 1;

  if (type === notificationType.UPDATE) {
    const ref = db.ref(`messages/${uid}`);

    let messagesForUser: ValueOf<MessagesData> = {};
    await ref.once("value", (data) => {
      if (data.exists()) {
        messagesForUser = data.val();
      }
    });

    newBadgeCount = Object.values(messagesForUser).filter(
      (message) => !message.read
    ).length;
  } else {
    const ref = db.ref("messages");

    let messagesData: MessagesData = {};
    await ref.once("value", (data) => {
      if (data.exists()) {
        messagesData = data.val();
      }
    });

    newBadgeCount = calculateNewMessageCount(messagesData);
  }

  console.log(newBadgeCount);

  let maybeActionWithData: WebpushNotification = {};
  let title = "";
  switch (type) {
    case notificationType.NEW:
      title = `New request by ${fromName}`;
      maybeActionWithData = {
        actions: [{ action: "ACK", title: "ACK" }],
        data: {
          uid,
          messageKey: key,
          newBadgeCount: (newBadgeCount - 1).toString(),
        },
      };
      break;
    case notificationType.DELETE:
      title = `Request deleted by ${fromName}`;
      break;
    case notificationType.UPDATE:
      title = `Updated status to "${messageStatusMap[status]}"`;
      break;
  }

  const appUrl = "https://tech.dangude.com";
  const imageUrl = `${appUrl}/apple-icon.png`;

  const payload: Message = {
    notification: {
      title: title,
      body: reason,
      imageUrl,
    },
    data: { newBadgeCount: newBadgeCount.toString() },
    token: fcmToken,
    webpush: {
      fcmOptions: { link: appUrl },
      notification: {
        icon: imageUrl,
        ...maybeActionWithData,
      },
    },
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
