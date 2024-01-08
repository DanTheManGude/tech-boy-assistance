"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { child, get, getDatabase, onValue, ref } from "firebase/database";
import { ValueOf } from "next/dist/shared/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { MessagesData } from "@/constants";
import { calculateNewMessageCount, updateAppBadge } from "@/utils";

type Data = {
  isAdmin: boolean;
  messages: MessagesData;
  fcmToken: string;
};

const DataContext = createContext<Data>({
  isAdmin: false,
  messages: {},
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
  const [messages, setMessages] = useState<Data["messages"]>({});
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
      setMessages({});
      return () => {};
    }

    let unsubscribe = () => {};

    if (isAdmin) {
      unsubscribe = onValue(ref(getDatabase(), `messages`), (snapshot) => {
        if (snapshot.exists()) {
          const snapshotValue: MessagesData = snapshot.val();

          setMessages(snapshotValue);

          const newBadgeCount = calculateNewMessageCount(snapshotValue);

          updateAppBadge(newBadgeCount);
        } else {
          setMessages({});
          navigator.clearAppBadge();
        }
      });
    } else {
      unsubscribe = onValue(
        ref(getDatabase(), `messages/${user.uid}`),
        (snapshot) => {
          if (snapshot.exists()) {
            const snapshotValue: ValueOf<MessagesData> = snapshot.val();

            setMessages({ [user.uid]: snapshotValue });
          } else {
            setMessages({});
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
