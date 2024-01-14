import { MessageWithKey, NotificationType } from "@/constants";

type payload = { fcmToken: string; type: NotificationType } & MessageWithKey;

export default payload;
