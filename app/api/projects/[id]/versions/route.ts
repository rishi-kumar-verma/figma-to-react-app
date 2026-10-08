import { NextRequest, NextResponse } from "next/server";
import { createProjectVersion, getProjectById } from "@/src/lib/db/projects-repository";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.generationResult) {
      return NextResponse.json(
        { error: "generationResult is required" },
        { status: 400 }
      );
    }

    const version = await createProjectVersion(
      id,
      body.changeSummary || "New version",
      body.generationResult
    );

    return NextResponse.json({ version }, { status: 201 });
  } catch (error: any) {
    console.error("[API POST /api/projects/[id]/versions Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create project version" },
      { status: 500 }
    );
  }
}
