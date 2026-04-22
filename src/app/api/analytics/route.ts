import { NextResponse } from "next/server";
import { getAnalyticsWeekly } from "@/server/jobhub-db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get("company");

    if (!company) {
      return NextResponse.json({ success: false, error: "Company parameter is required" }, { status: 400 });
    }

    const analytics = await getAnalyticsWeekly(company);
    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
