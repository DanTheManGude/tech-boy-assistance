import { ValueOf } from "next/dist/shared/lib/constants";

export const messageStatusKeys = {
  SUBMITTED: "SUBMITTED",
  ACKNOWLEDGED: "ACKNOWLEDGED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

export const messageStatusMap = {
  [messageStatusKeys.SUBMITTED]: "Submitted",
  [messageStatusKeys.ACKNOWLEDGED]: "Acknowledged",
  [messageStatusKeys.IN_PROGRESS]: "In progress",
  [messageStatusKeys.COMPLETED]: "Completed",
};

export type MessageStatus = ValueOf<typeof messageStatusKeys>;

export type Message = {
  fromName: string;
  submittedTime: number;
  reason: string;
  status: MessageStatus;
  read: boolean;
};

export type MessageWithKey = Message & { key: string };

export const notificationType = {
  NEW: "NEW",
  DELETE: "DELETE",
  UPDATE: "UPDATE",
} as const;
export type NotificationType = ValueOf<typeof notificationType>;

export type MessagesData = {
  [uid: string]: { [key: string]: Message };
};
