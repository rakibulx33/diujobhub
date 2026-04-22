import { NextResponse } from "next/server";
import { getAuditLogs } from "@/server/jobhub-db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || 100);
    const logs = await getAuditLogs(limit);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Audit log fetch error:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
