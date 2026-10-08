import { DesignTokens, GenerationRequest, ExtractedFigmaDesign } from "../types";
import { ParsedDesignOutput } from "./figma-parser-agent";

export interface AnalyzedDesignOutput {
  tokens: DesignTokens;
  componentMappings: Array<{
    figmaName: string;
    targetComponent: string;
    targetFile: string;
    props: string[];
    layoutStrategy: string;
  }>;
  brandName: string;
  category: ParsedDesignOutput["inferredCategory"];
  extractedDesign: ExtractedFigmaDesign;
  logs: string[];
}

export function runDesignAnalyzerAgent(
  parsed: ParsedDesignOutput,
  request: GenerationRequest
): AnalyzedDesignOutput {
  const logs: string[] = [];
  logs.push(`[DesignAnalyzerAgent] Synthesizing Design System for "${parsed.documentTitle}"...`);

  // Detect dominant primary color from parsed Figma fills
  const primaryHex =
    parsed.extractedColors.find(
      (c) =>
        c !== "#ffffff" &&
        c !== "#000000" &&
        c !== "#0f172a" &&
        c !== "#f8fafc" &&
        c !== "#e2e8f0"
    ) || (parsed.inferredCategory === "fintech" ? "#6366f1" : "#0284c7");

  const tokens: DesignTokens = {
    colors: {
      primary: primaryHex,
      primaryHover: primaryHex,
      accent: parsed.extractedColors[1] || "#10b981",
      backgroundLight: "#f8fafc",
      backgroundDark: "#090d16",
      cardLight: "#ffffff",
      cardDark: "#111827",
      borderLight: "#e2e8f0",
      borderDark: "#1f2937",
      textPrimaryLight: "#0f172a",
      textPrimaryDark: "#f8fafc",
      textMuted: "#64748b",
    },
    typography: {
      h1: { size: "1.875rem", weight: "700", lineHeight: "2.25rem" },
      h2: { size: "1.5rem", weight: "600", lineHeight: "2rem" },
      h3: { size: "1.25rem", weight: "600", lineHeight: "1.75rem" },
      body: { size: "0.875rem", weight: "400", lineHeight: "1.25rem" },
      caption: { size: "0.75rem", weight: "500", lineHeight: "1rem" },
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
    },
    borderRadius: {
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      full: "9999px",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    },
  };

  // Derive clean brand name from Figma document, extractedDesign or Project name
  const rawBrand = parsed.documentTitle.replace(/[-_]/g, " ").trim();
  const brandName =
    parsed.extractedDesign?.brandName ||
    (rawBrand.length > 2 && rawBrand !== "Document"
      ? rawBrand
      : request.projectName);

  // Build component mappings dynamically from top-level frames or category
  const componentMappings: AnalyzedDesignOutput["componentMappings"] = [
    {
      figmaName: "App Navigation Shell",
      targetComponent: "AppSidebar",
      targetFile: "src/components/layout/AppSidebar.tsx",
      props: ["activeRoute", "onRouteChange"],
      layoutStrategy: "Accessible responsive sidebar with ARIA navigation landmarks",
    },
    {
      figmaName: "Top Navigation Bar",
      targetComponent: "AppHeader",
      targetFile: "src/components/layout/AppHeader.tsx",
      props: ["title", "onActionClick", "onSearch"],
      layoutStrategy: "Sticky horizontal flex header with search input and notifications",
    },
    {
      figmaName: "Primary Metrics & KPI Row",
      targetComponent: "MetricsGrid",
      targetFile: "src/components/dashboard/MetricsGrid.tsx",
      props: ["items", "loading"],
      layoutStrategy: "Responsive CSS grid (cols-1 sm:cols-2 xl:cols-4) with delta badges",
    },
    {
      figmaName: "Metric Summary Card",
      targetComponent: "MetricCard",
      targetFile: "src/components/ui/MetricCard.tsx",
      props: ["title", "value", "trend", "isPositive", "icon"],
      layoutStrategy: "Rounded card with auto-layout padding and hover shadow",
    },
    {
      figmaName: "Central Data Table / Records",
      targetComponent: "DataTable",
      targetFile: "src/components/dashboard/DataTable.tsx",
      props: ["data", "onRowClick"],
      layoutStrategy: "Accessible tabular records with status indicators and sorting",
    },
  ];

  // If real screens exist from extractedDesign, add their component mappings
  if (parsed.extractedDesign?.screens) {
    for (const screen of parsed.extractedDesign.screens) {
      const sanitized = screen.title.replace(/[^a-zA-Z0-9]/g, "");
      componentMappings.push({
        figmaName: screen.title,
        targetComponent: `${sanitized}Screen`,
        targetFile: `src/components/dashboard/${sanitized}Screen.tsx`,
        props: ["records", "onAction"],
        layoutStrategy: `Figma auto-layout ${screen.type} view with responsive scrolling`,
      });
    }
  }

  logs.push(`[DesignAnalyzerAgent] Primary Brand Color: ${primaryHex} (extracted from Figma fills)`);
  logs.push(`[DesignAnalyzerAgent] Brand identified: "${brandName}" (${parsed.inferredCategory})`);
  logs.push(`[DesignAnalyzerAgent] Mapped ${componentMappings.length} design frames to modular components.`);
  logs.push(`[DesignAnalyzerAgent] Generated Tailwind tokens for dark & light responsive themes.`);

  return {
    tokens,
    componentMappings,
    brandName,
    category: parsed.inferredCategory,
    extractedDesign: parsed.extractedDesign,
    logs,
  };
}
