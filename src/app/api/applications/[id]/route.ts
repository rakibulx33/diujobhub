import { NextResponse } from "next/server";
import { deleteApplication } from "@/server/jobhub-db";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ success: false, message: "Application ID is required" }, { status: 400 });
  }

  try {
    await deleteApplication(id);
    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("Failed to delete application", error);
    return NextResponse.json({ success: false, message: "Failed to delete application" }, { status: 500 });
  }
}
