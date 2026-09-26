"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Bot,
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
  X,
  ExternalLink,
  Award,
  Clock,
  Tag,
} from "lucide-react";
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
  const visibleSkills = skills
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  // Group by category
  const categories = Array.from(
    new Set(visibleSkills.map((s) => s.category))
  );
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const filteredSkills =
    activeCategory === "All"
      ? visibleSkills
      : visibleSkills.filter((s) => s.category === activeCategory);

  const hasDetails = (skill: Skill) =>
    skill.description ||
    skill.descriptionAr ||
    skill.link ||
    skill.proofUrl ||
    (skill.tags && skill.tags.length > 0) ||
    skill.yearsOfExperience;

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
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
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-mono text-xs mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isAr
                ? "مصفوفة الكفاءة والقدرات التقنية"
                : "CAPABILITY MATRIX // EXPERTISE"}
            </span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            <span className="animate-shimmer-text inline-block">
              {isAr
                ? "المهارات والقدرات التقنية"
                : "Technical Arsenal & Proficiencies"}
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "مجموعة شاملة من الأدوات والمنهجيات ونماذج الذكاء الاصطناعي التي أستخدمها في بناء الأنظمة المتقدمة. اضغط على أي مهارة لمعرفة التفاصيل."
              : "Comprehensive stack of AI models, automation engines, and modern frameworks. Click any skill to explore details."}
          </p>
        </motion.div>

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
          {filteredSkills.map((skill, i) => {
            const Icon = iconMap[skill.iconName] || Code2;
            const clickable = hasDetails(skill);
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => clickable && setSelectedSkill(skill)}
                className={`bg-white dark:bg-[#0F121C] p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 flex flex-col justify-between group shadow-sm dark:shadow-none transition-all ${
                  clickable ? "cursor-pointer" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 dark:bg-white/[0.04] dark:border-white/10 dark:text-cyan-400 group-hover:scale-110 transition-all duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-right rtl:text-left">
                      <span className="font-mono text-xs text-sky-600 dark:text-cyan-400 font-semibold block">
                        {skill.level}%
                      </span>
                      {skill.yearsOfExperience && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans block">
                          {skill.yearsOfExperience}{" "}
                          {isAr ? "سنوات" : "yrs"}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-sans group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors">
                    {isAr && skill.nameAr ? skill.nameAr : skill.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                    {skill.category}
                  </p>

                  {/* Tags preview */}
                  {skill.tags && skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {skill.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-1.5 py-0.5 rounded-md bg-sky-50 dark:bg-cyan-500/10 text-sky-600 dark:text-cyan-400 border border-sky-100 dark:border-cyan-500/20 font-sans"
                        >
                          {tag}
                        </span>
                      ))}
                      {skill.tags.length > 2 && (
                        <span className="text-[9px] text-slate-400 font-sans self-center">
                          +{skill.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mt-4">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.04 }}
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 rounded-full"
                  />
                </div>

                {/* Click hint for detailed skills */}
                {clickable && (
                  <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 text-center font-sans opacity-0 group-hover:opacity-100 transition-opacity">
                    {isAr ? "اضغط للتفاصيل" : "Click for details"}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  SKILL DETAIL MODAL — Shown when a card is clicked */}
      {/* ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-[#0B1627] rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden"
            >
              {/* Modal Header with gradient accent */}
              <div className="relative p-6 pb-4 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
                      {(() => {
                        const Icon =
                          iconMap[selectedSkill.iconName] || Code2;
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                        {isAr && selectedSkill.nameAr
                          ? selectedSkill.nameAr
                          : selectedSkill.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                        {selectedSkill.category}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Proficiency Bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSkill.level}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 rounded-full"
                    />
                  </div>
                  <span className="font-mono text-sm text-sky-600 dark:text-cyan-400 font-bold min-w-[40px] text-right">
                    {selectedSkill.level}%
                  </span>
                </div>

                {/* Meta badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSkill.yearsOfExperience && (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 font-sans font-medium">
                      <Clock className="w-3 h-3" />
                      {selectedSkill.yearsOfExperience}{" "}
                      {isAr ? "سنوات خبرة" : "years experience"}
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                {/* Description */}
                {(selectedSkill.description ||
                  selectedSkill.descriptionAr) && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                    {isAr && selectedSkill.descriptionAr
                      ? selectedSkill.descriptionAr
                      : selectedSkill.description}
                  </p>
                )}

                {/* Tags */}
                {selectedSkill.tags && selectedSkill.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-sans font-semibold uppercase">
                        {isAr ? "الوسوم" : "Tags"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSkill.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-cyan-500/10 text-sky-700 dark:text-cyan-400 border border-sky-100 dark:border-cyan-500/20 font-sans font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-col gap-2.5">
                  {selectedSkill.link && (
                    <a
                      href={selectedSkill.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-500/15 transition-colors font-sans text-sm font-medium group"
                    >
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>
                        {isAr && selectedSkill.linkLabelAr
                          ? selectedSkill.linkLabelAr
                          : selectedSkill.linkLabel ||
                            (isAr ? "زيارة الرابط" : "Visit Link")}
                      </span>
                    </a>
                  )}

                  {selectedSkill.proofUrl && (
                    <a
                      href={selectedSkill.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/15 transition-colors font-sans text-sm font-medium group"
                    >
                      <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>
                        {isAr && selectedSkill.proofLabelAr
                          ? selectedSkill.proofLabelAr
                          : selectedSkill.proofLabel ||
                            (isAr ? "عرض الإثبات" : "View Proof")}
                      </span>
                    </a>
                  )}
                </div>

                {/* No extra details fallback */}
                {!selectedSkill.description &&
                  !selectedSkill.descriptionAr &&
                  !selectedSkill.link &&
                  !selectedSkill.proofUrl &&
                  (!selectedSkill.tags ||
                    selectedSkill.tags.length === 0) && (
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-sans text-center py-4">
                      {isAr
                        ? "لا توجد تفاصيل إضافية حالياً"
                        : "No additional details available yet"}
                    </p>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
