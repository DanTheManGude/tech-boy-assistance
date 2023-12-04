import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Data from "./payloadType";
import admin from "firebase-admin";

var serviceAccount = require("./service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tech-boy-assistance-default-rtdb.firebaseio.com",
});

const messaging = admin.messaging();

export async function POST(request: NextRequest) {
  const data: Data = await request.json();
  const { fcmToken, fromName, reason } = data;

  console.log(fcmToken, fromName, reason);

  var payload = {
    notification: {
      title: `New request from ${fromName}`,
      body: `Reason: ${reason}`,
    },
    token: fcmToken,
  };

  messaging
    .send(payload)
    .then((result) => {
      console.log("messaging send result", result);
    })
    .catch((error) => {
      console.error("messaging send error", error);
    });

  return new NextResponse(null, { status: 204 });
}
