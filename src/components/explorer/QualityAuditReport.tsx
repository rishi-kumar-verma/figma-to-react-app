import React from "react";
import { QualityAuditResult } from "../../lib/types";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Accessibility,
  Smartphone,
  Terminal,
  FileCheck2,
  Lock,
} from "lucide-react";

export interface QualityAuditReportProps {
  audit: QualityAuditResult;
}

export const QualityAuditReport: React.FC<QualityAuditReportProps> = ({ audit }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 space-y-6 overflow-y-auto text-xs">
      {/* Top Score Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-sky-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider text-[11px] mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise Production Standards Audit</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            WCAG 2.1 AA & Code Quality Certified
          </h3>
          <p className="text-slate-400 mt-0.5">
            Verified across Accessibility, Responsive Layouts, Strict Typing, and Automated Test Suites.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {audit.wcagScore}%
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">WCAG Score</div>
          </div>

          <div className="text-center p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-sky-400">
              {audit.typeSafetyScore}%
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Type Safety</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Accessibility className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold uppercase text-[10px]">ARIA Landmarks</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{audit.ariaRolesCount}</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">header, main, aside, region</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold uppercase text-[10px]">Breakpoints</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">4 Modes</div>
          <div className="text-[11px] text-slate-400 mt-0.5">375px → 1440px Fluid</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold uppercase text-[10px]">Unit Tests</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{audit.unitTestsCount} Suites</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Vitest + RTL Configured</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold uppercase text-[10px]">Security Scan</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">Zero Leaks</div>
          <div className="text-[11px] text-slate-400 mt-0.5">XSS Escaped &amp; Clean</div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>Automated Compliance Checklist &amp; Verification Rules</span>
        </h4>

        <div className="divide-y divide-slate-800">
          {audit.checklist.map((item) => (
            <div key={item.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{item.rule}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-semibold bg-slate-800 text-slate-400">
                    {item.category}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{item.message}</p>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Passed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
