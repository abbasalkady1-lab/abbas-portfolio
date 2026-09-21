"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Project } from "@/types";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
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

  const categories = [
    { key: "All", labelEn: "All Work", labelAr: "كافة المشاريع" },
    { key: "AI Agents", labelEn: "AI Agents", labelAr: "وكلاء أذكياء" },
    { key: "Automation", labelEn: "Automation & n8n", labelAr: "أتمتة و n8n" },
    { key: "AI", labelEn: "AI & RAG", labelAr: "ذكاء اصطناعي و RAG" },
    { key: "Web Development", labelEn: "Web & Platforms", labelAr: "تطبيقات الويب" },
  ];

  const publishedProjects = projects.filter((p) => p.published);

  // The Flagship project is Runnova
  const flagshipProject =
    publishedProjects.find((p) => p.slug === "runnova-enterprise-ai-platform") ||
    publishedProjects[0];

  // Secondary projects
  const secondaryProjects = publishedProjects.filter(
    (p) => p.id !== flagshipProject?.id
  );

  const filteredProjects =
    activeCategory === "All"
      ? secondaryProjects
      : secondaryProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1.5 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-[#0066FF] dark:text-[#00C2FF] font-mono text-xs mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#00C2FF]" />
            <span className="font-bold tracking-wider uppercase">
              {isAr ? "المشاريع ودراسات الحالة" : "SELECTED CASE STUDIES"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "مشاريع استثنائية وإثباتات هندسية" : "Engineering Proof & Flagships"}
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
              {/* Subtle Atmospheric Glow */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#0A84FF]/10 via-[#6D5DFB]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

              {/* Flagship Badge Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                  <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0066FF] via-[#0A84FF] to-[#6D5DFB] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 rtl:space-x-reverse shadow-md shadow-[#0066FF]/25">
                    <Sparkles className="w-3.5 h-3.5 text-[#00C2FF]" />
                    <span>{isAr ? "المنتج الرئيسي الرائد" : "FLAGSHIP PRODUCT"}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold">
                    {flagshipProject.year} &bull; {flagshipProject.status}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-[#0066FF] dark:text-[#00C2FF]">
                    {isAr ? "الدور الهندسي:" : "Role:"}
                  </span>{" "}
                  {isAr ? flagshipProject.roleAr : flagshipProject.role}
                </div>
              </div>

              {/* 2-Column Split Flagship Showcase */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Visual & Verified Metrics */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Thumbnail Mockup */}
                  <div className="relative aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 shadow-xl bg-slate-950 group/img">
                    <img
                      src={flagshipProject.thumbnail}
                      alt={isAr && flagshipProject.titleAr ? flagshipProject.titleAr : flagshipProject.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                      <span className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15 font-semibold">
                        runnova.cloud // v1.0
                      </span>
                      <span className="text-[#00C2FF] flex items-center space-x-1.5 rtl:space-x-reverse font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Production</span>
                      </span>
                    </div>
                  </div>

                  {/* 4 Verified Metric Cards with Card Tints */}
                  {flagshipProject.metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {flagshipProject.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="card-ai p-3.5 rounded-xl text-center shadow-sm"
                        >
                          <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#0066FF] dark:text-[#00C2FF]">
                            {m.value}
                          </div>
                          <div className="text-[11px] font-sans text-slate-600 dark:text-slate-400 mt-1 font-semibold">
                            {isAr ? m.labelAr : m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Narrative, Architecture, and AI Capabilities */}
                <div className="lg:col-span-6 space-y-5 text-left rtl:text-right">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans leading-tight">
                      {isAr && flagshipProject.titleAr ? flagshipProject.titleAr : flagshipProject.title}
                    </h3>
                    <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                      {isAr && flagshipProject.fullDescriptionAr
                        ? flagshipProject.fullDescriptionAr
                        : flagshipProject.fullDescription}
                    </p>
                  </div>

                  {/* Problem & Solution Accordion-like Blocks */}
                  <div className="space-y-3 font-sans text-xs sm:text-sm">
                    <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-slate-800 dark:text-slate-200">
                      <div className="font-bold text-rose-700 dark:text-rose-400 mb-1 flex items-center space-x-1.5 rtl:space-x-reverse">
                        <ShieldAlert className="w-4 h-4" />
                        <span>{isAr ? "التحدي والمشكلة:" : "The Problem:"}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {isAr ? flagshipProject.problemAr : flagshipProject.problem}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-slate-800 dark:text-slate-200">
                      <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center space-x-1.5 rtl:space-x-reverse">
                        <Zap className="w-4 h-4" />
                        <span>{isAr ? "الحل الهندسي:" : "The Solution:"}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {isAr ? flagshipProject.solutionAr : flagshipProject.solution}
                      </p>
                    </div>
                  </div>

                  {/* AI Capabilities Tags */}
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                      {isAr ? "القدرات الذكية المطبقة:" : "Core AI Capabilities:"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(isAr && flagshipProject.aiCapabilitiesAr ? flagshipProject.aiCapabilitiesAr : flagshipProject.aiCapabilities)?.map(
                        (cap, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-sans text-xs font-medium"
                          >
                            &bull; {cap}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/projects/${flagshipProject.slug}`}
                      className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#6D5DFB] hover:opacity-95 text-white font-sans text-xs font-bold shadow-md shadow-[#0066FF]/25 hover:-translate-y-0.5 transition-all group/btn"
                    >
                      <span>{isAr ? "دراسة الحالة الهندسية بالتفصيل" : "Deep Technical Case Study"}</span>
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
        {/* CATEGORY FILTER & ADDITIONAL CASE STUDIES */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl font-sans text-xs font-semibold transition-all duration-200 ${
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

        {/* Additional Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const isAgent = project.category === "AI Agents";
              const isAuto = project.category === "Automation";
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
      </div>
    </section>
  );
}
