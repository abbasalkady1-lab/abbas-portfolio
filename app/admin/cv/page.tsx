"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { CVData } from "@/types";
import { FileText, Download, Eye, Upload, CheckCircle2, RefreshCw, Save } from "lucide-react";

export default function AdminCVPage() {
  const [cv, setCv] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>("");

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
      const mediaItem = await uploadRes.json();

      const updated = {
        ...cv,
        [lang === "en" ? "enUrl" : "arUrl"]: mediaItem.url,
        [lang === "en" ? "enUpdatedAt" : "arUpdatedAt"]: new Date().toISOString().split("T")[0],
      };

      setCv(updated);

      // Save CV changes
      await fetch("/api/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      setSaveStatus(`${lang.toUpperCase()} CV successfully uploaded!`);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      alert("Failed to upload CV");
    } finally {
      setUploading(null);
    }
  };

  const handleSetActiveLang = async (activeLang: "en" | "ar") => {
    if (!cv) return;
    const updated = { ...cv, activeLanguage: activeLang };
    setCv(updated);
    await fetch("/api/cv", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  };

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="CURRICULUM VITAE // RESUME STUDIO"
        subtitle="Upload, replace, and preview English and Arabic PDF resumes with live download metrics"
      />

      <main className="p-6 sm:p-8 space-y-8 max-w-5xl">
        {saveStatus && (
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        {loading || !cv ? (
          <div className="py-12 text-center text-gray-500">Loading CV data...</div>
        ) : (
          <div className="space-y-8">
            {/* Download Metrics Strip */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">
                  Total Recorded Public Downloads
                </span>
                <span className="text-3xl font-black text-white">{cv.downloadCount}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block uppercase text-[10px]">
                  Active Default Version
                </span>
                <span className="text-emerald-400 font-bold text-sm uppercase">
                  {cv.activeLanguage === "en" ? "English Version" : "Arabic Version"}
                </span>
              </div>
            </div>

            {/* English CV Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">English Executive Resume (PDF)</h3>
                    <p className="text-gray-400 text-xs">Last Updated: {cv.enUpdatedAt}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSetActiveLang("en")}
                    className={`px-3 py-1.5 rounded-xl border transition-all ${
                      cv.activeLanguage === "en"
                        ? "bg-cyan-500 text-black font-bold border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                        : "bg-white/[0.04] text-gray-400 border-white/10 hover:text-white"
                    }`}
                  >
                    {cv.activeLanguage === "en" ? "Active Default" : "Set as Default"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-gray-300 font-mono break-all text-[11px] max-w-md">
                  <span className="text-gray-500 block">File Path / URL:</span>
                  <span>{cv.enUrl}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <a
                    href={cv.enUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>Preview</span>
                  </a>

                  <label className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
                    <Upload className="w-4 h-4" />
                    <span>{uploading === "en" ? "Uploading..." : "Upload New PDF"}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "en")}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Arabic CV Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Arabic Executive Resume (PDF)</h3>
                    <p className="text-gray-400 text-xs">آخر تحديث: {cv.arUpdatedAt}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSetActiveLang("ar")}
                    className={`px-3 py-1.5 rounded-xl border transition-all ${
                      cv.activeLanguage === "ar"
                        ? "bg-violet-500 text-white font-bold border-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                        : "bg-white/[0.04] text-gray-400 border-white/10 hover:text-white"
                    }`}
                  >
                    {cv.activeLanguage === "ar" ? "Active Default" : "Set as Default"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-gray-300 font-mono break-all text-[11px] max-w-md">
                  <span className="text-gray-500 block">File Path / URL:</span>
                  <span>{cv.arUrl}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <a
                    href={cv.arUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-violet-400" />
                    <span>Preview</span>
                  </a>

                  <label className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all">
                    <Upload className="w-4 h-4" />
                    <span>{uploading === "ar" ? "Uploading..." : "Upload New PDF"}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "ar")}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
