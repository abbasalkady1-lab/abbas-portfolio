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
      actionType: data.actionType || data.contactMethod || "both",
      thumbnail: data.thumbnail || "",
      youtubeUrl: data.youtubeUrl || "",
      fullDescription: data.fullDescription || "",
      fullDescriptionAr: data.fullDescriptionAr || "",
      externalUrl: data.externalUrl || "",
      externalUrlLabel: data.externalUrlLabel || "",
      externalUrlLabelAr: data.externalUrlLabelAr || "",
      price: data.price || "",
      priceAr: data.priceAr || "",
      badge: data.badge || "",
      badgeAr: data.badgeAr || "",
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
      actionType: data.actionType || data.contactMethod || services[index].actionType || "both",
      thumbnail: data.thumbnail !== undefined ? data.thumbnail : (services[index].thumbnail || ""),
      youtubeUrl: data.youtubeUrl !== undefined ? data.youtubeUrl : (services[index].youtubeUrl || ""),
      fullDescription: data.fullDescription !== undefined ? data.fullDescription : (services[index].fullDescription || ""),
      fullDescriptionAr: data.fullDescriptionAr !== undefined ? data.fullDescriptionAr : (services[index].fullDescriptionAr || ""),
      externalUrl: data.externalUrl !== undefined ? data.externalUrl : (services[index].externalUrl || ""),
      externalUrlLabel: data.externalUrlLabel !== undefined ? data.externalUrlLabel : (services[index].externalUrlLabel || ""),
      externalUrlLabelAr: data.externalUrlLabelAr !== undefined ? data.externalUrlLabelAr : (services[index].externalUrlLabelAr || ""),
      price: data.price !== undefined ? data.price : (services[index].price || ""),
      priceAr: data.priceAr !== undefined ? data.priceAr : (services[index].priceAr || ""),
      badge: data.badge !== undefined ? data.badge : (services[index].badge || ""),
      badgeAr: data.badgeAr !== undefined ? data.badgeAr : (services[index].badgeAr || ""),
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
