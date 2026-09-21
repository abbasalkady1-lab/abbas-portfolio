"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Calendar, Sparkles, ExternalLink } from "lucide-react";
import { TimelineItem } from "@/types";

interface TimelineSectionProps {
  timeline: TimelineItem[];
  lang: "en" | "ar";
}

export function TimelineSection({ timeline, lang }: TimelineSectionProps) {
  const isAr = lang === "ar";
  const [filter, setFilter] = useState<"all" | "experience" | "education">("all");

  const sortedItems = [...timeline]
    .filter((item) => (filter === "all" ? true : item.type === filter))
    .sort((a, b) => a.order - b.order);

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/25 text-sky-700 dark:text-cyan-400 font-mono text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "المسيرة الأكاديمية والمهنية" : "CHRONOLOGY // EXPERIENCE & EDUCATION"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "الخبرات والتعليم الأكاديمي" : "Experience & Academic Milestones"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "المحطات الأكاديمية والمهنية في علوم الحاسب وتطوير أنظمة الذكاء الاصطناعي."
              : "Track record of technical leadership, university academia, and client consulting solutions."}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center space-x-2.5 rtl:space-x-reverse mb-14 font-sans text-xs font-medium">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === "all"
                ? "bg-sky-600 text-white font-semibold shadow-sm dark:bg-cyan-400 dark:text-slate-950"
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/[0.03] dark:text-slate-300 dark:border-white/10"
            }`}
          >
            {isAr ? "كافة المحطات" : "Full Timeline"}
          </button>
          <button
            onClick={() => setFilter("experience")}
            className={`flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl transition-all ${
              filter === "experience"
                ? "bg-sky-600 text-white font-semibold shadow-sm dark:bg-cyan-400 dark:text-slate-950"
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/[0.03] dark:text-slate-300 dark:border-white/10"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isAr ? "الخبرات العملية" : "Experience"}</span>
          </button>
          <button
            onClick={() => setFilter("education")}
            className={`flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl transition-all ${
              filter === "education"
                ? "bg-sky-600 text-white font-semibold shadow-sm dark:bg-cyan-400 dark:text-slate-950"
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/[0.03] dark:text-slate-300 dark:border-white/10"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{isAr ? "التعليم الأكاديمي" : "Education"}</span>
          </button>
        </div>

        {/* Timeline Line & Items */}
        <div className="relative border-l border-slate-200 dark:border-white/10 ml-4 sm:ml-32 space-y-9">
          {sortedItems.map((item, idx) => {
            const isEdu = item.type === "education";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="relative pl-6 sm:pl-8 group"
              >
                {/* Node on Timeline Line */}
                <div
                  className={`absolute -left-[7px] top-2 w-3.5 h-3.5 rounded-full border-2 ${
                    isEdu
                      ? "bg-white dark:bg-[#090A0F] border-indigo-500 group-hover:bg-indigo-500 dark:border-indigo-400 dark:group-hover:bg-indigo-400"
                      : "bg-white dark:bg-[#090A0F] border-sky-500 group-hover:bg-sky-500 dark:border-cyan-400 dark:group-hover:bg-cyan-400"
                  } transition-colors duration-200`}
                />

                {/* Date on the left (Desktop) */}
                <div className="hidden sm:block absolute -left-32 top-1.5 text-right w-24 font-mono text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-slate-900 dark:text-white font-semibold block">{item.endDate}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.startDate}</span>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-[#0F121C] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold ${
                        isEdu
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                          : "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20"
                      }`}
                    >
                      {isEdu ? (isAr ? "تعليم" : "Education") : (isAr ? "خبرة مهنية" : "Experience")}
                    </span>

                    {/* Mobile Date */}
                    <span className="sm:hidden font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 rtl:space-x-reverse">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {item.startDate} &mdash; {item.endDate}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors">
                    {isAr && item.titleAr ? item.titleAr : item.title}
                  </h3>

                  <p className="text-xs font-mono text-sky-600 dark:text-cyan-400 mt-0.5">
                    {isAr && item.organizationAr ? item.organizationAr : item.organization}
                  </p>

                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-3 font-sans leading-relaxed">
                    {isAr && item.descriptionAr ? item.descriptionAr : item.description}
                  </p>

                  {item.verificationLink && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
                      <a
                        href={item.verificationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-sky-600 hover:text-sky-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-mono"
                      >
                        <span>{isAr ? "التحقق من المؤهل" : "Verify Credential"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
