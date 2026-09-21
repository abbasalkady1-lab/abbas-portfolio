import { NextRequest, NextResponse } from "next/server";
import { getTimeline, saveTimeline, handleStorageError } from "@/lib/db";
import { TimelineItem } from "@/types";

export async function GET() {
  const timeline = await getTimeline();
  return NextResponse.json(timeline);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const timeline = await getTimeline();

    const newItem: TimelineItem = {
      ...data,
      id: "time-" + Date.now(),
      order: timeline.length + 1,
    };

    timeline.push(newItem);
    await saveTimeline(timeline);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return handleStorageError(error, "Failed to create timeline item");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const timeline = await getTimeline();
    const index = timeline.findIndex((t) => t.id === data.id);
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    timeline[index] = { ...timeline[index], ...data };
    await saveTimeline(timeline);
    return NextResponse.json(timeline[index]);
  } catch (error) {
    return handleStorageError(error, "Failed to update timeline item");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const timeline = await getTimeline();
    const filtered = timeline.filter((t) => t.id !== id);
    await saveTimeline(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleStorageError(error, "Failed to delete timeline item");
  }
}
