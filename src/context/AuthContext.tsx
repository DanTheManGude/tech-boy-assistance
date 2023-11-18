"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase.config";

type ProviderValue = Partial<{
  user: User;
  logIn: () => Promise<UserCredential>;
  logOut: () => Promise<void>;
}>;

// Create auth context
const AuthContext = createContext<ProviderValue>({});

// Make auth context available across the app by exporting it
export const useAuth = () => useContext<ProviderValue>(AuthContext);

// Create the auth context provider
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);

  // Update the state depending on auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("login", user.uid);
      } else {
        setUser(undefined);
      }
    });

    setLoading(false);

    return () => unsubscribe();
  }, []);

  // Login the user
  const logIn = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    return signInWithPopup(auth, provider);
  };

  // Logout the user
  const logOut = async () => {
    setUser(undefined);
    return await signOut(auth);
  };

  const providerValue = { user, logIn, logOut };
  // Wrap the children with the context provider
  return (
    <AuthContext.Provider value={providerValue}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
