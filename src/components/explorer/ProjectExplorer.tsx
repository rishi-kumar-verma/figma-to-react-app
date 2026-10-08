import React, { useState, useEffect } from "react";
import { GenerationResult, GeneratedFile, ProjectVersion, GenerationRequest } from "../../lib/types";
import { FileTree } from "./FileTree";
import { CodeViewer } from "./CodeViewer";
import { InteractivePreview } from "./InteractivePreview";
import { ScreenMatchingStudio } from "./ScreenMatchingStudio";
import { DevAssetsInspector } from "./DevAssetsInspector";
import { VisualComparison } from "./VisualComparison";
import { QualityAuditReport } from "./QualityAuditReport";
import { AgentTerminalLogs } from "../pipeline/AgentTerminalLogs";
import { FigmaPagesLayersExplorer } from "./FigmaPagesLayersExplorer";
import { createProjectZip, triggerBrowserZipDownload } from "../../lib/packager/zip-builder";
import {
  Download,
  Eye,
  Code2,
  Columns,
  ShieldCheck,
  FileCode,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  Image as ImageIcon,
  RefreshCw,
  X,
  History,
  GitBranch,
  ExternalLink,
} from "lucide-react";

export interface ProjectExplorerProps {
  result: GenerationResult;
  onReset: () => void;
  logs: string[];
  onUpdateProject?: (request: GenerationRequest) => void;
  onSelectVersion?: (version: ProjectVersion) => void;
}

export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({
  result,
  onReset,
  logs,
  onUpdateProject,
  onSelectVersion,
}) => {
  const [activeTab, setActiveTab] = useState<
    "preview" | "figma-layers" | "screen-match" | "code" | "dev-assets" | "visual-qa" | "audit" | "logs"
  >("preview");

  const [selectedFile, setSelectedFile] = useState<GeneratedFile>(
    result.files.find((f) => f.path.includes("MetricCard.tsx")) || result.files[0]
  );

  const [isZipping, setIsZipping] = useState(false);
  const [availableVersions, setAvailableVersions] = useState<ProjectVersion[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatePrompt, setUpdatePrompt] = useState(
    "Improve table column sorting, add sticky header, and polish micro-interactions"
  );
  const [updateForceRefresh, setUpdateForceRefresh] = useState(false);

  // Fetch version history if projectId exists
  useEffect(() => {
    if (result.projectId) {
      fetch(`/api/projects/${result.projectId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.versions) {
            setAvailableVersions(data.versions);
          }
        })
        .catch((err) => console.warn("Failed to fetch project versions:", err));
    }
  }, [result.projectId, result.versionNumber]);

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      // Bundles clean React code without dev PNGs/SVGs
      const zipBlob = await createProjectZip(result.projectName, result.files);
      const vTag = result.versionNumber ? `-v${result.versionNumber}` : "";
      const filename = `${result.projectName.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}${vTag}.zip`;
      triggerBrowserZipDownload(zipBlob, filename);
    } catch (err) {
      console.error("Failed to generate zip:", err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadFigmaJson = () => {
    const docToExport = result.rawDocument || {
      id: "0:0",
      name: result.designName || result.projectName,
      type: "DOCUMENT",
      children: [],
    };
    const jsonStr = JSON.stringify(docToExport, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = result.projectName.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    a.href = url;
    a.download = `${safeName}-figma-document.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTriggerUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateProject) return;

    setIsUpdateModalOpen(false);
    onUpdateProject({
      ...result.request,
      projectId: result.projectId,
      versionNumber: (result.versionNumber || 1) + 1,
      changeSummary: updatePrompt,
      forceRefresh: updateForceRefresh,
      description: `${result.request.description}\n\nUpdate Requirements:\n${updatePrompt}`,
    });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] max-w-7xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl backdrop-blur-md pb-16">
      {/* Top Header Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                {result.projectName}
              </h2>

              {/* Version Badge or Dropdown */}
              {availableVersions.length > 1 ? (
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-full border border-sky-800/80 text-[11px]">
                  <GitBranch className="w-3 h-3 text-sky-400" />
                  <select
                    value={result.versionNumber || 1}
                    onChange={(e) => {
                      const vNum = Number(e.target.value);
                      const matched = availableVersions.find((v) => v.versionNumber === vNum);
                      if (matched && onSelectVersion) {
                        onSelectVersion(matched);
                      }
                    }}
                    className="bg-transparent text-sky-400 font-bold font-mono focus:outline-none cursor-pointer"
                  >
                    {availableVersions.map((v) => (
                      <option key={v.id} value={v.versionNumber} className="bg-slate-900 text-white">
                        v{v.versionNumber} ({v.changeSummary ? v.changeSummary.slice(0, 15) : "Version"})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-sky-950 text-sky-400 border border-sky-800">
                  v{result.versionNumber || 1}
                </span>
              )}

              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                PostgreSQL Saved
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {result.stats.totalFiles} Files • {result.stats.linesOfCode} Lines of Code •{" "}
              {result.stats.executionTimeMs}ms Build Time
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 hover:text-white bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-800/80 transition-colors shadow-sm"
            title="Open live app running on port 3001 in a new browser tab"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Port 3001</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>

          {onUpdateProject && (
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/80 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update Project</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Generation</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFigmaJson}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-sky-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
            title="Download complete Figma project file with all pages and layers as JSON"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Download Figma JSON</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-600/30 transition-all disabled:opacity-50"
            title="Download pure clean React code repository without dev images"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? "Bundling ZIP..." : `Download ZIP (v${result.versionNumber || 1})`}</span>
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex items-center px-6 bg-slate-950 border-b border-slate-800 text-xs shrink-0 overflow-x-auto scrollbar-none">
        {[
          { id: "preview" as const, label: "Live Preview", icon: Eye },
          {
            id: "figma-layers" as const,
            label: `Figma Pages & Layers (${result.rawDocument?.children?.length || result.stats.pagesCount || 1})`,
            icon: Layers,
          },
          { id: "screen-match" as const, label: "Screen Match Studio & AI Prompts", icon: Columns },
          { id: "code" as const, label: "Code & Project Explorer", icon: Code2 },
          { id: "dev-assets" as const, label: "Dev Assets (PNG/SVG)", icon: ImageIcon },
          { id: "visual-qa" as const, label: "Visual QA (Figma vs React)", icon: SlidersHorizontal },
          { id: "audit" as const, label: "Quality & A11y Audit", icon: ShieldCheck },
          { id: "logs" as const, label: "Agent Reasoning Logs", icon: FileCode },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? "border-sky-500 text-sky-400 bg-sky-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "preview" && (
          <InteractivePreview result={result} />
        )}

        {activeTab === "figma-layers" && (
          <FigmaPagesLayersExplorer result={result} />
        )}

        {activeTab === "screen-match" && (
          <ScreenMatchingStudio
            result={result}
            onUpdateProjectWithPrompt={(prompt) => {
              setUpdatePrompt(prompt);
              setIsUpdateModalOpen(true);
            }}
          />
        )}

        {activeTab === "code" && (
          <div className="flex h-full">
            {/* Sidebar File Tree */}
            <div className="w-72 bg-slate-900 border-r border-slate-800 overflow-y-auto shrink-0 scrollbar-thin scrollbar-thumb-slate-800">
              <FileTree
                files={result.files}
                selectedPath={selectedFile.path}
                onSelectFile={setSelectedFile}
              />
            </div>

            {/* Code Viewer */}
            <div className="flex-1 h-full min-w-0">
              <CodeViewer file={selectedFile} />
            </div>
          </div>
        )}

        {activeTab === "dev-assets" && (
          <DevAssetsInspector result={result} />
        )}

        {activeTab === "visual-qa" && (
          <VisualComparison comparison={result.visualComparison} />
        )}

        {activeTab === "audit" && (
          <QualityAuditReport audit={result.audit} />
        )}

        {activeTab === "logs" && (
          <div className="p-6 h-full bg-slate-950 overflow-y-auto">
            <AgentTerminalLogs logs={logs} />
          </div>
        )}
      </div>

      {/* Update Project & Bump Version Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Update Project • Create Version v{(result.versionNumber || 1) + 1}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Runs multi-agent refinement and saves the new version to PostgreSQL.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTriggerUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Update Instructions &amp; Prompt
                </label>
                <textarea
                  rows={3}
                  value={updatePrompt}
                  onChange={(e) => setUpdatePrompt(e.target.value)}
                  placeholder="e.g. Add dark mode toggle to header, add column sorting in Batch table..."
                  className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-100 placeholder-slate-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={updateForceRefresh}
                    onChange={(e) => setUpdateForceRefresh(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 w-3.5 h-3.5"
                  />
                  <span>Force re-sync latest changes from Figma REST API</span>
                </label>
                <p className="text-[10px] text-slate-500 pl-5.5">
                  Unchecked: Instantly reuses cached Figma AST from PostgreSQL (0 API calls consumed).
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/30 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Version v{(result.versionNumber || 1) + 1}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
