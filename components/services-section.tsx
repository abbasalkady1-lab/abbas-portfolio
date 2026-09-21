"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
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
              ? "تصميم وهندسة أنظمة الوكلاء المستقلين، أتمتة العمليات المؤسسية المعقدة عبر n8n، ومحركات RAG وتطبيقات الويب الذكية مع تواصل فوري ومباشر عبر واتساب أو البريد."
              : "End-to-end engineering of autonomous AI agents, enterprise n8n workflow automations, precision RAG pipelines, and scalable web platforms with direct WhatsApp & Email booking."}
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
          {visibleServices.map((srv, index) => {
            const IconComponent = serviceIcons[srv.iconName] || Bot;
            const features = isAr && srv.featuresAr?.length ? srv.featuresAr : srv.features;
            const title = isAr && srv.titleAr ? srv.titleAr : srv.title;
            const description = isAr && srv.descriptionAr ? srv.descriptionAr : srv.description;
            const price = isAr && srv.priceEstimateAr ? srv.priceEstimateAr : srv.priceEstimate;
            const delivery = isAr && srv.deliveryTimeAr ? srv.deliveryTimeAr : srv.deliveryTime;

            // WhatsApp link preparation
            const defaultWaMsg = isAr
              ? `مرحباً عباس، أود الاستفسار والبدء في تنفيذ خدمة: "${title}"`
              : `Hello Abbas, I would like to inquire about your service: "${title}"`;
            const waText = (isAr ? srv.whatsappMessageAr : srv.whatsappMessage) || defaultWaMsg;
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;

            // Email link preparation
            const defaultEmailSubject =
              (isAr ? `[استفسار عن خدمة] ${title}` : `[Service Inquiry] ${title}`);
            const defaultEmailBody = isAr
              ? `مرحباً عباس،\n\nأود الحصول على تفاصيل واستشارة بخصوص خدمة "${title}".\n\nتفاصيل المشروع ومتطلبات العمل:\n- `
              : `Hello Abbas,\n\nI am reaching out to discuss your "${title}" service.\n\nProject details & requirements:\n- `;
            const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
              defaultEmailSubject
            )}&body=${encodeURIComponent(defaultEmailBody)}`;

            const method = srv.contactMethod || "both";

            return (
              <motion.div
                key={srv.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-white dark:bg-[#0D111A] rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-sky-400/80 dark:hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-2xl hover:shadow-sky-500/10 p-7 sm:p-8 relative overflow-hidden"
              >
                {/* Dynamic animated glow sweep on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-sky-500 dark:via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  {/* Top Bar: Floating Animated Icon + Delivery/Pricing Badges */}
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-600 dark:bg-white/[0.04] dark:border-white/10 dark:text-cyan-400 group-hover:bg-sky-100/90 dark:group-hover:bg-cyan-500/15 group-hover:border-sky-300 dark:group-hover:border-cyan-500/30 transition-all duration-300 shadow-sm relative"
                    >
                      <IconComponent className="w-6 h-6 transition-transform duration-300" />
                      {/* Pulse ring on hover */}
                      <span className="absolute -inset-1 rounded-2xl bg-sky-400/20 dark:bg-cyan-400/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
                    </motion.div>

                    <div className="flex flex-wrap items-center gap-2 justify-end">
                      {delivery && (
                        <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-xs">
                          <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                          <span>{delivery}</span>
                        </span>
                      )}
                      {price && (
                        <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs">
                          <Coins className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{price}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-sans group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors duration-200">
                    {title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 font-sans leading-relaxed">
                    {description}
                  </p>

                  {/* Features / Deliverables List with animated checkmarks */}
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
                    <div className="text-[11px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 mb-3 tracking-wider">
                      {isAr ? "المخرجات والقدرات الأساسية:" : "Key Deliverables & Specs:"}
                    </div>
                    <ul className="space-y-2.5 font-sans text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
                      {features.map((feat, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: isAr ? 5 : -5 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.15 + idx * 0.05 }}
                          className="flex items-center space-x-2.5 rtl:space-x-reverse group/item hover:translate-x-1 rtl:group-hover/item:-translate-x-1 transition-transform duration-150"
                        >
                          <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0 group-hover/item:scale-110 transition-transform" />
                          <span>{feat}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct Action Area (WhatsApp & Email buttons based on dashboard settings) */}
                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/5 space-y-2.5 relative z-10">
                  {method === "both" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* WhatsApp Button */}
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold shadow-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all group/btn"
                      >
                        <MessageCircle className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                        <span>{isAr ? "واتساب فوري" : "WhatsApp Chat"}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                      </motion.a>

                      {/* Email Button */}
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={emailUrl}
                        className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-700 border border-slate-200/80 hover:border-sky-300 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-200 dark:hover:text-white dark:border-white/10 font-sans text-xs font-semibold transition-all group/email"
                      >
                        <Mail className="w-4 h-4 text-sky-600 dark:text-cyan-400 group-hover/email:scale-110 transition-transform" />
                        <span>{isAr ? "طلب بالبريد" : "Email Inquiry"}</span>
                      </motion.a>
                    </div>
                  ) : method === "whatsapp" ? (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold shadow-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all group/btn"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <MessageCircle className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                        <span>
                          {srv.ctaText || (isAr ? "طلب الخدمة عبر واتساب" : "Inquire via WhatsApp")}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 rtl:group-hover/btn:-translate-x-1.5 transition-transform" />
                    </motion.a>
                  ) : (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={emailUrl}
                      className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-sans text-xs font-semibold shadow-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all group/btn"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Mail className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span>
                          {srv.ctaText || (isAr ? "طلب الخدمة عبر البريد" : "Inquire via Email")}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 rtl:group-hover/btn:-translate-x-1.5 transition-transform" />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Global Consultation Strip with animated gradient borders */}
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
                ? "تواصل مع عباس القاضي مباشرة لمناقشة التفاصيل وتصميم استراتيجية التنفيذ المناسبة."
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
    </section>
  );
}
