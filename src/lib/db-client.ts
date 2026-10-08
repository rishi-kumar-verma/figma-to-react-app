import {
  FigmaNode,
  ExtractedFigmaDesign,
  DevScreenAsset,
  DevIconAsset,
  GenerationResult,
  SavedProject,
  ProjectVersion,
} from "./types";

export interface CachedFigmaResponse {
  isCached: boolean;
  fileKey: string;
  documentName?: string;
  rawDocument?: FigmaNode;
  extractedDesign?: ExtractedFigmaDesign;
  devAssets?: {
    screens: DevScreenAsset[];
    icons: DevIconAsset[];
  };
  figmaVersion?: string;
  cachedAt?: string;
  syncCount?: number;
}

export async function fetchCachedFigma(fileKey: string): Promise<CachedFigmaResponse | null> {
  if (!fileKey) return null;

  // On the server side (Node.js runtime in Next.js API routes / orchestrator pipeline),
  // invoke the database repository directly to avoid relative URL parsing errors in native fetch.
  if (typeof window === "undefined") {
    try {
      const { getCachedFigma } = await import("./db/figma-cache-repository");
      const record = await getCachedFigma(fileKey);
      if (record) {
        return {
          isCached: true,
          fileKey: record.fileKey,
          documentName: record.documentName,
          rawDocument: record.rawDocument,
          extractedDesign: record.extractedDesign,
          devAssets: record.devAssets,
          figmaVersion: record.figmaVersion,
          cachedAt: record.cachedAt,
          syncCount: record.syncCount,
        };
      }
      return null;
    } catch (err) {
      console.warn("[db-client] server getCachedFigma warning:", err);
      return null;
    }
  }

  // Client-side execution in the browser
  try {
    const res = await fetch(`/api/figma/cache?fileKey=${encodeURIComponent(fileKey)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.isCached ? data : null;
  } catch (err) {
    console.warn("[db-client] fetchCachedFigma warning:", err);
    return null;
  }
}

export async function persistFigmaCache(payload: {
  fileKey: string;
  documentName: string;
  rawDocument: FigmaNode;
  extractedDesign: ExtractedFigmaDesign;
  devAssets?: { screens: DevScreenAsset[]; icons: DevIconAsset[] };
  figmaVersion?: string;
}): Promise<boolean> {
  if (typeof window === "undefined") {
    try {
      const { saveFigmaCache } = await import("./db/figma-cache-repository");
      await saveFigmaCache(
        payload.fileKey,
        payload.documentName,
        payload.rawDocument,
        payload.extractedDesign,
        payload.devAssets,
        payload.figmaVersion
      );
      return true;
    } catch (err) {
      console.warn("[db-client] server saveFigmaCache warning:", err);
      return false;
    }
  }

  try {
    const res = await fetch("/api/figma/cache", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.warn("[db-client] persistFigmaCache warning:", err);
    return false;
  }
}

export async function persistProject(payload: {
  name: string;
  description: string;
  figmaUrl: string;
  figmaFileKey?: string;
  category?: string;
  generationResult: GenerationResult;
}): Promise<{ project: SavedProject; version: ProjectVersion } | null> {
  if (typeof window === "undefined") {
    try {
      const { createProject } = await import("./db/projects-repository");
      return await createProject(payload);
    } catch (err) {
      console.warn("[db-client] server persistProject warning:", err);
      return null;
    }
  }

  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("[db-client] persistProject warning:", err);
    return null;
  }
}

export async function persistProjectVersion(
  projectId: string,
  changeSummary: string,
  generationResult: GenerationResult
): Promise<{ version: ProjectVersion } | null> {
  if (typeof window === "undefined") {
    try {
      const { createProjectVersion } = await import("./db/projects-repository");
      const version = await createProjectVersion(projectId, changeSummary, generationResult);
      return { version };
    } catch (err) {
      console.warn("[db-client] server persistProjectVersion warning:", err);
      return null;
    }
  }

  try {
    const res = await fetch(`/api/projects/${projectId}/versions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ changeSummary, generationResult }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("[db-client] persistProjectVersion warning:", err);
    return null;
  }
}
