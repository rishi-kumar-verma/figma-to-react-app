import React, { useState } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  Search,
  Plus,
  Bell,
  Stethoscope,
  Activity,
  Heart,
  Wind,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CalendarClock,
  Users,
  Settings,
  X,
  TrendingUp,
  Layers,
  Sparkles,
  ShoppingBag,
  Cpu,
  FileText,
  Building,
  Package,
  ExternalLink,
  RefreshCw,
  Maximize2,
  Minimize2,
  Play,
  Globe,
} from "lucide-react";
import { GenerationResult } from "../../lib/types";

export interface InteractivePreviewProps {
  result: GenerationResult;
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({
  result,
}) => {
  const extracted = result.extractedDesign;
  const brand = extracted?.brandName || result.designName || result.projectName;
  const cat = extracted?.category || result.primaryCategory || "healthcare";
  const adminUser = extracted?.adminUser || "Administrator";
  const screens = extracted?.screens || [];

  const [runnerMode, setRunnerMode] = useState<"port3001" | "sandbox">("port3001");
  const [isPort3001Active, setIsPort3001Active] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  React.useEffect(() => {
    fetch("/api/live-runner")
      .then((r) => r.json())
      .then((d) => {
        setIsPort3001Active(d.isRunning);
      })
      .catch(() => setIsPort3001Active(false));
  }, []);

  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(
    screens.find((s) => s.id !== "login")?.id || screens[0]?.id || "overview"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const currentScreen = screens.find((s) => s.id === activeTab) || screens[0];

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "w-full";
    }
  };

  // Dynamic Navigation
  const getNavLinks = () => {
    if (extracted?.navItems && extracted.navItems.length > 0) {
      return extracted.navItems.map((item) => {
        let Icon = Activity;
        const idLower = item.id.toLowerCase();
        if (idLower.includes("batch")) Icon = Layers;
        else if (idLower.includes("content") || idLower.includes("doc")) Icon = FileText;
        else if (idLower.includes("user") || idLower.includes("student")) Icon = Users;
        else if (idLower.includes("institute") || idLower.includes("license")) Icon = Building;
        else if (idLower.includes("package")) Icon = Package;
        else if (idLower.includes("setting")) Icon = Settings;
        return {
          id: item.id,
          label: item.label,
          count: item.count,
          icon: Icon,
        };
      });
    }

    if (cat === "fintech") {
      return [
        { id: "overview", label: "Portfolio", icon: TrendingUp },
        { id: "markets", label: "Markets", icon: Activity, count: 8 },
        { id: "transactions", label: "Ledger", icon: Layers },
        { id: "settings", label: "Security", icon: Settings },
      ];
    }
    if (cat === "ecommerce") {
      return [
        { id: "overview", label: "Catalog", icon: ShoppingBag },
        { id: "orders", label: "Orders", icon: CalendarClock, count: 12 },
        { id: "customers", label: "Customers", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
      ];
    }
    if (cat === "healthcare" || result.request.presetId === "healthcare") {
      return [
        { id: "overview", label: "Overview", icon: Activity },
        { id: "appointments", label: "Appointments", icon: CalendarClock, count: 4 },
        { id: "patients", label: "Patients", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
      ];
    }
    // SaaS / General
    return [
      { id: "overview", label: "Overview", icon: Activity },
      { id: "analytics", label: "Analytics", icon: TrendingUp, count: 6 },
      { id: "records", label: "Records", icon: Layers },
      { id: "settings", label: "Settings", icon: Settings },
    ];
  };

  // Dynamic Metrics
  const getMetrics = () => {
    if (extracted?.metrics && extracted.metrics.length > 0) {
      return extracted.metrics;
    }
    if (cat === "fintech") {
      return [
        { id: "1", title: "Assets Under Management", value: "$2,845,920", subtitle: "+18.4% APY", trend: "18.4%", isPositive: true },
        { id: "2", title: "24h Trading Profit", value: "+$34,210", subtitle: "Optimal volume", trend: "4.8%", isPositive: true },
        { id: "3", title: "Margin Utilization", value: "62.4%", subtitle: "Risk Score: Low", trend: "2.1%", isPositive: false },
        { id: "4", title: "Execution Latency", value: "11 ms", subtitle: "-4ms faster", trend: "26%", isPositive: true },
      ];
    }
    if (cat === "ecommerce") {
      return [
        { id: "1", title: "Gross Merchandise Value", value: "$184,200", subtitle: "+14.2% this month", trend: "14.2%", isPositive: true },
        { id: "2", title: "Fulfilled Orders", value: "1,432", subtitle: "+8% growth", trend: "8.1%", isPositive: true },
        { id: "3", title: "Cart Conversion", value: "3.84%", subtitle: "Above industry avg", trend: "0.6%", isPositive: true },
        { id: "4", title: "Return Rate", value: "1.2%", subtitle: "Within target threshold", trend: "0.2%", isPositive: true },
      ];
    }
    if (cat === "healthcare" || result.request.presetId === "healthcare") {
      return [
        { id: "1", title: "Total Admitted Patients", value: "1,248", subtitle: "+12% vs last month", trend: "12.4%", isPositive: true },
        { id: "2", title: "Surgical Success Rate", value: "99.4%", subtitle: "Optimal recovery", trend: "0.8%", isPositive: true },
        { id: "3", title: "ICU Bed Occupancy", value: "82%", subtitle: "4 beds open", trend: "2.1%", isPositive: false },
        { id: "4", title: "Average Triage Wait", value: "14 min", subtitle: "-4 mins faster", trend: "22%", isPositive: true },
      ];
    }
    return [
      { id: "1", title: "Monthly Recurring Revenue", value: "$92,400", subtitle: "+12.4% MoM growth", trend: "12.4%", isPositive: true },
      { id: "2", title: "Active Workspaces", value: "1,894", subtitle: "+110 this week", trend: "6.2%", isPositive: true },
      { id: "3", title: "Platform SLA Uptime", value: "99.98%", subtitle: "All regions healthy", trend: "0.01%", isPositive: true },
      { id: "4", title: "API Response Latency", value: "42 ms", subtitle: "-12ms improvement", trend: "14%", isPositive: true },
    ];
  };

  // Dynamic Table Data
  const getLegacyTableRows = (): Array<Record<string, string>> => {
    if (cat === "fintech") {
      return [
        { "Entity / Title": "BTC / USD Perpetual", "Category": "Crypto", "Metric": "$68,410.00", "Status": "Active" },
        { "Entity / Title": "ETH / USDT Spot", "Category": "Crypto", "Metric": "$3,540.25", "Status": "Active" },
        { "Entity / Title": "NVDA Option Spread", "Category": "Equities", "Metric": "$142.80", "Status": "Executed" },
        { "Entity / Title": "SOL Staking Yield", "Category": "DeFi", "Metric": "$182.40", "Status": "Active" },
      ];
    }
    if (cat === "ecommerce") {
      return [
        { "Entity / Title": "Air Zoom Performance Runners", "Category": "Footwear", "Metric": "$160.00", "Status": "Fulfilled" },
        { "Entity / Title": "Pro Noise-Cancelling Headphones", "Category": "Electronics", "Metric": "$299.00", "Status": "Pending" },
        { "Entity / Title": "Tactile Mechanical Keyboard", "Category": "Accessories", "Metric": "$129.00", "Status": "Fulfilled" },
        { "Entity / Title": "Ultra-Light Carbon Daypack", "Category": "Gear", "Metric": "$89.50", "Status": "Active" },
      ];
    }
    if (cat === "healthcare" || result.request.presetId === "healthcare") {
      return [
        { "Entity / Title": "Eleanor Vance (Bed 4A)", "Category": "Cardiology", "Metric": "09:30 AM", "Status": "Urgent" },
        { "Entity / Title": "Marcus Sterling (ICU 2)", "Category": "Trauma Surgery", "Metric": "10:15 AM", "Status": "Emergency" },
        { "Entity / Title": "Sophia Hernandez (ER 1)", "Category": "Neurology", "Metric": "11:00 AM", "Status": "Routine" },
        { "Entity / Title": "David Miller (Room 12)", "Category": "Orthopedics", "Metric": "01:30 PM", "Status": "Routine" },
      ];
    }
    return [
      { "Entity / Title": "Enterprise Tenant Pipeline", "Category": "Enterprise", "Metric": "Tier 1 Dedicated", "Status": "Active" },
      { "Entity / Title": "Primary Database Cluster Sync", "Category": "Infrastructure", "Metric": "Sync Complete", "Status": "Active" },
      { "Entity / Title": "OAuth Gateway Authentication", "Category": "Security", "Metric": "Zero Failures", "Status": "Active" },
      { "Entity / Title": "Worker Queue Job Processor", "Category": "Compute", "Metric": "1,240 jobs/min", "Status": "Active" },
    ];
  };

  let tableColumns: string[] = [];
  let tableRowsData: Array<Record<string, string>> = [];

  if (currentScreen && currentScreen.columns && currentScreen.columns.length > 0) {
    tableColumns = currentScreen.columns;
    tableRowsData = currentScreen.rows || [];
  } else {
    tableColumns = ["Entity / Title", "Category", "Metric", "Status"];
    tableRowsData = getLegacyTableRows();
  }

  const renderedRows = tableRowsData.filter((r) => {
    if (!searchQuery.trim()) return true;
    return Object.values(r).some((val) =>
      val.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div
      className={`flex flex-col bg-slate-950 transition-all ${
        isMaximized ? "fixed inset-0 z-50 overflow-y-auto" : "flex-1 min-h-[850px]"
      }`}
    >
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {/* Runner Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setRunnerMode("port3001")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                runnerMode === "port3001"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>⚡ Live Port 3001 Runner</span>
            </button>
            <button
              type="button"
              onClick={() => setRunnerMode("sandbox")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                runnerMode === "sandbox"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>⚛️ In-Memory Sandbox</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-slate-400 font-mono font-medium truncate max-w-xs">{brand}</span>
            {isPort3001Active && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <span>🟢 Port 3001 Live</span>
              </span>
            )}
          </div>
        </div>

        {/* Viewport, Live Server Actions & Theme controls */}
        <div className="flex items-center gap-2.5">
          {runnerMode === "port3001" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIframeKey((k) => k + 1)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors cursor-pointer"
                title="Reload live app on port 3001"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Reload</span>
              </button>

              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition-all"
                title="Open http://localhost:3001 in a new browser window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Live App</span>
              </a>
            </div>
          )}

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === "desktop"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Desktop (1440px)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === "tablet"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === "mobile"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title={isMaximized ? "Exit fullscreen view" : "Maximize to full screen"}
          >
            {isMaximized ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Maximize View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Frame Container */}
      {runnerMode === "port3001" ? (
        /* PORT 3001 LIVE APPLICATION RUNNER (Unclipped, Full Viewport) */
        <div className="flex-1 w-full bg-[#070b14] flex flex-col p-3 sm:p-5 min-h-[900px]">
          <div className="w-full flex-1 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0b1120] flex flex-col min-h-[850px]">
            <div className="bg-[#0d1424] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-400 font-bold">http://localhost:3001</span>
                <span className="text-slate-600">•</span>
                <span>Active Live Development Server</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Viewport: {viewport.toUpperCase()}</span>
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1 shadow-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in Browser</span>
                </a>
              </div>
            </div>
            <iframe
              key={iframeKey}
              src="http://localhost:3001"
              title="Live Generated App on Port 3001"
              className="w-full flex-1 border-0 min-h-[800px] bg-[#070b14]"
            />
          </div>
        </div>
      ) : (
        /* DIRECT SANDBOX COMPONENT (Full Natural Height, Unclipped) */
        <div className="flex-1 p-4 md:p-6 flex justify-center bg-slate-950/80 overflow-y-auto">
          <div
            className={`${getViewportWidth()} w-full transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-700/60 bg-white ${
              isDarkMode ? "dark bg-slate-950 text-slate-100" : "text-slate-900"
            }`}
          >
            <div className="w-full flex flex-col md:flex-row min-h-screen">
            {/* Sidebar */}
            <aside
              className={`${
                viewport === "mobile" ? "w-full flex-row py-2" : "w-60 flex-col py-4"
              } bg-slate-900 text-slate-300 border-r border-slate-800 px-4 shrink-0 flex justify-between`}
            >
              <div className="w-full">
                <div className="flex items-center gap-2.5 px-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold shadow-md">
                    {brand.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight leading-none truncate max-w-[130px]">
                      {brand}
                    </h3>
                    <p className="text-[9px] uppercase font-bold text-sky-400 tracking-wider mt-0.5">
                      {cat}
                    </p>
                  </div>
                </div>

                <nav
                  className={`${
                    viewport === "mobile" ? "flex flex-wrap gap-1" : "space-y-1"
                  }`}
                >
                  {getNavLinks().map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-sky-600 text-white shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </div>
                        {tab.count && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-bold">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Stage */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">
              {/* Header */}
              <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {brand}
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Active Session • Figma Synthesized</span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter records..."
                      className="pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-slate-100 w-36 sm:w-48"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsActionModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">New Action</span>
                  </button>
                </div>
              </header>

              {/* Main Content Area (Unclipped, Full Natural Height) */}
              <div className="p-4 md:p-8 space-y-6 flex-1 pb-32">
                {/* Metric Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {getMetrics().map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {m.title}
                        </span>
                        <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                          <Activity className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                        {m.value}
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-[11px]">
                        <span
                          className={`inline-flex items-center font-bold ${
                            m.isPositive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {m.isPositive ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {m.trend}
                        </span>
                        <span className="text-slate-400 truncate">{m.subtitle}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Screen Sub-Tabs */}
                {screens.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {screens.map((screen) => (
                      <button
                        key={screen.id}
                        type="button"
                        onClick={() => setActiveTab(screen.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          activeTab === screen.id
                            ? "bg-sky-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {screen.title}
                      </button>
                    ))}
                  </div>
                )}

                {/* Primary Data Table */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {currentScreen ? currentScreen.title : "Active Entity Records"} ({renderedRows.length})
                      </h4>
                      {currentScreen?.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {currentScreen.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      Live Feed
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                          {tableColumns.map((col) => (
                            <th key={col} className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {renderedRows.length === 0 ? (
                          <tr>
                            <td colSpan={tableColumns.length} className="py-8 text-center text-slate-400">
                              No records match your query.
                            </td>
                          </tr>
                        ) : (
                          renderedRows.map((r, rowIdx) => (
                            <tr
                              key={rowIdx}
                              onClick={() => setActionAlert(`Selected: ${Object.values(r)[0]}`)}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                            >
                              {tableColumns.map((col, colIdx) => {
                                const val = r[col] || "—";
                                const isStatus = col.toLowerCase().includes("status");
                                return (
                                  <td
                                    key={col}
                                    className={`py-2.5 px-3 ${
                                      colIdx === 0
                                        ? "font-bold text-slate-800 dark:text-slate-100"
                                        : "text-slate-600 dark:text-slate-300"
                                    }`}
                                  >
                                    {isStatus ? (
                                      <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                          val.toLowerCase() === "active" || val.toLowerCase() === "fulfilled"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                            : val.toLowerCase() === "pending" || val.toLowerCase() === "enrolling"
                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                            : "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400"
                                        }`}
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

                {/* Click Alert */}
                {actionAlert && (
                  <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs flex items-center justify-between">
                    <span>{actionAlert}</span>
                    <button
                      type="button"
                      onClick={() => setActionAlert(null)}
                      className="text-sky-600 hover:text-sky-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Action Dialog */}
      {isActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                New Action for {brand}
              </h3>
              <button
                type="button"
                onClick={() => setIsActionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Record Identifier / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Entry"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsActionModalOpen(false)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsActionModalOpen(false);
                  setActionAlert("Action dispatched successfully!");
                }}
                className="px-4 py-1.5 text-xs rounded-xl bg-sky-600 text-white font-semibold shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
