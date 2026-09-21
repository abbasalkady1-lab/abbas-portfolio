import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/db";
import { Project } from "@/types";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const projects = await getProjects();

    const newProject: Project = {
      ...data,
      id: "proj-" + Date.now(),
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      order: projects.length + 1,
      featured: Boolean(data.featured),
      published: data.published !== undefined ? Boolean(data.published) : true,
      screenshots: Array.isArray(data.screenshots) ? data.screenshots : [],
      technologies: Array.isArray(data.technologies) ? data.technologies : [],
    };

    projects.push(newProject);
    await saveProjects(projects);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const projects = await getProjects();
    const index = projects.findIndex((p) => p.id === data.id);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    projects[index] = {
      ...projects[index],
      ...data,
    };

    await saveProjects(projects);
    return NextResponse.json(projects[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const projects = await getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    await saveProjects(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
