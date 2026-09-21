import { NextRequest, NextResponse } from "next/server";
import { getMedia, saveMediaItem, deleteMediaItem } from "@/lib/db";
import fs from "fs";
import path from "path";

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export async function GET() {
  const media = await getMedia();
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. JSON Request (Adding YouTube link or External Video URL)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { url, title, thumbnailUrl, description, type } = body;

      if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
      }

      const ytId = extractYouTubeId(url);
      const isYouTube = ytId !== null || type === "youtube" || url.includes("youtube.com") || url.includes("youtu.be");

      if (isYouTube && ytId) {
        const defaultThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        const embedUrl = `https://www.youtube.com/embed/${ytId}`;

        const newItem = await saveMediaItem({
          id: "yt-" + Date.now(),
          name: title || `YouTube Video (${ytId})`,
          url: url,
          type: "youtube",
          youtubeId: ytId,
          embedUrl: embedUrl,
          thumbnailUrl: thumbnailUrl || defaultThumb,
          title: title || `YouTube: ${ytId}`,
          description: description || "",
          uploadedAt: new Date().toISOString().split("T")[0],
        });

        return NextResponse.json(newItem, { status: 201 });
      }

      // External Video or Image URL
      const isVideo = type === "video" || /\.(mp4|webm|mov|mkv)(\?.*)?$/i.test(url);
      const newItem = await saveMediaItem({
        id: "ext-" + Date.now(),
        name: title || (isVideo ? "External Video" : "External Media"),
        url: url,
        type: isVideo ? "video" : "image",
        thumbnailUrl: thumbnailUrl || (isVideo ? undefined : url),
        title: title || "External Media",
        description: description || "",
        uploadedAt: new Date().toISOString().split("T")[0],
      });

      return NextResponse.json(newItem, { status: 201 });
    }

    // 2. Multipart Form Data (File Upload for Images & Videos)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const customThumbnail = formData.get("thumbnail") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || ".png";
    const filename = `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|mkv)$/i.test(file.name);

    const newItem = await saveMediaItem({
      id: "med-" + Date.now(),
      name: file.name,
      url: `/uploads/${filename}`,
      type: isVideo ? "video" : (file.type || "image/png"),
      size: file.size,
      thumbnailUrl: customThumbnail || (!isVideo ? `/uploads/${filename}` : undefined),
      uploadedAt: new Date().toISOString().split("T")[0],
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Media processing error:", error);
    return NextResponse.json({ error: "Failed to process media asset" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const success = await deleteMediaItem(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
