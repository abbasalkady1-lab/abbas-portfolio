import { NextRequest, NextResponse } from "next/server";
import { getFeaturedVideo, saveFeaturedVideo, handleStorageError } from "@/lib/db";
import { FeaturedVideo } from "@/types";

export async function GET() {
  const video = await getFeaturedVideo();
  return NextResponse.json(video);
}

export async function PUT(req: NextRequest) {
  try {
    const data: FeaturedVideo = await req.json();
    if (!data.youtubeUrl && !data.title) {
      return NextResponse.json(
        { error: "Valid YouTube URL and title are required" },
        { status: 400 }
      );
    }
    const updated = await saveFeaturedVideo(data);
    return NextResponse.json(updated);
  } catch (error) {
    return handleStorageError(error, "Failed to update featured video");
  }
}
