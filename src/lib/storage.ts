export interface ApiKeys {
  figmaToken: string;
  openAiKey: string;
  anthropicKey: string;
  geminiKey: string;
}

const STORAGE_KEY = "figma_to_react_api_credentials";

export const DEFAULT_API_KEYS: ApiKeys = {
  figmaToken: "",
  openAiKey: "",
  anthropicKey: "",
  geminiKey: "",
};

export function getStoredApiKeys(): ApiKeys {
  if (typeof window === "undefined") {
    return DEFAULT_API_KEYS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_API_KEYS;
    const parsed = JSON.parse(raw);
    return {
      figmaToken: typeof parsed.figmaToken === "string" ? parsed.figmaToken : "",
      openAiKey: typeof parsed.openAiKey === "string" ? parsed.openAiKey : "",
      anthropicKey: typeof parsed.anthropicKey === "string" ? parsed.anthropicKey : "",
      geminiKey: typeof parsed.geminiKey === "string" ? parsed.geminiKey : "",
    };
  } catch (e) {
    console.warn("Failed to read API keys from localStorage:", e);
    return DEFAULT_API_KEYS;
  }
}

export function saveStoredApiKeys(keys: ApiKeys): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch (e) {
    console.error("Failed to persist API keys to localStorage:", e);
  }
}

export function clearStoredApiKeys(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to remove API keys from localStorage:", e);
  }
}

export function countActiveKeys(keys: ApiKeys): number {
  let count = 0;
  if (keys.figmaToken.trim()) count++;
  if (keys.openAiKey.trim()) count++;
  if (keys.anthropicKey.trim()) count++;
  if (keys.geminiKey.trim()) count++;
  return count;
}
