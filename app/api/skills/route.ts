import { NextRequest, NextResponse } from "next/server";
import { getSkills, saveSkills, handleStorageError } from "@/lib/db";
import { Skill } from "@/types";

export async function GET() {
  const skills = await getSkills();
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const skills = await getSkills();

    const newSkill: Skill = {
      id: "skill-" + Date.now(),
      name: data.name || "",
      nameAr: data.nameAr || "",
      category: data.category || "Artificial Intelligence",
      level: Number(data.level) || 85,
      iconName: data.iconName || "Code2",
      order: data.order || skills.length + 1,
      visible: data.visible !== undefined ? Boolean(data.visible) : true,
      description: data.description || "",
      descriptionAr: data.descriptionAr || "",
      link: data.link || "",
      linkLabel: data.linkLabel || "",
      linkLabelAr: data.linkLabelAr || "",
      proofUrl: data.proofUrl || "",
      proofLabel: data.proofLabel || "",
      proofLabelAr: data.proofLabelAr || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      yearsOfExperience: data.yearsOfExperience || "",
    };

    skills.push(newSkill);
    await saveSkills(skills);
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    return handleStorageError(error, "Failed to create skill");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const skills = await getSkills();
    const index = skills.findIndex((s) => s.id === data.id);
    if (index === -1) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    skills[index] = {
      ...skills[index],
      ...data,
      level: Number(data.level) || skills[index].level,
      tags: Array.isArray(data.tags) ? data.tags : skills[index].tags || [],
    };

    await saveSkills(skills);
    return NextResponse.json(skills[index]);
  } catch (error) {
    return handleStorageError(error, "Failed to update skill");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const skills = await getSkills();
    const filtered = skills.filter((s) => s.id !== id);
    await saveSkills(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleStorageError(error, "Failed to delete skill");
  }
}
