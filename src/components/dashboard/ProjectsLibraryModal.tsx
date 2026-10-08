import React, { useState, useEffect } from "react";
import { SavedProject, ProjectVersion, GenerationResult } from "../../lib/types";
import { createProjectZip, triggerBrowserZipDownload } from "../../lib/packager/zip-builder";
import {
  FolderOpen,
  X,
  Search,
  Download,
  Trash2,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  FolderArchive,
  Database,
  CheckCircle2,
} from "lucide-react";

export interface ProjectsLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProject: (result: GenerationResult) => void;
}

export const ProjectsLibraryModal: React.FC<ProjectsLibraryModalProps> = ({
  isOpen,
  onClose,
  onOpenProject,
}) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to fetch projects from database:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleLoadProject = async (projectId: string) => {
    try {
      setLoadingProjectId(projectId);
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to load project details");
      const data = await res.json();

      // Load latest version by default
      const versions: ProjectVersion[] = data.versions || [];
      const latestVer = versions[versions.length - 1];

      if (latestVer?.generationResult) {
        onOpenProject(latestVer.generationResult);
        onClose();
      } else {
        alert("No generated versions found for this project.");
      }
    } catch (err: any) {
      alert(`Error loading project: ${err.message}`);
    } finally {
      setLoadingProjectId(null);
    }
  };

  const handleDownloadZip = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    try {
      setDownloadingId(projectId);
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to load project files");
      const data = await res.json();
      const versions: ProjectVersion[] = data.versions || [];
      const latestVer = versions[versions.length - 1];

      if (latestVer?.generationResult) {
        const zipBlob = await createProjectZip(
          data.project.name,
          latestVer.generationResult.files
        );
        const filename = `${data.project.name.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}-v${latestVer.versionNumber}.zip`;
        triggerBrowserZipDownload(zipBlob, filename);
      }
    } catch (err: any) {
      alert(`Failed to download project ZIP: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string, projectName: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete project "${projectName}" and all its versions?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      } else {
        alert("Failed to delete project from database");
      }
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Saved Projects & Version Library
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  PostgreSQL Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Browse all generated projects, load any saved version, update code, or download pure React ZIPs.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search and Refresh */}
        <div className="flex items-center justify-between gap-4 px-6 py-3 bg-slate-950/60 border-b border-slate-800 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved projects by name, category, or description..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchProjects}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <span className="text-slate-400 font-mono text-[11px]">
              {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
            </span>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {isLoading && projects.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
              <span>Querying PostgreSQL database...</span>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((proj) => {
              const isCurrentLoading = loadingProjectId === proj.id;
              const isZipping = downloadingId === proj.id;
              const formattedDate = new Date(proj.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={proj.id}
                  onClick={() => handleLoadProject(proj.id)}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-900/60 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                        {proj.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
                        v{proj.currentVersion}
                      </span>
                      {proj.versionsCount && proj.versionsCount > 1 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300">
                          {proj.versionsCount} versions recorded
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-800/80 text-slate-400 uppercase">
                        {proj.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {proj.description || "Enterprise UI Application generated from Figma"}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated: {formattedDate}</span>
                      </span>
                      {proj.figmaFileKey && (
                        <span className="font-mono text-slate-400">
                          Figma Key: {proj.figmaFileKey}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => handleDownloadZip(e, proj.id)}
                      disabled={isZipping}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                      title="Download pure React codebase ZIP"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isZipping ? "Bundling..." : "Download ZIP"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, proj.id, proj.name)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-600 group-hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition-all"
                    >
                      <span>{isCurrentLoading ? "Loading..." : "Open"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <FolderArchive className="w-10 h-10 text-slate-600 stroke-[1.5]" />
              <span className="font-semibold text-slate-300">No saved projects found</span>
              <p className="max-w-xs text-slate-500 text-[11px]">
                Projects are automatically saved in PostgreSQL as soon as you generate them from a Figma URL or preset.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PostgreSQL Persistence Active • Version History Tracked</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
