import { saveFigmaCache } from "../lib/db/figma-cache-repository";
import {
  thinkiitLoginPreset,
  thinkiitExtractedDesign,
  thinkiitDevAssets,
} from "../lib/figma/presets/thinkiit-login";

async function main() {
  console.log("Updating PostgreSQL Figma cache with 5-page document...");
  await saveFigmaCache(
    "Ovy67RJUeK4jPMmhzFei9p",
    "thinkiit 2nd project",
    thinkiitLoginPreset,
    thinkiitExtractedDesign,
    thinkiitDevAssets,
    "2.5.0-multi-page"
  );
  console.log("PostgreSQL cache successfully updated with all 5 pages and layer trees!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to update cache:", err);
  process.exit(1);
});
