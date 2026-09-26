"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  Zap,
  Bot,
  Database,
  Layers,
  CheckCircle2,
  Workflow,
  Cpu,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
import { Project } from "@/types";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface ProjectsGalleryProps {
  projects: Project[];
  lang: "en" | "ar";
}

export function ProjectsGallery({ projects, lang }: ProjectsGalleryProps) {
  const isAr = lang === "ar";
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"tape" | "grid">("tape");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Standard requested categories
  const baseCategories = useMemo(
    () => [
      { key: "All", labelEn: "All Work", labelAr: "كافة المشاريع" },
      { key: "AI Agents", labelEn: "AI Agents", labelAr: "وكلاء الذكاء الاصطناعي" },
      { key: "Automation & n8n", labelEn: "Automation & n8n", labelAr: "الأتمتة و n8n" },
      { key: "AI & RAG", labelEn: "AI & RAG", labelAr: "ذكاء اصطناعي و RAG" },
      { key: "Web & Platforms", labelEn: "Web & Platforms", labelAr: "منصات وتطبيقات الويب" },
    ],
    []
  );

  // Dynamically extract any unique custom categories written from dashboard
  const categories = useMemo(() => {
    const knownKeys = new Set([
      "All",
      "AI Agents",
      "Automation & n8n",
      "AI & RAG",
      "Web & Platforms",
      "n8n",
      "Automation",
      "AI",
      "Software",
      "Web Development",
    ]);

    const customKeys: string[] = [];
    projects.forEach((p) => {
      if (p.category && !knownKeys.has(p.category) && !customKeys.includes(p.category)) {
        customKeys.push(p.category);
      }
    });

    const extraCategories = customKeys.map((c) => ({
      key: c,
      labelEn: c,
      labelAr: c,
    }));

    return [...baseCategories, ...extraCategories];
  }, [projects, baseCategories]);

  const publishedProjects = useMemo(() => projects.filter((p) => p.published), [projects]);

  // Flagship project (Runnova)
  const flagshipProject = useMemo(
    () =>
      publishedProjects.find((p) => p.slug === "runnova-enterprise-ai-platform") ||
      publishedProjects[0],
    [publishedProjects]
  );

  // Secondary projects
  const secondaryProjects = useMemo(
    () => publishedProjects.filter((p) => p.id !== flagshipProject?.id),
    [publishedProjects, flagshipProject]
  );

  // Matching helper supporting custom categories and standard presets
  const matchesCategory = (projCat: string, activeCat: string) => {
    if (activeCat === "All") return true;
    if (projCat === activeCat) return true;

    const p = (projCat || "").toLowerCase();
    const a = activeCat.toLowerCase();

    if (a === "ai agents" && (p.includes("agent") || p === "ai agents")) return true;
    if (
      a === "automation & n8n" &&
      (p.includes("automation") || p.includes("n8n") || p === "n8n")
    )
      return true;
    if (
      a === "ai & rag" &&
      (p.includes("rag") || p === "ai" || p.includes("machine learning"))
    )
      return true;
    if (
      a === "web & platforms" &&
      (p.includes("web") || p.includes("platform") || p.includes("software"))
    )
      return true;

    return false;
  };

  const filteredProjects = useMemo(() => {
    return secondaryProjects.filter((p) => matchesCategory(p.category, activeCategory));
  }, [secondaryProjects, activeCategory]);

  // Duplicate list to guarantee continuous seamless marquee loop with zero blank gaps
  const marqueeItems = useMemo(() => {
    if (filteredProjects.length === 0) return [];
    if (filteredProjects.length === 1) {
      return [
        filteredProjects[0],
        filteredProjects[0],
        filteredProjects[0],
        filteredProjects[0],
      ];
    }
    if (filteredProjects.length === 2) {
      return [...filteredProjects, ...filteredProjects, ...filteredProjects];
    }
    return [...filteredProjects, ...filteredProjects];
  }, [filteredProjects]);

  const scrollTape = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1.5 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-[#0066FF] dark:text-[#00C2FF] font-mono text-xs mb-3 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00C2FF]" />
            <span className="font-bold tracking-wider uppercase">
              {isAr ? "المشاريع ودراسات الحالة الهندسية" : "SELECTED CASE STUDIES"}
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            <span className="animate-shimmer-text">
              {isAr ? "مشاريع استثنائية وإثباتات هندسية" : "Engineering Proof & Flagships"}
            </span>
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "مشاريع متكاملة مبنية بأحدث معايير الأداء والذكاء الاصطناعي والأتمتة، مدعومة بمؤشرات أداء مثبتة وحلول هندسية معمقة."
              : "Real-world autonomous systems and production-grade software engineered with rigorous accuracy, speed, and business impact."}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* HERO FLAGSHIP CASE STUDY: RUNNOVA */}
        {/* ========================================================================= */}
        {flagshipProject && (
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl bg-white dark:bg-[#0B1627] border-2 border-[#0A84FF]/25 dark:border-[#00C2FF]/30 shadow-2xl shadow-[#0A84FF]/10 p-6 sm:p-10 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#0A84FF]/10 via-[#6D5DFB]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left Column: Visual Media Preview */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-200/80 dark:border-white/10 shadow-lg">
                    <img
                      src={flagshipProject.thumbnail}
                      alt={flagshipProject.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#0066FF] text-white font-mono text-xs font-bold shadow-md shadow-[#0066FF]/30">
                        {isAr ? "المشروع الرائد الأول" : "FLAGSHIP PLATFORM"}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-[#00C2FF] font-mono text-xs">
                        {flagshipProject.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white font-mono text-xs">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-semibold text-emerald-300">
                          {flagshipProject.status}
                        </span>
                      </div>
                      <span className="text-slate-300">{flagshipProject.year}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Case Study Data */}
                <div className="lg:col-span-6 space-y-5 text-left rtl:text-right">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
                      {isAr && flagshipProject.titleAr
                        ? flagshipProject.titleAr
                        : flagshipProject.title}
                    </h3>
                    <p className="text-sm font-mono text-[#0066FF] dark:text-[#00C2FF] mt-1 font-semibold">
                      {isAr && flagshipProject.roleAr
                        ? flagshipProject.roleAr
                        : flagshipProject.role}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                    {isAr && flagshipProject.shortDescriptionAr
                      ? flagshipProject.shortDescriptionAr
                      : flagshipProject.shortDescription}
                  </p>

                  {/* Core Metrics */}
                  {flagshipProject.metrics && flagshipProject.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                      {flagshipProject.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10"
                        >
                          <div className="text-lg sm:text-xl font-mono font-bold text-[#0066FF] dark:text-[#00C2FF]">
                            {metric.value}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                            {isAr && metric.labelAr ? metric.labelAr : metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Core AI Capabilities */}
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                      {isAr ? "القدرات الذكية المطبقة:" : "Core AI Capabilities:"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(isAr && flagshipProject.aiCapabilitiesAr
                        ? flagshipProject.aiCapabilitiesAr
                        : flagshipProject.aiCapabilities
                      )?.map((cap, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-sans text-xs font-medium"
                        >
                          &bull; {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/projects/${flagshipProject.slug}`}
                      className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#6D5DFB] hover:opacity-95 text-white font-sans text-xs font-bold shadow-md shadow-[#0066FF]/25 hover:-translate-y-0.5 transition-all group/btn"
                    >
                      <span>
                        {isAr ? "دراسة الحالة الهندسية بالتفصيل" : "Deep Technical Case Study"}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                    </Link>

                    {flagshipProject.liveDemoUrl && (
                      <a
                        href={flagshipProject.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-3 rounded-xl bg-white dark:bg-white/[0.05] hover:bg-slate-50 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white font-sans text-xs font-bold shadow-sm hover:-translate-y-0.5 transition-all"
                      >
                        <ExternalLink className="w-4 h-4 text-[#0A84FF]" />
                        <span>{isAr ? "معاينة المنصة الحية" : "Live Platform"}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CATEGORY FILTER TABS & DISPLAY CONTROLS */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Categories Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl font-sans text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#0066FF] to-[#6D5DFB] text-white shadow-md shadow-[#0066FF]/25 scale-[1.02]"
                      : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] dark:text-slate-300 dark:border-white/10 dark:hover:border-white/20"
                  }`}
                >
                  {isAr ? cat.labelAr : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Tape / Grid Mode Switcher & Pause Control */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse shrink-0">
            {viewMode === "tape" && (
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                  isPaused
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                    : "bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                title={isPaused ? "تشغيل حركة الشريط" : "إيقاف الشريط مؤقتاً"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>
                  {isPaused
                    ? isAr
                      ? "استئناف الحركة"
                      : "Resume Tape"
                    : isAr
                    ? "إيقاف مؤقت"
                    : "Pause Tape"}
                </span>
              </button>
            )}

            {/* View Mode Toggle Button */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setViewMode("tape")}
                className={`p-1.5 rounded-lg text-xs font-sans font-medium flex items-center space-x-1 rtl:space-x-reverse transition-colors cursor-pointer ${
                  viewMode === "tape"
                    ? "bg-white dark:bg-[#0C111C] text-[#0066FF] dark:text-[#00C2FF] shadow-sm font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
                title={isAr ? "شريط متدفق من اليمين لليسار" : "Continuous Tape View"}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{isAr ? "شريط هادئ" : "Flow Tape"}</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-sans font-medium flex items-center space-x-1 rtl:space-x-reverse transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-[#0C111C] text-[#0066FF] dark:text-[#00C2FF] shadow-sm font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
                title={isAr ? "شبكة المشاريع" : "Grid View"}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{isAr ? "شبكة كروت" : "Grid"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: SMOOTH CONTINUOUS TAPE (RIGHT TO LEFT MARQUEE) */}
        {/* ========================================================================= */}
        {viewMode === "tape" ? (
          <div className="relative w-full py-4 overflow-hidden select-none">
            {/* Cinematic Gradient Fade Overlays on left & right edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#F7F9FC] dark:from-[#07111F] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#F7F9FC] dark:from-[#07111F] to-transparent z-20 pointer-events-none" />

            {/* Continuous Marquee Track */}
            <div
              ref={scrollContainerRef}
              className="w-full overflow-x-hidden no-scrollbar"
            >
              <div
                className={`animate-marquee-tape gap-6 py-2 ${
                  isPaused ? "marquee-is-paused" : ""
                }`}
              >
                {marqueeItems.map((project, index) => {
                  const isAgent = (project.category || "").includes("Agent");
                  const isAuto = (project.category || "").includes("Automation") || (project.category || "").includes("n8n");
                  const cardClass = isAgent
                    ? "card-ai"
                    : isAuto
                    ? "card-automation"
                    : "card-voice";

                  return (
                    <article
                      key={`${project.id}-tape-${index}`}
                      className={`w-[340px] sm:w-[410px] shrink-0 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group border border-slate-200/90 dark:border-white/10 hover:border-[#0066FF]/40 dark:hover:border-[#00C2FF]/40 bg-white dark:bg-[#0C111C] ${cardClass}`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                        <img
                          src={project.thumbnail}
                          alt={isAr && project.titleAr ? project.titleAr : project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />

                        {/* Category & Status Badges */}
                        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/15 text-[#00C2FF] font-mono text-[10px] font-bold">
                            {project.category}
                          </span>
                          {project.role && (
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-950/85 backdrop-blur-md border border-indigo-500/30 text-indigo-300 font-mono text-[10px]">
                              {isAr ? project.roleAr : project.role}
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/10 text-slate-300 font-mono text-[10px]">
                            {project.year}
                          </span>
                        </div>

                        {/* Metrics Overlay */}
                        {project.metrics && project.metrics.length > 0 && (
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2">
                            {project.metrics.slice(0, 2).map((m, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-slate-950/90 backdrop-blur-md text-white font-mono text-[10px] border border-white/15"
                              >
                                <strong className="text-[#00C2FF]">{m.value}</strong>{" "}
                                {isAr ? m.labelAr : m.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3.5 text-left rtl:text-right">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans group-hover:text-[#0066FF] dark:group-hover:text-[#00C2FF] transition-colors line-clamp-1">
                            {isAr && project.titleAr ? project.titleAr : project.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed line-clamp-2">
                            {isAr && project.shortDescriptionAr
                              ? project.shortDescriptionAr
                              : project.shortDescription}
                          </p>

                          {/* Capabilities Pills */}
                          {project.aiCapabilities && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {(isAr && project.aiCapabilitiesAr
                                ? project.aiCapabilitiesAr
                                : project.aiCapabilities
                              )
                                .slice(0, 2)
                                .map((cap, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 font-sans text-[10px] font-medium border border-slate-200/60 dark:border-white/5"
                                  >
                                    &bull; {cap}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* Technologies & Link Footer */}
                        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 font-mono text-[10px] border border-slate-200/80 dark:border-white/5"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <Link
                              href={`/projects/${project.slug}`}
                              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-[#0066FF] hover:text-[#0A84FF] dark:text-[#00C2FF] dark:hover:text-cyan-300 font-sans text-xs font-bold group/link"
                            >
                              <span>{isAr ? "تفاصيل دراسة الحالة" : "Case Study"}</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform" />
                            </Link>

                            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                  title="GitHub Repository"
                                >
                                  <GithubIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {project.liveDemoUrl && (
                                <a
                                  href={project.liveDemoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                  title="Live Preview"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW MODE 2: GRID VIEW */
          /* ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => {
                const isAgent = (project.category || "").includes("Agent");
                const isAuto =
                  (project.category || "").includes("Automation") ||
                  (project.category || "").includes("n8n");
                const cardClass = isAgent
                  ? "card-ai"
                  : isAuto
                  ? "card-automation"
                  : "card-voice";

                return (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${cardClass}`}
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                      <img
                        src={project.thumbnail}
                        alt={isAr && project.titleAr ? project.titleAr : project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />

                      {/* Category & Status Badges */}
                      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/15 text-[#00C2FF] font-mono text-[11px] font-bold">
                          {project.category}
                        </span>
                        {project.role && (
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-950/85 backdrop-blur-md border border-indigo-500/30 text-indigo-300 font-mono text-[11px]">
                            {isAr ? project.roleAr : project.role}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/10 text-slate-300 font-mono text-[11px]">
                          {project.year}
                        </span>
                      </div>

                      {/* Metrics Overlay */}
                      {project.metrics && project.metrics.length > 0 && (
                        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                          {project.metrics.slice(0, 2).map((m, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-md text-white font-mono text-[10px] border border-white/15"
                            >
                              <strong className="text-[#00C2FF]">{m.value}</strong>{" "}
                              {isAr ? m.labelAr : m.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4 text-left rtl:text-right">
                      <div className="space-y-2.5">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans group-hover:text-[#0066FF] dark:group-hover:text-[#00C2FF] transition-colors">
                          {isAr && project.titleAr ? project.titleAr : project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed line-clamp-3">
                          {isAr && project.shortDescriptionAr
                            ? project.shortDescriptionAr
                            : project.shortDescription}
                        </p>

                        {/* AI Capabilities Snippet */}
                        {project.aiCapabilities && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {(isAr && project.aiCapabilitiesAr
                              ? project.aiCapabilitiesAr
                              : project.aiCapabilities
                            )
                              .slice(0, 3)
                              .map((cap, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded bg-white/70 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 font-sans text-[11px] font-medium border border-slate-200/60 dark:border-white/5"
                                >
                                  &bull; {cap}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Technologies & CTAs */}
                      <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-white/5">
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-md bg-white/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-white/5"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-[#0066FF] hover:text-[#0A84FF] dark:text-[#00C2FF] dark:hover:text-cyan-300 font-sans text-xs font-bold group/link"
                          >
                            <span>{isAr ? "تفاصيل دراسة الحالة" : "Technical Case Study"}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform" />
                          </Link>

                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                title="GitHub Repository"
                              >
                                <GithubIcon className="w-4 h-4" />
                              </a>
                            )}
                            {project.liveDemoUrl && (
                              <a
                                href={project.liveDemoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                title="Live Preview"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
