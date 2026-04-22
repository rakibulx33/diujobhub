import { NextResponse } from "next/server";

import { listAcademicRecords, saveAcademicRecords, deleteAcademicRecord } from "@/server/jobhub-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, message: "userId is required." }, { status: 400 });
  }

  const records = await listAcademicRecords(userId);
  return NextResponse.json({ success: true, records });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    user_id?: string;
    records?: { semester: number; course_code: string; course_name: string; credit: number; cgpa: number }[];
  };

  if (!body.user_id) {
    return NextResponse.json({ success: false, message: "user_id is required." }, { status: 400 });
  }

  const records = await saveAcademicRecords(body.user_id, body.records ?? []);
  return NextResponse.json({ success: true, records });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (!id || !userId) {
    return NextResponse.json({ success: false, message: "id and userId are required." }, { status: 400 });
  }

  await deleteAcademicRecord(Number(id), userId);
  return NextResponse.json({ success: true });
}
