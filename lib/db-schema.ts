import mongoose, { Schema, Model } from "mongoose";

// We store the entire portfolio database as a SINGLE document in MongoDB.
// This mirrors the current JSON file approach exactly — one document, all data.
// The document is identified by { key: "main" }.

// Using a fully loose schema (Schema.Types.Mixed for everything) to avoid
// TypeScript conflicts with complex nested types.
const SiteDatabaseSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true, index: true },
    profile: Schema.Types.Mixed,
    projects: { type: Array, default: [] },
    skills: { type: Array, default: [] },
    timeline: { type: Array, default: [] },
    certificates: { type: Array, default: [] },
    services: { type: Array, default: [] },
    leads: { type: Array, default: [] },
    novaKnowledge: { type: Array, default: [] },
    novaSettings: Schema.Types.Mixed,
    cv: Schema.Types.Mixed,
    seo: Schema.Types.Mixed,
    media: { type: Array, default: [] },
    featuredVideo: Schema.Types.Mixed,
    analytics: Schema.Types.Mixed,
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Prevent model re-compilation during Next.js hot reloads
export const SiteDatabaseModel: Model<any> =
  mongoose.models.SiteDatabase ||
  mongoose.model("SiteDatabase", SiteDatabaseSchema);
