"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Bot, Workflow, Network, Zap, FileCode, Layers, Palette, Server, Database, Flame, GitBranch, Boxes, Code2 } from "lucide-react";
import { Skill } from "@/types";

interface SkillsMatrixProps {
  skills: Skill[];
  lang: "en" | "ar";
}

// Icon mapping helper
const iconMap: Record<string, React.ElementType> = {
  Brain,
  Bot,
  Sparkles,
  Workflow,
  Network,
  Zap,
  FileCode,
  Layers,
  Palette,
  Server,
  Database,
  Flame,
  GitBranch,
  Boxes,
  Code2,
};

export function SkillsMatrix({ skills, lang }: SkillsMatrixProps) {
  const isAr = lang === "ar";
  const visibleSkills = skills.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  // Group by category
  const categories = Array.from(new Set(visibleSkills.map((s) => s.category)));
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredSkills =
    activeCategory === "All"
      ? visibleSkills
      : visibleSkills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-mono text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "مصفوفة الكفاءة والقدرات التقنية" : "CAPABILITY MATRIX // EXPERTISE"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "المهارات والقدرات التقنية" : "Technical Arsenal & Proficiencies"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "مجموعة شاملة من الأدوات والمنهجيات ونماذج الذكاء الاصطناعي التي أستخدمها في بناء الأنظمة المتقدمة."
              : "Comprehensive stack of artificial intelligence models, automation engines, and modern full-stack frameworks."}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-medium transition-all ${
              activeCategory === "All"
                ? "bg-sky-600 text-white font-semibold shadow-sm dark:bg-cyan-400 dark:text-slate-950"
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] dark:text-slate-300 dark:border-white/10"
            }`}
          >
            {isAr ? "الكل" : "All Specializations"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-sky-600 text-white font-semibold shadow-sm dark:bg-cyan-400 dark:text-slate-950"
                  : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] dark:text-slate-300 dark:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => {
            const Icon = iconMap[skill.iconName] || Code2;
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-[#0F121C] p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 flex flex-col justify-between group shadow-sm dark:shadow-none transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 dark:bg-white/[0.04] dark:border-white/10 dark:text-cyan-400 group-hover:scale-105 transition-all duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-sky-600 dark:text-cyan-400 font-semibold">
                      {skill.level}%
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-sans group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">{skill.category}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
