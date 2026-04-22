import { NextResponse } from "next/server";
import { updateProfileSkills } from "@/server/jobhub-db";

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    user_id?: string;
    skills?: { name: string; level: string }[];
  };

  if (!body.user_id) {
    return NextResponse.json({ success: false, message: "user_id is required." }, { status: 400 });
  }

  try {
    const profile = await updateProfileSkills(body.user_id, body.skills || []);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Failed to update skills:", error);
    return NextResponse.json({ success: false, message: "Failed to update skills" }, { status: 500 });
  }
}
