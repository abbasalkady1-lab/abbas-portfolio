import fs from "fs";
import path from "path";
import { SiteDatabase, Project, Skill, TimelineItem, Certificate, Service, Lead, NovaKnowledgeItem, NovaSettings, ProfileData, CVData, SEOSettings, MediaItem } from "@/types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export async function getDatabase(): Promise<SiteDatabase> {
  try {
    if (!fs.existsSync(DB_PATH)) {
      throw new Error("Database file missing");
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as SiteDatabase;
  } catch (error) {
    console.error("Error reading database:", error);
    throw error;
  }
}

export async function saveDatabase(data: SiteDatabase): Promise<void> {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, DB_PATH);
  } catch (error) {
    console.error("Error writing database:", error);
    throw error;
  }
}

// Entity helpers
export async function getProjects(): Promise<Project[]> {
  const db = await getDatabase();
  return db.projects.sort((a, b) => a.order - b.order);
}

export async function saveProjects(projects: Project[]): Promise<Project[]> {
  const db = await getDatabase();
  db.projects = projects;
  await saveDatabase(db);
  return db.projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await getDatabase();
  return db.projects.find((p) => p.slug === slug && p.published) || null;
}

export async function getSkills(): Promise<Skill[]> {
  const db = await getDatabase();
  return db.skills.sort((a, b) => a.order - b.order);
}

export async function saveSkills(skills: Skill[]): Promise<Skill[]> {
  const db = await getDatabase();
  db.skills = skills;
  await saveDatabase(db);
  return db.skills;
}

export async function getTimeline(): Promise<TimelineItem[]> {
  const db = await getDatabase();
  return db.timeline.sort((a, b) => a.order - b.order);
}

export async function saveTimeline(timeline: TimelineItem[]): Promise<TimelineItem[]> {
  const db = await getDatabase();
  db.timeline = timeline;
  await saveDatabase(db);
  return db.timeline;
}

export async function getCertificates(): Promise<Certificate[]> {
  const db = await getDatabase();
  return db.certificates.sort((a, b) => a.order - b.order);
}

export async function saveCertificates(certificates: Certificate[]): Promise<Certificate[]> {
  const db = await getDatabase();
  db.certificates = certificates;
  await saveDatabase(db);
  return db.certificates;
}

export async function getServices(): Promise<Service[]> {
  const db = await getDatabase();
  return db.services.sort((a, b) => a.order - b.order);
}

export async function saveServices(services: Service[]): Promise<Service[]> {
  const db = await getDatabase();
  db.services = services;
  await saveDatabase(db);
  return db.services;
}

export async function getLeads(): Promise<Lead[]> {
  const db = await getDatabase();
  return db.leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addLead(leadData: Omit<Lead, "id" | "status" | "createdAt">): Promise<Lead> {
  const db = await getDatabase();
  const newLead: Lead = {
    ...leadData,
    id: "lead-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  db.leads.unshift(newLead);
  db.analytics.leadsCount = (db.analytics.leadsCount || 0) + 1;
  await saveDatabase(db);
  return newLead;
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<Lead | null> {
  const db = await getDatabase();
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  await saveDatabase(db);
  return lead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = await getDatabase();
  const initialLength = db.leads.length;
  db.leads = db.leads.filter((l) => l.id !== id);
  if (db.leads.length !== initialLength) {
    await saveDatabase(db);
    return true;
  }
  return false;
}

export async function getNovaKnowledge(): Promise<NovaKnowledgeItem[]> {
  const db = await getDatabase();
  return db.novaKnowledge;
}

export async function saveNovaKnowledge(items: NovaKnowledgeItem[]): Promise<NovaKnowledgeItem[]> {
  const db = await getDatabase();
  db.novaKnowledge = items;
  await saveDatabase(db);
  return db.novaKnowledge;
}

export async function getNovaSettings(): Promise<NovaSettings> {
  const db = await getDatabase();
  return db.novaSettings;
}

export async function saveNovaSettings(settings: NovaSettings): Promise<NovaSettings> {
  const db = await getDatabase();
  db.novaSettings = settings;
  await saveDatabase(db);
  return db.novaSettings;
}

export async function getProfile(): Promise<ProfileData> {
  const db = await getDatabase();
  return db.profile;
}

export async function saveProfile(profile: ProfileData): Promise<ProfileData> {
  const db = await getDatabase();
  db.profile = profile;
  await saveDatabase(db);
  return db.profile;
}

export async function getCV(): Promise<CVData> {
  const db = await getDatabase();
  return db.cv;
}

export async function saveCV(cv: CVData): Promise<CVData> {
  const db = await getDatabase();
  db.cv = cv;
  await saveDatabase(db);
  return db.cv;
}

export async function incrementCVDownloads(): Promise<number> {
  const db = await getDatabase();
  db.cv.downloadCount = (db.cv.downloadCount || 0) + 1;
  db.analytics.cvDownloads = (db.analytics.cvDownloads || 0) + 1;
  await saveDatabase(db);
  return db.cv.downloadCount;
}

export async function getSEO(): Promise<SEOSettings> {
  const db = await getDatabase();
  return db.seo;
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
  const db = await getDatabase();
  db.analytics.pageViews = (db.analytics.pageViews || 0) + 1;
  await saveDatabase(db);
  return db.analytics.pageViews;
}

export async function incrementNovaConversations(): Promise<number> {
  const db = await getDatabase();
  db.analytics.novaConversations = (db.analytics.novaConversations || 0) + 1;
  await saveDatabase(db);
  return db.analytics.novaConversations;
}
