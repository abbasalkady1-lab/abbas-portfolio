import { NextResponse } from "next/server";
import { incrementCVDownloads } from "@/lib/db";

export async function POST() {
  try {
    const count = await incrementCVDownloads();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record download" }, { status: 500 });
  }
}
