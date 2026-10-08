import { NextRequest, NextResponse } from "next/server";
import { parseFigmaUrl } from "@/src/lib/figma/client";

export async function POST(req: NextRequest) {
  try {
    const { url, token } = await req.json();

    const parsed = parseFigmaUrl(url);
    if (!parsed) {
      return NextResponse.json(
        { valid: false, error: "Invalid Figma URL format. Expected https://figma.com/file/... or /design/..." },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json({
        valid: true,
        isLiveApi: false,
        fileKey: parsed.fileKey,
        message: "URL format is valid. Built-in high-fidelity presets will be used for generation.",
      });
    }

    // Attempt live check
    const res = await fetch(`https://api.figma.com/v1/files/${parsed.fileKey}`, {
      headers: { "X-Figma-Token": token },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        valid: true,
        isLiveApi: true,
        fileKey: parsed.fileKey,
        fileName: data.name,
        message: `Successfully connected to Figma file: "${data.name}"`,
      });
    } else {
      return NextResponse.json(
        {
          valid: false,
          error: `Figma API responded with ${res.status}: ${res.statusText}. Please verify your access token.`,
        },
        { status: 401 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, error: err?.message || "Failed to contact Figma API" },
      { status: 500 }
    );
  }
}
