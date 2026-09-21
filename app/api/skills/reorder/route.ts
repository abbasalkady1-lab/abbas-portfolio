import { NextRequest, NextResponse } from "next/server";
import { getSkills, saveSkills } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { orderedIds } = await req.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "orderedIds array is required" }, { status: 400 });
    }

    const skills = await getSkills();
    const idToSkillMap = new Map(skills.map((s) => [s.id, s]));
    const reordered: typeof skills = [];

    orderedIds.forEach((id, index) => {
      const s = idToSkillMap.get(id);
      if (s) {
        s.order = index + 1;
        reordered.push(s);
        idToSkillMap.delete(id);
      }
    });

    let nextOrder = orderedIds.length + 1;
    idToSkillMap.forEach((s) => {
      s.order = nextOrder++;
      reordered.push(s);
    });

    await saveSkills(reordered);
    return NextResponse.json({ success: true, count: reordered.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reorder skills" }, { status: 500 });
  }
}
