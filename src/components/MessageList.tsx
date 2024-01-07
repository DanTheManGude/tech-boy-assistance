import {
  MessageWithKey,
  messageStatusMap,
  notificationType,
} from "@/constants";
import { useData } from "@/context/DataContext";
import { sendNotification } from "@/utils";
import { getDatabase, ref, update } from "firebase/database";

export default function MessageList() {
  const { messages, isAdmin, fcmToken } = useData();

  const getHandleDelete = (message: MessageWithKey) => () => {
    update(ref(getDatabase()), { [`messages/${message.key}`]: null }).catch(
      console.error
    );
    if (!isAdmin) {
      sendNotification(fcmToken, message, notificationType.DELETE);
    }
  };

  const renderMessage = (message: MessageWithKey) => {
    const { reason, fromName, submittedTime, key, status } = message;

    return (
      <div
        className="w-full my-2 inline-flex rounded-lg border-4 border-green-400"
        key={key}
      >
        <div className="w-full ml-2">
          <h1>{reason}</h1>
          {isAdmin && <p>By {fromName}</p>}
          <p>
            At {new Date(submittedTime).toDateString()}&nbsp;
            {new Date(submittedTime).toLocaleTimeString()}
          </p>
          <p>
            Status:&nbsp;
            {messageStatusMap[status]}
          </p>
        </div>
        <button
          className="mr-2 text-orange-600 font-bold"
          onClick={getHandleDelete(message)}
        >
          X
        </button>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center mx-3 pt-4">
      <div className="w-full max-w-sm">{messages.map(renderMessage)}</div>
    </div>
  );
}
