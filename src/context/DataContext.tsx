"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { child, get, getDatabase, onValue, ref } from "firebase/database";
import { useAuth } from "@/context/AuthContext";

export type Message = {
  fromName: string;
  submittedTime: number;
  reason: string;
};

export type MessageWithKey = Message & { key: string };

type Data = {
  isAdmin: boolean;
  messages: MessageWithKey[];
  fcmToken: string;
};

const DataContext = createContext<Data>({
  isAdmin: false,
  messages: [],
  fcmToken: "",
});

export const useData = () => useContext<Data>(DataContext);

export const DataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<Data["isAdmin"]>(false);
  const [messages, setMessages] = useState<Data["messages"]>([]);
  const [fcmToken, setFcmToken] = useState<Data["fcmToken"]>("");

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setIsAdminLoading(false);
      return;
    }
    setIsAdminLoading(true);

    get(child(ref(getDatabase()), "admin"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
      .catch(() => {
        setIsAdmin(false);
      })
      .finally(() => {
        setIsAdminLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      return () => {};
    }

    let unsubscribe = () => {};

    if (isAdmin) {
      unsubscribe = onValue(ref(getDatabase(), `messages`), (snapshot) => {
        if (snapshot.exists()) {
          const snapshotValue: { [uid: string]: { [key: string]: Message } } =
            snapshot.val();
          const fullMessages = Object.entries(snapshotValue).reduce<
            MessageWithKey[]
          >((acc, [uid, messagesForOneAccountMap]) => {
            const messagesForOneAccountList = Object.entries(
              messagesForOneAccountMap
            ).map(([key, message]) => ({ ...message, key: `${uid}/${key}` }));
            return [...acc, ...messagesForOneAccountList];
          }, []);

          setMessages(fullMessages);

          try {
            if (fullMessages.length) {
              navigator.setAppBadge(fullMessages.length);
            } else {
              navigator.clearAppBadge();
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          setMessages([]);
          navigator.clearAppBadge();
        }
      });
    } else {
      unsubscribe = onValue(
        ref(getDatabase(), `messages/${user.uid}`),
        (snapshot) => {
          if (snapshot.exists()) {
            const snapshotValue: { [key: string]: Message } = snapshot.val();
            const messagesFromAccount = Object.entries(snapshotValue).map(
              ([key, message]) => ({
                ...message,
                key: `${user.uid}/${key}`,
              })
            );
            setMessages(messagesFromAccount);
          }
        }
      );

      get(child(ref(getDatabase()), "fcm-token")).then((snapshot) => {
        if (snapshot.exists()) {
          const token = snapshot.val();
          setFcmToken(token);
        }
      });
    }

    return () => unsubscribe();
  }, [isAdmin, user]);

  return (
    <DataContext.Provider value={{ isAdmin, messages, fcmToken }}>
      {!isAdminLoading && children}
    </DataContext.Provider>
  );
};
