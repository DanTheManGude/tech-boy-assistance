import SendNotificationPayload from "@/app/api/send-notification/payloadType";
import {
  Message,
  MessagesData,
  NotificationType,
  messageStatusKeys,
} from "@/constants";

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

export const calculateNewMessageCount = (messagesData: MessagesData): number =>
  Object.values(messagesData).reduce((acc, messagesForOneAccountMap) => {
    return (
      acc +
      Object.values(messagesForOneAccountMap).filter(
        (message) => message.status === messageStatusKeys.SUBMITTED
      ).length
    );
  }, 0);

export const updateAppBadge = (newBadgeCount: number) => {
  try {
    if (newBadgeCount) {
      navigator.setAppBadge(newBadgeCount);
    } else {
      navigator.clearAppBadge();
    }
  } catch (error) {
    console.error(error);
  }
};
