"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  UserCredential,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase.config";

// User data type interface
interface UserType {
  email: string | null;
  uid: string | null;
}

interface ProviderValue {
  user: UserType;
  logIn: () => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<ProviderValue>({
  user: { email: null, uid: null },
  logIn: function (): Promise<UserCredential> {
    throw new Error("Function not implemented.");
  },
  logOut: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
});

// Make auth context available across the app by exporting it
export const useAuth = () => useContext<ProviderValue>(AuthContext);

// Create the auth context provider
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Define the constants for the user and loading state
  const [user, setUser] = useState<UserType>({ email: null, uid: null });
  const [loading, setLoading] = useState<Boolean>(true);

  // Update the state depending on auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          email: user.email,
          uid: user.uid,
        });
        console.log("login", user.uid);
      } else {
        setUser({ email: null, uid: null });
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
    setUser({ email: null, uid: null });
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
