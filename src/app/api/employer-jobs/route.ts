import { NextResponse } from "next/server";

import { listEmployerJobs, updateJobSettings, createJob, deleteEmployerJob } from "@/server/jobhub-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company");

  const jobs = await listEmployerJobs(company);

  return NextResponse.json({ success: true, jobs });
}

export async function POST(request: Request) {
  try {
    const jobData = await request.json();
    if (!jobData.title || !jobData.company) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    const success = await createJob(jobData);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Failed to create job:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, aiScreening, minScore, roleMapping } = body;

    if (!id || typeof aiScreening === "undefined" || typeof minScore === "undefined" || !roleMapping) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const updated = await updateJobSettings(id, aiScreening, minScore, roleMapping);
    return NextResponse.json({ success: updated });
  } catch (error) {
    console.error("Failed to update job settings:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const deleted = await deleteEmployerJob(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Failed to delete job:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
