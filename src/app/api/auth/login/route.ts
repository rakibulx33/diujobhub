import { NextResponse } from "next/server";

import { findUserByCredentials } from "@/server/jobhub-db";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
  }

  const user = await findUserByCredentials(email, password);

  if (!user) {
    return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
}
