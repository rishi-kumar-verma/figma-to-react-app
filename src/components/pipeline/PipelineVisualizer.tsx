import React from "react";
import { AgentStep } from "../../lib/types";
import {
  CheckCircle2,
  Loader2,
  Clock,
  Layers,
  Component,
  Network,
  Code2,
  ShieldCheck,
  PackageCheck,
  Bot,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { AgentTerminalLogs } from "./AgentTerminalLogs";

export interface PipelineVisualizerProps {
  steps: AgentStep[];
  logs: string[];
  projectName: string;
  errorMessage?: string;
  onBackToDashboard?: () => void;
  onCancel?: () => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  steps,
  logs,
  projectName,
  errorMessage,
  onBackToDashboard,
}) => {
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const getStepIcon = (id: AgentStep["id"]) => {
    switch (id) {
      case "figma-parsing":
        return <Layers className="w-5 h-5" />;
      case "component-mapping":
        return <Component className="w-5 h-5" />;
      case "route-generation":
        return <Network className="w-5 h-5" />;
      case "code-generation":
        return <Code2 className="w-5 h-5" />;
      case "review-agent":
        return <ShieldCheck className="w-5 h-5" />;
      case "packaging":
        return <PackageCheck className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {errorMessage && (
        <div className="p-5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-white">Pipeline Execution Stopped</h4>
              <p className="mt-0.5 text-rose-300 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="self-start sm:self-center shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Edit / Fix</span>
            </button>
          )}
        </div>
      )}

      {/* Header & Overall Progress */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Bot className="w-4 h-4" />
              <span>Multi-Agent Orchestrator Active</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Generating: {projectName}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">
              {completedCount} of {steps.length} Agents Completed
            </span>
            <span className="text-sm font-bold text-sky-400 font-mono">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {completedCount === steps.length && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200 shadow-xl animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <h4 className="font-bold text-white text-sm">🟢 Generated Project Live on Port 3001</h4>
                <p className="text-[11px] text-emerald-300">All dynamic components synthesized & executing in real-time</p>
              </div>
            </div>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Live App (http://localhost:3001)</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </a>
          </div>
        )}
      </div>

      {/* Step Cards Grid */}
      <div className="space-y-3">
        {steps.map((step) => {
          const isCompleted = step.status === "completed";
          const isRunning = step.status === "running";
          const isPending = step.status === "idle";

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                isRunning
                  ? "bg-sky-950/30 border-sky-500 shadow-lg ring-1 ring-sky-500/50"
                  : isCompleted
                  ? "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  : "bg-slate-950/40 border-slate-800/60 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isCompleted
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                        : isRunning
                        ? "bg-sky-900/60 text-sky-400 border border-sky-700 animate-pulse"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {getStepIcon(step.id)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Step {step.stepNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <span className="text-sky-400 font-medium">{step.agentName}</span>
                      <span className="mx-1.5 text-slate-600">•</span>
                      <span>{step.role}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {step.durationMs !== undefined && (
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {step.durationMs}ms
                    </span>
                  )}

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  )}

                  {isRunning && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-950/60 text-sky-400 border border-sky-800">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing...</span>
                    </span>
                  )}

                  {step.status === "error" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/60 text-rose-400 border border-rose-800">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Failed</span>
                    </span>
                  )}

                  {isPending && (
                    <span className="text-xs text-slate-500 font-medium px-2 py-0.5 rounded-full bg-slate-800/60">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-details if completed */}
              {step.details && step.details.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 pl-11 text-xs text-slate-300 space-y-1 font-sans">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-400">
                      <span className="text-sky-400 font-bold leading-none mt-1">•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time Agent Log Streamer */}
      <AgentTerminalLogs logs={logs} />
    </div>
  );
};
