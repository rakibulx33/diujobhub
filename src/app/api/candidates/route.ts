import { NextResponse } from "next/server";

import { listCandidates, updateCandidateStatus, deleteCandidate } from "@/server/jobhub-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const company = searchParams.get("company");

  const candidates = await listCandidates({ jobId, company });

  return NextResponse.json({ success: true, candidates });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const updated = await updateCandidateStatus(id, status);
    return NextResponse.json({ success: updated });
  } catch (error) {
    console.error("Failed to update candidate status:", error);
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

    const deleted = await deleteCandidate(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Failed to delete candidate:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
