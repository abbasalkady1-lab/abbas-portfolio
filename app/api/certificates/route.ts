import { NextRequest, NextResponse } from "next/server";
import { getCertificates, saveCertificates, handleStorageError } from "@/lib/db";
import { Certificate } from "@/types";

export async function GET() {
  const certs = await getCertificates();
  return NextResponse.json(certs);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const certs = await getCertificates();

    const newCert: Certificate = {
      ...data,
      id: "cert-" + Date.now(),
      order: certs.length + 1,
    };

    certs.push(newCert);
    await saveCertificates(certs);
    return NextResponse.json(newCert, { status: 201 });
  } catch (error) {
    return handleStorageError(error, "Failed to create certificate");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const certs = await getCertificates();
    const index = certs.findIndex((c) => c.id === data.id);
    if (index === -1) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    certs[index] = { ...certs[index], ...data };
    await saveCertificates(certs);
    return NextResponse.json(certs[index]);
  } catch (error) {
    return handleStorageError(error, "Failed to update certificate");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const certs = await getCertificates();
    const filtered = certs.filter((c) => c.id !== id);
    await saveCertificates(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleStorageError(error, "Failed to delete certificate");
  }
}
