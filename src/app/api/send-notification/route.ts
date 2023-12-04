import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Data from "./payloadType";
import { messaging } from "./setup";

export async function POST(request: NextRequest) {
  const data: Data = await request.json();
  const { fromName, reason, fcmToken } = data;

  console.log(fromName, reason, fcmToken);

  var payload = {
    notification: {
      title: `New request by ${fromName}`,
      body: `${reason}`,
    },
    token: fcmToken,
  };

  let success = false;
  await messaging
    .send(payload)
    .then((result) => {
      console.log("messaging send result", result);
      success = true;
    })
    .catch((error) => {
      console.error("messaging send error", error);
    });

  return new NextResponse(null, { status: success ? 204 : 500 });
}
