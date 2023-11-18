"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { child, get, getDatabase, onValue, ref } from "firebase/database";
import { useAuth } from "@/context/AuthContext";

type Message = {
  fromName: string;
  uid: string;
  submittedTime: Date;
  title: string;
};

type Data = {
  isAdmin: boolean;
  messages: Message[];
};

const DataContext = createContext<Data>({
  isAdmin: false,
  messages: [],
});

export const useData = () => useContext<Data>(DataContext);

export const DataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<Data["isAdmin"]>(false);
  const [messages, setMessages] = useState<Data["messages"]>([]);

  useEffect(() => {
    get(child(ref(getDatabase()), "admin"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setIsAdmin(Boolean(snapshot.val()));
        }
      })
      .catch(() => {});
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
          const fullMessages = Object.values(snapshotValue).reduce(
            (acc, messagesForOneAccountMap) => {
              const messagesForOneAccountList = Object.values(
                messagesForOneAccountMap
              );
              return [...acc, ...messagesForOneAccountList];
            },
            [] as Message[]
          );

          setMessages(fullMessages);
        }
      });
    } else {
      unsubscribe = onValue(
        ref(getDatabase(), `messages/${user.uid}`),
        (snapshot) => {
          if (snapshot.exists()) {
            setMessages(Object.values(snapshot.val()));
          }
        }
      );
    }

    return () => unsubscribe();
  }, [isAdmin, user]);

  return (
    <DataContext.Provider value={{ isAdmin, messages }}>
      {children}
    </DataContext.Provider>
  );
};
