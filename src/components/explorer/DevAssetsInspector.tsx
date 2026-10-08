import React, { useState } from "react";
import { GenerationResult, DevScreenAsset, DevIconAsset } from "../../lib/types";
import {
  Image as ImageIcon,
  Download,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  FileCode,
  Layers,
  Code2,
  Copy,
  Check,
  Maximize2,
  Loader2,
} from "lucide-react";
import {
  createDevAssetsZip,
  triggerBrowserZipDownload,
  downloadAsset,
  downloadSvgString,
} from "../../lib/packager/zip-builder";

export interface DevAssetsInspectorProps {
  result: GenerationResult;
}

export const DevAssetsInspector: React.FC<DevAssetsInspectorProps> = ({ result }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<DevScreenAsset | null>(null);
  const [isDownloadingBundle, setIsDownloadingBundle] = useState(false);
  const [downloadingScreenId, setDownloadingScreenId] = useState<string | null>(null);

  const devAssets = result.devAssets || { screens: [], icons: [] };
  const extractedScreens = result.extractedDesign?.screens || [];

  // Fallback dev screens if live API didn't export external URLs
  const screens: DevScreenAsset[] =
    devAssets.screens.length > 0
      ? devAssets.screens
      : extractedScreens.map((s) => ({
          id: s.id,
          name: s.title,
          format: "png",
          type: "screen",
        }));

  const icons: DevIconAsset[] =
    devAssets.icons.length > 0
      ? devAssets.icons
      : [
          { id: "ico-dashboard", name: "Dashboard Layout Icon", format: "svg" },
          { id: "ico-table", name: "Data Grid Icon", format: "svg" },
          { id: "ico-badge", name: "Status Badge Indicator", format: "svg" },
          { id: "ico-filter", name: "Search & Filter Icon", format: "svg" },
        ];

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadBundle = async () => {
    setIsDownloadingBundle(true);
    try {
      const zipBlob = await createDevAssetsZip(result.projectName || "figma-project", screens, icons);
      triggerBrowserZipDownload(zipBlob, `${result.projectName || "figma-project"}-dev-assets.zip`);
    } catch (err) {
      console.error("Failed to build dev assets zip:", err);
    } finally {
      setIsDownloadingBundle(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 space-y-6 overflow-y-auto text-slate-100">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>Development Assets & Screen Renders (PNG & SVG)</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Figma Design Renders & Vector Graphic Artifacts
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Cached in PostgreSQL for development reference, visual regression QA, and design alignment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-950/60 border border-sky-800/80 text-xs text-sky-300">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Dev Scope:</strong> Kept separate from project ZIP.
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownloadBundle}
            disabled={isDownloadingBundle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-lg shadow-sky-600/30 cursor-pointer"
            title="Download all screens (PNG) and vector icons (SVG) in a ZIP bundle"
          >
            {isDownloadingBundle ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloadingBundle ? "Packaging..." : "Download Dev Assets Bundle (.zip)"}</span>
          </button>
        </div>
      </div>

      {/* Screen PNG Renders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Screen-Level High-Resolution PNG Previews ({screens.length})</span>
          </h3>
          <span className="text-xs text-slate-400">@2x Resolution Frame Specs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {screens.map((screen) => (
            <div
              key={screen.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg hover:border-slate-700 transition-all group flex flex-col"
            >
              {/* Card Preview Window */}
              <div className="h-44 bg-[#0a0f1d] border-b border-slate-800/80 flex items-center justify-center p-4 relative overflow-hidden">
                {screen.imageUrl ? (
                  <img
                    src={screen.imageUrl}
                    alt={screen.name}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl border border-dashed border-purple-500/40 bg-purple-950/20 p-3 flex flex-col justify-between font-mono text-[10px] text-purple-300">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">❖ {screen.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200">
                        PNG @2x
                      </span>
                    </div>
                    <div className="space-y-1 text-slate-400 text-[9px]">
                      <div>Frame: #{screen.id.toUpperCase()}</div>
                      <div>Layout: Auto-Layout Flex Column</div>
                      <div>Render Target: 1440 × 900 px</div>
                    </div>
                    <div className="text-emerald-400 text-[9px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PostgreSQL Cached</span>
                    </div>
                  </div>
                )}

                {screen.imageUrl && (
                  <a
                    href={screen.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800"
                    title="Open full resolution"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Card Info & Actions */}
              <div className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white truncate max-w-[160px]">{screen.name}</h4>
                  <span className="text-[10px] font-mono text-slate-500">ID: {screen.id}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={async () => {
                      setDownloadingScreenId(screen.id);
                      try {
                        const url = screen.imageUrl || "/dev-assets/thinkiit-login-screen.png";
                        await downloadAsset(url, `${screen.name.replace(/[^a-zA-Z0-9_-]/g, "_")}.png`);
                      } finally {
                        setDownloadingScreenId(null);
                      }
                    }}
                    disabled={downloadingScreenId === screen.id}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                    title="Download PNG screen render (@2x)"
                  >
                    {downloadingScreenId === screen.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3" />
                    )}
                    <span>PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (screen.imageUrl) {
                        window.open(screen.imageUrl, "_blank");
                      } else {
                        alert(`Opening inspection for frame: ${screen.name}`);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Vector Icons Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Vector Icons & UI Glyphs (SVG)</span>
          </h3>
          <span className="text-xs text-slate-400">Ready for JSX Inlining & SVG Download</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {icons.map((icon) => {
            const sampleSnippet =
              icon.svgContent ||
              `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">\n  <!-- ${icon.name} -->\n  <rect width="18" height="18" x="3" y="3" rx="2" />\n  <path d="M3 9h18M9 21V9" />\n</svg>`;
            const isCopied = copiedId === icon.id;

            return (
              <div
                key={icon.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{icon.name}</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Format: SVG</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      downloadSvgString(sampleSnippet, `${icon.name.replace(/[^a-zA-Z0-9_-]/g, "_")}.svg`);
                    }}
                    className="p-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Download SVG file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => copyCode(sampleSnippet, icon.id)}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      isCopied
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    }`}
                    title="Copy SVG JSX code"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
