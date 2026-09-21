"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Eye, CheckCircle2, Sparkles } from "lucide-react";
import { CVData } from "@/types";

interface CVSectionProps {
  cv: CVData;
  lang: "en" | "ar";
}

export function CVSection({ cv, lang }: CVSectionProps) {
  const isAr = lang === "ar";
  const [selectedLang, setSelectedLang] = useState<"en" | "ar">("en");
  const [downloadCount, setDownloadCount] = useState(cv.downloadCount);
  const [downloading, setDownloading] = useState(false);

  const activeUrl = selectedLang === "en" ? cv.enUrl : cv.arUrl;
  const lastUpdated = selectedLang === "en" ? cv.enUpdatedAt : cv.arUpdatedAt;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Record download metric
      await fetch("/api/cv/download", { method: "POST" });
      setDownloadCount((prev) => prev + 1);

      // Trigger download
      const link = document.createElement("a");
      link.href = activeUrl;
      link.download = `Abbas-ElKady-CV-${selectedLang.toUpperCase()}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      window.open(activeUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="cv" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/25 text-sky-700 dark:text-cyan-400 font-mono text-xs mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "السيرة الذاتية الرسمية" : "CURRICULUM VITAE // DOSSIER"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "السيرة الذاتية المهنية" : "Executive CV & Resume"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "تحميل السيرة الذاتية المحدثة باللغتين العربية والإنجليزية، متضمنة المشاريع والخبرات والأبحاث الأكاديمية."
              : "Download the updated curriculum vitae in English and Arabic, highlighting AI agent architectures, n8n automations, and academic milestones."}
          </p>
        </div>

        {/* CV Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="bg-white dark:bg-[#0F121C] p-7 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden"
        >
          {/* Top Controls: Language Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6 mb-8">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-xs font-sans text-slate-500 dark:text-slate-400">
                {isAr ? "لغة الوثيقة:" : "Resume Language:"}
              </span>
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 font-sans text-xs">
                <button
                  onClick={() => setSelectedLang("en")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    selectedLang === "en"
                      ? "bg-sky-600 text-white font-semibold shadow-sm dark:bg-cyan-400 dark:text-slate-950"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  English Version
                </button>
                <button
                  onClick={() => setSelectedLang("ar")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    selectedLang === "ar"
                      ? "bg-sky-600 text-white font-semibold shadow-sm dark:bg-cyan-400 dark:text-slate-950"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  النسخة العربية
                </button>
              </div>
            </div>

            <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
              <span>{isAr ? "آخر تحديث: " : "Last Updated: "}</span>
              <span className="text-sky-600 dark:text-cyan-400 font-semibold">{lastUpdated}</span>
            </div>
          </div>

          {/* Document Summary Display */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual Document Mockup */}
            <div className="md:col-span-4 flex justify-center">
              <div className="w-48 h-64 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-4 shadow-sm flex flex-col justify-between relative group">
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-white/[0.04] border border-sky-100 dark:border-white/10 flex items-center justify-center text-sky-600 dark:text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded" />
                  <div className="w-3/4 h-1.5 bg-slate-200 dark:bg-white/10 rounded" />
                  <div className="w-5/6 h-1.5 bg-slate-200 dark:bg-white/10 rounded" />
                </div>
                <div className="border-t border-slate-200/80 dark:border-white/5 pt-2 text-[11px] font-mono text-sky-600 dark:text-cyan-400 flex items-center justify-between">
                  <span>PDF Document</span>
                  <span>{selectedLang.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Document Details and Action Buttons */}
            <div className="md:col-span-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
                  Abbas El Kady &mdash; Full CV (PDF)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-sans mt-2 leading-relaxed">
                  {selectedLang === "en"
                    ? "Comprehensive overview of 3rd-year CS & AI curriculum, autonomous multi-agent pipelines, enterprise n8n workflow systems, software consulting experience, and credentials."
                    : "ملف شامل يوضح المسار الأكاديمي في علوم الحاسب والذكاء الاصطناعي، ومشاريع بناء وكلاء الذكاء الاصطناعي الذاتية وأتمتة المؤسسات عبر n8n والشهادات المعتمدة."}
                </p>
              </div>

              {/* Bullet Features */}
              <div className="grid grid-cols-2 gap-2 text-xs font-sans text-slate-700 dark:text-slate-300">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
                  <span>Verified Credentials</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
                  <span>Project Case Studies</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
                  <span>Academic Honors</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
                  <span>Direct Contact Info</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-semibold shadow-md shadow-sky-600/20 dark:bg-cyan-400 dark:hover:bg-cyan-300 dark:text-slate-950 transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloading
                      ? isAr
                        ? "جاري التحميل..."
                        : "Downloading..."
                      : isAr
                      ? "تحميل السيرة الذاتية (PDF)"
                      : "Download CV (PDF)"}
                  </span>
                </button>

                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 rtl:space-x-reverse px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-white dark:border-white/10 font-sans text-xs font-medium transition-colors shadow-sm"
                >
                  <Eye className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                  <span>{isAr ? "معاينة في نافذة جديدة" : "Preview PDF"}</span>
                </a>
              </div>

              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>{isAr ? "إجمالي مرات التحميل: " : "Total Downloads: "}</span>
                <span className="text-sky-600 dark:text-cyan-400 font-semibold">{downloadCount}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
