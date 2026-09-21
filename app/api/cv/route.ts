import { NextRequest, NextResponse } from "next/server";
import { getCV, saveCV, handleStorageError } from "@/lib/db";

export async function GET() {
  const cv = await getCV();
  return NextResponse.json(cv);
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const current = await getCV();
    const updated = {
      ...current,
      ...data,
      enUpdatedAt: data.enUrl && data.enUrl !== current.enUrl ? new Date().toISOString().split("T")[0] : current.enUpdatedAt,
      arUpdatedAt: data.arUrl && data.arUrl !== current.arUrl ? new Date().toISOString().split("T")[0] : current.arUpdatedAt,
    };

    await saveCV(updated);
    return NextResponse.json(updated);
  } catch (error) {
    return handleStorageError(error, "Failed to update CV data");
  }
}
