import { NextResponse } from "next/server";

import { createApplication, listApplicationsForUser } from "@/server/jobhub-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: true, applications: [] });
  }

  const applications = await listApplicationsForUser(userId);
  return NextResponse.json({ success: true, applications });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { user_id?: string; job_id?: string };

  if (!body.user_id || !body.job_id) {
    return NextResponse.json({ success: false, message: "user_id and job_id are required." }, { status: 400 });
  }

  const result = await createApplication(body.user_id, body.job_id);

  if ("missingJob" in result && result.missingJob) {
    return NextResponse.json({ success: false, message: "Job not found." }, { status: 404 });
  }

  if ("duplicate" in result && result.duplicate) {
    return NextResponse.json({ success: false, message: "You already applied to this job." }, { status: 409 });
  }

  return NextResponse.json({ success: true, application: result.application }, { status: 201 });
}
