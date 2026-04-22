import { NextResponse } from "next/server";

import { getProfile, upsertProfile } from "@/server/jobhub-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, message: "userId is required." }, { status: 400 });
  }

  const profile = await getProfile(userId);

  return NextResponse.json({ success: true, profile });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    user_id?: string;
    university?: string;
    cgpa?: number;
    semester?: number;
    experience?: string;
    phone?: string;
    reg_id?: string;
  };

  if (!body.user_id) {
    return NextResponse.json({ success: false, message: "user_id is required." }, { status: 400 });
  }

  const profile = await upsertProfile({
    user_id: body.user_id,
    university: body.university,
    cgpa: body.cgpa,
    semester: body.semester,
    experience: body.experience,
    phone: body.phone,
    reg_id: body.reg_id,
  });

  return NextResponse.json({ success: true, profile });
}
