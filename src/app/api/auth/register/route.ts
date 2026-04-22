import { NextResponse } from "next/server";

import { createUser } from "@/server/jobhub-db";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
    role?: "seeker" | "employer" | "admin";
  };

  if (!body.name || !body.email || !body.password || !body.role) {
    return NextResponse.json({ success: false, message: "Missing registration fields." }, { status: 400 });
  }

  const result = await createUser({
    name: body.name,
    email: body.email,
    password: body.password,
    role: body.role,
  });

  if (result.duplicate) {
    return NextResponse.json({ success: false, message: "Email already in use." }, { status: 409 });
  }

  return NextResponse.json({ success: true, user: result.user }, { status: 201 });
}
