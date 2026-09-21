"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProfileData, SEOSettings } from "@/types";
import { User, Search, Globe, Save, CheckCircle2, Link as LinkIcon, Sparkles } from "lucide-react";

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [seo, setSeo] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "seo" | "domain">("profile");
  const [saveStatus, setSaveStatus] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setProfile(data.profile);
      setSeo(data.seo);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !seo) return;

    try {
      setSaveStatus("Saving system parameters...");
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, seo }),
      });
      setSaveStatus("Settings successfully synchronized!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="ECOSYSTEM SETTINGS // PROFILE & SEO CONTROL"
        subtitle="Manage personal identity, academic degrees, social connections, search engine metadata, and custom domain"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-5xl">
        {saveStatus && (
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === "profile"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                : "bg-white/[0.04] text-gray-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Identity</span>
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === "seo"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                : "bg-white/[0.04] text-gray-400 hover:text-white"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>SEO & OpenGraph Metadata</span>
          </button>

          <button
            onClick={() => setActiveTab("domain")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === "domain"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                : "bg-white/[0.04] text-gray-400 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Custom Personal Domain</span>
          </button>
        </div>

        {loading || !profile || !seo ? (
          <div className="py-12 text-center text-gray-500">Loading settings...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* TAB 1: PROFILE MANAGEMENT */}
            {activeTab === "profile" && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm border-b border-white/10 pb-3">
                  Personal & Academic Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Full Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Full Name (Arabic) *</label>
                    <input
                      type="text"
                      required
                      value={profile.nameAr}
                      onChange={(e) => setProfile({ ...profile, nameAr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Professional Job Title (EN) *</label>
                    <input
                      type="text"
                      required
                      value={profile.jobTitle}
                      onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Professional Job Title (AR) *</label>
                    <input
                      type="text"
                      required
                      value={profile.jobTitleAr}
                      onChange={(e) => setProfile({ ...profile, jobTitleAr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">University / Faculty</label>
                    <input
                      type="text"
                      value={profile.university}
                      onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Field of Study</label>
                    <input
                      type="text"
                      value={profile.studyField}
                      onChange={(e) => setProfile({ ...profile, studyField: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Academic Year</label>
                    <input
                      type="text"
                      value={profile.studyYear}
                      onChange={(e) => setProfile({ ...profile, studyYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Availability Status</label>
                    <input
                      type="text"
                      value={profile.availability}
                      onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Short Bio (EN)</label>
                    <textarea
                      rows={2}
                      value={profile.shortBio}
                      onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Short Bio (Arabic)</label>
                    <textarea
                      rows={2}
                      value={profile.shortBioAr}
                      onChange={(e) => setProfile({ ...profile, shortBioAr: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Full Mission Biography (EN)</label>
                  <textarea
                    rows={4}
                    value={profile.fullBio}
                    onChange={(e) => setProfile({ ...profile, fullBio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none leading-relaxed"
                  />
                </div>

                <h3 className="font-bold text-white uppercase tracking-wider text-sm border-b border-white/10 pb-3 pt-4">
                  Communication Channels & Social Networks
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Official Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">WhatsApp Number</label>
                    <input
                      type="text"
                      value={profile.whatsapp}
                      onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Direct Phone Number</label>
                    <input
                      type="text"
                      value={profile.phone || ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+20 100 000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">YouTube Channel URL</label>
                    <input
                      type="text"
                      value={profile.youtube || ""}
                      onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                      placeholder="https://youtube.com/@..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Telegram Channel / Username URL</label>
                    <input
                      type="text"
                      value={profile.telegram || ""}
                      onChange={(e) => setProfile({ ...profile, telegram: e.target.value })}
                      placeholder="https://t.me/yourusername"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Behance Portfolio URL</label>
                    <input
                      type="text"
                      value={profile.behance || ""}
                      onChange={(e) => setProfile({ ...profile, behance: e.target.value })}
                      placeholder="https://behance.net/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Avatar Image URL</label>
                  <input
                    type="text"
                    value={profile.avatarUrl || ""}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    placeholder="/uploads/... or https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                  {profile.avatarUrl && (
                    <div className="mt-2 flex items-center space-x-3">
                      <img
                        src={profile.avatarUrl}
                        alt="Avatar Preview"
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                      <span className="text-[10px] text-gray-400">Live Avatar Preview</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SEO METADATA */}
            {activeTab === "seo" && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm border-b border-white/10 pb-3">
                  Search Engine Optimization (SEO) & OpenGraph
                </h3>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Meta Page Title *</label>
                  <input
                    type="text"
                    required
                    value={seo.metaTitle}
                    onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Meta Description (160 characters recommended)</label>
                  <textarea
                    rows={3}
                    value={seo.metaDescription}
                    onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Keywords (comma separated)</label>
                  <input
                    type="text"
                    value={seo.keywords.join(", ")}
                    onChange={(e) =>
                      setSeo({
                        ...seo,
                        keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">OpenGraph Sharing Image URL</label>
                  <input
                    type="text"
                    value={seo.ogImage}
                    onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Canonical Website URL</label>
                  <input
                    type="text"
                    value={seo.canonicalUrl}
                    onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                    placeholder="https://www.abbasalkady.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">
                    Google Analytics 4 Measurement ID
                  </label>
                  <input
                    type="text"
                    value={seo.googleAnalyticsId || ""}
                    onChange={(e) =>
                      setSeo({ ...seo, googleAnalyticsId: e.target.value.trim() })
                    }
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    On Vercel, also set NEXT_PUBLIC_GA_MEASUREMENT_ID in Environment Variables so Analytics survives production deploys.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-4">
                  <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-xs">
                    Google Search Console
                  </h4>
                  <p className="text-gray-400 text-[11px] font-sans leading-relaxed">
                    اربط النطاق من Search Console بطريقة HTML tag، ثم الصق قيمة content هنا أو في متغير البيئة NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION على Vercel. بعد النشر أرسل Sitemap: /sitemap.xml
                  </p>
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">
                      Google Site Verification
                    </label>
                    <input
                      type="text"
                      value={seo.googleSiteVerification || ""}
                      onChange={(e) =>
                        setSeo({
                          ...seo,
                          googleSiteVerification: e.target.value.trim(),
                        })
                      }
                      placeholder="google-site-verification content"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">
                      Bing Webmaster Verification (optional)
                    </label>
                    <input
                      type="text"
                      value={seo.bingSiteVerification || ""}
                      onChange={(e) =>
                        setSeo({
                          ...seo,
                          bingSiteVerification: e.target.value.trim(),
                        })
                      }
                      placeholder="msvalidate.01 content"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOM DOMAIN SUPPORT */}
            {activeTab === "domain" && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                    Custom Domain Connection Architecture
                  </h3>
                  <p className="text-gray-400 text-xs font-sans mt-1">
                    Connect Abbas El Kady's personal domain (e.g. abbaselkady.com, abbaselkady.dev) with automatic HTTPS SSL encryption.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/[0.03] border border-cyan-500/20 space-y-3">
                  <div className="text-cyan-400 font-bold flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>DNS Configuration Records</span>
                  </div>
                  <div className="space-y-2 text-[11px] font-mono text-gray-300">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Type A (Apex):</span>
                      <span className="text-white font-bold">76.76.21.21</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">CNAME (www):</span>
                      <span className="text-white font-bold">cname.vercel-dns.com / ghs.googlehosted.com</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Primary Domain Name</label>
                  <input
                    type="text"
                    value={seo.canonicalUrl}
                    onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                    placeholder="https://www.abbasalkady.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    No temporary platform URLs are hardcoded in the codebase.
                  </span>
                </div>
              </div>
            )}

            {/* Save Buttons */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
