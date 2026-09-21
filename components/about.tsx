"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Briefcase, Mail, Phone, Sparkles, Code2, Workflow, Bot } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { ProfileData } from "@/types";

interface AboutProps {
  profile: ProfileData;
  lang: "en" | "ar";
}

export function About({ profile, lang }: AboutProps) {
  const isAr = lang === "ar";

  const pillars = [
    {
      icon: Bot,
      titleEn: "Autonomous AI Agents",
      titleAr: "وكلاء الذكاء الاصطناعي الذاتية",
      descEn: "Building goal-driven agents that reason, browse the web, invoke custom APIs, and execute complex workflows without human intervention.",
      descAr: "بناء وكلاء متقدمين قادرين على اتخاذ القرار، تصفح الويب، استدعاء الأدوات البرمجية، وتنفيذ المهام المعقدة ذاتياً.",
    },
    {
      icon: Workflow,
      titleEn: "Enterprise n8n Automation",
      titleAr: "أتمتة الأعمال المتقدمة بـ n8n",
      descEn: "Orchestrating robust end-to-end pipelines that connect messaging platforms, CRMs, and payment systems with self-healing capabilities.",
      descAr: "تنسيق مسارات عمل مؤسسية تربط منصات التواصل وإدارة العملاء بالدفع الآلي مع قدرة ذاتية على معالجة الأخطاء.",
    },
    {
      icon: Code2,
      titleEn: "Modern Software Engineering",
      titleAr: "هندسة البرمجيات والويب الحديث",
      descEn: "Engineering type-safe, ultra-fast full-stack web applications with Next.js, TypeScript, and modern distributed cloud backends.",
      descAr: "تطوير تطبيقات ويب فائقة الأداء والأمان باستخدام Next.js و TypeScript والأنظمة السحابية الموزعة.",
    },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-mono text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "نظرة عامة والتوجه الرقمي" : "SYSTEM ARCHITECTURE // IDENTITY"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "عن عباس القاضي" : "About Abbas El Kady"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "الجمع بين قوة الذكاء الاصطناعي التوليدي وهندسة البرمجيات لبناء حلول رقمية مستقلة وفعالة."
              : "Bridging the gap between cutting-edge Artificial Intelligence and resilient software architecture."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 bg-white dark:bg-[#0F121C] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden group shadow-sm dark:shadow-lg"
          >
            {/* Subtle corner light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl -z-10 group-hover:bg-sky-500/10 dark:group-hover:bg-cyan-500/10 transition-all" />

            {/* Avatar / Portrait */}
            <div className="relative w-28 h-28 mx-auto mb-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 p-1 bg-slate-50 dark:bg-white/[0.02] shadow-sm">
              <img
                src={profile.avatarUrl}
                alt={isAr ? profile.nameAr : profile.name}
                className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>

            <h3 className="text-center text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-sans">
              {isAr ? profile.nameAr : profile.name}
            </h3>
            <p className="text-center text-xs font-mono text-sky-600 dark:text-cyan-400 mt-1 uppercase tracking-wider">
              {isAr ? profile.jobTitleAr : profile.jobTitle}
            </p>

            {/* Quick Metadata */}
            <div className="mt-6 space-y-3 font-sans text-xs border-t border-b border-slate-100 dark:border-white/5 py-4 text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <GraduationCap className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
                <span>{isAr ? profile.universityAr : profile.university}</span>
              </div>
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>
                  {isAr ? profile.studyFieldAr : profile.studyField} &bull; {isAr ? profile.studyYearAr : profile.studyYear}
                </span>
              </div>
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isAr ? profile.locationAr : profile.location}</span>
              </div>
            </div>

            {/* Social & Contact Links */}
            <div className="mt-6 flex items-center justify-center space-x-2.5 rtl:space-x-reverse">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-950 border border-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:text-slate-400 dark:hover:text-white dark:border-white/10 transition-all shadow-sm"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-950 border border-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:text-slate-400 dark:hover:text-white dark:border-white/10 transition-all shadow-sm"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              <a
                href={`mailto:${profile.email}`}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-950 border border-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:text-slate-400 dark:hover:text-white dark:border-white/10 transition-all shadow-sm"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-950 border border-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:text-slate-400 dark:hover:text-white dark:border-white/10 transition-all shadow-sm"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Focus Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-5"
          >
            {/* Bio Card */}
            <div className="bg-white dark:bg-[#0F121C] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-md">
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-sans mb-3 flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-400" />
                <span>{isAr ? "الرؤية والهدف المهني" : "Mission & Technical Philosophy"}</span>
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base font-sans">
                {isAr ? profile.fullBioAr : profile.fullBio}
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 gap-3.5">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white hover:bg-slate-50/80 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 dark:border-white/5 dark:hover:border-white/20 flex items-start space-x-3.5 rtl:space-x-reverse shadow-sm dark:shadow-none transition-all"
                  >
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 dark:bg-white/[0.04] dark:border-white/10 dark:text-cyan-400 shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white font-sans">
                        {isAr ? pillar.titleAr : pillar.titleEn}
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-sans leading-relaxed">
                        {isAr ? pillar.descAr : pillar.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
