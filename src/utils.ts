import SendNotificationPayload from "@/app/api/send-notification/payloadType";
import { Message, NotificationType } from "@/constants";

export const sendNotification = async (
  fcmToken: string,
  message: Message,
  type: NotificationType
) => {
  const payload: SendNotificationPayload = { fcmToken, type, ...message };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch("/api/send-notification", requestOptions);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("send-notification", errorText);
    return;
  }

  console.log("send-notification OK");
};
