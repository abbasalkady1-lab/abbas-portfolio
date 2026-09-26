"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Play, Sparkles, Tv, ShieldCheck, Cpu } from "lucide-react";
import { YoutubeIcon } from "@/components/icons";
import { FeaturedVideo } from "@/types";

interface FeaturedVideoSectionProps {
  video?: FeaturedVideo;
  lang: "en" | "ar";
}

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = trimmed.match(regExp);
  if (match) return match[1];
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes(".")) {
    return trimmed;
  }
  return null;
}

export function FeaturedVideoSection({ video, lang }: FeaturedVideoSectionProps) {
  const isAr = lang === "ar";

  // If section is explicitly disabled by admin, do not render
  if (video && video.enabled === false) {
    return null;
  }

  // Fallback defaults
  const title = isAr
    ? video?.titleAr || video?.title || "شرح معماري متقدم لوكلاء الذكاء الاصطناعي والأتمتة المؤسسية"
    : video?.title || "Autonomous AI Agents & Enterprise Architecture Walkthrough";

  const subtitle = isAr
    ? video?.subtitleAr ||
      video?.subtitle ||
      "نظرة تفصيلية متعمقة في دورات عمل الوكلاء الذاتية، خطوط المعالجة الصوتية فائقة السرعة، ومسارات الأتمتة ذاتية التعافي."
    : video?.subtitle ||
      "A deep technical breakdown of autonomous agent loops, low-latency voice pipelines, and self-healing n8n automations.";

  const badge = isAr
    ? video?.badgeAr || video?.badge || "فيديو توضيحي مميز"
    : video?.badge || "FEATURED SYSTEM DEMO";

  const rawUrl = video?.youtubeUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const ytId = extractYouTubeId(rawUrl);
  const embedUrl = ytId
    ? `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&showinfo=0`
    : null;

  return (
    <section
      id="featured-video"
      className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-50/50 dark:bg-white/[0.01] overflow-hidden"
    >
      {/* Anchor alias to support previous bookmarks */}
      <span id="simulator" className="sr-only" />

      {/* Ambient background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#0066FF]/10 via-[#00C2FF]/10 to-[#6D5DFB]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-1.5 rounded-full bg-[#0066FF]/10 dark:bg-[#00C2FF]/10 border border-[#0066FF]/20 dark:border-[#00C2FF]/30 text-[#0066FF] dark:text-[#00C2FF] text-xs font-mono tracking-wider font-semibold shadow-md shadow-blue-500/5"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/20" />
            <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
            <span>{badge}</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            <span className="animate-shimmer-text inline-block">
              {title}
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* The YouTube Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-slate-900/95 dark:bg-[#07111F]/90 border border-slate-700/60 dark:border-white/15 shadow-2xl dark:shadow-[0_20px_60px_-15px_rgba(0,194,255,0.15)] group"
        >
          {/* Top Window Chrome Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700/60 dark:border-white/10 bg-slate-800/80 dark:bg-white/[0.03] backdrop-blur-md">
            {/* Traffic Window Buttons */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 dark:text-slate-400 ps-2">
                stream://live-architecture-demo
              </span>
            </div>

            {/* Live Indicator & YouTube External Link */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-md bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>YouTube 4K HD</span>
              </div>

              {rawUrl && (
                <a
                  href={rawUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-mono text-slate-300 hover:text-white hover:underline transition-colors px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                  <span>{isAr ? "مشاهدة على يوتيوب" : "Watch on YouTube"}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Video Container (16:9 Aspect Ratio) */}
          <div className="relative w-full aspect-video bg-black/90 flex items-center justify-center overflow-hidden">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
                  <Play className="w-7 h-7 fill-current" />
                </div>
                <div className="text-slate-300 font-mono text-sm">
                  {isAr
                    ? "يرجى تعيين رابط فيديو يوتيوب من لوحة التحكم"
                    : "Please configure a valid YouTube URL from Admin Dashboard"}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Highlights Matrix Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-slate-700/60 dark:divide-white/10 border-t border-slate-700/60 dark:border-white/10 bg-slate-800/50 dark:bg-white/[0.02] text-xs font-mono">
            <div className="p-4 flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 rounded-lg bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#0066FF] dark:text-[#00C2FF] shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-200 dark:text-white font-bold text-xs">
                  {isAr ? "وكلاء ذاتيون متعددو الوسائط" : "Autonomous Multimodal Agents"}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isAr ? "هندسة أتمتة RAG و n8n" : "RAG & n8n Orchestration"}
                </div>
              </div>
            </div>

            <div className="p-4 flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-200 dark:text-white font-bold text-xs">
                  {isAr ? "جاهزية إنتاجية كاملة" : "100% Production Ready"}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isAr ? "تأمين وحماية على مستوى المؤسسات" : "Enterprise-grade Isolation"}
                </div>
              </div>
            </div>

            <div className="p-4 flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-200 dark:text-white font-bold text-xs">
                  {isAr ? "استجابة فورية فائقة السرعة" : "Sub-450ms Voice AI"}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isAr ? "معالجة فورية وتزامن ذكي" : "Bidirectional Low Latency"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
