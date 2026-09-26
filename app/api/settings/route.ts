import { NextRequest, NextResponse } from "next/server";
import {
  getProfile,
  saveProfile,
  getSEO,
  saveSEO,
  getFeaturedVideo,
  saveFeaturedVideo,
  getDatabase,
  handleStorageError,
} from "@/lib/db";

export async function GET() {
  const db = await getDatabase();
  const featuredVideo = db.featuredVideo || (await getFeaturedVideo());
  return NextResponse.json({
    profile: db.profile,
    seo: db.seo,
    analytics: db.analytics,
    featuredVideo,
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
    if (data.featuredVideo) {
      await saveFeaturedVideo(data.featuredVideo);
    }

    const db = await getDatabase();
    return NextResponse.json({
      profile: db.profile,
      seo: db.seo,
      analytics: db.analytics,
      featuredVideo: db.featuredVideo,
    });
  } catch (error) {
    return handleStorageError(error, "Failed to update settings");
  }
}

