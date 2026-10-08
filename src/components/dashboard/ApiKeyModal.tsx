import React, { useState, useEffect } from "react";
import {
  X,
  Key,
  ShieldCheck,
  ExternalLink,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Save,
} from "lucide-react";
import {
  ApiKeys,
  saveStoredApiKeys,
  clearStoredApiKeys,
  countActiveKeys,
} from "../../lib/storage";

export interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  keys: ApiKeys;
  onSaveKeys: (keys: ApiKeys) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  keys,
  onSaveKeys,
}) => {
  const [localKeys, setLocalKeys] = useState<ApiKeys>(keys);
  const [showVisibility, setShowVisibility] = useState({
    figma: false,
    openai: false,
    anthropic: false,
    gemini: false,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingFigma, setTestingFigma] = useState(false);
  const [figmaTestResult, setFigmaTestResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  // Sync when modal opens or parent keys change
  useEffect(() => {
    setLocalKeys(keys);
    setSaveSuccess(false);
    setFigmaTestResult(null);
  }, [isOpen, keys]);

  if (!isOpen) return null;

  const toggleShow = (field: keyof typeof showVisibility) => {
    setShowVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    saveStoredApiKeys(localKeys);
    onSaveKeys(localKeys);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  const handleClear = () => {
    const emptyKeys: ApiKeys = {
      figmaToken: "",
      openAiKey: "",
      anthropicKey: "",
      geminiKey: "",
    };
    setLocalKeys(emptyKeys);
    clearStoredApiKeys();
    onSaveKeys(emptyKeys);
    setFigmaTestResult(null);
  };

  const handleTestFigma = async () => {
    if (!localKeys.figmaToken.trim()) {
      setFigmaTestResult({
        valid: false,
        message: "Please enter a Figma Personal Access Token first.",
      });
      return;
    }

    setTestingFigma(true);
    setFigmaTestResult(null);

    try {
      const res = await fetch("/api/figma/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: "https://figma.com/file/xZ849Lp1Q0/Health-Dashboard",
          token: localKeys.figmaToken.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setFigmaTestResult({
          valid: true,
          message: data.message || "Figma token is valid and active!",
        });
      } else {
        setFigmaTestResult({
          valid: false,
          message: data.error || "Token verification failed. Please check permissions.",
        });
      }
    } catch (err: any) {
      setFigmaTestResult({
        valid: false,
        message: err?.message || "Failed to reach Figma API endpoint.",
      });
    } finally {
      setTestingFigma(false);
    }
  };

  const activeCount = countActiveKeys(localKeys);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                API Keys &amp; Custom Integrations
              </h3>
              <p className="text-[11px] text-slate-400">
                {activeCount > 0 ? (
                  <span className="text-emerald-400 font-semibold">
                    ● {activeCount} key{activeCount > 1 ? "s" : ""} active in local storage
                  </span>
                ) : (
                  <span>Keys are stored securely in your browser's localStorage</span>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Banner */}
        <div className="text-xs text-slate-300 bg-sky-950/40 border border-sky-800/40 p-3.5 rounded-2xl flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
          <div className="leading-relaxed text-[11px]">
            <span className="font-semibold text-white">100% Client-Side Privacy: </span>
            Credentials are saved to your browser&apos;s <code className="text-sky-300 font-mono">localStorage</code>. They persist across page refreshes and are never stored or logged on any external backend database.
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 text-xs">
          {/* Figma PAT */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="figma-pat" className="font-semibold text-slate-200">
                Figma Personal Access Token (PAT)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestFigma}
                  disabled={testingFigma || !localKeys.figmaToken}
                  className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold hover:underline flex items-center gap-1 disabled:opacity-40 disabled:no-underline"
                >
                  {testingFigma ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Test Token</span>
                  )}
                </button>
                <span className="text-slate-600">•</span>
                <a
                  href="https://www.figma.com/developers/api#access-tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  Get token <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="relative">
              <input
                id="figma-pat"
                type={showVisibility.figma ? "text" : "password"}
                value={localKeys.figmaToken}
                onChange={(e) =>
                  setLocalKeys({ ...localKeys, figmaToken: e.target.value })
                }
                placeholder="figd_xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full pl-3 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => toggleShow("figma")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showVisibility.figma ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Test result status */}
            {figmaTestResult && (
              <div
                className={`p-2 rounded-xl text-[11px] flex items-center gap-2 ${
                  figmaTestResult.valid
                    ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                    : "bg-rose-950/60 text-rose-300 border border-rose-800/60"
                }`}
              >
                {figmaTestResult.valid ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                )}
                <span className="truncate">{figmaTestResult.message}</span>
              </div>
            )}
          </div>

          {/* OpenAI Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="openai-key" className="font-semibold text-slate-200">
                OpenAI API Key (GPT-4o / GPT-5 UI Architect)
              </label>
              <span className="text-[10px] text-slate-500">Optional</span>
            </div>
            <div className="relative">
              <input
                id="openai-key"
                type={showVisibility.openai ? "text" : "password"}
                value={localKeys.openAiKey}
                onChange={(e) =>
                  setLocalKeys({ ...localKeys, openAiKey: e.target.value })
                }
                placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full pl-3 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => toggleShow("openai")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showVisibility.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Anthropic Claude Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="anthropic-key" className="font-semibold text-slate-200">
                Anthropic Claude Key (Opus UI Understanding)
              </label>
              <span className="text-[10px] text-slate-500">Optional</span>
            </div>
            <div className="relative">
              <input
                id="anthropic-key"
                type={showVisibility.anthropic ? "text" : "password"}
                value={localKeys.anthropicKey}
                onChange={(e) =>
                  setLocalKeys({ ...localKeys, anthropicKey: e.target.value })
                }
                placeholder="sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full pl-3 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => toggleShow("anthropic")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showVisibility.anthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Google Gemini Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="gemini-key" className="font-semibold text-slate-200">
                Google Gemini Key (Gemini Vision Verification)
              </label>
              <span className="text-[10px] text-slate-500">Optional</span>
            </div>
            <div className="relative">
              <input
                id="gemini-key"
                type={showVisibility.gemini ? "text" : "password"}
                value={localKeys.geminiKey}
                onChange={(e) =>
                  setLocalKeys({ ...localKeys, geminiKey: e.target.value })
                }
                placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full pl-3 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => toggleShow("gemini")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showVisibility.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClear}
            disabled={activeCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-600/30 transition-all"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Keys</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
