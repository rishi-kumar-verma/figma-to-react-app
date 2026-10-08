import { getDbPool, initDatabaseSchema } from "./pool";
import { FigmaNode, ExtractedFigmaDesign, DevScreenAsset, DevIconAsset } from "../types";

export interface CachedFigmaRecord {
  fileKey: string;
  documentName: string;
  rawDocument: FigmaNode;
  extractedDesign: ExtractedFigmaDesign;
  devAssets: {
    screens: DevScreenAsset[];
    icons: DevIconAsset[];
  };
  figmaVersion: string;
  cachedAt: string;
  syncCount: number;
}

export async function getCachedFigma(fileKey: string): Promise<CachedFigmaRecord | null> {
  if (!fileKey) return null;

  try {
    await initDatabaseSchema();
    const db = getDbPool();

    const query = `
      SELECT 
        file_key AS "fileKey",
        document_name AS "documentName",
        raw_document AS "rawDocument",
        extracted_design AS "extractedDesign",
        dev_assets AS "devAssets",
        figma_version AS "figmaVersion",
        cached_at AS "cachedAt",
        sync_count AS "syncCount"
      FROM figma_cache
      WHERE file_key = $1;
    `;

    const { rows } = await db.query(query, [fileKey]);
    if (rows.length === 0) return null;

    // Increment sync count and touch timestamp asynchronously
    db.query(
      `UPDATE figma_cache SET last_used_at = NOW(), sync_count = sync_count + 1 WHERE file_key = $1;`,
      [fileKey]
    ).catch((err) => console.warn("[PostgreSQL] Touch figma cache warning:", err));

    const r = rows[0];
    return {
      fileKey: r.fileKey,
      documentName: r.documentName,
      rawDocument: r.rawDocument,
      extractedDesign: r.extractedDesign,
      devAssets: r.devAssets || { screens: [], icons: [] },
      figmaVersion: r.figmaVersion || "1.0",
      cachedAt: new Date(r.cachedAt).toISOString(),
      syncCount: r.syncCount,
    };
  } catch (error) {
    console.warn(`[PostgreSQL] Cache lookup warning for key "${fileKey}":`, error);
    return null;
  }
}

export async function isFigmaKeyCached(fileKey: string): Promise<boolean> {
  if (!fileKey) return false;
  try {
    await initDatabaseSchema();
    const db = getDbPool();
    const res = await db.query(`SELECT 1 FROM figma_cache WHERE file_key = $1;`, [fileKey]);
    return res.rows.length > 0;
  } catch {
    return false;
  }
}

export async function saveFigmaCache(
  fileKey: string,
  documentName: string,
  rawDocument: FigmaNode,
  extractedDesign: ExtractedFigmaDesign,
  devAssets: { screens: DevScreenAsset[]; icons: DevIconAsset[] } = { screens: [], icons: [] },
  figmaVersion: string = "1.0"
): Promise<void> {
  if (!fileKey) return;

  try {
    await initDatabaseSchema();
    const db = getDbPool();

    const upsertQuery = `
      INSERT INTO figma_cache (file_key, document_name, raw_document, extracted_design, dev_assets, figma_version, cached_at, last_used_at, sync_count)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), 1)
      ON CONFLICT (file_key) DO UPDATE SET
        document_name = EXCLUDED.document_name,
        raw_document = EXCLUDED.raw_document,
        extracted_design = EXCLUDED.extracted_design,
        dev_assets = EXCLUDED.dev_assets,
        figma_version = EXCLUDED.figma_version,
        cached_at = NOW(),
        last_used_at = NOW(),
        sync_count = figma_cache.sync_count + 1;
    `;

    await db.query(upsertQuery, [
      fileKey,
      documentName,
      JSON.stringify(rawDocument),
      JSON.stringify(extractedDesign),
      JSON.stringify(devAssets),
      figmaVersion,
    ]);

    console.log(`[PostgreSQL] Saved/Updated Figma cache for file key "${fileKey}".`);
  } catch (error) {
    console.error(`[PostgreSQL] Failed to save Figma cache for key "${fileKey}":`, error);
  }
}
