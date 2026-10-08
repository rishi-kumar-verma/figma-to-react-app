"use client";

import React, { useState } from "react";
import {
  GenerationRequest,
  GenerationResult,
  AgentStep,
  AgentStepId,
} from "@/src/lib/types";
import {
  INITIAL_PIPELINE_STEPS,
  runOrchestrationPipeline,
} from "@/src/lib/agents/orchestrator";
import { ProjectSetupForm } from "@/src/components/dashboard/ProjectSetupForm";
import { PipelineVisualizer } from "@/src/components/pipeline/PipelineVisualizer";
import { ProjectExplorer } from "@/src/components/explorer/ProjectExplorer";
import { ProjectsLibraryModal } from "@/src/components/dashboard/ProjectsLibraryModal";
import {
  Sparkles,
  Layers,
  Code2,
  Workflow,
  Github,
  Zap,
  Database,
} from "lucide-react";

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<
    "dashboard" | "pipeline" | "explorer"
  >("dashboard");

  const [activeRequest, setActiveRequest] = useState<GenerationRequest | null>(
    null
  );
  const [steps, setSteps] = useState<AgentStep[]>(INITIAL_PIPELINE_STEPS);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGlobalLibraryOpen, setIsGlobalLibraryOpen] = useState(false);

  const handleStartGeneration = async (request: GenerationRequest) => {
    setActiveRequest(request);
    setCurrentScreen("pipeline");
    setIsLoading(true);
    setErrorMessage(null);
    setLogs([]);
    setSteps(INITIAL_PIPELINE_STEPS.map((s) => ({ ...s, status: "idle", details: [] })));

    try {
      const generated = await runOrchestrationPipeline(
        request,
        (stepId: AgentStepId, updated: Partial<AgentStep>) => {
          setSteps((prev) =>
            prev.map((step) =>
              step.id === stepId ? { ...step, ...updated } : step
            )
          );
        },
        (logMessage: string) => {
          setLogs((prev) => [...prev, logMessage]);
        }
      );

      setResult(generated);
      // Brief pause to allow user to see 100% completion
      setTimeout(() => {
        setCurrentScreen("explorer");
        setIsLoading(false);
      }, 700);
    } catch (err: any) {
      console.error("Pipeline failure:", err);
      const msg = err?.message || "Unknown error occurred";
      setErrorMessage(msg);
      setSteps((prev) =>
        prev.map((s) =>
          s.status === "running" ? { ...s, status: "error" } : s
        )
      );
      setLogs((prev) => [
        ...prev,
        `[Orchestrator ERROR] Generation failed: ${msg}`,
      ]);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentScreen("dashboard");
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Application Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-tight">
                  FigmaToReact <span className="text-sky-400 font-mono">Agent</span>
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-950 text-sky-400 border border-sky-800">
                  ENTERPRISE v3.0
                </span>
              </div>
            </div>
          </div>

          {/* Screen Indicator Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCurrentScreen("dashboard")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                currentScreen === "dashboard"
                  ? "bg-slate-800 text-sky-400 border border-slate-700"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              1. Dashboard &amp; Specs
            </button>
            <span className="text-slate-700">→</span>
            <button
              type="button"
              disabled={!activeRequest}
              onClick={() => activeRequest && setCurrentScreen("pipeline")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                currentScreen === "pipeline"
                  ? "bg-slate-800 text-sky-400 border border-slate-700"
                  : "text-slate-500 hover:text-slate-300 disabled:opacity-40"
              }`}
            >
              2. Agent Pipeline
            </button>
            <span className="text-slate-700">→</span>
            <button
              type="button"
              disabled={!result}
              onClick={() => result && setCurrentScreen("explorer")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                currentScreen === "explorer"
                  ? "bg-slate-800 text-sky-400 border border-slate-700"
                  : "text-slate-500 hover:text-slate-300 disabled:opacity-40"
              }`}
            >
              3. Project Explorer &amp; Preview
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsGlobalLibraryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saved Projects</span>
            </button>

            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Agents Ready</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {currentScreen === "dashboard" && (
          <ProjectSetupForm
            onStartGeneration={handleStartGeneration}
            isLoading={isLoading}
            onOpenSavedProject={(savedResult) => {
              setResult(savedResult);
              setCurrentScreen("explorer");
            }}
          />
        )}

        {currentScreen === "pipeline" && (
          <PipelineVisualizer
            steps={steps}
            logs={logs}
            projectName={activeRequest?.projectName || "Enterprise App"}
            errorMessage={errorMessage || undefined}
            onBackToDashboard={() => {
              setCurrentScreen("dashboard");
              setErrorMessage(null);
            }}
          />
        )}

        {currentScreen === "explorer" && result && (
          <ProjectExplorer
            result={result}
            onReset={handleReset}
            logs={logs}
            onUpdateProject={handleStartGeneration}
            onSelectVersion={(ver) => setResult(ver.generationResult)}
          />
        )}
      </main>

      <ProjectsLibraryModal
        isOpen={isGlobalLibraryOpen}
        onClose={() => setIsGlobalLibraryOpen(false)}
        onOpenProject={(savedResult) => {
          setResult(savedResult);
          setCurrentScreen("explorer");
        }}
      />

      {/* Footer */}
      <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>
          AI Agent for Figma → Production-Ready React UI Generation • Built with Next.js, TypeScript, Tailwind &amp; Radix
        </p>
      </footer>
    </div>
  );
}
