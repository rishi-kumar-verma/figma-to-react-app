import React, { useState, useEffect } from "react";
import {
  GenerationRequest,
  FrameworkChoice,
  LanguageChoice,
  StylingChoice,
} from "../../lib/types";
import {
  Sparkles,
  Layers,
  Code2,
  Palette,
  ShieldCheck,
  CheckCircle2,
  Settings2,
  ExternalLink,
  Laptop,
  Database,
  RefreshCw,
} from "lucide-react";
import { ApiKeyModal } from "./ApiKeyModal";
import { ProjectsLibraryModal } from "./ProjectsLibraryModal";
import {
  ApiKeys,
  DEFAULT_API_KEYS,
  getStoredApiKeys,
  countActiveKeys,
} from "../../lib/storage";
import { GenerationResult } from "../../lib/types";

export interface ProjectSetupFormProps {
  onStartGeneration: (request: GenerationRequest) => void;
  isLoading: boolean;
  onOpenSavedProject?: (result: GenerationResult) => void;
}

export const ProjectSetupForm: React.FC<ProjectSetupFormProps> = ({
  onStartGeneration,
  isLoading,
  onOpenSavedProject,
}) => {
  const [formMode, setFormMode] = useState<"custom" | "preset">("custom");
  const [projectName, setProjectName] = useState("ThinkIIT Learning & Operations Platform");
  const [figmaUrl, setFigmaUrl] = useState(
    "https://www.figma.com/design/Ovy67RJUeK4jPMmhzFei9p/thinkiit-2nd-project"
  );
  const [description, setDescription] = useState(
    `Build enterprise EdTech learning & institute management UI.\n\nRequirements:\n- React & TypeScript with strict interfaces\n- Tailwind CSS design system with custom brand tokens\n- Multi-tenant institute management (aryan.ThinkIIT.in)\n- Batch management with JEE & NEET academic cohorts\n- Content hierarchy & curriculum leaf lesson viewer\n- User management for student and faculty roles\n- Accessibility (WCAG 2.1 AA compliant, ARIA landmarks)\n- Unit test scaffolding with Vitest & React Testing Library`
  );

  const [framework, setFramework] = useState<FrameworkChoice>("react");
  const [language, setLanguage] = useState<LanguageChoice>("typescript");
  const [styling, setStyling] = useState<StylingChoice>("tailwind");
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([
    "shadcn",
    "Radix",
    "Lucide",
  ]);

  const [features, setFeatures] = useState({
    darkMode: true,
    accessibility: true,
    responsive: true,
    testScaffolding: true,
    huskyLinting: true,
  });

  const [presetId, setPresetId] = useState<"healthcare" | "fintech" | "crm" | undefined>(
    undefined
  );
  const [figmaJson, setFigmaJson] = useState("");
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [isCachedInDb, setIsCachedInDb] = useState(false);
  const [cachedDocName, setCachedDocName] = useState<string | null>(null);
  const [forceRefresh, setForceRefresh] = useState(false);

  // Load saved credentials from localStorage on mount
  useEffect(() => {
    const stored = getStoredApiKeys();
    setApiKeys(stored);
    if (stored.figmaToken) {
      setPresetId(undefined);
      setFormMode("custom");
    }
  }, []);

  // Check if current figmaUrl is already cached in PostgreSQL
  useEffect(() => {
    const match = figmaUrl.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) {
      fetch(`/api/figma/cache?fileKey=${match[1]}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.isCached) {
            setIsCachedInDb(true);
            setCachedDocName(d.documentName);
          } else {
            setIsCachedInDb(false);
            setCachedDocName(null);
          }
        })
        .catch(() => setIsCachedInDb(false));
    } else {
      setIsCachedInDb(false);
    }
  }, [figmaUrl]);

  const handleUrlChange = (url: string) => {
    setFigmaUrl(url);
    setPresetId(undefined);
    setFormMode("custom");

    if (url.toLowerCase().includes("thinkiit")) {
      setProjectName("ThinkIIT Learning & Operations Platform");
      setDescription(
        `Build enterprise EdTech learning & institute management UI.\n\nRequirements:\n- React & TypeScript with strict interfaces\n- Tailwind CSS design system with custom brand tokens\n- Multi-tenant institute management (aryan.ThinkIIT.in)\n- Batch management with JEE & NEET academic cohorts\n- Content hierarchy & curriculum leaf lesson viewer\n- User management for student and faculty roles\n- Accessibility (WCAG 2.1 AA compliant, ARIA landmarks)\n- Unit test scaffolding with Vitest & React Testing Library`
      );
    } else {
      const match = url.match(/figma\.com\/(?:file|design)\/[a-zA-Z0-9_-]+\/([a-zA-Z0-9_-]+)/i);
      if (match && match[1] && projectName.includes("PulseCare")) {
        const derived = match[1].replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        setProjectName(derived);
      }
    }
  };

  const handlePresetSelect = (id: "healthcare" | "fintech" | "crm") => {
    setPresetId(id);
    setFormMode("preset");
    if (id === "healthcare") {
      setProjectName("PulseCare Clinical Dashboard");
      setFigmaUrl("https://figma.com/file/xZ849Lp1Q0/Enterprise-Healthcare-Dashboard");
      setDescription(
        `Build a modern healthcare clinical dashboard.\n\nRequirements:\n- React & TypeScript with strict interfaces\n- Tailwind CSS design system\n- Mobile & Tablet Responsive (Fluid Auto-Layout)\n- Dark Theme & High-contrast Medical Readability\n- Accessibility (WCAG 2.1 AA compliant, ARIA landmarks)\n- Reusable components (MetricCard, PatientTable, VitalsPanel)\n- Unit test scaffolding with Vitest & React Testing Library`
      );
    } else if (id === "fintech") {
      setProjectName("Apex Wealth & Trading Terminal");
      setFigmaUrl("https://figma.com/file/fin99014Pk/Apex-Fintech-Trading-Terminal");
      setDescription(
        `Build a high-performance wealth and crypto trading terminal.\n\nRequirements:\n- Real-time asset overview and AUM calculation\n- Candlestick and portfolio allocation charts\n- Dark mode trading theme\n- Keyboard shortcuts and accessibility\n- Strict TypeScript data models for currency transactions`
      );
    } else {
      setProjectName("Nexus Cloud CRM & Billing");
      setFigmaUrl("https://figma.com/file/crm81729Nx/Nexus-SaaS-Admin-Hub");
      setDescription(
        `Build an enterprise multi-tenant SaaS admin console.\n\nRequirements:\n- Customer pipeline and MRR metrics\n- Team permission control and audit logs\n- Responsive table with server-side pagination pattern`
      );
    }
  };

  const toggleLibrary = (lib: string) => {
    if (selectedLibraries.includes(lib)) {
      setSelectedLibraries(selectedLibraries.filter((l) => l !== lib));
    } else {
      setSelectedLibraries([...selectedLibraries, lib]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGeneration({
      projectName,
      description,
      figmaUrl,
      figmaToken: apiKeys.figmaToken.trim() || undefined,
      openAiKey: apiKeys.openAiKey.trim() || undefined,
      anthropicKey: apiKeys.anthropicKey.trim() || undefined,
      geminiKey: apiKeys.geminiKey.trim() || undefined,
      figmaJson: figmaJson.trim() || undefined,
      presetId: formMode === "preset" ? presetId : undefined,
      framework,
      language,
      styling,
      componentLibraries: selectedLibraries,
      features,
      forceRefresh,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-sky-900/60 via-slate-900 to-indigo-950/60 border border-sky-500/20 shadow-xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Autonomous Multi-Agent Architecture</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Figma → Production-Ready React UI Generator
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Transforms Figma designs and business specs into enterprise-grade, accessible, and test-scaffolded React & Next.js codebases.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Saved Projects</span>
          </button>

          <button
            type="button"
            onClick={() => setIsKeyModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-all shadow-sm"
          >
            <Settings2 className="w-4 h-4 text-sky-400" />
            {countActiveKeys(apiKeys) > 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-semibold">
                  {countActiveKeys(apiKeys)} Key{countActiveKeys(apiKeys) > 1 ? "s" : ""} Active
                </span>
              </span>
            ) : (
              <span>API Keys &amp; Credentials</span>
            )}
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setFormMode("custom");
              setPresetId(undefined);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              formMode === "custom"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-1 ring-sky-400"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>🔗 Live Figma File (REST API)</span>
            {apiKeys.figmaToken ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormMode("preset");
              handlePresetSelect("healthcare");
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              formMode === "preset"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>⚡ Instant Design Presets</span>
          </button>
        </div>

        {formMode === "custom" && (
          <button
            type="button"
            onClick={() => handleUrlChange("https://www.figma.com/design/Ovy67RJUeK4jPMmhzFei9p/thinkiit-2nd-project")}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Load ThinkIIT File</span>
          </button>
        )}
      </div>

      {/* Preset Starters (Only shown when Instant Presets mode is selected) */}
      {formMode === "preset" && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select a Production Design Preset (Instant Execution):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "healthcare" as const,
                title: "Healthcare Dashboard",
                badge: "Clinical Command",
                desc: "Patient vitals, ER triage, doctor appointments, WCAG 2.1 AA",
              },
              {
                id: "fintech" as const,
                title: "Fintech Trading Terminal",
                badge: "Wealth & Stocks",
                desc: "Asset allocations, portfolio charts, dark theme trading UI",
              },
              {
                id: "crm" as const,
                title: "Enterprise SaaS Admin",
                badge: "CRM & MRR",
                desc: "Customer pipeline, activity audits, multi-tenant navigation",
              },
            ].map((preset) => {
              const isSelected = presetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all duration-150 ${
                    isSelected
                      ? "bg-sky-950/40 border-sky-500 shadow-md ring-1 ring-sky-500/50"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{preset.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        isSelected
                          ? "bg-sky-500 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{preset.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Configuration Card */}
      <form
        onSubmit={handleSubmit}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-md"
      >
        {/* Figma URL & Project Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="figma-url"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Figma File URL or Design Link
              </label>
              {apiKeys.figmaToken ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live PAT Active
                </span>
              ) : null}
            </div>
            <div className="relative">
              <input
                id="figma-url"
                type="text"
                required={!figmaJson}
                value={figmaUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://figma.com/file/xxxx/Design-File"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors font-mono"
              />
            </div>

            {/* Mode Banner */}
            {formMode === "preset" && presetId ? (
              <div className="flex items-center justify-between text-[11px] text-indigo-300 bg-indigo-950/40 border border-indigo-900/60 px-3 py-1.5 rounded-xl mt-2">
                <span>⚡ Using Preset Template: <strong>{presetId.toUpperCase()}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setFormMode("custom");
                    setPresetId(undefined);
                  }}
                  className="text-indigo-400 hover:text-white underline font-semibold"
                >
                  Switch to Live Figma
                </button>
              </div>
            ) : (
              <div className="mt-2 space-y-1.5">
                {isCachedInDb && (
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-300 bg-emerald-950/70 border border-emerald-800/80 px-3 py-2 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span>
                        <strong>Cached in PostgreSQL:</strong> "{cachedDocName || "Design AST"}" is saved. Instant generation (0 Figma API calls).
                      </span>
                    </div>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-750">
                      <input
                        type="checkbox"
                        checked={forceRefresh}
                        onChange={(e) => setForceRefresh(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 w-3.5 h-3.5"
                      />
                      <span className="text-[10px] whitespace-nowrap font-medium text-slate-300">Force re-fetch from Figma</span>
                    </label>
                  </div>
                )}

                {apiKeys.figmaToken ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1.5 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>
                      <strong>Live Figma REST API Mode:</strong> Connected to api.figma.com with active PAT
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-amber-300 bg-amber-950/40 border border-amber-900/60 px-3 py-1.5 rounded-xl">
                    <span>⚠️ Figma PAT required for live fetch.</span>
                    <button
                      type="button"
                      onClick={() => setIsKeyModalOpen(true)}
                      className="text-xs text-amber-200 hover:text-white underline font-bold"
                    >
                      Enter Token
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Optional JSON Paste Toggle */}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowJsonInput(!showJsonInput)}
                className="text-[11px] text-slate-400 hover:text-sky-300 flex items-center gap-1"
              >
                <span>{showJsonInput ? "Hide JSON Input" : "+ Or Paste Figma JSON / Node Export"}</span>
              </button>

              {showJsonInput && (
                <div className="mt-2 space-y-1">
                  <textarea
                    rows={3}
                    value={figmaJson}
                    onChange={(e) => {
                      setFigmaJson(e.target.value);
                      setPresetId(undefined);
                    }}
                    placeholder='{"name": "My Design", "document": { ... }}'
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono resize-none"
                  />
                  <p className="text-[10px] text-slate-500">
                    Paste raw JSON exported from Figma or Figma plugins (works offline with zero API tokens).
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="project-name"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Project Name
            </label>
            <input
              id="project-name"
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Acme Health Portal"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Business Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
          >
            Business Description & Requirements
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors font-mono leading-relaxed resize-none"
          />
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 border-t border-slate-800">
          {/* Framework */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Framework
            </span>
            <div className="space-y-1.5 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="framework"
                  checked={framework === "react"}
                  onChange={() => setFramework("react")}
                  className="accent-sky-500"
                />
                <span>(*) React (Vite / SPA)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="framework"
                  checked={framework === "nextjs"}
                  onChange={() => setFramework("nextjs")}
                  className="accent-sky-500"
                />
                <span>( ) Next.js (App Router)</span>
              </label>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Language
            </span>
            <div className="space-y-1.5 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  checked={language === "typescript"}
                  onChange={() => setLanguage("typescript")}
                  className="accent-sky-500"
                />
                <span>(*) TypeScript (Strict)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  checked={language === "javascript"}
                  onChange={() => setLanguage("javascript")}
                  className="accent-sky-500"
                />
                <span>( ) JavaScript</span>
              </label>
            </div>
          </div>

          {/* Styling */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Styling
            </span>
            <div className="space-y-1.5 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="styling"
                  checked={styling === "tailwind"}
                  onChange={() => setStyling("tailwind")}
                  className="accent-sky-500"
                />
                <span>(*) Tailwind CSS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="styling"
                  checked={styling === "mui"}
                  onChange={() => setStyling("mui")}
                  className="accent-sky-500"
                />
                <span>( ) MUI</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="styling"
                  checked={styling === "chakra"}
                  onChange={() => setStyling("chakra")}
                  className="accent-sky-500"
                />
                <span>( ) Chakra UI</span>
              </label>
            </div>
          </div>

          {/* Component Library */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Components
            </span>
            <div className="space-y-1.5 text-xs text-slate-300">
              {["shadcn", "Radix", "Lucide"].map((lib) => (
                <label key={lib} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLibraries.includes(lib)}
                    onChange={() => toggleLibrary(lib)}
                    className="accent-sky-500 rounded"
                  />
                  <span>☑ {lib}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise Standards Checklist */}
        <div className="pt-4 border-t border-slate-800">
          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Enterprise Quality Standards Enforced:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>WCAG 2.1 AA & ARIA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mobile / Tablet Fluid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vitest Unit Scaffolding</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dark Theme Tokens</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Generates full project architecture, pages, components, tests, and downloadable ZIP.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? "Generating Enterprise Project..." : "Generate Project"}</span>
          </button>
        </div>
      </form>

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        keys={apiKeys}
        onSaveKeys={(newKeys) => setApiKeys(newKeys)}
      />

      <ProjectsLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onOpenProject={(res) => {
          if (onOpenSavedProject) {
            onOpenSavedProject(res);
          }
        }}
      />
    </div>
  );
};
