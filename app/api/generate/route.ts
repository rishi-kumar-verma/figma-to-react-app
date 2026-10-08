import { NextRequest, NextResponse } from "next/server";
import { GenerationRequest } from "@/src/lib/types";
import { runOrchestrationPipeline } from "@/src/lib/agents/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    if (!rawBody.projectName) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const body: GenerationRequest = {
      framework: "react",
      language: "typescript",
      styling: "tailwind",
      stateManagement: "react-state",
      ...rawBody,
    };

    const result = await runOrchestrationPipeline(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Pipeline execution error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to execute generation pipeline" },
      { status: 500 }
    );
  }
}
