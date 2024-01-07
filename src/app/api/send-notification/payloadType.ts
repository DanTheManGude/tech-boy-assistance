import { Message, NotificationType } from "@/constants";

type payload = { fcmToken: string; type: NotificationType } & Message;

export default payload;
