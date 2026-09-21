import { NextRequest, NextResponse } from "next/server";
import { getServices, saveServices, handleStorageError } from "@/lib/db";
import { Service } from "@/types";

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const services = await getServices();

    const newService: Service = {
      ...data,
      id: data.id || "srv-" + Date.now(),
      order: data.order !== undefined ? Number(data.order) : services.length + 1,
      features: Array.isArray(data.features) ? data.features : [],
      featuresAr: Array.isArray(data.featuresAr) ? data.featuresAr : [],
      contactMethod: data.contactMethod || "both",
      visible: data.visible !== false,
    };

    services.push(newService);
    await saveServices(services);
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return handleStorageError(error, "Failed to create service");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const services = await getServices();
    const index = services.findIndex((s) => s.id === data.id);
    if (index === -1) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    services[index] = {
      ...services[index],
      ...data,
      features: Array.isArray(data.features) ? data.features : services[index].features,
      featuresAr: Array.isArray(data.featuresAr) ? data.featuresAr : (services[index].featuresAr || []),
      contactMethod: data.contactMethod || services[index].contactMethod || "both",
      visible: data.visible !== undefined ? data.visible : (services[index].visible !== false),
    };

    await saveServices(services);
    return NextResponse.json(services[index]);
  } catch (error) {
    return handleStorageError(error, "Failed to update service");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const services = await getServices();
    const filtered = services.filter((s) => s.id !== id);
    await saveServices(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleStorageError(error, "Failed to delete service");
  }
}
