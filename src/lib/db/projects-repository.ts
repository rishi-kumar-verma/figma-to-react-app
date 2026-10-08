import { getDbPool, initDatabaseSchema } from "./pool";
import { GenerationResult, SavedProject, ProjectVersion } from "../types";

export interface CreateProjectParams {
  id?: string;
  name: string;
  description: string;
  figmaUrl: string;
  figmaFileKey?: string;
  category?: string;
  generationResult: GenerationResult;
}

export async function getAllProjects(): Promise<SavedProject[]> {
  await initDatabaseSchema();
  const db = getDbPool();

  const query = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.figma_url AS "figmaUrl",
      p.figma_file_key AS "figmaFileKey",
      p.category,
      p.current_version AS "currentVersion",
      p.created_at AS "createdAt",
      p.updated_at AS "updatedAt",
      COUNT(pv.id)::int AS "versionsCount"
    FROM projects p
    LEFT JOIN project_versions pv ON p.id = pv.project_id
    GROUP BY p.id
    ORDER BY p.updated_at DESC;
  `;

  const { rows } = await db.query(query);
  return rows.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt).toISOString(),
    updatedAt: new Date(r.updatedAt).toISOString(),
  }));
}

export async function getProjectById(
  id: string
): Promise<{ project: SavedProject; versions: ProjectVersion[] } | null> {
  await initDatabaseSchema();
  const db = getDbPool();

  const projQuery = `
    SELECT 
      id,
      name,
      description,
      figma_url AS "figmaUrl",
      figma_file_key AS "figmaFileKey",
      category,
      current_version AS "currentVersion",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM projects
    WHERE id = $1;
  `;
  const projRes = await db.query(projQuery, [id]);
  if (projRes.rows.length === 0) return null;

  const projectRow = projRes.rows[0];
  const project: SavedProject = {
    ...projectRow,
    createdAt: new Date(projectRow.createdAt).toISOString(),
    updatedAt: new Date(projectRow.updatedAt).toISOString(),
  };

  const verQuery = `
    SELECT 
      id,
      project_id AS "projectId",
      version_number AS "versionNumber",
      change_summary AS "changeSummary",
      generation_result AS "generationResult",
      created_at AS "createdAt"
    FROM project_versions
    WHERE project_id = $1
    ORDER BY version_number ASC;
  `;
  const verRes = await db.query(verQuery, [id]);
  const versions: ProjectVersion[] = verRes.rows.map((v) => ({
    ...v,
    createdAt: new Date(v.createdAt).toISOString(),
  }));

  return { project, versions };
}

export async function createProject(
  params: CreateProjectParams
): Promise<{ project: SavedProject; version: ProjectVersion }> {
  await initDatabaseSchema();
  const db = getDbPool();
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const projectId =
      params.id ||
      `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const versionId = `ver_${projectId}_1`;

    // 1. Insert Project
    const projInsert = `
      INSERT INTO projects (id, name, description, figma_url, figma_file_key, category, current_version, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, 1, NOW(), NOW())
      RETURNING 
        id, name, description, 
        figma_url AS "figmaUrl", 
        figma_file_key AS "figmaFileKey", 
        category, 
        current_version AS "currentVersion", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt";
    `;
    const projRes = await client.query(projInsert, [
      projectId,
      params.name,
      params.description,
      params.figmaUrl,
      params.figmaFileKey || null,
      params.category || "saas",
    ]);

    // Attach projectId and versionNumber to generationResult
    const updatedResult: GenerationResult = {
      ...params.generationResult,
      projectId,
      versionNumber: 1,
    };

    // 2. Insert Version 1
    const verInsert = `
      INSERT INTO project_versions (id, project_id, version_number, change_summary, generation_result, created_at)
      VALUES ($1, $2, 1, $3, $4, NOW())
      RETURNING 
        id, 
        project_id AS "projectId", 
        version_number AS "versionNumber", 
        change_summary AS "changeSummary", 
        generation_result AS "generationResult", 
        created_at AS "createdAt";
    `;
    const verRes = await client.query(verInsert, [
      versionId,
      projectId,
      "Initial generation from Figma specification",
      JSON.stringify(updatedResult),
    ]);

    await client.query("COMMIT");

    const pRow = projRes.rows[0];
    const vRow = verRes.rows[0];

    return {
      project: {
        ...pRow,
        createdAt: new Date(pRow.createdAt).toISOString(),
        updatedAt: new Date(pRow.updatedAt).toISOString(),
        versionsCount: 1,
      },
      version: {
        ...vRow,
        createdAt: new Date(vRow.createdAt).toISOString(),
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[PostgreSQL Create Project Error]", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createProjectVersion(
  projectId: string,
  changeSummary: string,
  result: GenerationResult
): Promise<ProjectVersion> {
  await initDatabaseSchema();
  const db = getDbPool();
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Fetch next version number
    const maxVerRes = await client.query(
      `SELECT COALESCE(MAX(version_number), 0) + 1 AS next_ver FROM project_versions WHERE project_id = $1`,
      [projectId]
    );
    const nextVersion = Number(maxVerRes.rows[0].next_ver);
    const versionId = `ver_${projectId}_${nextVersion}`;

    const updatedResult: GenerationResult = {
      ...result,
      projectId,
      versionNumber: nextVersion,
    };

    // Insert version
    const verInsert = `
      INSERT INTO project_versions (id, project_id, version_number, change_summary, generation_result, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING 
        id, 
        project_id AS "projectId", 
        version_number AS "versionNumber", 
        change_summary AS "changeSummary", 
        generation_result AS "generationResult", 
        created_at AS "createdAt";
    `;
    const verRes = await client.query(verInsert, [
      versionId,
      projectId,
      nextVersion,
      changeSummary || `Version ${nextVersion} update`,
      JSON.stringify(updatedResult),
    ]);

    // Update project record
    await client.query(
      `UPDATE projects SET current_version = $1, updated_at = NOW() WHERE id = $2`,
      [nextVersion, projectId]
    );

    await client.query("COMMIT");

    const vRow = verRes.rows[0];
    return {
      ...vRow,
      createdAt: new Date(vRow.createdAt).toISOString(),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[PostgreSQL Create Version Error]", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteProject(projectId: string): Promise<boolean> {
  await initDatabaseSchema();
  const db = getDbPool();
  const res = await db.query(`DELETE FROM projects WHERE id = $1`, [projectId]);
  return (res.rowCount ?? 0) > 0;
}
