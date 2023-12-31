import admin from "firebase-admin";
import { getDatabase } from "firebase-admin/database";

const serviceAccount = process.env.FIREBASE_ADMIN || "{}";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
    databaseURL: "https://tech-boy-assistance-default-rtdb.firebaseio.com",
  });
}

export const messaging = admin.messaging();
export const db = getDatabase();
