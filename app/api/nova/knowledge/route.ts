import { NextRequest, NextResponse } from "next/server";
import { getNovaKnowledge, saveNovaKnowledge } from "@/lib/db";
import { NovaKnowledgeItem } from "@/types";

export async function GET() {
  const items = await getNovaKnowledge();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const items = await getNovaKnowledge();

    const newItem: NovaKnowledgeItem = {
      ...data,
      id: "nk-" + Date.now(),
      enabled: data.enabled !== undefined ? Boolean(data.enabled) : true,
    };

    items.push(newItem);
    await saveNovaKnowledge(items);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add knowledge item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const items = await getNovaKnowledge();
    const index = items.findIndex((k) => k.id === data.id);
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    items[index] = { ...items[index], ...data };
    await saveNovaKnowledge(items);
    return NextResponse.json(items[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update knowledge item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const items = await getNovaKnowledge();
    const filtered = items.filter((k) => k.id !== id);
    await saveNovaKnowledge(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete knowledge item" }, { status: 500 });
  }
}
