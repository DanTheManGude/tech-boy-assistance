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

export const auth = getAuth();
export const messaging = getMessaging(app);

export const getMessagingToken = () =>
  getToken(messaging, {
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
