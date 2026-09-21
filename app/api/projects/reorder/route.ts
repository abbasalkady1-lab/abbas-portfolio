import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { orderedIds } = await req.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "orderedIds array is required" }, { status: 400 });
    }

    const projects = await getProjects();
    const idToProjectMap = new Map(projects.map((p) => [p.id, p]));

    const reordered: typeof projects = [];

    // Assign new order sequence based on orderedIds
    orderedIds.forEach((id, index) => {
      const proj = idToProjectMap.get(id);
      if (proj) {
        proj.order = index + 1;
        reordered.push(proj);
        idToProjectMap.delete(id);
      }
    });

    // Append any unmentioned projects
    let nextOrder = orderedIds.length + 1;
    idToProjectMap.forEach((proj) => {
      proj.order = nextOrder++;
      reordered.push(proj);
    });

    await saveProjects(reordered);
    return NextResponse.json({ success: true, count: reordered.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reorder projects" }, { status: 500 });
  }
}
