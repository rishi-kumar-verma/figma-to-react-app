import JSZip from "jszip";
import { GeneratedFile, DevScreenAsset, DevIconAsset } from "../types";

export async function createProjectZip(
  projectName: string,
  files: GeneratedFile[]
): Promise<Blob> {
  const zip = new JSZip();
  const rootFolderName = projectName.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  const folder = zip.folder(rootFolderName) || zip;

  for (const file of files) {
    folder.file(file.path, file.content);
  }

  // Generate binary Blob
  const content = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return content;
}

export async function createDevAssetsZip(
  projectName: string,
  screens: DevScreenAsset[],
  icons: DevIconAsset[]
): Promise<Blob> {
  const zip = new JSZip();
  const rootFolderName = `${projectName.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}-dev-assets`;
  const folder = zip.folder(rootFolderName) || zip;
  const screensFolder = folder.folder("screens") || folder;
  const iconsFolder = folder.folder("icons") || folder;

  // Add Screens
  for (const screen of screens) {
    const safeName = screen.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    if (screen.imageUrl) {
      try {
        const res = await fetch(screen.imageUrl);
        if (res.ok) {
          const blob = await res.blob();
          const ext = screen.format || "png";
          screensFolder.file(`${safeName}.${ext}`, blob);
          continue;
        }
      } catch (err) {
        console.warn(`Failed to fetch image for screen ${screen.name}:`, err);
      }
    }

    // Fallback SVG representation for screens without direct image blob
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900">
  <rect width="1440" height="900" fill="#0f172a"/>
  <text x="720" y="450" font-family="sans-serif" font-size="28" font-weight="bold" fill="#38bdf8" text-anchor="middle">
    ${screen.name}
  </text>
  <text x="720" y="490" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">
    Figma Frame ID: ${screen.id} (1440 x 900 px)
  </text>
</svg>`;
    screensFolder.file(`${safeName}.svg`, fallbackSvg);
  }

  // Add Icons
  for (const icon of icons) {
    const safeName = icon.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    const svgCode =
      icon.svgContent ||
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- ${icon.name} -->
  <rect width="18" height="18" x="3" y="3" rx="2" />
  <path d="M3 9h18M9 21V9" />
</svg>`;
    iconsFolder.file(`${safeName}.svg`, svgCode);
  }

  // Add Readme describing dev assets usage
  folder.file(
    "README.txt",
    `Development Reference Assets for ${projectName}\n=========================================\nThese PNG screenshots and SVG vector glyphs are provided strictly for developer design reference and visual alignment.\nThey are kept separate from the React source code bundle to preserve clean production code standards.\n`
  );

  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

export function triggerBrowserZipDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAsset(url: string, filename: string): Promise<void> {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      triggerBrowserZipDownload(blob, filename);
      return;
    }
  } catch {
    // fallback to browser link download
  }
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadSvgString(svgContent: string, filename: string): void {
  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  triggerBrowserZipDownload(blob, filename.endsWith(".svg") ? filename : `${filename}.svg`);
}
