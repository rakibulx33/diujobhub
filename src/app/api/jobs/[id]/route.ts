import { NextResponse } from "next/server";

import { getJobById } from "@/server/jobhub-db";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const job = await getJobById(id);

  if (!job) {
    return NextResponse.json({ success: false, message: "Job not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, job });
}
