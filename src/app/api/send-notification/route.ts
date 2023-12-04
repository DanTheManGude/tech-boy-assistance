import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { fcmToken } = data;

  console.log(fcmToken);

  return new NextResponse(null, { status: 204 });
}
