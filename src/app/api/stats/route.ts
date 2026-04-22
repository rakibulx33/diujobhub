import { NextResponse } from "next/server";

import { getStats } from "@/server/jobhub-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  return NextResponse.json(await getStats(userId));
}
