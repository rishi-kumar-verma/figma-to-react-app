export type FrameworkChoice = "react" | "nextjs";
export type LanguageChoice = "typescript" | "javascript";
export type StylingChoice = "tailwind" | "mui" | "chakra";

export interface ProjectFeatures {
  darkMode: boolean;
  accessibility: boolean;
  responsive: boolean;
  testScaffolding: boolean;
  huskyLinting: boolean;
}

export interface GenerationRequest {
  projectName: string;
  description: string;
  figmaUrl: string;
  figmaToken?: string;
  openAiKey?: string;
  anthropicKey?: string;
  geminiKey?: string;
  figmaJson?: string;
  presetId?: "healthcare" | "fintech" | "crm" | "thinkiit";
  framework: FrameworkChoice;
  language: LanguageChoice;
  styling: StylingChoice;
  componentLibraries: string[];
  features: ProjectFeatures;
  aiModel?: string;
  forceRefresh?: boolean;
  projectId?: string;
  versionNumber?: number;
  changeSummary?: string;
}

export type AgentStepId =
  | "figma-parsing"
  | "component-mapping"
  | "route-generation"
  | "code-generation"
  | "review-agent"
  | "packaging";

export interface AgentStep {
  id: AgentStepId;
  stepNumber: number;
  title: string;
  agentName: string;
  role: string;
  status: "idle" | "running" | "completed" | "error";
  durationMs?: number;
  summary?: string;
  details?: string[];
  logs?: string[];
}

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaNode {
  id: string;
  name: string;
  type:
    | "DOCUMENT"
    | "CANVAS"
    | "FRAME"
    | "COMPONENT"
    | "INSTANCE"
    | "GROUP"
    | "TEXT"
    | "VECTOR"
    | "RECTANGLE"
    | "ELLIPSE"
    | "LINE"
    | "STAR"
    | string;
  children?: FigmaNode[];
  layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
  layoutWrap?: "NO_WRAP" | "WRAP";
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "BASELINE";
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fills?: Array<{
    type: string;
    color?: FigmaColor;
    opacity?: number;
  }>;
  strokes?: Array<{
    type: string;
    color?: FigmaColor;
  }>;
  strokeWeight?: number;
  cornerRadius?: number;
  characters?: string;
  style?: {
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    lineHeightPx?: number;
    textAlignHorizontal?: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  };
}

export interface DesignTokens {
  colors: Record<string, string>;
  typography: Record<string, { size: string; weight: string; lineHeight: string }>;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type:
    | "component"
    | "page"
    | "layout"
    | "hook"
    | "service"
    | "config"
    | "test"
    | "style"
    | "asset";
  size: number;
}

export interface AuditChecklistItem {
  id: string;
  category: "accessibility" | "responsive" | "type-safety" | "testing" | "security";
  rule: string;
  passed: boolean;
  message: string;
}

export interface QualityAuditResult {
  wcagScore: number;
  a11yIssuesCount: number;
  ariaRolesCount: number;
  responsiveBreakpoints: string[];
  typeSafetyScore: number;
  unitTestsCount: number;
  checklist: AuditChecklistItem[];
}

export interface VisualComparisonData {
  figmaSnapshotName: string;
  figmaDescription: string;
  similarityScore: number;
  metrics: {
    layoutMatch: number;
    colorMatch: number;
    typographyMatch: number;
    spacingMatch: number;
  };
  highlights: string[];
}

export interface FigmaScreenModel {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  type: "table" | "form" | "grid" | "tree";
  columns?: string[];
  rows?: Array<Record<string, string>>;
}

export interface ExtractedFigmaDesign {
  brandName: string;
  adminUser?: string;
  category: string;
  navItems: Array<{ id: string; label: string; count?: number; icon?: string }>;
  metrics: Array<{ id: string; title: string; value: string; subtitle?: string; trend: string; isPositive: boolean }>;
  screens: FigmaScreenModel[];
  colors: string[];
}

export interface GenerationResult {
  id: string;
  projectId?: string;
  versionNumber?: number;
  projectName: string;
  createdAt: string;
  designName: string;
  isLiveFigma: boolean;
  primaryCategory?: string;
  rawDocument?: FigmaNode;
  extractedDesign?: ExtractedFigmaDesign;
  devAssets?: {
    screens: DevScreenAsset[];
    icons: DevIconAsset[];
  };
  request: GenerationRequest;
  files: GeneratedFile[];
  tokens: DesignTokens;
  stats: {
    componentsCount: number;
    pagesCount: number;
    linesOfCode: number;
    totalFiles: number;
    executionTimeMs: number;
  };
  audit: QualityAuditResult;
  visualComparison: VisualComparisonData;
}

export interface DevScreenAsset {
  id: string;
  name: string;
  imageUrl?: string;
  width?: number;
  height?: number;
  format: "png" | "svg";
  type: "screen" | "frame";
}

export interface DevIconAsset {
  id: string;
  name: string;
  svgContent?: string;
  imageUrl?: string;
  format: "svg" | "png";
}

export interface SavedProject {
  id: string;
  name: string;
  description: string;
  figmaUrl: string;
  figmaFileKey?: string;
  category: string;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  versionsCount?: number;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  changeSummary?: string;
  createdAt: string;
  generationResult: GenerationResult;
}
