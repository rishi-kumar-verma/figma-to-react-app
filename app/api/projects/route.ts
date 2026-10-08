import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/src/lib/db/projects-repository";

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("[API GET /api/projects Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.generationResult) {
      return NextResponse.json(
        { error: "name and generationResult are required" },
        { status: 400 }
      );
    }

    const created = await createProject(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("[API POST /api/projects Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
