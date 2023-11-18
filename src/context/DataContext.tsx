"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { child, get, getDatabase, onValue, ref } from "firebase/database";
import { useAuth } from "@/context/AuthContext";

type IsAdmin = boolean;

interface Data {
  isAdmin: IsAdmin;
}

const DataContext = createContext<Data>({
  isAdmin: false,
});

export const useData = () => useContext<Data>(DataContext);

export const DataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<IsAdmin>(false);

  useEffect(() => {
    get(child(ref(getDatabase()), "admin"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setIsAdmin(Boolean(snapshot.val()));
        }
      })
      .catch(() => {});
  }, [user]);

  return (
    <DataContext.Provider value={{ isAdmin }}>{children}</DataContext.Provider>
  );
};
