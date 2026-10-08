import React, { useState } from "react";
import { GeneratedFile } from "../../lib/types";
import {
  Sparkles,
  Copy,
  Check,
  Wand2,
  Terminal,
  Code2,
  Layers,
  ShieldCheck,
  Zap,
  Sliders,
  ChevronRight,
  Flame,
  ArrowRight,
} from "lucide-react";

export interface PromptImprovementAssistantProps {
  currentScreenTitle: string;
  currentScreenId: string;
  files: GeneratedFile[];
  isLiveFigma: boolean;
  brandName: string;
  figmaUrl?: string;
  onApplyPrompt?: (prompt: string) => void;
}

type PromptCategory = "fidelity" | "interactions" | "datagrid" | "accessibility" | "responsive";

interface CuratedTemplate {
  id: string;
  category: PromptCategory;
  title: string;
  badge: string;
  description: string;
  promptText: (context: {
    screenTitle: string;
    brandName: string;
    componentName: string;
  }) => string;
}

export const PromptImprovementAssistant: React.FC<PromptImprovementAssistantProps> = ({
  currentScreenTitle,
  currentScreenId,
  files,
  isLiveFigma,
  brandName,
  figmaUrl,
  onApplyPrompt,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>("fidelity");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom prompt synthesizer state
  const [targetFile, setTargetFile] = useState<string>(
    files.find((f) => f.path.includes("DataTable.tsx"))?.path || files[0]?.path || "src/components/dashboard/DataTable.tsx"
  );
  const [focusArea, setFocusArea] = useState<string>("visual-polish");
  const [customRequirement, setCustomRequirement] = useState<string>(
    "Add sticky table headers, glassmorphism card surfaces, and subtle row highlight on hover"
  );
  const [strictness, setStrictness] = useState<"strict" | "standard">("strict");

  const componentBaseName = targetFile.split("/").pop() || "DataTable.tsx";

  const curatedTemplates: CuratedTemplate[] = [
    {
      id: "pixel-perfect-tokens",
      category: "fidelity",
      title: "Pixel-Perfect Token & Spacing Alignment",
      badge: "Design Tokens",
      description:
        "Refine spacing, color variables, borders, and typography to achieve 1:1 parity with the Figma design canvas.",
      promptText: (ctx) =>
        `You are an elite Staff Frontend Engineer specializing in pixel-perfect Figma to React transformations.
Target Screen: "${ctx.screenTitle}" (${ctx.brandName})
Target Component: "${componentBaseName}"

TASK:
Audit and elevate the styling of ${componentBaseName} to match Figma design specifications with 100% visual fidelity:
1. Spacing & Geometry: Strictly use the design token spacing scale (4px, 8px, 12px, 16px, 24px, 32px). Verify padding and margins match auto-layout values.
2. Color & Shadows: Enforce cohesive theme variables. Use layered multi-stop soft shadows (\`shadow-sm\`, \`shadow-md\`) and border contrast matching dark/light mode standards.
3. Typography Scale: Ensure font weights (semibold for headers, medium for labels), letter spacing (tracking-tight), and line-heights align with Figma text layers.
4. Component Surface: Elevate card surfaces with modern subtle backdrop blur and refined borders (e.g., \`border-slate-800/80 bg-slate-900/60 backdrop-blur-md\`).

Output clean, production-ready TypeScript + React code preserving all props and types.`,
    },
    {
      id: "micro-interactions",
      category: "interactions",
      title: "Fluid Micro-Interactions & State Transitions",
      badge: "Motion & UX",
      description:
        "Introduce smooth hover feedback, active states, loading skeletons, and interactive state feedback.",
      promptText: (ctx) =>
        `You are an expert React UI/UX Engineer specializing in delightful micro-interactions.
Target Screen: "${ctx.screenTitle}"
Component: "${componentBaseName}"

TASK:
Implement high-polish micro-interactions and transitions in ${componentBaseName}:
1. Hover & Active States: Add subtle scale transforms (\`hover:scale-[1.01]\`), smooth color fades (\`transition-all duration-200\`), and clear active press states (\`active:scale-[0.99]\`).
2. Interactive Action Buttons: Give action buttons (e.g. Edit, Delete, Filter, Export) distinct hover glow effects and tooltip prompts.
3. Loading & Skeleton Polish: Add shimmer skeleton placeholders for asynchronous row data fetching.
4. Smooth State Changes: Animate filter chips appearing/disappearing and table row transitions smoothly without layout shift (CLS: 0).

Provide the revised code with clean CSS/Tailwind transitions.`,
    },
    {
      id: "datagrid-enterprise",
      category: "datagrid",
      title: "Enterprise Data Grid & Power-User Controls",
      badge: "Enterprise Grid",
      description:
        "Add multi-column sorting, row selection, search debounce, CSV export, and pagination.",
      promptText: (ctx) =>
        `You are a Senior Frontend Architect building enterprise-grade SaaS applications.
Target Screen: "${ctx.screenTitle}"
Component: "${componentBaseName}"

TASK:
Supercharge the data grid in ${componentBaseName} with enterprise functionality:
1. Column Sorting: Enable clickable column headers with ascending/descending chevron indicators and numeric/alphabetical sort handlers.
2. Bulk Row Selection: Add a master checkbox in the table header to select all visible rows, with a floating batch action bar (e.g. "Export Selected", "Delete", "Change Status").
3. Search & Filter: Add a debounced search input (300ms) with highlight matching text and a category filter dropdown.
4. Export & Pagination: Add a "Export to CSV" button that serializes current visible rows, plus intuitive pagination controls showing "Showing 1-10 of N results".

Maintain strict TypeScript interfaces and ensure zero hydration mismatches.`,
    },
    {
      id: "wcag-a11y-compliance",
      category: "accessibility",
      title: "WCAG 2.1 AA Accessibility & Keyboard Nav",
      badge: "WCAG 2.1 AA",
      description:
        "Guarantee full screen-reader compliance, ARIA attributes, semantic markup, and keyboard focus states.",
      promptText: (ctx) =>
        `You are an Accessibility (a11y) specialist and Senior React Engineer.
Target Screen: "${ctx.screenTitle}"
Component: "${componentBaseName}"

TASK:
Audit and remediate ${componentBaseName} to guarantee strict WCAG 2.1 AA compliance:
1. Semantic HTML: Ensure proper table tags (\`<table>\`, \`<thead>\`, \`<tbody>\`, \`<th>\`, \`<td>\`) with \`scope="col"\` on headers.
2. ARIA Enhancements: Add \`aria-label\`, \`aria-sort\`, \`aria-expanded\`, and announce search filter results via an \`aria-live="polite"\` region.
3. Keyboard Navigation: Implement full keyboard operability (Tab order, Enter/Space activation, Esc to dismiss modals, visible focus ring \`focus-visible:ring-2 focus-visible:ring-sky-500\`).
4. Color Contrast: Verify text-to-background contrast ratio exceeds 4.5:1 for normal text and 3:1 for large text across both light and dark themes.

Return the fully accessible, tested TypeScript component.`,
    },
    {
      id: "mobile-responsive",
      category: "responsive",
      title: "Mobile Adaptive Layout & Responsive Stacking",
      badge: "Responsive",
      description:
        "Transform wide tables into responsive card layouts on mobile screens while preserving all data and actions.",
      promptText: (ctx) =>
        `You are a responsive design specialist for modern web applications.
Target Screen: "${ctx.screenTitle}"
Component: "${componentBaseName}"

TASK:
Refactor ${componentBaseName} to render flawlessly across all viewports (Mobile 375px, Tablet 768px, Desktop 1440px):
1. Mobile Card Stacking: On screens < 768px (\`hidden md:table\`), transform wide table rows into compact, tap-friendly card tiles (\`block md:hidden\`).
2. Touch Target Sizing: Guarantee all interactive buttons, badges, and dropdowns meet the minimum 44x44px touch target guidelines.
3. Responsive Toolbar: Collapsible search bar and overflow action menu for mobile viewports to prevent horizontal overflow.
4. Fluid Typography: Use responsive font utilities (\`text-xs sm:text-sm\`) and adaptive padding to maintain high information density without clutter.

Provide the updated responsive component with no layout breakage.`,
    },
  ];

  const filteredTemplates = curatedTemplates.filter(
    (t) => t.category === selectedCategory || selectedCategory === "fidelity"
  );

  // Synthesize customized prompt
  const synthesizedPrompt = `You are a Principal Software Engineer refining the "${currentScreenTitle}" screen for the "${brandName}" application.
Target Component: ${targetFile}
Figma Source: ${isLiveFigma && figmaUrl ? figmaUrl : "Figma Enterprise Specification"}

PRIMARY OBJECTIVE:
Improve and optimize this component focusing on: ${focusArea.replace("-", " ").toUpperCase()}.

SPECIFIC REQUIREMENTS:
1. ${customRequirement}
2. Architectural Standards: ${
    strictness === "strict"
      ? "Strict TypeScript 5, Zero any, Modular sub-components, JSDoc comments, React 19 hooks standards, Tailwind CSS 3.4 utility classes."
      : "Standard React functional components with clean readable Tailwind CSS styling."
  }
3. Preserve all existing exported interfaces, prop contracts, and data-flow bindings.
4. Guarantee no SSR hydration mismatches (avoid browser-only globals during server render, use deterministic identifiers).

Please return the fully refactored, complete source code for ${targetFile} ready for direct drop-in replacement.`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>AI Code Refinement & Prompt Synthesizer</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Optimized Prompts for</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-mono">
              {currentScreenTitle}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Copy production-tested prompts to guide AI models (Claude, GPT-4, Cursor) to polish styling, micro-interactions, data controls, and a11y.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Context:</span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/60">
            {brandName} • {isLiveFigma ? "Live Figma API" : "Design Preset"}
          </span>
        </div>
      </div>

      {/* Two Column Section: Curated Prompts (Left) & Custom Synthesizer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Curated Prompt Templates (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Curated Improvement Prompts</span>
            </h4>
            <span className="text-[11px] text-slate-500">1-Click Copy Ready</span>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {[
              { id: "fidelity" as const, label: "Pixel Polish", icon: Wand2 },
              { id: "interactions" as const, label: "Micro-Motion", icon: Sparkles },
              { id: "datagrid" as const, label: "Data Controls", icon: Layers },
              { id: "accessibility" as const, label: "A11y (WCAG)", icon: ShieldCheck },
              { id: "responsive" as const, label: "Mobile Adapt", icon: Sliders },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Prompt Cards List */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredTemplates.map((template) => {
              const text = template.promptText({
                screenTitle: currentScreenTitle,
                brandName,
                componentName: componentBaseName,
              });
              const isCopied = copiedId === template.id;

              return (
                <div
                  key={template.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                          {template.title}
                        </h5>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-sky-950 text-sky-400 border border-sky-800">
                          {template.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(text, template.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                        isCopied
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/30"
                          : "bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Snippet Preview */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-slate-400 line-clamp-2">
                    {text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Custom Prompt Synthesizer (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Custom Prompt Synthesizer</span>
              </h4>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950/70 px-2 py-0.5 rounded border border-sky-800/60">
                Interactive Builder
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5">
              {/* Target Component Dropdown */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Target Component / File
                </label>
                <select
                  value={targetFile}
                  onChange={(e) => setTargetFile(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                >
                  {files.map((f) => (
                    <option key={f.path} value={f.path}>
                      {f.path}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goal / Focus Area */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Improvement Focus
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "visual-polish", label: "🎨 Visual Fidelity" },
                    { id: "micro-interactions", label: "✨ Micro-Motion" },
                    { id: "data-grid-power", label: "⚡ Data Filtering" },
                    { id: "a11y-wcag", label: "🛡️ A11y & ARIA" },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setFocusArea(goal.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-left font-medium border transition-all ${
                        focusArea === goal.id
                          ? "bg-sky-600/20 text-sky-300 border-sky-500"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
                      }`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Requirement Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Custom Requirements / Tweaks
                </label>
                <textarea
                  rows={2}
                  value={customRequirement}
                  onChange={(e) => setCustomRequirement(e.target.value)}
                  placeholder="e.g. Add sticky header, subtle badge animations, and status badge tooltips..."
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                />
              </div>

              {/* Strictness Level */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Code Standard Strictness
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStrictness("strict")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      strictness === "strict"
                        ? "bg-emerald-950/50 text-emerald-300 border-emerald-600"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    Enterprise Strict (No any, A11y)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStrictness("standard")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      strictness === "standard"
                        ? "bg-sky-950/50 text-sky-300 border-sky-600"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    Standard React
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Custom Prompt Output Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-900/60 space-y-2.5 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Synthesized Actionable Prompt:
              </span>
              <div className="flex items-center gap-2">
                {onApplyPrompt && (
                  <button
                    type="button"
                    onClick={() => onApplyPrompt(synthesizedPrompt)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-600/30 transition-all"
                    title="Populate into Update Project dialog"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>⚡ Apply to Next Version</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => copyToClipboard(synthesizedPrompt, "synthesized")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    copiedId === "synthesized"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/30"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  {copiedId === "synthesized" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="font-mono text-[11px] text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
              {synthesizedPrompt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
