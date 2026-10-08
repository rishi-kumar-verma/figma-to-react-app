import { FigmaNode, GenerationRequest, ExtractedFigmaDesign, FigmaScreenModel } from "../types";

export interface FigmaPageSummary {
  id: string;
  name: string;
  layersCount: number;
  framesCount: number;
  componentsCount: number;
  textCount: number;
  vectorsCount: number;
}

export interface ParsedDesignOutput {
  documentTitle: string;
  pages: FigmaPageSummary[];
  framesCount: number;
  componentsCount: number;
  textNodesCount: number;
  vectorsCount: number;
  layoutNodes: Array<{ id: string; name: string; type: string; layoutMode?: string; itemSpacing?: number }>;
  topLevelFrames: Array<{ id: string; name: string; layoutMode?: string; textSnippets: string[] }>;
  extractedTexts: string[];
  extractedColors: string[];
  extractedFonts: string[];
  inferredCategory: string;
  extractedDesign: ExtractedFigmaDesign;
  logs: string[];
}

export function runFigmaParserAgent(
  document: FigmaNode,
  request: GenerationRequest,
  docName: string
): ParsedDesignOutput {
  const logs: string[] = [];
  logs.push(`[FigmaParserAgent] Initializing parser for: "${docName}"`);
  logs.push(`[FigmaParserAgent] Figma Source: ${request.figmaUrl || "Imported Figma AST"}`);

  let framesCount = 0;
  let componentsCount = 0;
  let textNodesCount = 0;
  let vectorsCount = 0;
  const layoutNodes: Array<{ id: string; name: string; type: string; layoutMode?: string; itemSpacing?: number }> = [];
  const topLevelFrames: Array<{ id: string; name: string; layoutMode?: string; textSnippets: string[] }> = [];
  const extractedTexts: string[] = [];
  const colorSet = new Set<string>();
  const fontSet = new Set<string>();

  // Find canvases / pages
  const canvases = (document.type === "DOCUMENT" && document.children ? document.children : [document]).filter(
    (n) => n.type === "CANVAS" || n.type === "FRAME" || n.children
  );

  const pagesSummary: FigmaPageSummary[] = canvases.map((canvas, idx) => {
    let pLayers = 0;
    let pFrames = 0;
    let pComponents = 0;
    let pText = 0;
    let pVectors = 0;

    function countCanvasNodes(n: FigmaNode) {
      pLayers++;
      if (n.type === "FRAME") pFrames++;
      if (n.type === "COMPONENT" || n.type === "INSTANCE") pComponents++;
      if (n.type === "TEXT") pText++;
      if (n.type === "VECTOR" || n.type === "RECTANGLE" || n.type === "ELLIPSE") pVectors++;
      if (n.children) {
        for (const child of n.children) countCanvasNodes(child);
      }
    }

    if (canvas.children) {
      for (const child of canvas.children) countCanvasNodes(child);
    } else {
      pLayers = 1;
    }

    return {
      id: canvas.id || `page-${idx + 1}`,
      name: canvas.name || `Page ${idx + 1}`,
      layersCount: pLayers,
      framesCount: pFrames,
      componentsCount: pComponents,
      textCount: pText,
      vectorsCount: pVectors,
    };
  });

  logs.push(`[FigmaParserAgent] Extracted ${pagesSummary.length} pages from Figma project:`);
  pagesSummary.forEach((p) => {
    logs.push(`  • ${p.name}: ${p.layersCount} layers (${p.framesCount} frames, ${p.textCount} text, ${p.vectorsCount} vectors)`);
  });

  for (const canvas of canvases) {
    if (canvas.children) {
      for (const topNode of canvas.children) {
        if (topNode.type === "FRAME" || topNode.type === "COMPONENT") {
          const frameTexts: string[] = [];
          collectTexts(topNode, frameTexts);
          topLevelFrames.push({
            id: topNode.id,
            name: topNode.name,
            layoutMode: topNode.layoutMode,
            textSnippets: frameTexts.slice(0, 8),
          });
        }
      }
    }
  }

  function collectTexts(node: FigmaNode, acc: string[]) {
    if (node.characters && node.characters.trim().length > 0) {
      acc.push(node.characters.trim());
    }
    if (node.children) {
      for (const c of node.children) {
        collectTexts(c, acc);
      }
    }
  }

  function traverse(node: FigmaNode, depth = 0) {
    if (node.type === "FRAME") framesCount++;
    if (node.type === "COMPONENT" || node.type === "INSTANCE") componentsCount++;
    if (node.type === "TEXT") {
      textNodesCount++;
      if (node.characters && node.characters.trim()) {
        extractedTexts.push(node.characters.trim());
      }
    }
    if (node.type === "VECTOR") vectorsCount++;

    if (node.layoutMode && node.layoutMode !== "NONE") {
      layoutNodes.push({
        id: node.id,
        name: node.name,
        type: node.type,
        layoutMode: node.layoutMode,
        itemSpacing: node.itemSpacing,
      });
    }

    if (node.fills) {
      for (const fill of node.fills) {
        if (fill.color) {
          const r = Math.round(fill.color.r * 255);
          const g = Math.round(fill.color.g * 255);
          const b = Math.round(fill.color.b * 255);
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          colorSet.add(hex);
        }
      }
    }

    if (node.style?.fontFamily) {
      fontSet.add(node.style.fontFamily);
    }

    if (node.children) {
      for (const child of node.children) {
        traverse(child, depth + 1);
      }
    }
  }

  traverse(document);

  if (colorSet.size < 2) {
    colorSet.add("#0284c7");
    colorSet.add("#0f172a");
  }
  if (fontSet.size === 0) {
    fontSet.add("Inter");
  }

  const allTextsCombined = `${docName} ${canvases.map((c) => c.name || "").join(" ")} ${extractedTexts.slice(0, 100).join(" ")}`.toLowerCase();

  // 1. DYNAMIC NAVIGATION ROUTES: Derived directly from the actual Figma Pages (canvases)
  const dynamicNavItems = canvases.map((canvas, i) => {
    const nameLower = (canvas.name || "").toLowerCase();
    let icon = "Layers";
    if (nameLower.includes("home") || nameLower.includes("dashboard")) icon = "Activity";
    else if (nameLower.includes("login") || nameLower.includes("auth")) icon = "Lock";
    else if (nameLower.includes("user") || nameLower.includes("student") || nameLower.includes("faculty")) icon = "Users";
    else if (nameLower.includes("content") || nameLower.includes("node") || nameLower.includes("curriculum")) icon = "FileText";
    else if (nameLower.includes("institute") || nameLower.includes("center") || nameLower.includes("campus")) icon = "Building";
    else if (nameLower.includes("style") || nameLower.includes("guide")) icon = "Palette";
    else if (nameLower.includes("setting")) icon = "Settings";
    else if (nameLower.includes("package")) icon = "Package";
    else if (nameLower.includes("market") || nameLower.includes("trade") || nameLower.includes("finance")) icon = "TrendingUp";

    return {
      id: canvas.id || `nav-${i + 1}`,
      label: canvas.name || `Page ${i + 1}`,
      count: canvas.children ? canvas.children.length : undefined,
      icon,
    };
  });

  // 2. DYNAMIC SCREENS: Derived directly from all top-level frames on every page
  const dynamicScreens: FigmaScreenModel[] = [];

  for (const canvas of canvases) {
    if (canvas.children) {
      for (const frame of canvas.children) {
        if (frame.type === "FRAME" || frame.type === "COMPONENT") {
          const frameTexts: string[] = [];
          collectTexts(frame, frameTexts);

          const nameLower = (frame.name || "").toLowerCase();
          let screenType: FigmaScreenModel["type"] = "table";
          if (nameLower.includes("alert") || nameLower.includes("modal") || nameLower.includes("dialog")) {
            screenType = "form";
          } else if (nameLower.includes("login") || nameLower.includes("auth") || nameLower.includes("form") || nameLower.includes("edit") || nameLower.includes("add")) {
            screenType = "form";
          } else if (nameLower.includes("tree") || nameLower.includes("hierarchy") || nameLower.includes("parent") || nameLower.includes("curriculum")) {
            screenType = "tree";
          } else if (nameLower.includes("bulk") || nameLower.includes("grid") || nameLower.includes("card") || nameLower.includes("view")) {
            screenType = "grid";
          }

          // Extract columns dynamically from child text nodes
          const uniqueTexts = Array.from(new Set(frameTexts.filter((t) => t.length < 35)));
          const cols = uniqueTexts.slice(0, 5);
          const columns = cols.length >= 2 ? cols : ["Item Name", "Type", "Status", "Actions"];

          dynamicScreens.push({
            id: frame.id,
            title: frame.name,
            subtitle: `Page: ${canvas.name} • ${frame.layoutMode || "Auto-Layout"} Frame`,
            badge: canvas.name,
            type: screenType,
            columns,
            rows: [
              { [columns[0]]: `${frame.name} Item 1`, Status: "Active" },
              { [columns[0]]: `${frame.name} Item 2`, Status: "Active" },
            ],
          });
        }
      }
    }
  }

  // Fallback if no frames exist inside canvases
  if (dynamicScreens.length === 0) {
    canvases.forEach((canvas, idx) => {
      dynamicScreens.push({
        id: canvas.id || `screen-${idx + 1}`,
        title: canvas.name || `Screen ${idx + 1}`,
        subtitle: `Page: ${canvas.name}`,
        badge: canvas.name,
        type: "table",
        columns: ["Record Name", "Category", "Status"],
        rows: [{ "Record Name": `${canvas.name} Record`, Category: "Default", Status: "Active" }],
      });
    });
  }

  // Inferred category from tokens
  let inferredCat = "Enterprise Design";
  if (allTextsCombined.includes("learn") || allTextsCombined.includes("student") || allTextsCombined.includes("curriculum") || allTextsCombined.includes("node") || allTextsCombined.includes("thinkiit")) {
    inferredCat = "EdTech & Operations";
  } else if (allTextsCombined.includes("crypto") || allTextsCombined.includes("trade") || allTextsCombined.includes("portfolio")) {
    inferredCat = "Fintech & Analytics";
  } else if (allTextsCombined.includes("patient") || allTextsCombined.includes("clinical")) {
    inferredCat = "Healthcare";
  }

  const extractedDesign: ExtractedFigmaDesign = {
    brandName: docName.replace(/[-_]/g, " ").trim() || request.projectName || "Figma Project",
    category: inferredCat,
    navItems: dynamicNavItems.length > 0 ? dynamicNavItems : [{ id: "main", label: "Main View", icon: "Layers" }],
    metrics: [
      { id: "m-1", title: "Total Pages", value: `${canvases.length} Pages`, subtitle: "Active Figma Canvases", trend: "+100%", isPositive: true },
      { id: "m-2", title: "Layout Frames", value: `${framesCount} Frames`, subtitle: "Synthesized UI Screens", trend: "+12%", isPositive: true },
      { id: "m-3", title: "Typography Nodes", value: `${textNodesCount}`, subtitle: "Text Labels & Headers", trend: "+24%", isPositive: true },
      { id: "m-4", title: "Design Colors", value: `${colorSet.size} Colors`, subtitle: "Extracted Theme Palette", trend: "Optimal", isPositive: true },
    ],
    screens: dynamicScreens,
    colors: Array.from(colorSet),
  };

  logs.push(`[FigmaParserAgent] Document parsed: "${extractedDesign.brandName}" (${extractedDesign.category})`);
  logs.push(`[FigmaParserAgent] Extracted ${extractedDesign.navItems.length} primary navigation routes: ${extractedDesign.navItems.map((n) => n.label).join(", ")}`);
  logs.push(`[FigmaParserAgent] Extracted ${framesCount} layout frames (${topLevelFrames.length} top-level screens).`);
  logs.push(`[FigmaParserAgent] Extracted ${textNodesCount} typography nodes and ${extractedTexts.length} text labels.`);

  return {
    documentTitle: docName,
    pages: pagesSummary,
    framesCount,
    componentsCount: Math.max(componentsCount, topLevelFrames.length || 4),
    textNodesCount,
    vectorsCount,
    layoutNodes,
    topLevelFrames,
    extractedTexts,
    extractedColors: Array.from(colorSet),
    extractedFonts: Array.from(fontSet),
    inferredCategory: extractedDesign.category,
    extractedDesign,
    logs,
  };
}
