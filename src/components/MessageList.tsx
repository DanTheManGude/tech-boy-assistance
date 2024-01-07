import { useMemo } from "react";
import { getDatabase, ref, update } from "firebase/database";
import {
  MessageStatus,
  MessageWithKey,
  messageStatusKeys,
  messageStatusMap,
  notificationType,
} from "@/constants";
import { useData } from "@/context/DataContext";
import {
  calculateNewMessageCount,
  sendNotification,
  updateAppBadge,
} from "@/utils";

export default function MessageList() {
  const { messages, isAdmin, fcmToken } = useData();

  const messageList: MessageWithKey[] = useMemo(
    () =>
      Object.entries(messages).reduce<MessageWithKey[]>(
        (acc, [uid, messagesForOneAccountMap]) => {
          const messagesForOneAccountList = Object.entries(
            messagesForOneAccountMap
          ).map(([key, message]) => ({ ...message, key: `${uid}/${key}` }));
          return [...acc, ...messagesForOneAccountList];
        },
        []
      ),
    [messages]
  );

  const getHandleDelete = (message: MessageWithKey) => () => {
    update(ref(getDatabase()), { [`messages/${message.key}`]: null }).catch(
      console.error
    );
    if (!isAdmin) {
      sendNotification(fcmToken, message, notificationType.DELETE);
    }
  };

  const handleChangeStatus = (newStatus: string, key: string) => {
    update(ref(getDatabase()), { [`messages/${key}/status`]: newStatus }).catch(
      console.error
    );

    const newBadgeCount = calculateNewMessageCount(messages);
    updateAppBadge(newBadgeCount);
  };

  const renderStatus = (status: MessageStatus, key: string) => {
    if (!isAdmin) {
      return (
        <p>
          Status:&nbsp;
          {messageStatusMap[status]}
        </p>
      );
    }
    return (
      <>
        <select
          id="status"
          className="my-2 w-5/6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            handleChangeStatus(event.target.value, key);
          }}
          value={status}
        >
          {Object.values(messageStatusKeys).map((statusValue) => (
            <option value={statusValue} selected={statusValue === status}>
              {messageStatusMap[statusValue]}
            </option>
          ))}
        </select>
      </>
    );
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
          {renderStatus(status, key)}
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
      <div className="w-full max-w-sm">{messageList.map(renderMessage)}</div>
    </div>
  );
}
