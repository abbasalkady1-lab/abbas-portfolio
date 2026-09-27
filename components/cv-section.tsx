"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Eye,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Cpu,
  Workflow,
  Database,
  Layers,
  Award,
} from "lucide-react";
import { CVData } from "@/types";

interface CVSectionProps {
  cv: CVData;
  lang: "en" | "ar";
}

export function CVSection({ cv, lang }: CVSectionProps) {
  const isAr = lang === "ar";
  // Default to language matching the current site lang or cv activeLanguage
  const [selectedLang, setSelectedLang] = useState<"en" | "ar">(
    lang === "ar" ? "ar" : cv.activeLanguage || "en"
  );
  const [downloadCount, setDownloadCount] = useState(cv.downloadCount || 0);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync when parent site language changes
  useEffect(() => {
    setSelectedLang(lang === "ar" ? "ar" : "en");
  }, [lang]);

  // Keep local download count in sync if cv prop updates
  useEffect(() => {
    if (cv.downloadCount !== undefined) {
      setDownloadCount(cv.downloadCount);
    }
  }, [cv.downloadCount]);

  const activeUrl = selectedLang === "en" ? cv.enUrl : cv.arUrl;
  const lastUpdated = selectedLang === "en" ? cv.enUpdatedAt : cv.arUpdatedAt;

  const title =
    selectedLang === "en"
      ? cv.titleEn || "Abbas El Kady — AI Engineer & Intelligent Systems Builder"
      : cv.titleAr || "عباس القاضي — مهندس ذكاء اصطناعي ومطور أنظمة وأتمتة ذكية";

  const summary =
    selectedLang === "en"
      ? cv.summaryEn ||
        "Comprehensive curriculum vitae covering 3rd-year CS & AI curriculum, autonomous multi-agent pipelines, enterprise n8n workflow systems, software consulting experience, and credentials."
      : cv.summaryAr ||
        "ملف سيرة ذاتية شامل يوضح المسار الأكاديمي في علوم الحاسب والذكاء الاصطناعي، ومشاريع بناء وكلاء الذكاء الاصطناعي الذاتية وأتمتة المؤسسات عبر n8n والشهادات المعتمدة.";

  const highlights =
    selectedLang === "en"
      ? [
          {
            icon: Cpu,
            title: "Autonomous AI Agents",
            desc: "ReAct loops, Gemini 1.5 & tool calling",
          },
          {
            icon: Workflow,
            title: "Enterprise n8n Automations",
            desc: "High-throughput webhooks & CRM sync",
          },
          {
            icon: Database,
            title: "Precision RAG Engines",
            desc: "Hybrid search with zero-hallucination citations",
          },
          {
            icon: Layers,
            title: "Scalable Full-Stack Web",
            desc: "Next.js App Router, TypeScript & Postgres",
          },
        ]
      : [
          {
            icon: Cpu,
            title: "وكلاء الذكاء الاصطناعي",
            desc: "دورات ReAct، نماذج Gemini 1.5 واستدعاء الأدوات",
          },
          {
            icon: Workflow,
            title: "أتمتة العمليات n8n",
            desc: "خطافات ويب فائقة السرعة وربط الـ CRM",
          },
          {
            icon: Database,
            title: "محركات RAG الدقيقة",
            desc: "بحث هجين مع توثيق المصادر بدون هلوسة",
          },
          {
            icon: Layers,
            title: "تطبيقات ويب متكاملة",
            desc: "Next.js الحديث، TypeScript وقواعد البيانات",
          },
        ];

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
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleCopyLink = () => {
    try {
      const fullUrl = activeUrl.startsWith("http")
        ? activeUrl
        : `${window.location.origin}${activeUrl}`;
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="cv" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-1.5 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sky-600 dark:text-cyan-400 font-mono text-xs mb-3 shadow-md shadow-cyan-500/5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
            <span className="font-bold tracking-wider uppercase">
              {isAr ? "السيرة الذاتية الرسمية والمحدثة" : "CURRICULUM VITAE // VERIFIED DOSSIER"}
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            <span className="animate-shimmer-text inline-block">
              {isAr ? "السيرة الذاتية والملف المهني" : "Executive CV & Engineering Dossier"}
            </span>
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "تحميل السيرة الذاتية المحدثة باللغتين العربية والإنجليزية، متضمنة المشاريع والخبرات والأبحاث الأكاديمية والشهادات المعتمدة."
              : "Download the updated curriculum vitae in English and Arabic, highlighting AI agent architectures, n8n automations, and academic milestones."}
          </p>
        </motion.div>

        {/* Master CV Dossier Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-cyan-500/20 p-6 sm:p-10 shadow-2xl shadow-blue-500/5 overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-gradient-to-tr from-violet-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

          {/* Top Bar: Language Tabs & Status Badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6 mb-8">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">
                {isAr ? "لغة السيرة الذاتية:" : "Resume Language:"}
              </span>

              <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedLang("en")}
                  className={`relative px-4 py-1.5 rounded-xl font-bold transition-all ${
                    selectedLang === "en"
                      ? "text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  English Version
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLang("ar")}
                  className={`relative px-4 py-1.5 rounded-xl font-bold transition-all ${
                    selectedLang === "ar"
                      ? "text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  النسخة العربية
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isAr ? "جاهز للتحميل" : "Verified PDF"}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                <span>{lastUpdated || "2026"}</span>
              </div>
            </div>
          </div>

          {/* Dossier Body: Interactive Presentation */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual PDF Mockup with Corner Fold Effect */}
            <div className="lg:col-span-4 flex justify-center">
              <motion.div
                whileHover={{ y: -4, rotate: -1 }}
                transition={{ duration: 0.3 }}
                className="w-56 h-72 sm:w-60 sm:h-80 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0D1527] dark:to-[#070D19] border-2 border-slate-200 dark:border-white/10 p-5 shadow-2xl flex flex-col justify-between relative group overflow-hidden"
              >
                {/* Decorative Top Document Ribbon */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                  <div className="absolute transform rotate-45 bg-blue-600 text-white font-mono text-[9px] font-bold py-0.5 right-[-35px] top-[18px] w-[120px] text-center shadow-md">
                    2026 ATS
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-blue-600 dark:text-cyan-400 font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-white/[0.04] border border-blue-100 dark:border-white/10">
                      {selectedLang.toUpperCase()}
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white font-sans line-clamp-1">
                      {selectedLang === "en" ? "Abbas El Kady" : "عباس القاضي"}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {selectedLang === "en"
                        ? "AI Engineer & Architect"
                        : "مهندس ذكاء اصطناعي وأتمتة"}
                    </div>
                  </div>

                  {/* Visual Document Skeleton Lines */}
                  <div className="space-y-1.5 pt-2">
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/15 rounded-full" />
                    <div className="w-4/5 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full" />
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full" />
                    <div className="w-3/5 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full" />
                  </div>
                </div>

                <div className="border-t border-slate-200/90 dark:border-white/10 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verified</span>
                  </span>
                  <span className="text-blue-600 dark:text-cyan-400 font-bold">PDF Format</span>
                </div>
              </motion.div>
            </div>

            {/* Document Details & High-Conversion Action Hub */}
            <div className="lg:col-span-8 space-y-6 text-left rtl:text-right">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-1.5">
                  <Award className="w-4 h-4" />
                  <span>{isAr ? "ملف الكفاءات والخبرات" : "EXECUTIVE PROFILE & CURRICULUM"}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 dark:text-white leading-snug">
                  {title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans mt-2.5 leading-relaxed">
                  {summary}
                </p>
              </div>

              {/* 4 Pillars Highlight Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {highlights.map((h, i) => {
                  const HIcon = h.icon;
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-start gap-3 group hover:border-blue-500/30 transition-all"
                    >
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5">
                        <HIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white font-sans truncate">
                          {h.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-tight mt-0.5">
                          {h.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                {/* Primary Download CTA */}
                <motion.button
                  onClick={handleDownload}
                  disabled={downloading}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2.5 rtl:space-x-reverse px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-sans text-sm font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                >
                  <Download className={`w-4 h-4 ${downloading ? "animate-bounce" : ""}`} />
                  <span>
                    {downloading
                      ? isAr
                        ? "جاري بدء التحميل..."
                        : "Preparing PDF..."
                      : isAr
                      ? "تحميل السيرة الذاتية (PDF)"
                      : "Download Executive CV (PDF)"}
                  </span>
                </motion.button>

                {/* Secondary Preview Link */}
                <motion.a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-white border border-slate-300 dark:border-white/10 font-sans text-xs sm:text-sm font-semibold transition-all shadow-sm"
                >
                  <Eye className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <span>{isAr ? "معاينة الملف" : "Preview in Browser"}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </motion.a>

                {/* Tertiary Copy Direct Link */}
                <motion.button
                  type="button"
                  onClick={handleCopyLink}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-3.5 rounded-2xl bg-transparent hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-white/10 font-sans text-xs font-medium transition-all"
                  title="Copy Direct Link"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">
                        {isAr ? "تم نسخ الرابط!" : "Copied!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>{isAr ? "نسخ الرابط" : "Copy Link"}</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Total Downloads & Security Badge Footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans border-t border-slate-100 dark:border-white/5 gap-2">
                <div className="flex items-center gap-1.5 font-mono">
                  <span>{isAr ? "إجمالي مرات التحميل:" : "Total Public Downloads:"}</span>
                  <span className="font-bold text-blue-600 dark:text-cyan-400 text-sm">
                    {downloadCount}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isAr ? "متوافق مع أنظمة الفرز الذكية ATS" : "ATS Format Optimized"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
