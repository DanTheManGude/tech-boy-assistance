import { useEffect, useMemo } from "react";
import { getDatabase, ref, update, child, get } from "firebase/database";

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

  useEffect(() => {
    if (!isAdmin) {
      try {
        navigator.clearAppBadge();
      } catch (error) {
        console.error(error);
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      const unreadMessages = messageList.filter((message) => !message.read);

      if (unreadMessages.length) {
        const updates = unreadMessages.reduce<{ [path: string]: boolean }>(
          (acc, message) => ({
            ...acc,
            [`messages/${message.key}/read`]: true,
          }),
          {}
        );

        update(ref(getDatabase()), updates).catch(console.error);
      }
    }
  }, [messageList, isAdmin]);

  const getHandleDelete = (message: MessageWithKey) => () => {
    update(ref(getDatabase()), { [`messages/${message.key}`]: null }).catch(
      console.error
    );
    if (!isAdmin) {
      sendNotification(fcmToken, message, notificationType.DELETE);
    }
  };

  const handleChangeStatus = (
    newStatus: MessageStatus,
    message: MessageWithKey
  ) => {
    update(ref(getDatabase()), {
      [`messages/${message.key}/status`]: newStatus,
      [`messages/${message.key}/read`]: false,
    }).catch(console.error);

    const newBadgeCount = calculateNewMessageCount(messages);
    updateAppBadge(newBadgeCount);

    get(child(ref(getDatabase()), `accounts/${message.uid}/fcm-token`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const clientFcmToken = snapshot.val();
          sendNotification(
            clientFcmToken,
            { ...message, status: newStatus },
            notificationType.UPDATE
          );
        } else {
          console.log("No fcm-token for client");
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  };

  const renderStatus = (status: MessageStatus, message: MessageWithKey) => {
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
          onChange={(event) => {
            handleChangeStatus(event.target.value as MessageStatus, message);
          }}
          value={status}
        >
          {Object.values(messageStatusKeys).map((statusValue) => (
            <option value={statusValue} key={statusValue}>
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
          {renderStatus(status, message)}
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
