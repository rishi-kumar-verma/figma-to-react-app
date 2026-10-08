import { GeneratedFile, GenerationRequest } from "../types";
import { PlannedArchitectureOutput } from "./ui-architect-agent";
import { AnalyzedDesignOutput } from "./design-analyzer-agent";

export interface GeneratedCodeOutput {
  files: GeneratedFile[];
  linesOfCode: number;
  componentsCount: number;
  logs: string[];
}

export function runReactGeneratorAgent(
  planned: PlannedArchitectureOutput,
  analyzed: AnalyzedDesignOutput,
  request: GenerationRequest
): GeneratedCodeOutput {
  const logs: string[] = [];
  const extracted = analyzed.extractedDesign;
  const brand = extracted?.brandName || analyzed.brandName;
  const cat = extracted?.category || analyzed.category;
  const adminUser = extracted?.adminUser || "Administrator";
  const screens = extracted?.screens && extracted.screens.length > 0 ? extracted.screens : [];
  const metrics = extracted?.metrics && extracted.metrics.length > 0 ? extracted.metrics : [
    { id: "m-1", title: "Active Batches", value: "24", subtitle: "Live academic cohorts", trend: "+4 cohorts", isPositive: true },
    { id: "m-2", title: "Curriculum Nodes", value: "11,345", subtitle: "Physics, Chem, Maths DPP", trend: "+12.4%", isPositive: true },
    { id: "m-3", title: "Registered Students", value: "4,850", subtitle: "Active student portal logins", trend: "+18.2%", isPositive: true },
    { id: "m-4", title: "Partner Institutes", value: "18", subtitle: "100% SLA uptime", trend: "100% SLA", isPositive: true },
  ];
  const navItems = extracted?.navItems && extracted.navItems.length > 0 ? extracted.navItems : [
    { id: "batches", label: "Batch Management", icon: "Layers" },
    { id: "content", label: "Content Management", count: 11345, icon: "FileText" },
    { id: "users", label: "User Management", count: 4850, icon: "Users" },
    { id: "institutes", label: "Institute Management", count: 18, icon: "Building" },
    { id: "settings", label: "Settings", icon: "Settings" },
  ];

  const safeFramework = request.framework || "react";
  const safeLanguage = request.language || "typescript";
  const safeCat = cat || "saas";

  logs.push(`[ReactGeneratorAgent] Synthesizing React codebase for: "${brand}" (${safeCat.toUpperCase()})...`);
  logs.push(`[ReactGeneratorAgent] Target: ${safeFramework} + ${safeLanguage} | Tailwind Theme`);
  logs.push(`[ReactGeneratorAgent] Incorporating ${screens.length} Figma screens and ${metrics.length} telemetry metrics.`);

  const files: GeneratedFile[] = [];

  // 1. package.json
  const packageJson = JSON.stringify(
    {
      name: brand.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
      version: "1.0.0",
      private: true,
      description: request.description || `Generated enterprise UI for ${brand}`,
      scripts: {
        dev: request.framework === "nextjs" ? "next dev" : "vite",
        build: request.framework === "nextjs" ? "next build" : "vite build",
        test: "vitest run",
        lint: "eslint src --ext .ts,.tsx",
        format: "prettier --write 'src/**/*.{ts,tsx,css}'",
      },
      dependencies: {
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "lucide-react": "^0.475.0",
        clsx: "^2.1.1",
        "tailwind-merge": "^3.0.1",
        ...(request.framework === "nextjs" ? { next: "^15.1.7" } : {}),
      },
      devDependencies: {
        typescript: "^5.7.3",
        "@types/react": "^19.0.8",
        "@types/react-dom": "^19.0.3",
        tailwindcss: "^3.4.17",
        autoprefixer: "^10.4.20",
        postcss: "^8.5.2",
        vitest: "^3.0.5",
        "@testing-library/react": "^16.2.0",
      },
    },
    null,
    2
  );
  files.push({
    path: "package.json",
    content: packageJson,
    type: "config",
    size: packageJson.length,
  });

  // 2. Types
  const typesContent = `export type EntityStatus = "active" | "pending" | "completed" | "flagged";

export interface MetricItem {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  trend: string;
  isPositive: boolean;
}

export interface ScreenModel {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  type: "table" | "form" | "grid" | "tree";
  columns: string[];
  rows: Array<Record<string, string>>;
}

export interface NavItemModel {
  id: string;
  label: string;
  count?: number;
  icon?: string;
}

export interface UserSession {
  userId: string;
  displayName: string;
  role: string;
  organization: string;
}
`;
  files.push({
    path: "src/types/index.ts",
    content: typesContent,
    type: "config",
    size: typesContent.length,
  });

  // 3. MetricCard.tsx
  const metricCardContent = `import React from "react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend: string;
  isPositive: boolean;
  badgeLabel?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  isPositive,
  badgeLabel,
  icon,
}) => {
  return (
    <article
      role="region"
      aria-label={title}
      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
          {icon || <Activity className="w-4 h-4" aria-hidden="true" />}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>
        {badgeLabel && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {badgeLabel}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs">
        <span
          className={\`inline-flex items-center font-semibold \${
            isPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          }\`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
          )}
          {trend}
        </span>
        {subtitle && (
          <span className="text-slate-400 dark:text-slate-500 truncate">
            {subtitle}
          </span>
        )}
      </div>
    </article>
  );
};
`;
  files.push({
    path: "src/components/ui/MetricCard.tsx",
    content: metricCardContent,
    type: "component",
    size: metricCardContent.length,
  });

  // 4. AppHeader.tsx
  const appHeaderContent = `import React from "react";
import { Search, Bell, ShieldCheck, Plus } from "lucide-react";

export interface AppHeaderProps {
  onActionClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onActionClick,
  searchQuery = "",
  onSearchChange,
}) => {
  return (
    <header
      role="banner"
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            ${brand}
          </h1>
          <span className="text-[10px] px-2.5 py-0.5 font-bold uppercase rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400 border border-sky-300 dark:border-sky-800">
            ${cat}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
          <span>Figma AST Live Synthesized • ${adminUser}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <label htmlFor="search-input" className="sr-only">Search</label>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search batches, curriculum, records..."
            className="w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-transparent focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
          />
        </div>

        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500" />
        </button>

        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>New Entry</span>
        </button>
      </div>
    </header>
  );
};
`;
  files.push({
    path: "src/components/layout/AppHeader.tsx",
    content: appHeaderContent,
    type: "component",
    size: appHeaderContent.length,
  });

  // 5. AppSidebar.tsx
  const appSidebarContent = `import React from "react";
import { NavItemModel } from "../../types";
import { Layers, FileText, Users, Building, Package, Settings, Shield, Activity } from "lucide-react";

export interface AppSidebarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  navItems: NavItemModel[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ currentTab, onTabChange, navItems }) => {
  const getIcon = (id: string, iconName?: string) => {
    switch (id) {
      case "batches": return <Layers className="w-4 h-4" />;
      case "content": return <FileText className="w-4 h-4" />;
      case "users": return <Users className="w-4 h-4" />;
      case "institutes": return <Building className="w-4 h-4" />;
      case "packages": return <Package className="w-4 h-4" />;
      case "settings": return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <aside
      aria-label="Sidebar navigation"
      className="w-64 flex flex-col justify-between bg-slate-900 text-slate-300 border-r border-slate-800 p-4 min-h-screen shrink-0"
    >
      <div>
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold shadow-md">
            ${brand.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight truncate max-w-[140px]">${brand}</h2>
            <p className="text-[10px] uppercase font-bold text-sky-400">Production UI</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={\`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all \${
                  isActive
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }\`}
              >
                <div className="flex items-center gap-2.5">
                  {getIcon(item.id, item.icon)}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-1">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Figma-Synthesized</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          100% WCAG 2.1 AA accessible and strictly typed.
        </p>
      </div>
    </aside>
  );
};
`;
  files.push({
    path: "src/components/layout/AppSidebar.tsx",
    content: appSidebarContent,
    type: "component",
    size: appSidebarContent.length,
  });

  // 6. MetricsGrid.tsx
  const metricsGridContent = `import React from "react";
import { MetricCard } from "../ui/MetricCard";
import { MetricItem } from "../../types";

export interface MetricsGridProps {
  metrics: MetricItem[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard
          key={m.id}
          title={m.title}
          value={m.value}
          subtitle={m.subtitle}
          trend={m.trend}
          isPositive={m.isPositive}
        />
      ))}
    </section>
  );
};
`;
  files.push({
    path: "src/components/dashboard/MetricsGrid.tsx",
    content: metricsGridContent,
    type: "component",
    size: metricsGridContent.length,
  });

  // 7. DataTable.tsx
  const dataTableContent = `import React from "react";

export interface DataTableProps {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: Array<Record<string, string>>;
  searchQuery?: string;
  onRowClick?: (row: Record<string, string>) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  subtitle,
  columns,
  rows,
  searchQuery = "",
  onRowClick,
}) => {
  const filteredRows = rows.filter((r) =>
    columns.some((col) => (r[col] || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
          {filteredRows.length} Records Active
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" role="table">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              {columns.map((col) => (
                <th key={col} scope="col" className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[11px]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-slate-400">
                  No records match your query.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  {columns.map((col, colIdx) => {
                    const val = row[col] || "—";
                    const isStatus = col.toLowerCase().includes("status");
                    return (
                      <td
                        key={col}
                        className={\`py-3 px-4 \${
                          colIdx === 0
                            ? "font-bold text-slate-900 dark:text-white"
                            : "text-slate-600 dark:text-slate-300"
                        }\`}
                      >
                        {isStatus ? (
                          <span
                            className={\`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase \${
                              val.toLowerCase() === "active" || val.toLowerCase() === "fulfilled"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                : val.toLowerCase() === "pending" || val.toLowerCase() === "enrolling"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                : "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400"
                            }\`}
                          >
                            {val}
                          </span>
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
`;
  files.push({
    path: "src/components/dashboard/DataTable.tsx",
    content: dataTableContent,
    type: "component",
    size: dataTableContent.length,
  });

  // Helper to convert screen title into valid PascalCase component name
  const toPascalCase = (str: string) =>
    str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, (c) => c.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, "");

  // 7b. Dynamic Action Modal Component
  const actionModalContent = `import React, { useState } from "react";
import { X, Check } from "lucide-react";

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  title: string;
  fields?: string[];
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields = ["Name", "Category", "Status"],
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm">Create New {title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {fields.map((f) => (
            <div key={f}>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                {f}
              </label>
              <input
                type="text"
                required
                placeholder={"Enter " + f + "..."}
                value={formData[f] || ""}
                onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-sm flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
`;
  files.push({
    path: "src/components/ui/ActionModal.tsx",
    content: actionModalContent,
    type: "component",
    size: actionModalContent.length,
  });

  // 7c. DYNAMIC SCREEN COMPONENTS: Synthesize a dedicated component for EVERY screen in the project
  for (const screen of screens) {
    if (screen.id === "login") continue;
    const componentName = `${toPascalCase(screen.title)}View`;
    const screenColsJson = JSON.stringify(screen.columns || ["Name", "Category", "Metric", "Status"]);
    const screenRowsJson = JSON.stringify(screen.rows || []);

    const screenCode = `import React, { useState } from "react";
import { DataTable } from "../dashboard/DataTable";
import { ActionModal } from "../ui/ActionModal";
import { Plus } from "lucide-react";

export interface ${componentName}Props {
  searchQuery?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ searchQuery = "" }) => {
  const [columns] = useState<string[]>(${screenColsJson});
  const [rows, setRows] = useState<Array<Record<string, string>>>(${screenRowsJson});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRecord = (newRecord: Record<string, string>) => {
    setRows([newRecord, ...rows]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Screen Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              ${screen.badge || "Screen View"}
            </span>
            <span className="text-xs text-slate-400">❖ Figma AST Synced</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            ${screen.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ${screen.subtitle || `Interactive ${screen.title} component view`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add ${screen.title.split(" ")[0]}</span>
          </button>
        </div>
      </div>

      {/* Screen Records Data Table */}
      <DataTable
        title="${screen.title}"
        subtitle="${screen.subtitle || ""}"
        columns={columns}
        rows={rows}
        searchQuery={searchQuery}
      />

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRecord}
        title="${screen.title}"
        fields={columns.slice(0, 4)}
      />
    </div>
  );
};
`;

    files.push({
      path: `src/components/screens/${componentName}.tsx`,
      content: screenCode,
      type: "component",
      size: screenCode.length,
    });
    logs.push(`[ReactGeneratorAgent] Dynamic component generated: src/components/screens/${componentName}.tsx`);
  }

  // 8. Custom Hook: useDashboardData.ts
  const screensJson = JSON.stringify(screens, null, 2);
  const metricsJson = JSON.stringify(metrics, null, 2);
  const navItemsJson = JSON.stringify(navItems, null, 2);

  const hookContent = `import { useState } from "react";
import { MetricItem, ScreenModel, NavItemModel } from "../types";

export function useDashboardData() {
  const [navItems] = useState<NavItemModel[]>(${navItemsJson});
  const [metrics] = useState<MetricItem[]>(${metricsJson});
  const [screens] = useState<ScreenModel[]>(${screensJson});
  const [activeScreenId, setActiveScreenId] = useState<string>("${screens[0]?.id || navItems[0]?.id || "overview"}");

  const activeScreen = screens.find((s) => s.id === activeScreenId) || screens[0];

  return {
    navItems,
    metrics,
    screens,
    activeScreenId,
    setActiveScreenId,
    activeScreen,
  };
}
`;
  files.push({
    path: "src/hooks/useDashboardData.ts",
    content: hookContent,
    type: "hook",
    size: hookContent.length,
  });

  // 9. Dashboard Page
  const dashboardPageContent = `import React, { useState } from "react";
import { AppSidebar } from "../components/layout/AppSidebar";
import { AppHeader } from "../components/layout/AppHeader";
import { MetricsGrid } from "../components/dashboard/MetricsGrid";
import { DataTable } from "../components/dashboard/DataTable";
import { useDashboardData } from "../hooks/useDashboardData";

export const DashboardPage: React.FC = () => {
  const { navItems, metrics, screens, activeScreenId, setActiveScreenId, activeScreen } = useDashboardData();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <AppSidebar
        currentTab={activeScreenId}
        onTabChange={setActiveScreenId}
        navItems={navItems}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Key Metrics */}
          <MetricsGrid metrics={metrics} />

          {/* Screen Sub-Tabs */}
          {screens.length > 1 && (
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
              {screens.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveScreenId(s.id)}
                  className={\`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap \${
                    activeScreenId === s.id
                      ? "bg-sky-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }\`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}

          {/* Active Screen Data Table */}
          {activeScreen && (
            <div className="grid grid-cols-1 gap-6">
              <DataTable
                title={activeScreen.title}
                subtitle={activeScreen.subtitle}
                columns={activeScreen.columns}
                rows={activeScreen.rows}
                searchQuery={searchQuery}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
`;
  files.push({
    path: "src/pages/DashboardPage.tsx",
    content: dashboardPageContent,
    type: "page",
    size: dashboardPageContent.length,
  });

  // 10. ThinkIIT Authentication Portal (Matching Figma Login Screenshot)
  if (brand.toLowerCase().includes("thinkiit") || screens.some((s) => s.id === "login")) {
    const thinkiitPortalCode = `import React, { useState } from "react";

export interface ThinkIITLoginPortalProps {
  onLoginSuccess?: (role: "institute" | "student") => void;
  standalone?: boolean;
}

export const ThinkIITLoginPortal: React.FC<ThinkIITLoginPortalProps> = ({
  onLoginSuccess,
  standalone = true,
}) => {
  const [selectedRole, setSelectedRole] = useState<"institute" | "student">("institute");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFeedback(\`Authenticated as \${selectedRole === "institute" ? "Institute Administrator" : "Student"}\`);
    if (onLoginSuccess) {
      setTimeout(() => onLoginSuccess(selectedRole), 800);
    }
  };

  const handleGoogleLogin = () => {
    setLoginFeedback(\`Google SSO OAuth initiated for \${selectedRole}\`);
    if (onLoginSuccess) {
      setTimeout(() => onLoginSuccess(selectedRole), 800);
    }
  };

  return (
    <div
      className={\`w-full flex items-center justify-center p-4 sm:p-8 select-none transition-all \${
        standalone ? "min-h-screen" : "min-h-[580px] h-full"
      }\`}
      style={{
        background: "linear-gradient(135deg, #1ba3fc 0%, #2563eb 40%, #6366f1 70%, #581c87 100%)",
      }}
    >
      <div className="bg-white rounded-[28px] shadow-2xl p-8 sm:p-12 max-w-[840px] w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 relative animate-fadeIn">
        <div className="flex flex-col items-center justify-center w-full md:w-[45%] text-center py-4">
          <div className="relative w-36 h-36 flex items-center justify-center mb-3">
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="45" y1="35" x2="35" y2="25" stroke="#ec4899" strokeWidth="5" strokeLinecap="round" />
              <line x1="30" y1="58" x2="16" y2="58" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
              <line x1="80" y1="20" x2="80" y2="6" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
              <line x1="115" y1="35" x2="125" y2="25" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
              <line x1="130" y1="58" x2="144" y2="58" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" />
              <path
                d="M56 68 C56 46 104 46 104 68 C104 80 94 88 92 98 L68 98 C66 88 56 80 56 68 Z"
                fill="#fbbf24"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <path d="M80 52 L62 60 L80 68 L98 60 Z" fill="#ffffff" />
              <path d="M68 64 L68 73 C68 77 92 77 92 73 L92 64" fill="#ffffff" />
              <line x1="94" y1="62" x2="98" y2="72" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <rect x="68" y="98" width="24" height="4" rx="2" fill="#d97706" />
              <rect x="71" y="103" width="18" height="4" rx="2" fill="#b45309" />
              <path
                d="M50 114 C65 110 77 114 80 117 C83 114 95 110 110 114 L110 134 C95 130 83 134 80 137 C77 134 65 130 50 134 Z"
                fill="#0096c7"
              />
              <path d="M80 117 L80 137" stroke="#023e8a" strokeWidth="2" />
              <path d="M48 116 C64 112 76 116 78 119 L78 123 C64 120 50 123 48 123 Z" fill="#48cae4" />
              <path d="M112 116 C96 112 84 116 82 119 L82 123 C96 120 110 123 112 123 Z" fill="#48cae4" />
            </svg>
          </div>
          <div className="flex items-baseline justify-center tracking-tight select-none">
            <span className="text-4xl font-extrabold text-[#0096c7] font-sans lowercase">
              think
            </span>
            <span className="text-4xl font-extrabold text-[#f97316] font-sans uppercase">
              IIT
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Academic &amp; Institute Operations
          </p>
        </div>
        <div className="hidden md:block w-[1px] self-stretch bg-slate-200/90 my-2" />
        <div className="flex flex-col w-full md:w-[50%] space-y-5">
          <h2 className="text-xl font-normal text-slate-700 text-center tracking-tight">
            Login As
          </h2>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("institute")}
              className={\`px-7 py-2 rounded-full text-sm font-medium transition-all \${
                selectedRole === "institute"
                  ? "bg-[#0096c7] text-white shadow-md shadow-[#0096c7]/30 scale-[1.02]"
                  : "bg-white border border-slate-300 text-slate-600 hover:border-[#0096c7]"
              }\`}
            >
              Institute
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={\`px-7 py-2 rounded-full text-sm font-medium transition-all \${
                selectedRole === "student"
                  ? "bg-[#0096c7] text-white shadow-md shadow-[#0096c7]/30 scale-[1.02]"
                  : "bg-white border border-slate-300 text-[#0096c7] hover:border-[#0096c7]"
              }\`}
            >
              Student
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label htmlFor="auth-email" className="sr-only">Email ID</label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email ID"
                className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-[#0096c7] text-slate-800 placeholder-slate-400 text-sm focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="sr-only">Password</label>
              <input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-[#0096c7] text-slate-800 placeholder-slate-400 text-sm focus:outline-none transition-colors"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#0096c7] hover:bg-[#0077b6] text-white font-medium text-sm shadow-md shadow-[#0096c7]/25 hover:shadow-lg transition-all active:scale-[0.99]"
              >
                Login
              </button>
            </div>
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setLoginFeedback("Password reset link sent to your registered address.")}
                className="text-xs font-semibold text-[#0096c7] hover:underline transition-colors"
              >
                Forget Password?
              </button>
            </div>
            <div className="flex items-center gap-3 my-2 text-xs text-slate-400">
              <div className="h-[1px] bg-slate-200 flex-1" />
              <span>or</span>
              <div className="h-[1px] bg-slate-200 flex-1" />
            </div>
            <div className="flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-700">
              <span>Quick Login By</span>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="px-6 py-1.5 rounded-full bg-[#c5221f] hover:bg-[#a51d1a] text-white font-medium text-xs transition-colors shadow-sm active:scale-95"
              >
                Google
              </button>
            </div>
            {loginFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700 text-center font-medium animate-fadeIn">
                {loginFeedback}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
`;
    files.push({
      path: "src/components/auth/ThinkIITLoginPortal.tsx",
      content: thinkiitPortalCode,
      type: "component",
      size: thinkiitPortalCode.length,
    });
  }

  // 11. Root App Component
  const isThinkIITBrand = brand.toLowerCase().includes("thinkiit") || screens.some((s) => s.id === "login");
  const appTsxContent = `import React, { useState } from "react";
${isThinkIITBrand ? `import { ThinkIITLoginPortal } from "./components/auth/ThinkIITLoginPortal";` : ""}
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(${isThinkIITBrand ? "false" : "true"});
  const [role, setRole] = useState<"institute" | "student">("institute");

  ${
    isThinkIITBrand
      ? `if (!isAuthenticated) {
    return (
      <ThinkIITLoginPortal
        onLoginSuccess={(selectedRole) => {
          setRole(selectedRole);
          setIsAuthenticated(true);
        }}
        standalone={true}
      />
    );
  }`
      : ""
  }

  return (
    <div className="min-h-screen">
      <DashboardPage />
    </div>
  );
}
`;
  files.push({
    path: "src/App.tsx",
    content: appTsxContent,
    type: "component",
    size: appTsxContent.length,
  });

  // 10. Unit Test
  const testContent = `import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MetricCard } from "../../src/components/ui/MetricCard";

describe("MetricCard Component for ${brand}", () => {
  it("renders metric title and value with proper accessibility attributes", () => {
    render(
      <MetricCard
        title="Primary Indicator"
        value="$1,248"
        subtitle="+12% growth"
        trend="12%"
        isPositive={true}
      />
    );

    expect(screen.getByRole("region", { name: /primary indicator/i })).toBeDefined();
    expect(screen.getByText("$1,248")).toBeDefined();
  });
});
`;
  files.push({
    path: "tests/components/MetricCard.test.tsx",
    content: testContent,
    type: "test",
    size: testContent.length,
  });

  // 11. README.md
  const readmeContent = `# ${brand}

> Generated by **Antigravity AI Agent for Figma → Production-Ready React UI**

## Architecture & Enterprise Standards
- **Figma Document**: ${analyzed.brandName}
- **Category**: ${safeCat.toUpperCase()}
- **Framework**: ${safeFramework.toUpperCase()} with ${safeLanguage.toUpperCase()}
- **Styling**: Tailwind CSS with Semantic Design Tokens (Primary: ${analyzed.tokens.colors.primary})
- **Accessibility**: WCAG 2.1 AA Compliant with ARIA landmarks
- **Testing**: Vitest + React Testing Library scaffolded

## Quick Start
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Run test suites
npm run test
\`\`\`
`;
  files.push({
    path: "README.md",
    content: readmeContent,
    type: "config",
    size: readmeContent.length,
  });

  const totalLines = files.reduce((acc, f) => acc + f.content.split("\n").length, 0);

  logs.push(`[ReactGeneratorAgent] Synthesized ${files.length} production files (${totalLines} lines of TypeScript).`);
  logs.push(`[ReactGeneratorAgent] Embedded brand "${brand}" and category ${cat} into modular components.`);

  return {
    files,
    linesOfCode: totalLines,
    componentsCount: files.filter((f) => f.type === "component").length,
    logs,
  };
}
