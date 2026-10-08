import { NextRequest, NextResponse } from "next/server";
import { getCachedFigma, saveFigmaCache } from "@/src/lib/db/figma-cache-repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileKey = searchParams.get("fileKey");

    if (!fileKey) {
      return NextResponse.json(
        { error: "fileKey parameter is required" },
        { status: 400 }
      );
    }

    const cached = await getCachedFigma(fileKey);
    return NextResponse.json({
      isCached: !!cached,
      fileKey,
      documentName: cached?.documentName || null,
      rawDocument: cached?.rawDocument || null,
      extractedDesign: cached?.extractedDesign || null,
      devAssets: cached?.devAssets || { screens: [], icons: [] },
      figmaVersion: cached?.figmaVersion || "1.0",
      cachedAt: cached?.cachedAt || null,
      syncCount: cached?.syncCount || 0,
      screensCount: cached?.extractedDesign?.screens?.length || 0,
    });
  } catch (error: any) {
    console.error("[API GET /api/figma/cache Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to check Figma cache" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.fileKey || !body.documentName || !body.rawDocument || !body.extractedDesign) {
      return NextResponse.json(
        { error: "Missing required cache fields" },
        { status: 400 }
      );
    }

    await saveFigmaCache(
      body.fileKey,
      body.documentName,
      body.rawDocument,
      body.extractedDesign,
      body.devAssets || { screens: [], icons: [] },
      body.figmaVersion || "1.0"
    );

    return NextResponse.json({ success: true, fileKey: body.fileKey });
  } catch (error: any) {
    console.error("[API POST /api/figma/cache Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save Figma cache" },
      { status: 500 }
    );
  }
}
