import { NextResponse } from "next/server";

import { listJobs } from "@/server/jobhub-db";

export async function GET() {
  const jobs = await listJobs();
  return NextResponse.json({ success: true, jobs });
}
