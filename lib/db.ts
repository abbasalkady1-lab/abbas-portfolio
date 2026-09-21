import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import defaultDatabase from "@/data/db.json";
import {
  SiteDatabase,
  Project,
  Skill,
  TimelineItem,
  Certificate,
  Service,
  Lead,
  NovaKnowledgeItem,
  NovaSettings,
  ProfileData,
  CVData,
  SEOSettings,
  MediaItem,
} from "@/types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

/**
 * Checks if the current execution environment is Vercel or a read-only serverless runtime.
 */
export function isVercelEnvironment(): boolean {
  return Boolean(
    process.env.VERCEL === "1" ||
    process.env.VERCEL === "true" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    process.env.AWS_LAMBDA_FUNCTION_NAME
  );
}

/**
 * Error thrown when an attempt is made to write to the local filesystem in a read-only serverless environment.
 */
export class ReadOnlyStorageError extends Error {
  public readonly code = "READ_ONLY_STORAGE";
  constructor(
    message = "Database is read-only on Vercel serverless functions. Local JSON mutations cannot be persisted to the deployed filesystem. A persistent database (e.g., PostgreSQL, Supabase, Neon) must be configured for CMS updates in production."
  ) {
    super(message);
    this.name = "ReadOnlyStorageError";
  }
}

/**
 * Standard HTTP response handler for API routes catching database storage errors.
 */
export function handleStorageError(error: unknown, fallbackMessage: string) {
  if (
    error instanceof ReadOnlyStorageError ||
    (error as any)?.name === "ReadOnlyStorageError" ||
    (error as any)?.code === "READ_ONLY_STORAGE" ||
    (error as any)?.code === "EROFS"
  ) {
    return NextResponse.json(
      {
        error:
          "Database storage is read-only in this production deployment. CMS changes cannot be persisted to the local file system. An external database (e.g. Supabase, PostgreSQL) is required for production writes.",
        code: "READ_ONLY_STORAGE",
      },
      { status: 503 }
    );
  }
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}

function getBundledDatabase(): SiteDatabase {
  return JSON.parse(JSON.stringify(defaultDatabase)) as SiteDatabase;
}

export async function getDatabase(): Promise<SiteDatabase> {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(raw) as SiteDatabase;
    }
  } catch (error) {
    console.warn(
      "[Database] Could not read db.json from filesystem, using bundled database fallback:",
      error
    );
  }
  return getBundledDatabase();
}

export async function saveDatabase(data: SiteDatabase): Promise<void> {
  // On Vercel, the deployed filesystem is strictly read-only.
  // Never attempt to mutate the filesystem on Vercel.
  if (isVercelEnvironment()) {
    console.warn(
      "[Database] Mutation rejected: Read-only serverless filesystem on Vercel."
    );
    throw new ReadOnlyStorageError();
  }

  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, DB_PATH);
  } catch (error: any) {
    console.error("[Database] Error writing database to filesystem:", error);
    if (
      error?.code === "EROFS" ||
      error?.code === "EACCES" ||
      error?.code === "EPERM"
    ) {
      throw new ReadOnlyStorageError(
        `Filesystem is read-only (${error.code}). Local database writes cannot be persisted in this environment.`
      );
    }
    throw error;
  }
}

// Entity helpers
export async function getProjects(): Promise<Project[]> {
  const db = await getDatabase();
  return (db.projects || []).sort((a, b) => a.order - b.order);
}

export async function saveProjects(projects: Project[]): Promise<Project[]> {
  const db = await getDatabase();
  db.projects = projects;
  await saveDatabase(db);
  return db.projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await getDatabase();
  return (
    (db.projects || []).find((p) => p.slug === slug && p.published) || null
  );
}

export async function getSkills(): Promise<Skill[]> {
  const db = await getDatabase();
  return (db.skills || []).sort((a, b) => a.order - b.order);
}

export async function saveSkills(skills: Skill[]): Promise<Skill[]> {
  const db = await getDatabase();
  db.skills = skills;
  await saveDatabase(db);
  return db.skills;
}

export async function getTimeline(): Promise<TimelineItem[]> {
  const db = await getDatabase();
  return (db.timeline || []).sort((a, b) => a.order - b.order);
}

export async function saveTimeline(
  timeline: TimelineItem[]
): Promise<TimelineItem[]> {
  const db = await getDatabase();
  db.timeline = timeline;
  await saveDatabase(db);
  return db.timeline;
}

export async function getCertificates(): Promise<Certificate[]> {
  const db = await getDatabase();
  return (db.certificates || []).sort((a, b) => a.order - b.order);
}

export async function saveCertificates(
  certificates: Certificate[]
): Promise<Certificate[]> {
  const db = await getDatabase();
  db.certificates = certificates;
  await saveDatabase(db);
  return db.certificates;
}

export async function getServices(): Promise<Service[]> {
  const db = await getDatabase();
  return (db.services || []).sort((a, b) => a.order - b.order);
}

export async function saveServices(services: Service[]): Promise<Service[]> {
  const db = await getDatabase();
  db.services = services;
  await saveDatabase(db);
  return db.services;
}

export async function getLeads(): Promise<Lead[]> {
  const db = await getDatabase();
  return (db.leads || []).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addLead(
  leadData: Omit<Lead, "id" | "status" | "createdAt">
): Promise<Lead> {
  const db = await getDatabase();
  const newLead: Lead = {
    ...leadData,
    id: "lead-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  if (!db.leads) db.leads = [];
  db.leads.unshift(newLead);
  if (!db.analytics) {
    db.analytics = {
      pageViews: 0,
      cvDownloads: 0,
      novaConversations: 0,
      leadsCount: 0,
    };
  }
  db.analytics.leadsCount = (db.analytics.leadsCount || 0) + 1;

  // Always log lead to standard runtime output so contact submissions are preserved in logs
  console.log("[LEAD_SUBMISSION]", JSON.stringify(newLead));

  await saveDatabase(db);
  return newLead;
}

export async function updateLeadStatus(
  id: string,
  status: Lead["status"]
): Promise<Lead | null> {
  const db = await getDatabase();
  const lead = (db.leads || []).find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  await saveDatabase(db);
  return lead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = await getDatabase();
  const initialLength = (db.leads || []).length;
  db.leads = (db.leads || []).filter((l) => l.id !== id);
  if (db.leads.length !== initialLength) {
    await saveDatabase(db);
    return true;
  }
  return false;
}

export async function getNovaKnowledge(): Promise<NovaKnowledgeItem[]> {
  const db = await getDatabase();
  return db.novaKnowledge || [];
}

export async function saveNovaKnowledge(
  items: NovaKnowledgeItem[]
): Promise<NovaKnowledgeItem[]> {
  const db = await getDatabase();
  db.novaKnowledge = items;
  await saveDatabase(db);
  return db.novaKnowledge;
}

export async function getNovaSettings(): Promise<NovaSettings> {
  const db = await getDatabase();
  return (
    db.novaSettings ||
    (defaultDatabase as unknown as SiteDatabase).novaSettings
  );
}

export async function saveNovaSettings(
  settings: NovaSettings
): Promise<NovaSettings> {
  const db = await getDatabase();
  db.novaSettings = settings;
  await saveDatabase(db);
  return db.novaSettings;
}

export async function getProfile(): Promise<ProfileData> {
  const db = await getDatabase();
  return (
    db.profile || (defaultDatabase as unknown as SiteDatabase).profile
  );
}

export async function saveProfile(profile: ProfileData): Promise<ProfileData> {
  const db = await getDatabase();
  db.profile = profile;
  await saveDatabase(db);
  return db.profile;
}

export async function getCV(): Promise<CVData> {
  const db = await getDatabase();
  return db.cv || (defaultDatabase as unknown as SiteDatabase).cv;
}

export async function saveCV(cv: CVData): Promise<CVData> {
  const db = await getDatabase();
  db.cv = cv;
  await saveDatabase(db);
  return db.cv;
}

export async function incrementCVDownloads(): Promise<number> {
  try {
    const db = await getDatabase();
    if (!db.cv) db.cv = (defaultDatabase as unknown as SiteDatabase).cv;
    if (!db.analytics) {
      db.analytics = {
        pageViews: 0,
        cvDownloads: 0,
        novaConversations: 0,
        leadsCount: 0,
      };
    }
    db.cv.downloadCount = (db.cv.downloadCount || 0) + 1;
    db.analytics.cvDownloads = (db.analytics.cvDownloads || 0) + 1;

    if (!isVercelEnvironment()) {
      try {
        await saveDatabase(db);
      } catch (err) {
        console.warn("[Analytics] CV download increment not persisted:", err);
      }
    }
    return db.cv.downloadCount;
  } catch (err) {
    console.warn("[Analytics] incrementCVDownloads handled safely:", err);
    return 0;
  }
}

export async function getSEO(): Promise<SEOSettings> {
  const db = await getDatabase();
  return db.seo || (defaultDatabase as unknown as SiteDatabase).seo;
}

export async function saveSEO(seo: SEOSettings): Promise<SEOSettings> {
  const db = await getDatabase();
  db.seo = seo;
  await saveDatabase(db);
  return db.seo;
}

export async function getMedia(): Promise<MediaItem[]> {
  const db = await getDatabase();
  return db.media || [];
}

export async function saveMediaItem(item: MediaItem): Promise<MediaItem> {
  const db = await getDatabase();
  if (!db.media) db.media = [];
  db.media.unshift(item);
  await saveDatabase(db);
  return item;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  const db = await getDatabase();
  if (!db.media) return false;
  const init = db.media.length;
  db.media = db.media.filter((m) => m.id !== id);
  if (db.media.length !== init) {
    await saveDatabase(db);
    return true;
  }
  return false;
}

export async function incrementPageViews(): Promise<number> {
  try {
    const db = await getDatabase();
    if (!db.analytics) {
      db.analytics = {
        pageViews: 0,
        cvDownloads: 0,
        novaConversations: 0,
        leadsCount: 0,
      };
    }
    db.analytics.pageViews = (db.analytics.pageViews || 0) + 1;

    if (!isVercelEnvironment()) {
      try {
        await saveDatabase(db);
      } catch (err) {
        console.warn("[Analytics] Page view increment not persisted:", err);
      }
    }
    return db.analytics.pageViews;
  } catch (err) {
    console.warn("[Analytics] incrementPageViews handled safely:", err);
    return 0;
  }
}

export async function incrementNovaConversations(): Promise<number> {
  try {
    const db = await getDatabase();
    if (!db.analytics) {
      db.analytics = {
        pageViews: 0,
        cvDownloads: 0,
        novaConversations: 0,
        leadsCount: 0,
      };
    }
    db.analytics.novaConversations =
      (db.analytics.novaConversations || 0) + 1;

    if (!isVercelEnvironment()) {
      try {
        await saveDatabase(db);
      } catch (err) {
        console.warn(
          "[Analytics] Nova conversation increment not persisted:",
          err
        );
      }
    }
    return db.analytics.novaConversations;
  } catch (err) {
    console.warn(
      "[Analytics] incrementNovaConversations handled safely:",
      err
    );
    return 0;
  }
}
