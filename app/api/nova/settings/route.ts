import { NextRequest, NextResponse } from "next/server";
import { getNovaSettings, saveNovaSettings, handleStorageError } from "@/lib/db";

export async function GET() {
  const settings = await getNovaSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const current = await getNovaSettings();
    const updated = {
      ...current,
      ...data,
      allowedActions: Array.isArray(data.allowedActions) ? data.allowedActions : current.allowedActions,
    };

    await saveNovaSettings(updated);
    return NextResponse.json(updated);
  } catch (error) {
    return handleStorageError(error, "Failed to update NOVA settings");
  }
}
