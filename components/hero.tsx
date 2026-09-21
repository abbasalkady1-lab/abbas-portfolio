"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bot,
  ArrowRight,
  Download,
  Cpu,
  Workflow,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { ProfileData } from "@/types";
import { HeroNeuralMatrix } from "@/components/hero/hero-neural-matrix";

interface HeroProps {
  profile: ProfileData;
  lang: "en" | "ar";
  onOpenNova: () => void;
}

export function Hero({ profile, lang, onOpenNova }: HeroProps) {
  const isAr = lang === "ar";

  const capabilities = isAr
    ? [
        "وكلاء الذكاء الاصطناعي",
        "أتمتة العمليات n8n",
        "محركات RAG الدقيقة",
        "ذكاء صوتي متعدد الوسائط",
        "أنظمة ويب ذكية",
      ]
    : [
        "Autonomous AI Agents",
        "n8n Enterprise Automation",
        "Precision Cognitive RAG",
        "Real-time Multimodal Voice",
        "Scalable Web Systems",
      ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Asymmetric 2-Column Hero Grid — Seamlessly Unified */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Editorial Authority & Choreographed Sequence */}
          <div className="lg:col-span-7 space-y-6 text-left rtl:text-right">
            {/* 1. 100ms: Availability & Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="inline-flex items-center space-x-2.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#0B1627]/90 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-slate-200 font-mono text-xs shadow-sm backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {isAr ? profile.availabilityAr : profile.availability}
              </span>
            </motion.div>

            {/* 2. 200ms: Label & 300ms/450ms: Name & Animated Typography */}
            <div className="space-y-2">
              {/* 200ms: Editorial Hierarchy Label */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-xs sm:text-sm font-mono tracking-widest text-[#0066FF] dark:text-[#00C2FF] uppercase font-bold"
              >
                {isAr ? "عباس القاضي // ملف الأعمال الرقمي" : "ABBAS EL KADY // OFFICIAL PORTFOLIO"}
              </motion.div>

              {/* 300ms: Mask/Clip Name Reveal + 450ms: Slow Gradient Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white leading-[1.08]">
                {/* 300ms: Name with smooth clip/mask */}
                <motion.span
                  initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                  animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                  transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-slate-950 dark:text-white"
                >
                  {isAr ? profile.nameAr : profile.name}
                </motion.span>

                {/* 450ms: Headline with Slow Animated Gradient Flow */}
                <motion.span
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-gradient-primary mt-2"
                >
                  {isAr ? (
                    "مهندس ذكاء اصطناعي ومطور منتجات ذكية"
                  ) : (
                    "AI Engineer & Intelligent Products Builder"
                  )}
                </motion.span>
              </h1>
            </div>

            {/* 3. 600ms: Value Proposition Statement */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-sans leading-relaxed max-w-2xl font-normal"
            >
              {isAr
                ? "أصمم وأهندس وكلاء ذكاء اصطناعي ذاتية التفكير، مسارات أتمتة مؤسسية عبر n8n، ومحركات معرفية متقدمة تحول التحديات الرقمية إلى منتجات حقيقية تخدم ملايين العمليات."
                : "Architecting autonomous AI agents, enterprise n8n workflow automations, and precision RAG engines that turn complex requirements into high-value intelligent digital products."}
            </motion.p>

            {/* 4. 750ms: Engineering Capability Badges (Staggered) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.75 }}
              className="flex flex-wrap gap-2 pt-1"
            >
              {capabilities.map((cap, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.75 + i * 0.05 }}
                  whileHover={{ scale: 1.05, borderColor: "rgba(10, 132, 255, 0.4)" }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 text-slate-700 dark:text-slate-300 font-sans text-xs font-semibold shadow-sm hover:shadow-md transition-all cursor-default"
                >
                  {cap}
                </motion.span>
              ))}
            </motion.div>

            {/* 5. 900ms: 3-Tier CTAs with Micro-Interactions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="pt-2 flex flex-wrap items-center gap-3.5"
            >
              {/* Primary CTA: Explore Work */}
              <motion.a
                href="#projects"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center space-x-2.5 rtl:space-x-reverse px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#0A84FF] to-[#6D5DFB] text-white font-sans text-sm font-bold shadow-lg shadow-[#0066FF]/25 hover:shadow-xl hover:shadow-[#0066FF]/35 transition-all"
              >
                <span>{isAr ? "استعراض المشاريع الرائدة" : "Explore Flagship Work"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </motion.a>

              {/* Secondary CTA: Talk to NOVA */}
              <motion.button
                onClick={onOpenNova}
                whileHover={{
                  y: -2,
                  borderColor: "rgba(10, 132, 255, 0.6)",
                  boxShadow: "0 0 25px -4px rgba(10, 132, 255, 0.25)",
                }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center space-x-2.5 rtl:space-x-reverse px-5 py-3.5 rounded-xl bg-white/90 dark:bg-[#0B1627]/90 hover:bg-white text-slate-800 border border-slate-300 dark:border-white/15 dark:text-white shadow-sm transition-all"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#00C2FF] animate-pulse" />
                <Bot className="w-4 h-4 text-[#0066FF] dark:text-[#00C2FF]" />
                <span className="font-bold text-sm">{isAr ? "تحدث مع NOVA" : "Talk to Nova"}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A84FF]/10 text-[#0066FF] dark:text-[#00C2FF] font-mono font-bold">
                  AI Voice
                </span>
              </motion.button>

              {/* Tertiary CTA: Download CV */}
              <motion.a
                href="#cv"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-3 rounded-xl text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.05] font-sans text-xs sm:text-sm font-semibold transition-all"
              >
                <Download className="w-4 h-4 text-slate-500 group-hover:text-slate-900" />
                <span>{isAr ? "تحميل السيرة الذاتية" : "Download CV"}</span>
              </motion.a>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: 1000ms: Living AI Agentic Network Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <HeroNeuralMatrix lang={lang} />
          </motion.div>
        </div>

        {/* High-Tech Proof Strip with Color-Tinted Depth */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.15 }}
          className="mt-14 sm:mt-18 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto text-left rtl:text-right"
        >
          {/* Card 1: Academic & AI Focus (Blue Tint) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.22 }}
            className="card-ai p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#0A84FF] text-xs mb-1.5 font-mono">
              <Cpu className="w-4 h-4" />
              <span>{isAr ? "التخصص الأكاديمي" : "Academic Focus"}</span>
            </div>
            <div className="text-slate-950 dark:text-white font-bold text-sm sm:text-base font-sans">
              Computer Science &amp; AI
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-sans">
              {isAr ? "الفرقة الثالثة &bull; كلية الحاسبات والذكاء الاصطناعي" : "3rd Year &bull; CS & AI Faculty"}
            </div>
          </motion.div>

          {/* Card 2: Agentic AI (Violet Tint) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.22 }}
            className="card-automation p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#6D5DFB] text-xs mb-1.5 font-mono">
              <Bot className="w-4 h-4" />
              <span>{isAr ? "أنظمة الوكلاء الذاتية" : "Agentic AI"}</span>
            </div>
            <div className="text-slate-950 dark:text-white font-bold text-sm sm:text-base font-sans">
              ReAct &amp; Tool Calling
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-sans">
              {isAr ? "Gemini 1.5 &bull; ذاكرة موثقة &bull; أدوات" : "Gemini 1.5 &bull; Grounded &bull; Multi-Agent"}
            </div>
          </motion.div>

          {/* Card 3: Enterprise Automation (Cyan Tint) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.22 }}
            className="card-voice p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#00C2FF] text-xs mb-1.5 font-mono">
              <Workflow className="w-4 h-4" />
              <span>{isAr ? "أتمتة العمليات n8n" : "Enterprise Automation"}</span>
            </div>
            <div className="text-slate-950 dark:text-white font-bold text-sm sm:text-base font-sans">
              50k+ Daily Actions
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-sans">
              {isAr ? "واتساب &bull; CRM &bull; تكامل Webhooks" : "WhatsApp &bull; CRM &bull; Webhook Queues"}
            </div>
          </motion.div>

          {/* Card 4: Verified Precision (Emerald Tint) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.22 }}
            className="card-rag p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#22C55E] text-xs mb-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? "الدقة المعتمدة" : "Precision RAG"}</span>
            </div>
            <div className="text-slate-950 dark:text-white font-bold text-sm sm:text-base font-sans">
              100% Citations
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-sans">
              {isAr ? "بحث هجين &bull; عزل تام &bull; بدون هلوسة" : "Hybrid Vector &bull; Zero Hallucination"}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
