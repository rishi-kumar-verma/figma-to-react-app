import { GenerationRequest } from "../types";
import { AnalyzedDesignOutput } from "./design-analyzer-agent";

export interface PlannedArchitectureOutput {
  routeStructure: Array<{
    path: string;
    pageName: string;
    componentFile: string;
    description: string;
  }>;
  folderTree: string[];
  typesList: string[];
  hooksList: string[];
  logs: string[];
}

export function runUiArchitectAgent(
  analyzed: AnalyzedDesignOutput,
  request: GenerationRequest
): PlannedArchitectureOutput {
  const logs: string[] = [];
  logs.push(`[UiArchitectAgent] Planning Architecture for "${analyzed.brandName}" (${analyzed.category.toUpperCase()})`);

  const isNextJs = request.framework === "nextjs";
  const cat = analyzed.category;

  let routes: Array<{ path: string; pageName: string; subPath: string; description: string }> = [];

  // Check if real screens exist in extractedDesign
  if (analyzed.extractedDesign?.screens && analyzed.extractedDesign.screens.length > 0) {
    routes = analyzed.extractedDesign.screens.map((screen, index) => {
      const slug = index === 0 ? "" : screen.id.toLowerCase();
      const cleanTitle = screen.title.replace(/[^a-zA-Z0-9]/g, "");
      return {
        path: slug ? `/${slug}` : "/",
        pageName: `${cleanTitle}Page`,
        subPath: slug,
        description: screen.subtitle || `${screen.title} interface synthesized from Figma frame`,
      };
    });

    if (!routes.some((r) => r.path === "/settings")) {
      routes.push({
        path: "/settings",
        pageName: "SettingsPage",
        subPath: "settings",
        description: "System administration and access control",
      });
    }
  } else if (cat === "fintech") {
    routes = [
      { path: "/", pageName: "PortfolioOverview", subPath: "", description: "Real-time assets, balance & performance" },
      { path: "/markets", pageName: "MarketDepthPage", subPath: "markets", description: "Trading depth, crypto pairs & candlesticks" },
      { path: "/transactions", pageName: "LedgerPage", subPath: "transactions", description: "Audit trail, transfers & execution history" },
      { path: "/wallets", pageName: "WalletsPage", subPath: "wallets", description: "Multi-currency accounts & custody vaults" },
      { path: "/settings", pageName: "SettingsPage", subPath: "settings", description: "Trading limits & security preferences" },
    ];
  } else if (cat === "ecommerce") {
    routes = [
      { path: "/", pageName: "CatalogOverview", subPath: "", description: "Product showcase, collections & top sellers" },
      { path: "/products", pageName: "ProductsPage", subPath: "products", description: "Inventory management & SKU catalog" },
      { path: "/orders", pageName: "OrdersPage", subPath: "orders", description: "Customer orders, tracking & fulfillment" },
      { path: "/customers", pageName: "CustomersPage", subPath: "customers", description: "Customer accounts & lifetime value" },
      { path: "/settings", pageName: "StoreSettings", subPath: "settings", description: "Payment gateways, taxes & shipping" },
    ];
  } else if (cat === "healthcare" || request.presetId === "healthcare") {
    routes = [
      { path: "/", pageName: "DashboardPage", subPath: "", description: "Primary clinical command center & analytics" },
      { path: "/appointments", pageName: "AppointmentsPage", subPath: "appointments", description: "Interactive doctor scheduling & consultation queue" },
      { path: "/patients", pageName: "PatientsPage", subPath: "patients", description: "Patient electronic health records (EHR)" },
      { path: "/telemetry", pageName: "TelemetryPage", subPath: "telemetry", description: "Real-time ICU vitals monitoring" },
      { path: "/settings", pageName: "SettingsPage", subPath: "settings", description: "Department HIPAA compliance & configs" },
    ];
  } else {
    // SaaS / Enterprise Dashboard / General
    routes = [
      { path: "/", pageName: "DashboardOverview", subPath: "", description: "Executive KPI command center & metrics" },
      { path: "/analytics", pageName: "AnalyticsPage", subPath: "analytics", description: "Funnel metrics, conversion & traffic" },
      { path: "/data", pageName: "DataRecordsPage", subPath: "data", description: "Searchable data records & activity logs" },
      { path: "/team", pageName: "TeamManagement", subPath: "team", description: "User permissions, roles & workspace members" },
      { path: "/settings", pageName: "SettingsPage", subPath: "settings", description: "Workspace preferences & billing configs" },
    ];
  }

  const routeStructure = routes.map((r) => ({
    path: r.path,
    pageName: r.pageName,
    componentFile: isNextJs
      ? r.subPath
        ? `app/${r.subPath}/page.tsx`
        : `app/page.tsx`
      : `src/pages/${r.pageName}.tsx`,
    description: r.description,
  }));

  const folderTree = [
    "src/",
    "src/components/",
    "src/components/layout/",
    "src/components/dashboard/",
    "src/components/ui/",
    "src/hooks/",
    "src/services/",
    "src/types/",
    "src/styles/",
    "tests/",
    "tests/components/",
  ];

  const typesList = [
    `${analyzed.brandName.replace(/[^a-zA-Z]/g, "")}Entity`,
    "MetricSummary",
    "RecordItem",
    "UserProfile",
  ];

  const hooksList = [
    "useDashboardData",
    "useTheme",
    "useSearchFilter",
  ];

  logs.push(`[UiArchitectAgent] Established ${routeStructure.length} routes matching "${analyzed.brandName}".`);
  logs.push(`[UiArchitectAgent] Scaffolding feature-sliced directory structure with strict typing.`);

  return {
    routeStructure,
    folderTree,
    typesList,
    hooksList,
    logs,
  };
}
