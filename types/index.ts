export interface Project {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  shortDescription: string;
  shortDescriptionAr?: string;
  fullDescription: string;
  fullDescriptionAr?: string;
  problem?: string;
  problemAr?: string;
  solution?: string;
  solutionAr?: string;
  architecture?: string;
  architectureAr?: string;
  role?: string;
  roleAr?: string;
  aiCapabilities?: string[];
  aiCapabilitiesAr?: string[];
  metrics?: { label: string; labelAr?: string; value: string }[];
  technicalChallenges?: string;
  technicalChallengesAr?: string;
  result?: string;
  resultAr?: string;
  category: "AI" | "AI Agents" | "Automation" | "n8n" | "Web Development" | "Software" | "Experiments";
  technologies: string[];
  thumbnail: string;
  coverImage?: string;
  screenshots: string[];
  demoVideo?: string;
  youtubeUrl?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  year: string;
  status: "Completed" | "In Development" | "Live Production" | "Prototype";
  featured: boolean;
  published: boolean;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: "Artificial Intelligence" | "Automation & n8n" | "Programming & Frameworks" | "Backend & Databases" | "Tools & DevOps";
  level: number; // 1-100 percentage
  iconName: string;
  order: number;
  visible: boolean;
}

export interface TimelineItem {
  id: string;
  type: "experience" | "education";
  title: string;
  titleAr?: string;
  organization: string;
  organizationAr?: string;
  description: string;
  descriptionAr?: string;
  startDate: string;
  endDate: string; // e.g. "Present" or "2025"
  logo?: string;
  verificationLink?: string;
  order: number;
}

export interface Certificate {
  id: string;
  title: string;
  titleAr?: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
  imageUrl?: string;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  iconName: string;
  features: string[];
  featuresAr?: string[];
  ctaText?: string;
  ctaTextAr?: string;
  contactMethod?: "whatsapp" | "email" | "both";
  whatsappMessage?: string;
  whatsappMessageAr?: string;
  emailSubject?: string;
  priceEstimate?: string;
  priceEstimateAr?: string;
  deliveryTime?: string;
  deliveryTimeAr?: string;
  visible?: boolean;
  order: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
}

export interface NovaKnowledgeItem {
  id: string;
  question: string;
  questionAr?: string;
  answer: string;
  answerAr?: string;
  category: "Bio" | "Skills" | "Projects" | "Work & Hire" | "Education" | "General";
  enabled: boolean;
}

export interface NovaSettings {
  enabled: boolean;
  welcomeMessageEn: string;
  welcomeMessageAr: string;
  systemInstructions: string;
  voiceGender: "male" | "female";
  speakingTone: "professional" | "innovative" | "friendly" | "concise";
  allowedActions: string[];
}

export interface CVData {
  enUrl: string;
  arUrl: string;
  enUpdatedAt: string;
  arUpdatedAt: string;
  activeLanguage: "en" | "ar";
  downloadCount: number;
}

export interface ProfileData {
  name: string;
  nameAr: string;
  jobTitle: string;
  jobTitleAr: string;
  university: string;
  universityAr: string;
  studyField: string;
  studyFieldAr: string;
  studyYear: string;
  studyYearAr?: string;
  location: string;
  locationAr: string;
  availability: string;
  availabilityAr: string;
  shortBio: string;
  shortBioAr: string;
  fullBio: string;
  fullBioAr: string;
  avatarUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  behance?: string;
  youtube?: string;
  telegram?: string;
  twitter?: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedAt: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  embedUrl?: string;
  title?: string;
  description?: string;
}

export interface SiteDatabase {
  profile: ProfileData;
  projects: Project[];
  skills: Skill[];
  timeline: TimelineItem[];
  certificates: Certificate[];
  services: Service[];
  leads: Lead[];
  novaKnowledge: NovaKnowledgeItem[];
  novaSettings: NovaSettings;
  cv: CVData;
  seo: SEOSettings;
  media: MediaItem[];
  analytics: {
    pageViews: number;
    cvDownloads: number;
    novaConversations: number;
    leadsCount: number;
  };
}
