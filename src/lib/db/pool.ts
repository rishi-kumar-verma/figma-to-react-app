import { Pool, PoolConfig } from "pg";

let pool: Pool | null = null;
let schemaInitialized = false;

const defaultConnectionString =
  process.env.DATABASE_URL ||
  "postgresql://figma2react:figma2react_secret@localhost:5433/figma2react_db";

export function getDbPool(): Pool {
  if (!pool) {
    const config: PoolConfig = {
      connectionString: defaultConnectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
    pool = new Pool(config);

    pool.on("error", (err) => {
      console.error("[PostgreSQL Pool Error]", err);
    });
  }
  return pool;
}

export async function initDatabaseSchema(): Promise<void> {
  if (schemaInitialized) return;

  const db = getDbPool();
  const client = await db.connect();

  try {
    // 1. Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        figma_url TEXT,
        figma_file_key VARCHAR(128),
        category VARCHAR(64) DEFAULT 'saas',
        current_version INT DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Project Versions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_versions (
        id VARCHAR(64) PRIMARY KEY,
        project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        version_number INT NOT NULL,
        change_summary TEXT,
        generation_result JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT unique_project_version UNIQUE (project_id, version_number)
      );
      CREATE INDEX IF NOT EXISTS idx_versions_project_id ON project_versions(project_id);
    `);

    // 3. Figma Cache Table (stores AST, extracted design, and dev-only assets)
    await client.query(`
      CREATE TABLE IF NOT EXISTS figma_cache (
        file_key VARCHAR(128) PRIMARY KEY,
        document_name VARCHAR(255) NOT NULL,
        raw_document JSONB NOT NULL,
        extracted_design JSONB NOT NULL,
        dev_assets JSONB DEFAULT '{"screens":[],"icons":[]}'::jsonb,
        figma_version VARCHAR(64),
        cached_at TIMESTAMPTZ DEFAULT NOW(),
        last_used_at TIMESTAMPTZ DEFAULT NOW(),
        sync_count INT DEFAULT 1
      );
    `);

    schemaInitialized = true;
    console.log("[PostgreSQL] Database schema verified and initialized.");
  } catch (error) {
    console.error("[PostgreSQL Schema Init Error]", error);
    throw error;
  } finally {
    client.release();
  }
}
