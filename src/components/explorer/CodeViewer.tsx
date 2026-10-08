import React, { useState } from "react";
import { GeneratedFile } from "../../lib/types";
import { Copy, Check, FileCode, Hash } from "lucide-react";

export interface CodeViewerProps {
  file: GeneratedFile;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);
  const lines = file.content.split("\n");

  const copyCode = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeBadge = (type: GeneratedFile["type"]) => {
    switch (type) {
      case "component":
        return "bg-sky-950/60 text-sky-400 border-sky-800";
      case "page":
        return "bg-indigo-950/60 text-indigo-400 border-indigo-800";
      case "hook":
        return "bg-amber-950/60 text-amber-400 border-amber-800";
      case "test":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-800";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-xs">
      {/* File Action Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <FileCode className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-200">{file.path}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getTypeBadge(
              file.type
            )}`}
          >
            {file.type}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] text-slate-500">
            {lines.length} lines • {(file.size / 1024).toFixed(1)} KB
          </span>
          <button
            type="button"
            onClick={copyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copied ? "Copied" : "Copy Code"}</span>
          </button>
        </div>
      </div>

      {/* Code Display with Line Numbers */}
      <div className="flex-1 overflow-auto p-4 flex gap-4 text-slate-300 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="select-none text-slate-600 text-right pr-2 border-r border-slate-800/80 font-mono">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        <pre className="flex-1 font-mono leading-6 overflow-x-auto whitespace-pre">
          <code>{file.content}</code>
        </pre>
      </div>
    </div>
  );
};
