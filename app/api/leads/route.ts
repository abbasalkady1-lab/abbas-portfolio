import { NextRequest, NextResponse } from "next/server";
import { getLeads, addLead, updateLeadStatus, deleteLead, handleStorageError } from "@/lib/db";

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lead = await addLead({
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      company: data.company || "",
      service: data.service || "General Inquiry",
      message: data.message,
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return handleStorageError(error, "Failed to create lead");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id || !data.status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const updated = await updateLeadStatus(data.id, data.status);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return handleStorageError(error, "Failed to update lead");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const deleted = await deleteLead(id);
    if (!deleted) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleStorageError(error, "Failed to delete lead");
  }
}
