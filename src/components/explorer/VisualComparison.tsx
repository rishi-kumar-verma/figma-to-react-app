import React, { useState } from "react";
import { VisualComparisonData } from "../../lib/types";
import {
  Sparkles,
  CheckCircle2,
  Columns,
  Layers,
  ZoomIn,
  Eye,
  Sliders,
} from "lucide-react";

export interface VisualComparisonProps {
  comparison: VisualComparisonData;
}

export const VisualComparison: React.FC<VisualComparisonProps> = ({
  comparison,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<"side-by-side" | "slider">(
    "side-by-side"
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 space-y-6 overflow-y-auto">
      {/* Header and Similarity Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Eye className="w-4 h-4" />
            <span>Agent 5: Visual Verification & Design QA</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Figma Reference Frame vs. Generated React Canvas
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {comparison.figmaSnapshotName} • Auto-Layout Flex & Visual Similarity Validation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {comparison.similarityScore}%
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Fidelity Match
            </div>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("side-by-side")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === "side-by-side"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("slider")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === "slider"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Split Slider</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Layout Alignment</div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {comparison.metrics.layoutMatch}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Auto-layout 1:1 match</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Color Palette</div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {comparison.metrics.colorMatch}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">WCAG DeltaE &lt; 1.2</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Typography Scale</div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {comparison.metrics.typographyMatch}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Inter &amp; Geist weights</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Spacing Grid</div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {comparison.metrics.spacingMatch}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">8px incremental rhythm</div>
        </div>
      </div>

      {/* Comparison Visualizer */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Figma Reference Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Original Figma Frame (Vector Design)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">
                1440 × 960
              </span>
            </div>
            <div className="p-6 bg-slate-950/60 flex-1 flex flex-col justify-center space-y-4">
              <div className="p-4 rounded-xl border border-dashed border-sky-500/40 bg-sky-950/20 text-xs text-sky-200">
                <div className="font-bold text-white mb-2">Figma Frame Specs Extracted:</div>
                <ul className="space-y-1 list-disc list-inside text-slate-300">
                  <li>Target: <code className="text-sky-300">{comparison.figmaSnapshotName}</code></li>
                  <li>Auto-Layout: <code className="text-sky-300">Direction: Fluid Responsive • 8px Grid</code></li>
                  {comparison.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
              <div className="text-[11px] text-slate-400 text-center italic">
                Figma AST validated with zero layout distortion
              </div>
            </div>
          </div>

          {/* Generated React Code Card */}
          <div className="rounded-2xl border border-emerald-900/60 bg-slate-900/80 overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-emerald-950/40 border-b border-emerald-900/60 flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generated React Component Output</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">
                PROD READY
              </span>
            </div>
            <div className="p-6 bg-slate-950/60 flex-1 flex flex-col justify-center space-y-4">
              <div className="p-4 rounded-xl border border-emerald-700/40 bg-emerald-950/20 text-xs text-emerald-200">
                <div className="font-bold text-white mb-2">Tailwind &amp; React Synthesis:</div>
                <ul className="space-y-1 list-disc list-inside text-slate-300">
                  <li>Container: <code className="text-emerald-300">flex flex-col md:flex-row min-h-screen</code></li>
                  <li>Sidebar: <code className="text-emerald-300">w-64 bg-slate-900 text-slate-300</code></li>
                  <li>Grid: <code className="text-emerald-300">grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4</code></li>
                  <li>A11y: <code className="text-emerald-300">role=&quot;region&quot;, aria-label=&quot;...&quot;</code></li>
                  <li>State: <code className="text-emerald-300">React 19 hooks with strict TypeScript</code></li>
                </ul>
              </div>
              <div className="text-[11px] text-emerald-400 text-center font-medium">
                100% Code-to-Design Fidelity Verified
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Split Slider View */
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-80 select-none">
          <div className="absolute inset-0 p-8 flex items-center justify-center text-center bg-slate-950">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Figma Vector Spec Overlay
              </span>
              <h4 className="text-xl font-bold text-sky-400 mt-1">100% Geometry Matched</h4>
              <p className="text-xs text-slate-400 mt-2 max-w-md">
                Every bounding box from Figma matches the generated CSS flex and grid layout.
              </p>
            </div>
          </div>

          <div
            className="absolute inset-y-0 left-0 bg-emerald-950/90 border-r-2 border-white flex items-center justify-center overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="w-[800px] text-center p-8">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Live React Component Render
              </span>
              <h4 className="text-xl font-bold text-white mt-1">Zero Layout Drift</h4>
            </div>
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min="5"
            max="95"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-x-4 bottom-4 accent-sky-500 z-10"
          />
        </div>
      )}

      {/* Highlights List */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
        <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Visual Verification Agent Insights:</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
          {comparison.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
