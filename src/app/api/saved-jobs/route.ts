import { NextResponse } from "next/server";
import { listSavedJobs, getSavedJobIds, saveJob } from "@/server/jobhub-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const idsOnly = searchParams.get("idsOnly");

  if (!userId) {
    return NextResponse.json({ success: true, savedJobs: [], savedIds: [] });
  }

  if (idsOnly === "true") {
    const ids = await getSavedJobIds(userId);
    return NextResponse.json({ success: true, savedIds: ids });
  }

  const savedJobs = await listSavedJobs(userId);
  return NextResponse.json({ success: true, savedJobs });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { user_id?: string; job_id?: string };

  if (!body.user_id || !body.job_id) {
    return NextResponse.json(
      { success: false, message: "user_id and job_id are required." },
      { status: 400 },
    );
  }

  const result = await saveJob(body.user_id, body.job_id);

  if (result.duplicate) {
    return NextResponse.json({ success: true, message: "Job already saved." });
  }

  return NextResponse.json({ success: true, message: "Job saved." }, { status: 201 });
}
