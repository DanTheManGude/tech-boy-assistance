import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Payload from "./payloadType";

export async function POST(request: NextRequest) {
  const data: Payload = await request.json();
  const { fcmToken, fromName, reason } = data;

  console.log(fcmToken, fromName, reason);

  return new NextResponse(null, { status: 204 });
}
