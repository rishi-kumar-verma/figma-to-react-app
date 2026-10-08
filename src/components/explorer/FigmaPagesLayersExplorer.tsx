import React, { useState, useMemo } from "react";
import {
  Layers,
  FileCode,
  Download,
  Copy,
  Check,
  Search,
  ChevronRight,
  ChevronDown,
  Layout,
  Type,
  Maximize2,
  Box,
  Palette,
  ExternalLink,
  Sliders,
  Sparkles,
  Info,
  Folder,
  FolderOpen,
} from "lucide-react";
import { FigmaNode, GenerationResult } from "../../lib/types";

export interface FigmaPagesLayersExplorerProps {
  result: GenerationResult;
}

export const FigmaPagesLayersExplorer: React.FC<FigmaPagesLayersExplorerProps> = ({
  result,
}) => {
  const rawDoc = result.rawDocument;

  // Extract all pages (CANVAS nodes or top-level children)
  const pages: FigmaNode[] = useMemo(() => {
    if (rawDoc && rawDoc.children && rawDoc.children.length > 0) {
      const canvasNodes = rawDoc.children.filter((c) => c.type === "CANVAS");
      if (canvasNodes.length > 0) return canvasNodes;
      return rawDoc.children;
    }
    // Fallback: If rawDocument is not present, construct from extracted screens
    const screens = result.extractedDesign?.screens || [];
    return screens.map((screen, idx) => ({
      id: screen.id || `page-${idx + 1}`,
      name: screen.title,
      type: "CANVAS",
      children: [
        {
          id: `frame-${screen.id}`,
          name: `${screen.title} Frame`,
          type: "FRAME",
          layoutMode: "VERTICAL",
          absoluteBoundingBox: { x: 0, y: 0, width: 1440, height: 900 },
          children: (screen.rows || []).slice(0, 8).map((row, rIdx) => ({
            id: `row-${screen.id}-${rIdx}`,
            name: String(Object.values(row)[0] || `Row ${rIdx + 1}`),
            type: "FRAME",
            layoutMode: "HORIZONTAL",
            children: Object.entries(row).map(([k, v], cIdx) => ({
              id: `cell-${screen.id}-${rIdx}-${cIdx}`,
              name: `${k}: ${v}`,
              type: "TEXT",
              characters: String(v),
            })),
          })),
        },
      ],
    }));
  }, [rawDoc, result.extractedDesign]);

  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [selectedNode, setSelectedNode] = useState<FigmaNode | null>(null);
  const [searchLayer, setSearchLayer] = useState<string>("");
  const [pageSearch, setPageSearch] = useState<string>("");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [isCopiedDoc, setIsCopiedDoc] = useState<boolean>(false);
  const [isCopiedNode, setIsCopiedNode] = useState<boolean>(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const activePage = pages[selectedPageIndex] || pages[0];

  // Auto-expand first level of active page
  React.useEffect(() => {
    if (activePage) {
      const exp: Record<string, boolean> = { [activePage.id]: true };
      if (activePage.children) {
        for (const child of activePage.children) {
          exp[child.id] = true;
          if (child.children) {
            for (const sub of child.children.slice(0, 3)) {
              exp[sub.id] = true;
            }
          }
        }
      }
      setExpandedNodes(exp);
      setSelectedNode(activePage.children?.[0] || activePage);
    }
  }, [activePage?.id]);

  // Overall Document Stats
  const docStats = useMemo(() => {
    let totalLayers = 0;
    let framesCount = 0;
    let textCount = 0;
    let vectorCount = 0;
    let componentCount = 0;

    function countNodes(n: FigmaNode) {
      totalLayers++;
      if (n.type === "FRAME") framesCount++;
      if (n.type === "TEXT") textCount++;
      if (n.type === "VECTOR" || n.type === "RECTANGLE" || n.type === "ELLIPSE") vectorCount++;
      if (n.type === "COMPONENT" || n.type === "INSTANCE") componentCount++;
      if (n.children) {
        for (const c of n.children) countNodes(c);
      }
    }

    pages.forEach((p) => countNodes(p));
    return { totalLayers, framesCount, textCount, vectorCount, componentCount };
  }, [pages]);

  // Download complete raw document as JSON
  const handleDownloadFullFigmaJson = () => {
    const docToExport = rawDoc || {
      id: "0:0",
      name: result.designName || result.projectName,
      type: "DOCUMENT",
      children: pages,
    };
    const jsonStr = JSON.stringify(docToExport, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = result.projectName.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    a.href = url;
    a.download = `${safeName}-figma-document.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download single active page as JSON
  const handleDownloadPageJson = (page: FigmaNode) => {
    const jsonStr = JSON.stringify(page, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = page.name.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    a.href = url;
    a.download = `page-${safeName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy full document JSON to clipboard
  const handleCopyFullDocJson = () => {
    const docToExport = rawDoc || {
      id: "0:0",
      name: result.designName || result.projectName,
      type: "DOCUMENT",
      children: pages,
    };
    navigator.clipboard.writeText(JSON.stringify(docToExport, null, 2));
    setIsCopiedDoc(true);
    setTimeout(() => setIsCopiedDoc(false), 2000);
  };

  // Copy single selected node JSON
  const handleCopyNodeJson = () => {
    if (!selectedNode) return;
    navigator.clipboard.writeText(JSON.stringify(selectedNode, null, 2));
    setIsCopiedNode(true);
    setTimeout(() => setIsCopiedNode(false), 2000);
  };

  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const expandAll = () => {
    const exp: Record<string, boolean> = {};
    function collect(n: FigmaNode) {
      exp[n.id] = true;
      if (n.children) n.children.forEach(collect);
    }
    if (activePage) collect(activePage);
    setExpandedNodes(exp);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  // Count layers inside a page
  const countPageLayers = (page: FigmaNode): number => {
    let count = 0;
    function walk(n: FigmaNode) {
      count++;
      if (n.children) n.children.forEach(walk);
    }
    walk(page);
    return count;
  };

  // Filtered pages for left pane
  const filteredPages = useMemo(() => {
    if (!pageSearch.trim()) return pages;
    return pages.filter((p) => p.name.toLowerCase().includes(pageSearch.toLowerCase()));
  }, [pages, pageSearch]);

  // Node type icon
  const getNodeIcon = (type: string, isExpanded?: boolean) => {
    switch (type) {
      case "CANVAS":
        return <Layers className="w-4 h-4 text-sky-400 shrink-0" />;
      case "FRAME":
        return isExpanded ? (
          <FolderOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        ) : (
          <Folder className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        );
      case "COMPONENT":
      case "INSTANCE":
        return <Box className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case "TEXT":
        return <Type className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case "VECTOR":
      case "RECTANGLE":
      case "ELLIPSE":
        return <Layout className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      default:
        return <Box className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  // Render tree node
  const renderTreeNode = (node: FigmaNode, depth: number = 0) => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = Boolean(expandedNodes[node.id]);
    const isSelected = selectedNode?.id === node.id;

    // Search filter match check
    const matchesSearch =
      !searchLayer.trim() ||
      node.name.toLowerCase().includes(searchLayer.toLowerCase()) ||
      node.type.toLowerCase().includes(searchLayer.toLowerCase()) ||
      (node.characters && node.characters.toLowerCase().includes(searchLayer.toLowerCase()));

    // Get color fill preview
    let fillHex: string | null = null;
    if (node.fills && node.fills[0]?.color) {
      const c = node.fills[0].color;
      const r = Math.round((c.r || 0) * 255);
      const g = Math.round((c.g || 0) * 255);
      const b = Math.round((c.b || 0) * 255);
      fillHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    return (
      <div key={node.id} className="select-none">
        {matchesSearch && (
          <div
            onClick={() => setSelectedNode(node)}
            style={{ paddingLeft: `${Math.min(depth * 18 + 8, 160)}px` }}
            className={`group flex items-center justify-between pr-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
              isSelected
                ? "bg-sky-600/30 text-sky-200 border border-sky-500/60 font-medium"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={(e) => toggleExpand(node.id, e)}
                  className="p-0.5 hover:bg-slate-700/60 rounded text-slate-400 hover:text-white"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
              ) : (
                <span className="w-4 shrink-0" />
              )}

              {getNodeIcon(node.type, isExpanded)}

              <span className="truncate max-w-[220px] font-mono text-[11px]">
                {node.name}
              </span>

              {node.characters && (
                <span className="text-[10px] text-slate-500 truncate max-w-[120px] italic">
                  "{node.characters}"
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
              {fillHex && (
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-700"
                  style={{ backgroundColor: fillHex }}
                  title={`Fill: ${fillHex}`}
                />
              )}

              {node.layoutMode && node.layoutMode !== "NONE" && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-sky-400 font-mono">
                  {node.layoutMode === "HORIZONTAL" ? "H" : "V"}
                </span>
              )}

              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono uppercase">
                {node.type}
              </span>
            </div>
          </div>
        )}

        {hasChildren && isExpanded && (
          <div className="border-l border-slate-800/60 ml-3">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#070b14] text-slate-100 min-h-[850px]">
      {/* Top Summary & Action Bar */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Figma AST Project Document: {rawDoc?.name || result.designName || result.projectName}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Full AST Parsed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {pages.length} Pages • {docStats.totalLayers} Total Layers • {docStats.framesCount} Frames • {docStats.textCount} Text Nodes • {docStats.vectorCount} Vectors
            </p>
          </div>
        </div>

        {/* Global Download & Copy Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyFullDocJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            title="Copy full multi-page Figma AST JSON to clipboard"
          >
            {isCopiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopiedDoc ? "Copied!" : "Copy Full AST JSON"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFullFigmaJson}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-600/30 transition-all cursor-pointer"
            title="Download the entire Figma project AST as a .json file containing all pages and layers"
          >
            <Download className="w-4 h-4" />
            <span>Download Complete Figma File (.json)</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Pane 1: Pages Selector (Left) */}
        <div className="w-full lg:w-72 border-r border-slate-800 bg-slate-950/70 flex flex-col shrink-0">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>All Pages ({pages.length})</span>
            </span>
          </div>

          <div className="p-2.5 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                placeholder="Filter pages..."
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Pages List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scroll">
            {filteredPages.map((page, idx) => {
              const isSelected = selectedPageIndex === idx;
              const layerCount = countPageLayers(page);
              return (
                <div
                  key={page.id}
                  onClick={() => setSelectedPageIndex(idx)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-sky-950/60 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/30"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 rounded-lg bg-slate-800 font-mono text-[10px] items-center justify-center font-bold text-sky-400">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold truncate text-[11px] leading-tight">
                        {page.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {layerCount} layers
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPageJson(page);
                    }}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-sky-600 text-slate-400 hover:text-white transition-colors opacity-70 group-hover:opacity-100"
                    title={`Download ${page.name} as JSON`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pane 2: Collapsible Layer Tree (Middle) */}
        <div className="flex-1 border-r border-slate-800 bg-[#0a0f1d] flex flex-col min-w-0">
          <div className="p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Layer Hierarchy: {activePage?.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 font-mono font-bold">
                {countPageLayers(activePage)} nodes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Search layers input */}
          <div className="p-2.5 border-b border-slate-800 bg-slate-900/20">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchLayer}
                onChange={(e) => setSearchLayer(e.target.value)}
                placeholder="Filter layers by name, text snippet, or type..."
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Layer Tree */}
          <div className="flex-1 overflow-y-auto p-3 space-y-0.5 custom-scroll">
            {activePage ? (
              renderTreeNode(activePage, 0)
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No layers found in this page.
              </div>
            )}
          </div>
        </div>

        {/* Pane 3: Deep Layer Inspector (Right) */}
        <div className="w-full lg:w-96 bg-slate-950 flex flex-col shrink-0">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Layer Inspector</span>
            </span>

            {selectedNode && (
              <button
                type="button"
                onClick={handleCopyNodeJson}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors cursor-pointer"
                title="Copy selected node JSON"
              >
                {isCopiedNode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{isCopiedNode ? "Copied" : "Copy Node"}</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scroll text-xs">
            {selectedNode ? (
              <>
                {/* Node Title & Identity */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                      {selectedNode.type}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      ID: {selectedNode.id}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white break-words">
                    {selectedNode.name}
                  </h4>
                  {selectedNode.characters && (
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-sans italic text-xs">
                      "{selectedNode.characters}"
                    </div>
                  )}
                </div>

                {/* Geometry & Bounding Box */}
                {selectedNode.absoluteBoundingBox && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Geometry & Coordinates
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                        <span className="text-slate-500 text-[10px] block">WIDTH</span>
                        <span className="font-bold text-white">
                          {Math.round(selectedNode.absoluteBoundingBox.width)}px
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                        <span className="text-slate-500 text-[10px] block">HEIGHT</span>
                        <span className="font-bold text-white">
                          {Math.round(selectedNode.absoluteBoundingBox.height)}px
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                        <span className="text-slate-500 text-[10px] block">X POS</span>
                        <span className="font-bold text-slate-300">
                          {Math.round(selectedNode.absoluteBoundingBox.x)}px
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                        <span className="text-slate-500 text-[10px] block">Y POS</span>
                        <span className="font-bold text-slate-300">
                          {Math.round(selectedNode.absoluteBoundingBox.y)}px
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-Layout Attributes */}
                {selectedNode.layoutMode && selectedNode.layoutMode !== "NONE" && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Auto-Layout Spec
                    </span>
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Direction:</span>
                        <span className="text-sky-400 font-bold">{selectedNode.layoutMode}</span>
                      </div>
                      {selectedNode.itemSpacing !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Item Gap:</span>
                          <span className="text-white font-bold">{selectedNode.itemSpacing}px</span>
                        </div>
                      )}
                      {(selectedNode.paddingLeft || selectedNode.paddingTop) && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Padding:</span>
                          <span className="text-white font-bold">
                            T: {selectedNode.paddingTop || 0}px • R: {selectedNode.paddingRight || 0}px • B: {selectedNode.paddingBottom || 0}px • L: {selectedNode.paddingLeft || 0}px
                          </span>
                        </div>
                      )}
                      {selectedNode.cornerRadius && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Corner Radius:</span>
                          <span className="text-white font-bold">{selectedNode.cornerRadius}px</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fills & Colors */}
                {selectedNode.fills && selectedNode.fills.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Fills & Color Palette
                    </span>
                    <div className="space-y-1.5">
                      {selectedNode.fills.map((fill, fIdx) => {
                        let hex = "#000000";
                        if (fill.color) {
                          const r = Math.round((fill.color.r || 0) * 255);
                          const g = Math.round((fill.color.g || 0) * 255);
                          const b = Math.round((fill.color.b || 0) * 255);
                          hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                        }
                        return (
                          <div
                            key={fIdx}
                            onClick={() => {
                              navigator.clipboard.writeText(hex);
                              setCopiedColor(hex);
                              setTimeout(() => setCopiedColor(null), 1500);
                            }}
                            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-5 h-5 rounded-lg border border-slate-700 shadow-sm"
                                style={{ backgroundColor: hex }}
                              />
                              <div>
                                <span className="font-mono font-bold text-white text-[11px] uppercase">
                                  {hex}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  {fill.type}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] text-sky-400 font-semibold">
                              {copiedColor === hex ? "Copied!" : "Copy Hex"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Typography details */}
                {selectedNode.style && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Typography
                    </span>
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Font Family:</span>
                        <span className="text-white font-bold">{selectedNode.style.fontFamily}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Font Size:</span>
                        <span className="text-white font-bold">{selectedNode.style.fontSize}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Font Weight:</span>
                        <span className="text-white font-bold">{selectedNode.style.fontWeight}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* React / Tailwind Code Snippet */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Synthesized Tailwind Classes
                  </span>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-sky-300 break-words leading-relaxed">
                    {selectedNode.type === "FRAME"
                      ? `className="${
                          selectedNode.layoutMode === "HORIZONTAL" ? "flex flex-row" : "flex flex-col"
                        }${
                          selectedNode.itemSpacing ? ` gap-[${selectedNode.itemSpacing}px]` : ""
                        }${
                          selectedNode.cornerRadius ? ` rounded-[${selectedNode.cornerRadius}px]` : ""
                        }${
                          selectedNode.paddingLeft ? ` p-[${selectedNode.paddingLeft}px]` : ""
                        } w-full"`
                      : selectedNode.type === "TEXT"
                      ? `className="text-[${selectedNode.style?.fontSize || 14}px] font-[${
                          selectedNode.style?.fontWeight || 400
                        }] text-slate-900 dark:text-white"`
                      : `className="w-full h-auto"`}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500">
                Select any layer in the hierarchy to inspect its geometry, styling tokens, and layout specs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
