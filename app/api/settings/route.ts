import { NextRequest, NextResponse } from "next/server";
import { getProfile, saveProfile, getSEO, saveSEO, getDatabase } from "@/lib/db";

export async function GET() {
  const db = await getDatabase();
  return NextResponse.json({
    profile: db.profile,
    seo: db.seo,
    analytics: db.analytics,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    if (data.profile) {
      await saveProfile(data.profile);
    }
    if (data.seo) {
      await saveSEO(data.seo);
    }

    const db = await getDatabase();
    return NextResponse.json({
      profile: db.profile,
      seo: db.seo,
      analytics: db.analytics,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
