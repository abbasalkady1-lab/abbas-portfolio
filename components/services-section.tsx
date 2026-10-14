"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Bot,
  Workflow,
  Database,
  Code2,
  Sparkles,
  Zap,
  Network,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  Mail,
  Clock,
  Coins,
  MessageCircle,
  ExternalLink,
  Play,
  X,
  ChevronRight,
  DollarSign,
  Info,
  Flame,
} from "lucide-react";
import { Service, ProfileData } from "@/types";

interface ServicesSectionProps {
  services: Service[];
  profile?: ProfileData;
  lang: "en" | "ar";
}

const serviceIcons: Record<string, React.ElementType> = {
  Bot,
  Workflow,
  Database,
  Code2,
  Sparkles,
  Zap,
  Network,
  ShieldCheck,
  Cpu,
  Layers,
};

// Extract standard embed URL from various YouTube formats
function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`;
  }
  return null;
}

// Container stagger animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

export function ServicesSection({ services, profile, lang }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  if (!services || services.length === 0) return null;

  const isAr = lang === "ar";
  const visibleServices = services
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  // Clean phone number for WhatsApp
  const rawPhone = profile?.whatsapp || profile?.phone || "+201000000000";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const emailAddress = profile?.email || "contact@abbaselkady.dev";

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-sky-400/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with animated badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-1.5 rounded-full bg-sky-50 dark:bg-cyan-500/10 border border-sky-200/80 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-400 font-mono text-xs mb-3 shadow-sm hover:scale-105 transition-transform duration-200">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
            </motion.div>
            <span className="font-semibold tracking-wider uppercase">
              {isAr ? "خدماتي الهندسية المخصصة" : "BESPOKE ENGINEERING SERVICES"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "خدمات وحلول الذكاء الاصطناعي والأتمتة" : "Intelligent Services & Solutions"}
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "تصميم وهندسة أنظمة الوكلاء المستقلين، أتمتة العمليات المؤسسية عبر n8n، ومحركات RAG وتطبيقات الويب الذكية مع تواصل فوري ومباشر عبر واتساب أو الروابط الخارجية."
              : "End-to-end engineering of autonomous AI agents, enterprise n8n workflow automations, precision RAG pipelines, and scalable web platforms with direct WhatsApp, Email, & instant external booking."}
          </p>
        </motion.div>

        {/* Services Grid with Framer Motion Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8"
        >
          {visibleServices.map((srv) => {
            const IconComponent = serviceIcons[srv.iconName] || Bot;
            const features = isAr && srv.featuresAr?.length ? srv.featuresAr : srv.features;
            const title = isAr && srv.titleAr ? srv.titleAr : srv.title;
            const description = isAr && srv.descriptionAr ? srv.descriptionAr : srv.description;
            const price = isAr && (srv.priceAr || srv.priceEstimateAr)
              ? (srv.priceAr || srv.priceEstimateAr)
              : (srv.price || srv.priceEstimate);
            const delivery = isAr && srv.deliveryTimeAr ? srv.deliveryTimeAr : srv.deliveryTime;
            const badgeText = isAr && srv.badgeAr ? srv.badgeAr : srv.badge;

            // Determine action type
            const actionType = srv.actionType || srv.contactMethod || "both";

            // WhatsApp link preparation
            const defaultWaMsg = isAr
              ? `مرحباً عباس، أود الاستفسار والبدء في تنفيذ خدمة: "${title}"`
              : `Hello Abbas, I would like to inquire about your service: "${title}"`;
            const waText = (isAr ? srv.whatsappMessageAr : srv.whatsappMessage) || defaultWaMsg;
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;

            // Email link preparation
            const defaultEmailSubject =
              isAr ? `[استفسار عن خدمة] ${title}` : `[Service Inquiry] ${title}`;
            const defaultEmailBody = isAr
              ? `مرحباً عباس،\n\nأود الحصول على تفاصيل واستشارة بخصوص خدمة "${title}".\n\nالمتطلبات وميزانية المشروع:\n- `
              : `Hello Abbas,\n\nI am reaching out to discuss your "${title}" service.\n\nProject details & requirements:\n- `;
            const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
              defaultEmailSubject
            )}&body=${encodeURIComponent(defaultEmailBody)}`;

            // External link preparation
            const externalUrl = srv.externalUrl || "";
            const externalLabel = isAr
              ? (srv.externalUrlLabelAr || srv.ctaTextAr || "طلب الخدمة أونلاين")
              : (srv.externalUrlLabel || srv.ctaText || "Get Service Online");

            const hasVideo = Boolean(srv.youtubeUrl);
            const hasThumbnail = Boolean(srv.thumbnail);

            return (
              <motion.div
                key={srv.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-white dark:bg-[#0B1324] rounded-3xl border border-slate-200/80 dark:border-white/10 hover:border-sky-400/80 dark:hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-2xl hover:shadow-sky-500/10 relative overflow-hidden"
              >
                {/* Dynamic animated glow sweep on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-sky-500 dark:via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* ─── Thumbnail / Media Banner ─── */}
                <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-900 border-b border-slate-100 dark:border-white/5">
                  {hasThumbnail ? (
                    <img
                      src={srv.thumbnail}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1)_0%,transparent_70%)]" />
                      <IconComponent className="w-20 h-20 text-sky-500/15 group-hover:text-cyan-400/25 transition-colors duration-300" />
                    </div>
                  )}

                  {/* Gradient shade over thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1324] via-[#0B1324]/40 to-black/30" />

                  {/* Floating Badges on Thumbnail */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    {badgeText ? (
                      <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-[11px] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white shadow-lg backdrop-blur-md">
                        <Flame className="w-3 h-3" />
                        <span>{badgeText}</span>
                      </span>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-1.5">
                      {delivery && (
                        <span className="inline-flex items-center space-x-1 rtl:space-x-reverse text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-200 border border-white/10 shadow-xs">
                          <Clock className="w-3 h-3 text-sky-400" />
                          <span>{delivery}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price Tag badge on bottom edge of thumbnail */}
                  {price && (
                    <div className="absolute bottom-3 left-3.5 rtl:left-auto rtl:right-3.5 z-10">
                      <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 shadow-lg">
                        <Coins className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{price}</span>
                      </span>
                    </div>
                  )}

                  {/* Watch Video Button Overlay if youtubeUrl is present */}
                  {hasVideo && (
                    <button
                      type="button"
                      onClick={() => setSelectedService(srv)}
                      className="absolute bottom-3 right-3.5 rtl:right-auto rtl:left-3.5 z-10 inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title={isAr ? "مشاهدة فيديو شرح الخدمة" : "Watch Explainer Video"}
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{isAr ? "فيديو الشرح" : "Watch Video"}</span>
                    </button>
                  )}
                </div>

                {/* ─── Card Body ─── */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    {/* Floating Animated Icon + Title Header */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-600 dark:bg-white/[0.04] dark:border-white/10 dark:text-cyan-400 group-hover:bg-sky-100/90 dark:group-hover:bg-cyan-500/15 group-hover:border-sky-300 dark:group-hover:border-cyan-500/30 transition-all duration-300 shadow-sm shrink-0">
                        <IconComponent className="w-5 h-5 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-sans group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors duration-200 leading-snug">
                          {title}
                        </h3>
                        {isAr && srv.title && (
                          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5" dir="ltr">
                            {srv.title}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-sans leading-relaxed line-clamp-2">
                      {description}
                    </p>

                    {/* Features / Deliverables List */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="text-[11px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2.5 tracking-wider">
                        {isAr ? "المخرجات والقدرات الأساسية:" : "Key Deliverables & Specs:"}
                      </div>
                      <ul className="space-y-2 font-sans text-xs text-slate-700 dark:text-slate-300">
                        {features.slice(0, 3).map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-center space-x-2 rtl:space-x-reverse"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                        {features.length > 3 && (
                          <li className="text-[11px] text-sky-600 dark:text-cyan-400 font-semibold cursor-pointer hover:underline pt-0.5"
                              onClick={() => setSelectedService(srv)}>
                            {isAr
                              ? `+ ${features.length - 3} مخرجات إضافية (انقر للتفاصيل)`
                              : `+ ${features.length - 3} more deliverables (click for details)`}
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Quick Trigger to Open Details Modal */}
                    <button
                      type="button"
                      onClick={() => setSelectedService(srv)}
                      className="mt-4 inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-semibold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors cursor-pointer group/more"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{isAr ? "عرض التفاصيل الكاملة والفيديو" : "View Full Details & Specs"}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover/more:translate-x-1 rtl:group-hover/more:-translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* ─── Card Action Area (Based on Dashboard Settings) ─── */}
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 space-y-2">
                    {/* Case 1: External Link Only */}
                    {actionType === "external" && externalUrl && (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-sans text-xs font-bold shadow-md hover:shadow-xl hover:shadow-blue-500/25 transition-all group/btn"
                      >
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          <span>{externalLabel}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                      </motion.a>
                    )}

                    {/* Case 2: WhatsApp Only */}
                    {actionType === "whatsapp" && (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold shadow-md hover:shadow-xl hover:shadow-emerald-500/25 transition-all group/btn"
                      >
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <MessageCircle className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                          <span>
                            {srv.ctaText || (isAr ? "طلب الخدمة عبر واتساب" : "Inquire via WhatsApp")}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                      </motion.a>
                    )}

                    {/* Case 3: Email Only */}
                    {actionType === "email" && (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={emailUrl}
                        className="inline-flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-sans text-xs font-bold shadow-md hover:shadow-xl hover:shadow-sky-500/25 transition-all group/btn"
                      >
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Mail className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          <span>
                            {srv.ctaText || (isAr ? "طلب الخدمة عبر البريد" : "Inquire via Email")}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                      </motion.a>
                    )}

                    {/* Case 4: Both / Multi-action (WhatsApp + External OR WhatsApp + Email) */}
                    {(actionType === "both" || (!externalUrl && actionType === "external")) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* WhatsApp Button */}
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold shadow-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all group/btn"
                        >
                          <MessageCircle className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                          <span>{isAr ? "واتساب مباشر" : "WhatsApp"}</span>
                        </motion.a>

                        {/* Second Button: External Link if available, otherwise Email */}
                        {externalUrl ? (
                          <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-sans text-xs font-bold shadow-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all group/ext"
                          >
                            <ExternalLink className="w-3.5 h-3.5 group-hover/ext:scale-110 transition-transform" />
                            <span className="truncate">{externalLabel}</span>
                          </motion.a>
                        ) : (
                          <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href={emailUrl}
                            className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-700 border border-slate-200/80 hover:border-sky-300 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-200 dark:hover:text-white dark:border-white/10 font-sans text-xs font-bold transition-all group/email"
                          >
                            <Mail className="w-4 h-4 text-sky-600 dark:text-cyan-400 group-hover/email:scale-110 transition-transform" />
                            <span>{isAr ? "طلب بالبريد" : "Email Inquiry"}</span>
                          </motion.a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Global Consultation Strip */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-cyan-500/10 border border-sky-200/80 dark:border-cyan-500/25 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-start relative overflow-hidden shadow-sm"
        >
          <div className="relative z-10">
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-sans flex items-center justify-center sm:justify-start space-x-2 rtl:space-x-reverse">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-cyan-400 animate-pulse" />
              <span>{isAr ? "هل لديك متطلبات خاصة أو بنية معقدة؟" : "Have a Custom AI Architecture in Mind?"}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-sans">
              {isAr
                ? "تواصل مع عباس القاضي مباشرة لمناقشة التفاصيل وتصميم استراتيجية التنفيذ المناسبة لمشروعك."
                : "Schedule a direct technical consultation via WhatsApp or Email to architect your solution."}
            </p>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse shrink-0 relative z-10">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                isAr
                  ? "مرحباً عباس، أود حجز استشارة تقنية لمشروع ذكاء اصطناعي وأتمتة"
                  : "Hello Abbas, I would like to schedule a technical consultation for an AI & automation project"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold shadow-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? "واتساب مباشر" : "WhatsApp"}</span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${emailAddress}?subject=${encodeURIComponent(
                isAr ? "طلب استشارة تقنية مخصصة" : "Bespoke Technical Consultation Request"
              )}`}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white dark:border-white/15 font-sans text-xs font-semibold transition-all shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>{isAr ? "إرسال بريد" : "Email"}</span>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ─── INTERACTIVE EXPANDED SERVICE DETAILS MODAL ─── */}
      {/* ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl bg-[#0B1324] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-slate-200 font-sans"
            >
              {/* Modal Header Bar */}
              <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 sticky top-0 z-20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-cyan-400 border border-cyan-500/20">
                    {React.createElement(serviceIcons[selectedService.iconName] || Bot, { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      {isAr && selectedService.titleAr ? selectedService.titleAr : selectedService.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {selectedService.title}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                {/* 1. YouTube Video Embed Player OR High-Res Banner */}
                {selectedService.youtubeUrl && getYouTubeEmbedUrl(selectedService.youtubeUrl) ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-semibold text-red-400">
                        <Play className="w-3.5 h-3.5 fill-red-400" />
                        {isAr ? "فيديو توضيحي وشرح للخدمة" : "Service Explainer Video"}
                      </span>
                      <a
                        href={selectedService.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                      >
                        <span>{isAr ? "فتح على يوتيوب" : "Open in YouTube"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedService.youtubeUrl)!}
                        title={selectedService.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                ) : selectedService.thumbnail ? (
                  <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                    <img
                      src={selectedService.thumbnail}
                      alt={selectedService.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1324] via-transparent to-transparent" />
                  </div>
                ) : null}

                {/* 2. Key Metadata Cards (Price, Timeline, Status) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Price */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold block mb-1 flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {isAr ? "التكلفة التقديرية" : "Estimated Cost"}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-emerald-300 font-sans">
                      {isAr && (selectedService.priceAr || selectedService.priceEstimateAr)
                        ? (selectedService.priceAr || selectedService.priceEstimateAr)
                        : (selectedService.price || selectedService.priceEstimate || (isAr ? "تسعير مخصص" : "Custom Engineering"))}
                    </span>
                  </div>

                  {/* Delivery Timeline */}
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                    <span className="text-[11px] font-mono text-sky-400 uppercase font-semibold block mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {isAr ? "الجدول الزمني" : "Delivery Timeline"}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-sky-200 font-sans">
                      {isAr && selectedService.deliveryTimeAr
                        ? selectedService.deliveryTimeAr
                        : (selectedService.deliveryTime || (isAr ? "حسب النطاق" : "Scope-based"))}
                    </span>
                  </div>

                  {/* Badge or Category */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold block mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {isAr ? "مستوى الاعتماد" : "Tier"}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-200 font-sans">
                      {isAr && selectedService.badgeAr
                        ? selectedService.badgeAr
                        : (selectedService.badge || (isAr ? "جاهز للإنتاج" : "Production Grade"))}
                    </span>
                  </div>
                </div>

                {/* 3. Detailed Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    {isAr ? "نظرة عامة وشرح تفصيلي:" : "Full Solution Overview:"}
                  </h4>
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-sm leading-relaxed text-slate-300 font-sans">
                    {isAr
                      ? (selectedService.fullDescriptionAr || selectedService.descriptionAr || selectedService.description)
                      : (selectedService.fullDescription || selectedService.description)}
                  </div>
                </div>

                {/* 4. Complete Deliverables Checklist */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    {isAr ? "المخرجات المضمنة والمواصفات الفنية:" : "Included Deliverables & Technical Specs:"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(isAr && selectedService.featuresAr?.length
                      ? selectedService.featuresAr
                      : selectedService.features
                    ).map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer with Direct Actions */}
              <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isAr ? "إغلاق النافذة" : "Close"}
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* External Link button if provided */}
                  {selectedService.externalUrl && (
                    <a
                      href={selectedService.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>
                        {isAr
                          ? (selectedService.externalUrlLabelAr || selectedService.ctaTextAr || "احصل على الخدمة الآن")
                          : (selectedService.externalUrlLabel || selectedService.ctaText || "Get Service Now")}
                      </span>
                    </a>
                  )}

                  {/* WhatsApp Direct Action */}
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      (isAr ? selectedService.whatsappMessageAr : selectedService.whatsappMessage) ||
                        (isAr
                          ? `مرحباً عباس، أود طلب وتنفيذ خدمة: "${selectedService.titleAr || selectedService.title}"`
                          : `Hello Abbas, I would like to inquire and proceed with: "${selectedService.title}"`)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isAr ? "محادثة واتساب فورية" : "WhatsApp Chat"}</span>
                  </a>

                  {/* Email Action */}
                  <a
                    href={`mailto:${emailAddress}?subject=${encodeURIComponent(
                      isAr
                        ? `[استفسار عن خدمة] ${selectedService.titleAr || selectedService.title}`
                        : `[Service Inquiry] ${selectedService.title}`
                    )}&body=${encodeURIComponent(
                      isAr
                        ? `مرحباً عباس، أود الاستفسار عن خدمة "${selectedService.titleAr || selectedService.title}" ومناقشة تفاصيل المشروع.`
                        : `Hello Abbas, I am reaching out regarding "${selectedService.title}".`
                    )}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
                  >
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span>{isAr ? "بريد إلكتروني" : "Email"}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
