import { NextResponse } from "next/server";
import { getJobRoles } from "@/server/jobhub-db";

export async function GET(request: Request) {
  try {
    const roles = await getJobRoles();
    return NextResponse.json({ success: true, roles });
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
