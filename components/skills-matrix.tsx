"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
  CheckCircle2,
  FolderGit2,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Skill, Project } from "@/types";

interface SkillsMatrixProps {
  skills: Skill[];
  projects?: Project[];
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

function getDefaultLearnings(skill: Skill, isAr: boolean): string[] {
  const name = skill.name.toLowerCase();
  const cat = (skill.category || "").toLowerCase();

  if (
    name.includes("gemini") ||
    name.includes("llm") ||
    name.includes("agent") ||
    cat.includes("intelligence")
  ) {
    return isAr
      ? [
          "هندسة الأوامر المتقدمة (Prompt Engineering) والتحكم الصارم بالمخرجات المهيكلة",
          "بناء وكلاء ReAct مع استدعاء الأدوات البرمجية الذاتي (Tool Calling)",
          "ربط قواعد المعرفة وتطبيق محركات RAG لمنع الهلوسة نهائياً",
          "معالجة البيانات متعددة الوسائط (نصوص، صوت فوري، وصور)",
        ]
      : [
          "Advanced Prompt Engineering & Few-Shot Instruction Tuning",
          "Autonomous ReAct Agent loops with schema-validated Tool Calling",
          "Precision RAG architecture with verified citations & zero hallucination",
          "Multimodal AI orchestration across text, real-time voice, and vision",
        ];
  }

  if (
    name.includes("n8n") ||
    name.includes("webhook") ||
    cat.includes("automation")
  ) {
    return isAr
      ? [
          "هندسة مسارات أتمتة مؤسسية موزعة ذاتية التعافي (Self-Healing)",
          "تأمين خطافات الويب (Webhooks) ضد هجمات الإعادة عبر Redis و HMAC",
          "مزامنة أنظمة إدارة العملاء (CRM) وقواعد البيانات في الوقت الفعلي",
          "أتمتة المحادثات وحملات التأهيل عبر WhatsApp Cloud API وسلاك",
        ]
      : [
          "Distributed, self-healing enterprise workflow architectures",
          "Robust Webhook replay attack defense via Redis & HMAC signatures",
          "Real-time CRM & multi-database bidirectional synchronization",
          "Automated lead qualification pipelines via WhatsApp Cloud & Slack APIs",
        ];
  }

  if (
    name.includes("next") ||
    name.includes("react") ||
    name.includes("type") ||
    cat.includes("framework")
  ) {
    return isAr
      ? [
          "بناء تطبيقات الويب الحديثة باستخدام Next.js App Router و Server Components",
          "كتابة كود برمجي عالي الأمان والموثوقية بنظام TypeScript الصارم",
          "تصميم واجهات مستخدم فائقة السرعة مع تأثيرات Glassmorphism و Micro-interactions",
          "تحسين محركات البحث الفني (SEO)، ومؤشرات أداء الويب Core Web Vitals",
        ]
      : [
          "Modern full-stack web architecture with Next.js App Router & RSCs",
          "Strict type safety and resilient state management with TypeScript",
          "Responsive, high-performance UI engineering with smooth Framer Motion",
          "Technical SEO optimization, SSR caching, and Core Web Vitals mastery",
        ];
  }

  if (
    name.includes("sql") ||
    name.includes("database") ||
    name.includes("base") ||
    cat.includes("database")
  ) {
    return isAr
      ? [
          "تصميم مخططات قواعد البيانات العلائقية (Relational Schemas) والـ Indexes",
          "تأمين الوصول وعزل بيانات المستأجرين (Multi-Tenancy & Row-Level Security)",
          "تخزين واسترجاع المتجهات الدلالية (Vector Embeddings) عبر pgvector",
          "إدارة مجمعات الاتصال (Connection Pooling) والمعاملات الذرية (ACID)",
        ]
      : [
          "Relational & Document database schema design and index optimization",
          "Multi-tenant data isolation and strict Row-Level Security (RLS)",
          "Vector embeddings indexing & hybrid similarity search (pgvector)",
          "Connection pooling, atomic ACID transactions, and backup strategies",
        ];
  }

  if (
    name.includes("docker") ||
    name.includes("git") ||
    cat.includes("devops")
  ) {
    return isAr
      ? [
          "بناء حاويات Docker خفيفة الوزن ومتعددة المراحل (Multi-Stage Builds)",
          "إدارة المستودعات البرمجية والعمل الجماعي عبر مسارات Git المتقدمة",
          "أتمتة الاختبارات والنشر المستمر عبر CI/CD Actions",
          "عزل بيئات العمل ومراقبة استقرار الخدمات السحابية",
        ]
      : [
          "Multi-stage Docker containerization for minimal production footprints",
          "Collaborative Git version control, branching strategies, and PR reviews",
          "Automated CI/CD pipeline configuration with automated testing",
          "Environment isolation and containerized production deployments",
        ];
  }

  return isAr
    ? [
        "إتقان المفاهيم الأساسية والمعمارية المتقدمة للأداة",
        "تطبيق الأداة في مشاريع إنتاجية حقيقية عالية الأداء",
        "تحسين استهلاك الموارد وتفادي الاختناقات البرمجية",
      ]
    : [
        "Core architectural paradigms and advanced best practices",
        "Real-world application in high-throughput production environments",
        "Performance optimization and runtime resource efficiency",
      ];
}

export function SkillsMatrix({ skills, projects = [], lang }: SkillsMatrixProps) {
  const isAr = lang === "ar";
  const visibleSkills = useMemo(
    () =>
      skills
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order),
    [skills]
  );

  // Group by category
  const categories = useMemo(
    () => Array.from(new Set(visibleSkills.map((s) => s.category))),
    [visibleSkills]
  );

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const filteredSkills = useMemo(
    () =>
      activeCategory === "All"
        ? visibleSkills
        : visibleSkills.filter((s) => s.category === activeCategory),
    [activeCategory, visibleSkills]
  );

  // Find projects related to selectedSkill (Explicitly selected OR smart matching)
  const relatedProjects = useMemo(() => {
    if (!selectedSkill || !projects.length) return [];

    const explicitIds = new Set(selectedSkill.relatedProjectIds || []);
    const skillNameLower = selectedSkill.name.toLowerCase();
    const skillTagsLower = (selectedSkill.tags || []).map((t) => t.toLowerCase());

    return projects.filter((p) => {
      // 1. Explicit selection in admin dashboard
      if (explicitIds.has(p.id)) return true;

      // 2. Smart matching via technologies, capabilities, title, or category
      const pTechs = (p.technologies || []).map((t) => t.toLowerCase());
      const pTitle = (p.title || "").toLowerCase();
      const pCategory = (p.category || "").toLowerCase();
      const pCaps = (p.aiCapabilities || []).map((c) => c.toLowerCase());

      if (pTechs.some((t) => t.includes(skillNameLower) || skillNameLower.includes(t))) return true;
      if (pTitle.includes(skillNameLower)) return true;
      if (skillTagsLower.some((st) => pTechs.some((pt) => pt.includes(st) || st.includes(pt)))) return true;
      if (skillTagsLower.some((st) => pCaps.some((pc) => pc.includes(st)))) return true;

      // Domain-specific aliases
      if (skillNameLower.includes("agent") && (pCategory.includes("agent") || pTitle.includes("agent") || p.slug.includes("runnova"))) return true;
      if (skillNameLower.includes("n8n") && (pCategory.includes("n8n") || pCategory.includes("automation") || p.slug.includes("n8n"))) return true;
      if (skillNameLower.includes("rag") && (pCategory.includes("rag") || pTitle.includes("rag") || p.slug.includes("runnova"))) return true;
      if (skillNameLower.includes("gemini") && pTechs.some((t) => t.includes("gemini"))) return true;
      if (skillNameLower.includes("next.js") && pTechs.some((t) => t.includes("next"))) return true;
      if (skillNameLower.includes("python") && pTechs.some((t) => t.includes("python"))) return true;
      if (skillNameLower.includes("typescript") && pTechs.some((t) => t.includes("typescript"))) return true;
      if (skillNameLower.includes("tailwind") && pTechs.some((t) => t.includes("tailwind"))) return true;
      if (skillNameLower.includes("voice") && (pCaps.some((c) => c.includes("voice")) || pTitle.includes("voice"))) return true;

      return false;
    });
  }, [selectedSkill, projects]);

  // Determine learning outcomes for selectedSkill
  const learningOutcomes = useMemo(() => {
    if (!selectedSkill) return [];
    if (isAr && selectedSkill.learningOutcomesAr && selectedSkill.learningOutcomesAr.length > 0) {
      return selectedSkill.learningOutcomesAr;
    }
    if (!isAr && selectedSkill.learningOutcomes && selectedSkill.learningOutcomes.length > 0) {
      return selectedSkill.learningOutcomes;
    }
    return getDefaultLearnings(selectedSkill, isAr);
  }, [selectedSkill, isAr]);

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
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-1.5 rounded-full bg-[#0066FF]/10 dark:bg-[#00C2FF]/10 border border-[#0066FF]/20 dark:border-[#00C2FF]/30 text-[#0066FF] dark:text-[#00C2FF] font-mono text-xs mb-3 shadow-md shadow-blue-500/5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00C2FF] animate-pulse" />
            <span className="font-bold tracking-wider uppercase">
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
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "مجموعة شاملة من الأدوات والمنهجيات ونماذج الذكاء الاصطناعي التي أستخدمها في بناء الأنظمة المتقدمة. اضغط على أي مهارة للاطلاع على ما تم تعلمه، الروابط، والمشاريع المرتبطة بها."
              : "Comprehensive stack of AI models, automation engines, and modern frameworks. Click any skill to explore what I learned, documentation links, and associated projects."}
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-xl font-sans text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeCategory === "All"
                ? "bg-gradient-to-r from-[#0066FF] to-[#6D5DFB] text-white shadow-md shadow-[#0066FF]/25 scale-[1.02]"
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] dark:text-slate-300 dark:border-white/10 dark:hover:border-white/20"
            }`}
          >
            {isAr ? "كافة المهارات" : "All Specializations"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl font-sans text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-[#0066FF] to-[#6D5DFB] text-white shadow-md shadow-[#0066FF]/25 scale-[1.02]"
                  : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] dark:text-slate-300 dark:border-white/10 dark:hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid - EVERY CARD IS CLICKABLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill, i) => {
            const Icon = iconMap[skill.iconName] || Code2;
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setSelectedSkill(skill)}
                className="bg-white dark:bg-[#0B1324] p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-[#0066FF]/50 dark:hover:border-[#00C2FF]/50 hover:shadow-xl hover:shadow-[#00C2FF]/5 flex flex-col justify-between group shadow-sm transition-all cursor-pointer select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[#0066FF] dark:bg-white/[0.04] dark:border-white/10 dark:text-[#00C2FF] group-hover:scale-110 transition-all duration-200 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-right rtl:text-left">
                      <span className="font-mono text-xs text-[#0066FF] dark:text-[#00C2FF] font-bold block">
                        {skill.level}%
                      </span>
                      {skill.yearsOfExperience && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans block">
                          {skill.yearsOfExperience} {isAr ? "سنوات خبرة" : "yrs exp"}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans group-hover:text-[#0066FF] dark:group-hover:text-[#00C2FF] transition-colors leading-snug">
                    {isAr && skill.nameAr ? skill.nameAr : skill.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                    {skill.category}
                  </p>

                  {/* Tags preview */}
                  {skill.tags && skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {skill.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#0066FF]/10 text-[#0066FF] dark:text-[#00C2FF] border border-[#0066FF]/20 font-sans"
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
                    className="h-full bg-gradient-to-r from-[#0066FF] via-[#0A84FF] to-[#00C2FF] rounded-full shadow-[0_0_8px_rgba(0,194,255,0.4)]"
                  />
                </div>

                {/* Interactive Click Hint */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5 text-[10px] text-[#0066FF] dark:text-[#00C2FF] font-sans font-semibold text-center flex items-center justify-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{isAr ? "اضغط لعرض ما تعلمته والمشاريع" : "View learnings & projects"}</span>
                  <ArrowRight className="w-3 h-3 rtl:-scale-x-100" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  EXPANDED SKILL DETAIL MODAL                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white dark:bg-[#0B1324] rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="relative p-6 sm:p-7 pb-4 border-b border-slate-100 dark:border-white/10 shrink-0 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#6D5DFB] text-white shadow-lg shadow-[#0066FF]/25">
                      {(() => {
                        const Icon = iconMap[selectedSkill.iconName] || Code2;
                        return <Icon className="w-7 h-7" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
                        {isAr && selectedSkill.nameAr
                          ? selectedSkill.nameAr
                          : selectedSkill.name}
                      </h3>
                      <p className="text-xs font-mono text-[#0066FF] dark:text-[#00C2FF] font-semibold mt-0.5">
                        {selectedSkill.category}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Proficiency Level Bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSkill.level}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-[#0066FF] via-[#0A84FF] to-[#00C2FF] rounded-full shadow-[0_0_8px_rgba(0,194,255,0.5)]"
                    />
                  </div>
                  <span className="font-mono text-sm text-[#0066FF] dark:text-[#00C2FF] font-bold min-w-[44px] text-right">
                    {selectedSkill.level}%
                  </span>
                </div>

                {/* Meta Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSkill.yearsOfExperience && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 font-sans font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedSkill.yearsOfExperience} {isAr ? "سنوات خبرة مثبتة" : "years experience"}
                    </span>
                  )}
                  {relatedProjects.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-sans font-semibold">
                      <FolderGit2 className="w-3.5 h-3.5" />
                      {relatedProjects.length} {isAr ? "مشاريع مرتبطة" : "projects linked"}
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-7 space-y-6 overflow-y-auto flex-1">
                {/* Description */}
                {(selectedSkill.description || selectedSkill.descriptionAr) && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                      {isAr && selectedSkill.descriptionAr
                        ? selectedSkill.descriptionAr
                        : selectedSkill.description}
                    </p>
                  </div>
                )}

                {/* 1. What I Learned Section (ما تم تعلمه واكتسابه) */}
                {learningOutcomes.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-sans font-bold text-sm">
                      <BookOpen className="w-4 h-4 text-[#0066FF] dark:text-[#00C2FF]" />
                      <span>{isAr ? "ما تم تعلمه والمحاور المكتسبة:" : "What I Learned & Key Competencies:"}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {learningOutcomes.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 flex items-start gap-2.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Associated Projects Section (المشاريع المرتبطة بالمهارة) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-sans font-bold text-sm">
                      <FolderGit2 className="w-4 h-4 text-[#6D5DFB]" />
                      <span>{isAr ? "المشاريع المنفذة بهذه المهارة:" : "Projects Demonstrating this Skill:"}</span>
                    </div>
                    {relatedProjects.length > 0 && (
                      <span className="text-xs font-mono text-slate-400">
                        ({relatedProjects.length})
                      </span>
                    )}
                  </div>

                  {relatedProjects.length > 0 ? (
                    <div className="space-y-3">
                      {relatedProjects.map((p) => (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 hover:border-[#0066FF]/40 dark:hover:border-[#00C2FF]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {p.thumbnail && (
                              <img
                                src={p.thumbnail}
                                alt={p.title}
                                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-white/10"
                              />
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0066FF]/10 text-[#0066FF] dark:text-[#00C2FF] font-mono font-bold">
                                  {p.category}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {p.year}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans truncate mt-1 group-hover:text-[#0066FF] dark:group-hover:text-[#00C2FF] transition-colors">
                                {isAr && p.titleAr ? p.titleAr : p.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans truncate">
                                {isAr && p.shortDescriptionAr ? p.shortDescriptionAr : p.shortDescription}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <Link
                              href={`/projects/${p.slug}`}
                              onClick={() => setSelectedSkill(null)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#6D5DFB] text-white text-xs font-sans font-bold shadow-sm hover:opacity-95 transition-opacity"
                            >
                              <span>{isAr ? "دراسة الحالة" : "Case Study"}</span>
                              <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                            </Link>
                            {p.liveDemoUrl && (
                              <a
                                href={p.liveDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                title="Live Preview"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                        {isAr
                          ? "لم يتم ربط مشاريع مباشرة بهذه المهارة بعد — يمكن تحديدها وربطها من لوحة التحكم."
                          : "No projects directly linked to this skill yet — can be assigned from the dashboard."}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Links & Proof (الروابط والشهادات والإثباتات) */}
                {(selectedSkill.link || selectedSkill.proofUrl) && (
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-2.5">
                      {isAr ? "الروابط والإثباتات المعتمدة:" : "Official Links & Verification:"}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      {selectedSkill.link && (
                        <a
                          href={selectedSkill.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl bg-[#0066FF]/10 hover:bg-[#0066FF]/15 border border-[#0066FF]/20 text-[#0066FF] dark:text-[#00C2FF] font-sans text-xs font-bold transition-all group/btn"
                        >
                          <span className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            <span>
                              {isAr && selectedSkill.linkLabelAr
                                ? selectedSkill.linkLabelAr
                                : selectedSkill.linkLabel || (isAr ? "الموقع / التوثيق الرسمي" : "Official Website / Docs")}
                            </span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                        </a>
                      )}

                      {selectedSkill.proofUrl && (
                        <a
                          href={selectedSkill.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-sans text-xs font-bold transition-all group/btn"
                        >
                          <span className="flex items-center gap-2">
                            <Award className="w-4 h-4 group-hover/btn:scale-110 transition-transform text-amber-500" />
                            <span>
                              {isAr && selectedSkill.proofLabelAr
                                ? selectedSkill.proofLabelAr
                                : selectedSkill.proofLabel || (isAr ? "شهادة الكفاءة والإثبات" : "Certificate & Proof")}
                            </span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Tags */}
                {selectedSkill.tags && selectedSkill.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-sans font-semibold uppercase">
                        {isAr ? "الوسوم والتقنيات المرتبطة" : "Tags & Related Technologies"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSkill.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-sans font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
