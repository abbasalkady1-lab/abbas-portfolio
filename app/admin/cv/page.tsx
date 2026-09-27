"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { CVData } from "@/types";
import {
  FileText,
  Download,
  Eye,
  Upload,
  CheckCircle2,
  Save,
  Link as LinkIcon,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

export default function AdminCVPage() {
  const [cv, setCv] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"en" | "ar">("en");

  const fetchCV = async () => {
    try {
      const res = await fetch("/api/cv");
      const data = await res.json();
      setCv(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCV();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, lang: "en" | "ar") => {
    const file = e.target.files?.[0];
    if (!file || !cv) return;

    setUploading(lang);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload via media api
      const uploadRes = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      const mediaItem = await uploadRes.json();
      const today = new Date().toISOString().split("T")[0];

      const updated: CVData = {
        ...cv,
        [lang === "en" ? "enUrl" : "arUrl"]: mediaItem.url,
        [lang === "en" ? "enUpdatedAt" : "arUpdatedAt"]: today,
      };

      setCv(updated);

      // Auto-save to CV database immediately
      const saveRes = await fetch("/api/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (saveRes.ok) {
        setSaveStatus(
          lang === "en"
            ? "English CV uploaded & published live!"
            : "Arabic CV uploaded & published live!"
        );
        setTimeout(() => setSaveStatus(""), 4000);
      }
    } catch (err) {
      alert("Failed to upload CV file. Please ensure file is a valid PDF.");
    } finally {
      setUploading(null);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cv) return;

    setSaving(true);
    try {
      const res = await fetch("/api/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
      });

      if (res.ok) {
        const savedData = await res.json();
        setCv(savedData);
        setSaveStatus("All CV changes saved and updated live on the website!");
        setTimeout(() => setSaveStatus(""), 4000);
      } else {
        throw new Error("Save failed");
      }
    } catch (err) {
      alert("Failed to save CV changes.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-sans text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 placeholder:text-slate-500 transition-colors";
  const labelClass =
    "block text-slate-300 font-sans text-xs font-semibold mb-1.5 uppercase tracking-wide";

  return (
    <div className="flex-1 flex flex-col font-sans">
      <AdminHeader
        title="CURRICULUM VITAE // RESUME STUDIO"
        subtitle="Manage English & Arabic executive resumes, direct URLs, file uploads, and public download metrics"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-5xl">
        {saveStatus && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-sans text-sm font-semibold flex items-center gap-3 shadow-lg shadow-emerald-500/5 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {loading || !cv ? (
          <div className="py-20 text-center text-slate-400 font-sans">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-blue-500" />
            <span>Loading CV management suite...</span>
          </div>
        ) : (
          <form onSubmit={handleSaveAll} className="space-y-6">
            {/* Top Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-xs font-medium uppercase tracking-wider">
                    Total Public Downloads
                  </span>
                  <span className="text-3xl font-extrabold text-white mt-1 block">
                    {cv.downloadCount}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Download className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-xs font-medium uppercase tracking-wider">
                    Active Default Version
                  </span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block">
                    {cv.activeLanguage === "en" ? "English Resume" : "النسخة العربية"}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-xs font-medium uppercase tracking-wider">
                    Latest Sync Date
                  </span>
                  <span className="text-base font-bold text-blue-400 mt-1 block font-mono">
                    {cv.enUpdatedAt || cv.arUpdatedAt || "Current"}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Language Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={`px-5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "en"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>English Resume (EN)</span>
                {cv.activeLanguage === "en" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-400 text-slate-950 font-bold">
                    Default
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ar")}
                className={`px-5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "ar"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>النسخة العربية (AR)</span>
                {cv.activeLanguage === "ar" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-300 text-slate-950 font-bold">
                    افتراضي
                  </span>
                )}
              </button>
            </div>

            {/* Active Language Configuration Card */}
            {activeTab === "en" ? (
              /* ─── ENGLISH RESUME PANEL ─── */
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        English Executive Resume (PDF)
                      </h3>
                      <p className="text-slate-400 text-xs">
                        Displayed on the portfolio when English is active or selected
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCv({ ...cv, activeLanguage: "en" })}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        cv.activeLanguage === "en"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                      }`}
                    >
                      {cv.activeLanguage === "en" ? "✓ Active Default" : "Set as Default"}
                    </button>

                    <a
                      href={cv.enUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span>Preview Live</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Direct File URL or Path *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cv.enUrl}
                        onChange={(e) => setCv({ ...cv, enUrl: e.target.value })}
                        className={inputClass}
                        placeholder="/cv-abbas-elkady-en.pdf or https://..."
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Local file path or cloud storage URL (Google Drive, Cloudinary, AWS S3)
                    </span>
                  </div>

                  <div>
                    <label className={labelClass}>Upload New PDF File</label>
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold cursor-pointer shadow-lg shadow-blue-500/20 text-sm transition-all">
                      <Upload className="w-4 h-4" />
                      <span>{uploading === "en" ? "Uploading..." : "Upload New PDF"}</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "en")}
                        disabled={uploading !== null}
                      />
                    </label>
                    <span className="text-[11px] text-slate-500 mt-1 block text-center">
                      Auto-saves & updates URL immediately upon upload
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Last Updated Date</label>
                    <input
                      type="date"
                      value={cv.enUpdatedAt || ""}
                      onChange={(e) => setCv({ ...cv, enUpdatedAt: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Document Headline (Optional)</label>
                    <input
                      type="text"
                      value={cv.titleEn || ""}
                      onChange={(e) => setCv({ ...cv, titleEn: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. Abbas El Kady — AI Systems & Automation Dossier"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Summary Description (Optional)</label>
                  <textarea
                    rows={3}
                    value={cv.summaryEn || ""}
                    onChange={(e) => setCv({ ...cv, summaryEn: e.target.value })}
                    className={inputClass}
                    placeholder="Comprehensive overview of CS & AI curriculum, autonomous multi-agent pipelines, enterprise n8n workflow systems, software consulting experience, and credentials."
                  />
                </div>
              </div>
            ) : (
              /* ─── ARABIC RESUME PANEL ─── */
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        السيرة الذاتية باللغة العربية (PDF)
                      </h3>
                      <p className="text-slate-400 text-xs">
                        تظهر على الموقع عند اختيار النسخة العربية من السيرة الذاتية
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCv({ ...cv, activeLanguage: "ar" })}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        cv.activeLanguage === "ar"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                      }`}
                    >
                      {cv.activeLanguage === "ar" ? "✓ النسخة الافتراضية" : "تعيين كافتراضي"}
                    </button>

                    <a
                      href={cv.arUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-4 h-4 text-violet-400" />
                      <span>معاينة مباشرة</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>رابط الملف أو المسار المباشر *</label>
                    <input
                      type="text"
                      required
                      value={cv.arUrl}
                      onChange={(e) => setCv({ ...cv, arUrl: e.target.value })}
                      className={inputClass}
                      placeholder="/cv-abbas-elkady-ar.pdf or https://..."
                      dir="ltr"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      مسار الملف المحلي أو رابط سحابي (Google Drive, Cloud Storage)
                    </span>
                  </div>

                  <div>
                    <label className={labelClass}>رفع ملف PDF جديد</label>
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-bold cursor-pointer shadow-lg shadow-violet-500/20 text-sm transition-all">
                      <Upload className="w-4 h-4" />
                      <span>{uploading === "ar" ? "جاري الرفع..." : "رفع ملف PDF جديد"}</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "ar")}
                        disabled={uploading !== null}
                      />
                    </label>
                    <span className="text-[11px] text-slate-500 mt-1 block text-center">
                      يتم حفظ الملف وتحديث الرابط فورياً
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>تاريخ آخر تحديث</label>
                    <input
                      type="date"
                      value={cv.arUpdatedAt || ""}
                      onChange={(e) => setCv({ ...cv, arUpdatedAt: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>عنوان الوثيقة (اختياري)</label>
                    <input
                      type="text"
                      value={cv.titleAr || ""}
                      onChange={(e) => setCv({ ...cv, titleAr: e.target.value })}
                      className={inputClass}
                      placeholder="عباس القاضي — ملف السيرة الذاتية وهندسة الأنظمة الذكية"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>الوصف والملخص (اختياري)</label>
                  <textarea
                    rows={3}
                    value={cv.summaryAr || ""}
                    onChange={(e) => setCv({ ...cv, summaryAr: e.target.value })}
                    className={inputClass}
                    placeholder="ملف شامل يوضح المسار الأكاديمي في علوم الحاسب والذكاء الاصطناعي، ومشاريع بناء وكلاء الذكاء الاصطناعي الذاتية وأتمتة المؤسسات عبر n8n والشهادات المعتمدة."
                    dir="rtl"
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div className="text-xs text-slate-500">
                Any changes made here reflect instantly on the public website.
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-sans font-bold text-sm shadow-xl shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes..." : "Save & Publish Changes"}</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
