import React, { useRef, useEffect } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export interface AgentTerminalLogsProps {
  logs: string[];
}

export const AgentTerminalLogs: React.FC<AgentTerminalLogsProps> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-black/90 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-xs">Agent Execution Stream & Reasoning</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
        </div>
        <button
          type="button"
          onClick={copyLogs}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Log"}</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className="p-4 h-64 overflow-y-auto space-y-1.5 text-slate-300 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {logs.length === 0 ? (
          <div className="text-slate-600 italic">Waiting for agent orchestration pipeline to initialize...</div>
        ) : (
          logs.map((log, index) => {
            const isError = log.includes("error") || log.includes("Error");
            const isAgent = log.startsWith("[");
            const isSuccess = log.includes("passed") || log.includes("PASSED") || log.includes("successfully");

            return (
              <div
                key={index}
                className={`leading-relaxed ${
                  isError
                    ? "text-rose-400"
                    : isSuccess
                    ? "text-emerald-300"
                    : isAgent
                    ? "text-sky-300"
                    : "text-slate-300"
                }`}
              >
                <span className="text-slate-600 select-none mr-2">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {log}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
