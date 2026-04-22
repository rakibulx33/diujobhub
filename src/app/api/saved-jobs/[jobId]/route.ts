import { NextResponse } from "next/server";
import { unsaveJob } from "@/server/jobhub-db";

export async function DELETE(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId || !jobId) {
    return NextResponse.json(
      { success: false, message: "userId and jobId are required." },
      { status: 400 },
    );
  }

  await unsaveJob(userId, jobId);
  return NextResponse.json({ success: true, message: "Job removed from saved." });
}
