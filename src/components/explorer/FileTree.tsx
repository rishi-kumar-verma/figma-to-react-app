import React, { useState } from "react";
import { GeneratedFile } from "../../lib/types";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface TreeNode {
  name: string;
  fullPath: string;
  isDirectory: boolean;
  children?: TreeNode[];
  file?: GeneratedFile;
}

export interface FileTreeProps {
  files: GeneratedFile[];
  selectedPath: string;
  onSelectFile: (file: GeneratedFile) => void;
}

function buildTree(files: GeneratedFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join("/");

      let existingNode = currentLevel.find((n) => n.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          fullPath: currentPath,
          isDirectory: !isFile,
          children: isFile ? undefined : [],
          file: isFile ? file : undefined,
        };
        currentLevel.push(existingNode);
      }

      if (!isFile && existingNode.children) {
        currentLevel = existingNode.children;
      }
    }
  }

  // Sort directories first, then files alphabetically
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    for (const node of nodes) {
      if (node.children) sortNodes(node.children);
    }
  };

  sortNodes(root);
  return root;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  selectedPath,
  onSelectFile,
}) => {
  const tree = buildTree(files);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    src: true,
    "src/components": true,
    "src/components/ui": true,
    "src/components/dashboard": true,
    "src/components/layout": true,
    "src/hooks": true,
    "src/pages": true,
    tests: true,
    "tests/components": true,
  });

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderFileIcon = (fileName: string) => {
    if (fileName.endsWith(".json")) {
      return <FileJson className="w-4 h-4 text-amber-400 shrink-0" />;
    }
    if (fileName.endsWith(".md")) {
      return <FileText className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    return <FileCode className="w-4 h-4 text-sky-400 shrink-0" />;
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    const isFolder = node.isDirectory;
    const isOpen = openFolders[node.fullPath];
    const isSelected = !isFolder && node.fullPath === selectedPath;

    return (
      <div key={node.fullPath}>
        {isFolder ? (
          <div>
            <button
              type="button"
              onClick={() => toggleFolder(node.fullPath)}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              className="w-full flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
            >
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
              {isOpen ? (
                <FolderOpen className="w-4 h-4 text-sky-400 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-sky-400 shrink-0" />
              )}
              <span className="truncate">{node.name}</span>
            </button>
            {isOpen && node.children && (
              <div>{node.children.map((child) => renderNode(child, depth + 1))}</div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => node.file && onSelectFile(node.file)}
            style={{ paddingLeft: `${depth * 12 + 20}px` }}
            className={`w-full flex items-center gap-2 py-1 px-2 rounded-lg text-xs transition-colors text-left ${
              isSelected
                ? "bg-sky-600/30 text-sky-300 font-semibold border-l-2 border-sky-500"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            {renderFileIcon(node.name)}
            <span className="truncate">{node.name}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-2 space-y-0.5 select-none font-mono">
      <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-800 mb-2">
        Project File Tree
      </div>
      {tree.map((node) => renderNode(node, 0))}
    </div>
  );
};
