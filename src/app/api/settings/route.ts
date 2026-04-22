import { NextResponse } from "next/server";

import { getSettings, saveSettings } from "@/server/jobhub-db";

export async function GET() {
  const config = await getSettings();
  return NextResponse.json({ success: true, config });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { config?: Record<string, unknown> };

  if (!body.config) {
    return NextResponse.json({ success: false, message: "config is required." }, { status: 400 });
  }

  const current = await getSettings();
  const settings = await saveSettings({
    ...current,
    ...body.config,
  });

  return NextResponse.json({ success: true, config: settings });
}
