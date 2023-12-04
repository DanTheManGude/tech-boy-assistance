"use client";

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

if (typeof window !== "undefined") {
  import("firebase/app-check").then((firebaseAppCheck) => {
    firebaseAppCheck.initializeAppCheck(app, {
      provider: new firebaseAppCheck.ReCaptchaEnterpriseProvider(
        process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || ""
      ),
      isTokenAutoRefreshEnabled: true,
    });
  });
}

export const auth = getAuth();

export const getMessagingToken = () =>
  getToken(getMessaging(app), {
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
  }).then((currentToken) => {
    if (currentToken) {
      console.log("fcm token", currentToken);
      return currentToken;
    } else {
      throw new Error(
        "No registration token available. Request permission to generate one."
      );
    }
  });
