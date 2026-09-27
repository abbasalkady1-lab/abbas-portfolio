/**
 * MongoDB-backed database layer.
 * Mirrors the exact same API as lib/db.ts but reads/writes from MongoDB Atlas.
 * Used in production (Vercel) when MONGODB_URI is set.
 */

import { connectToDatabase } from "./mongodb";
import { SiteDatabaseModel } from "./db-schema";
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
  FeaturedVideo,
} from "@/types";

const DEFAULT_KEY = "main";

// ─── Core helpers ──────────────────────────────────────────────────────────────

async function getDb(): Promise<SiteDatabase> {
  await connectToDatabase();
  const doc = await SiteDatabaseModel.findOne({ key: DEFAULT_KEY }).lean();
  if (doc) {
    // Remove mongoose internals
    const { _id, __v, key, createdAt, updatedAt, ...data } = doc as any;
    return data as SiteDatabase;
  }
  // First run: seed from bundled JSON
  await seedDatabase();
  return JSON.parse(JSON.stringify(defaultDatabase)) as SiteDatabase;
}

async function saveDb(data: SiteDatabase): Promise<void> {
  await connectToDatabase();
  await SiteDatabaseModel.findOneAndUpdate(
    { key: DEFAULT_KEY },
    { $set: { ...data, key: DEFAULT_KEY } },
    { upsert: true, new: true }
  );
}

async function seedDatabase(): Promise<void> {
  try {
    const seed = JSON.parse(JSON.stringify(defaultDatabase)) as SiteDatabase;
    await SiteDatabaseModel.findOneAndUpdate(
      { key: DEFAULT_KEY },
      { $setOnInsert: { ...seed, key: DEFAULT_KEY } },
      { upsert: true }
    );
    console.log("[MongoDB] Database seeded from bundled JSON.");
  } catch (err) {
    console.error("[MongoDB] Seeding failed:", err);
  }
}

// ─── Public exports (same API as lib/db.ts) ────────────────────────────────────

export async function getDatabase(): Promise<SiteDatabase> {
  return getDb();
}

export async function saveDatabase(data: SiteDatabase): Promise<void> {
  return saveDb(data);
}

// Projects
export async function getProjects(): Promise<Project[]> {
  const db = await getDb();
  return (db.projects || []).sort((a, b) => a.order - b.order);
}

export async function saveProjects(projects: Project[]): Promise<Project[]> {
  const db = await getDb();
  db.projects = projects;
  await saveDb(db);
  return db.projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await getDb();
  return (db.projects || []).find((p) => p.slug === slug && p.published) || null;
}

// Skills
export async function getSkills(): Promise<Skill[]> {
  const db = await getDb();
  return (db.skills || []).sort((a, b) => a.order - b.order);
}

export async function saveSkills(skills: Skill[]): Promise<Skill[]> {
  const db = await getDb();
  db.skills = skills;
  await saveDb(db);
  return db.skills;
}

// Timeline
export async function getTimeline(): Promise<TimelineItem[]> {
  const db = await getDb();
  return (db.timeline || []).sort((a, b) => a.order - b.order);
}

export async function saveTimeline(timeline: TimelineItem[]): Promise<TimelineItem[]> {
  const db = await getDb();
  db.timeline = timeline;
  await saveDb(db);
  return db.timeline;
}

// Certificates
export async function getCertificates(): Promise<Certificate[]> {
  const db = await getDb();
  return (db.certificates || []).sort((a, b) => a.order - b.order);
}

export async function saveCertificates(certificates: Certificate[]): Promise<Certificate[]> {
  const db = await getDb();
  db.certificates = certificates;
  await saveDb(db);
  return db.certificates;
}

// Services
export async function getServices(): Promise<Service[]> {
  const db = await getDb();
  return (db.services || []).sort((a, b) => a.order - b.order);
}

export async function saveServices(services: Service[]): Promise<Service[]> {
  const db = await getDb();
  db.services = services;
  await saveDb(db);
  return db.services;
}

// Leads
export async function getLeads(): Promise<Lead[]> {
  const db = await getDb();
  return (db.leads || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addLead(leadData: Omit<Lead, "id" | "status" | "createdAt">): Promise<Lead> {
  const db = await getDb();
  const newLead: Lead = {
    ...leadData,
    id: "lead-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  if (!db.leads) db.leads = [];
  db.leads.unshift(newLead);
  if (!db.analytics) {
    db.analytics = { pageViews: 0, cvDownloads: 0, novaConversations: 0, leadsCount: 0 };
  }
  db.analytics.leadsCount = (db.analytics.leadsCount || 0) + 1;
  console.log("[LEAD_SUBMISSION]", JSON.stringify(newLead));
  await saveDb(db);
  return newLead;
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<Lead | null> {
  const db = await getDb();
  const lead = (db.leads || []).find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  await saveDb(db);
  return lead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = await getDb();
  const init = (db.leads || []).length;
  db.leads = (db.leads || []).filter((l) => l.id !== id);
  if (db.leads.length !== init) {
    await saveDb(db);
    return true;
  }
  return false;
}

// Nova
export async function getNovaKnowledge(): Promise<NovaKnowledgeItem[]> {
  const db = await getDb();
  return db.novaKnowledge || [];
}

export async function saveNovaKnowledge(items: NovaKnowledgeItem[]): Promise<NovaKnowledgeItem[]> {
  const db = await getDb();
  db.novaKnowledge = items;
  await saveDb(db);
  return db.novaKnowledge;
}

export async function getNovaSettings(): Promise<NovaSettings> {
  const db = await getDb();
  return db.novaSettings || (defaultDatabase as any).novaSettings;
}

export async function saveNovaSettings(settings: NovaSettings): Promise<NovaSettings> {
  const db = await getDb();
  db.novaSettings = settings;
  await saveDb(db);
  return db.novaSettings;
}

// Profile
export async function getProfile(): Promise<ProfileData> {
  const db = await getDb();
  return db.profile || (defaultDatabase as any).profile;
}

export async function saveProfile(profile: ProfileData): Promise<ProfileData> {
  const db = await getDb();
  db.profile = profile;
  await saveDb(db);
  return db.profile;
}

// CV
export async function getCV(): Promise<CVData> {
  const db = await getDb();
  return db.cv || (defaultDatabase as any).cv;
}

export async function saveCV(cv: CVData): Promise<CVData> {
  const db = await getDb();
  db.cv = cv;
  await saveDb(db);
  return db.cv;
}

export async function incrementCVDownloads(): Promise<number> {
  try {
    const db = await getDb();
    if (!db.cv) db.cv = (defaultDatabase as any).cv;
    if (!db.analytics) {
      db.analytics = { pageViews: 0, cvDownloads: 0, novaConversations: 0, leadsCount: 0 };
    }
    db.cv.downloadCount = (db.cv.downloadCount || 0) + 1;
    db.analytics.cvDownloads = (db.analytics.cvDownloads || 0) + 1;
    await saveDb(db);
    return db.cv.downloadCount;
  } catch (err) {
    console.warn("[Analytics] incrementCVDownloads handled safely:", err);
    return 0;
  }
}

// SEO
export async function getSEO(): Promise<SEOSettings> {
  const db = await getDb();
  return db.seo || (defaultDatabase as any).seo;
}

export async function saveSEO(seo: SEOSettings): Promise<SEOSettings> {
  const db = await getDb();
  db.seo = seo;
  await saveDb(db);
  return db.seo;
}

// Media
export async function getMedia(): Promise<MediaItem[]> {
  const db = await getDb();
  return db.media || [];
}

export async function saveMediaItem(item: MediaItem): Promise<MediaItem> {
  const db = await getDb();
  if (!db.media) db.media = [];
  db.media.unshift(item);
  await saveDb(db);
  return item;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db.media) return false;
  const init = db.media.length;
  db.media = db.media.filter((m) => m.id !== id);
  if (db.media.length !== init) {
    await saveDb(db);
    return true;
  }
  return false;
}

// Featured Video
export async function getFeaturedVideo(): Promise<FeaturedVideo> {
  const db = await getDb();
  return (
    db.featuredVideo ||
    (defaultDatabase as any).featuredVideo || {
      title: "Autonomous AI Agents & Enterprise Architecture Walkthrough",
      titleAr: "شرح معماري متقدم لوكلاء الذكاء الاصطناعي والأتمتة المؤسسية",
      subtitle: "A deep technical breakdown of autonomous agent loops.",
      subtitleAr: "نظرة تفصيلية متعمقة في دورات عمل الوكلاء الذاتية.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      badge: "FEATURED SYSTEM DEMO",
      badgeAr: "عرض توضيحي مميز",
      enabled: true,
    }
  );
}

export async function saveFeaturedVideo(video: FeaturedVideo): Promise<FeaturedVideo> {
  const db = await getDb();
  db.featuredVideo = video;
  await saveDb(db);
  return db.featuredVideo;
}

// Analytics
export async function incrementPageViews(): Promise<number> {
  try {
    const db = await getDb();
    if (!db.analytics) {
      db.analytics = { pageViews: 0, cvDownloads: 0, novaConversations: 0, leadsCount: 0 };
    }
    db.analytics.pageViews = (db.analytics.pageViews || 0) + 1;
    await saveDb(db);
    return db.analytics.pageViews;
  } catch (err) {
    console.warn("[Analytics] incrementPageViews handled safely:", err);
    return 0;
  }
}

export async function incrementNovaConversations(): Promise<number> {
  try {
    const db = await getDb();
    if (!db.analytics) {
      db.analytics = { pageViews: 0, cvDownloads: 0, novaConversations: 0, leadsCount: 0 };
    }
    db.analytics.novaConversations = (db.analytics.novaConversations || 0) + 1;
    await saveDb(db);
    return db.analytics.novaConversations;
  } catch (err) {
    console.warn("[Analytics] incrementNovaConversations handled safely:", err);
    return 0;
  }
}
