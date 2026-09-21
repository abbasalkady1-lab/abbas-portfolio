import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug, getProfile } from "@/lib/db";
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles, CheckCircle, AlertCircle, Layers, Cpu, ShieldCheck, Zap } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found | Abbas El Kady" };
  return {
    title: `${project.title} | Abbas El Kady Case Study`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [project.thumbnail],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const allProjects = await getProjects();
  const publishedProjects = allProjects.filter((p) => p.published);
  const currentIndex = publishedProjects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? publishedProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < publishedProjects.length - 1 ? publishedProjects[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#090A0F] text-slate-900 dark:text-white selection:bg-sky-500/25 selection:text-slate-900 dark:selection:text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Subtle Ambient Background Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-500/5 dark:from-cyan-500/5 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/#projects"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 shadow-sm dark:bg-white/[0.03] dark:hover:bg-white/[0.07] dark:text-slate-300 dark:hover:text-white dark:border-white/10 font-sans text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects Matrix</span>
          </Link>
        </div>

        {/* Hero Header */}
        <header className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/25 text-sky-700 dark:text-cyan-300 font-mono text-xs font-semibold">
              {project.category}
            </span>
            {project.role && (
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-semibold">
                Role: {project.role}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-mono text-xs shadow-sm">
              Year: {project.year}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>{project.status}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans tracking-tight text-slate-900 dark:text-white">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-sans leading-relaxed max-w-3xl">
            {project.shortDescription}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-semibold shadow-md shadow-sky-600/20 dark:bg-cyan-400 dark:hover:bg-cyan-300 dark:text-slate-950 hover:scale-[1.02] transition-all"
              >
                <span>Launch Live System</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-sm dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:border-white/15 dark:text-white font-sans text-xs font-medium transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Source Code / Repo</span>
              </a>
            )}
          </div>
        </header>

        {/* Verified Technical Metrics Strip */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-10">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0F121C] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm text-center"
              >
                <div className="text-xl sm:text-2xl font-mono font-bold text-sky-600 dark:text-cyan-400">
                  {m.value}
                </div>
                <div className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Cover / Hero Media */}
        <div className="rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-lg mb-12 bg-slate-100 dark:bg-slate-950">
          <img
            src={project.coverImage || project.thumbnail}
            alt={project.title}
            className="w-full h-auto max-h-[520px] object-cover"
          />
        </div>

        {/* Detailed Case Study Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Main Narrative (2 cols) */}
          <div className="md:col-span-2 space-y-7">
            {/* Overview */}
            <div className="bg-white dark:bg-[#0F121C] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                <span>System Architecture &amp; Overview</span>
              </h2>
              <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                {project.fullDescription}
              </p>
            </div>

            {/* Problem & Solution */}
            {(project.problem || project.solution) && (
              <div className="grid grid-cols-1 gap-5">
                {project.problem && (
                  <div className="bg-white dark:bg-[#0F121C] p-6 rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/40 dark:bg-rose-500/[0.02] shadow-sm">
                    <h3 className="text-sm font-bold font-sans text-rose-600 dark:text-rose-400 flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>The Challenge / Problem</span>
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-sans leading-relaxed">
                      {project.problem}
                    </p>
                  </div>
                )}

                {project.solution && (
                  <div className="bg-white dark:bg-[#0F121C] p-6 rounded-2xl border border-sky-200 dark:border-cyan-500/20 bg-sky-50/40 dark:bg-cyan-500/[0.02] shadow-sm">
                    <h3 className="text-sm font-bold font-sans text-sky-700 dark:text-cyan-400 flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Engineering Solution</span>
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-sans leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Technical Challenges & Result */}
            {(project.technicalChallenges || project.result) && (
              <div className="grid grid-cols-1 gap-5">
                {project.technicalChallenges && (
                  <div className="bg-white dark:bg-[#0F121C] p-6 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/[0.02] shadow-sm">
                    <h3 className="text-sm font-bold font-sans text-amber-700 dark:text-amber-400 flex items-center space-x-2 mb-2">
                      <Cpu className="w-4 h-4" />
                      <span>Technical Hardening &amp; Challenges</span>
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-sans leading-relaxed">
                      {project.technicalChallenges}
                    </p>
                  </div>
                )}

                {project.result && (
                  <div className="bg-white dark:bg-[#0F121C] p-6 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/[0.02] shadow-sm">
                    <h3 className="text-sm font-bold font-sans text-emerald-700 dark:text-emerald-400 flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4" />
                      <span>Commercial &amp; Production Result</span>
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-sans leading-relaxed">
                      {project.result}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Architecture breakdown */}
            {project.architecture && (
              <div className="bg-white dark:bg-[#0F121C] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
                <h3 className="text-sm font-bold font-sans text-indigo-600 dark:text-indigo-400 flex items-center space-x-2 mb-2">
                  <Layers className="w-4 h-4" />
                  <span>Pipeline &amp; Architecture Flow</span>
                </h3>
                <p className="text-slate-800 dark:text-slate-300 text-sm font-mono leading-relaxed bg-slate-50 dark:bg-black/40 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                  {project.architecture}
                </p>
              </div>
            )}

            {/* AI Capabilities list */}
            {project.aiCapabilities && project.aiCapabilities.length > 0 && (
              <div className="bg-white dark:bg-[#0F121C] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
                <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                  <span>Applied AI &amp; Engineering Capabilities</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.aiCapabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/25 text-sky-800 dark:text-sky-300 font-sans text-xs font-semibold"
                    >
                      &bull; {cap}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Multiple Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-white">System Interface &amp; Analytics</h3>
                <div className="grid grid-cols-1 gap-4">
                  {project.screenshots.map((shot, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-colors shadow-sm"
                    >
                      <img src={shot} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-auto" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Specifications (1 col) */}
          <aside className="space-y-6">
            <div className="bg-white dark:bg-[#0F121C] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5 font-sans text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3">
                Technical Specifications
              </h3>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider text-[10px] font-mono">
                  Technologies Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sky-700 dark:text-cyan-300 font-mono text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider text-[10px] font-mono">
                  Category
                </span>
                <span className="text-slate-900 dark:text-white font-semibold">{project.category}</span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider text-[10px] font-mono">
                  Engineering Period
                </span>
                <span className="text-slate-900 dark:text-white font-semibold">{project.year}</span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider text-[10px] font-mono">
                  Deployment Status
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{project.status}</span>
              </div>
            </div>

            {/* Quick Contact CTA */}
            <div className="bg-white dark:bg-[#0F121C] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm text-center space-y-3">
              <Sparkles className="w-6 h-6 text-sky-600 dark:text-cyan-400 mx-auto" />
              <h4 className="text-sm font-bold font-sans text-slate-900 dark:text-white">Interested in this architecture?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                Abbas can build and deploy similar autonomous AI systems or n8n automations for your organization.
              </p>
              <Link
                href="/#contact"
                className="block w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-semibold shadow-md shadow-sky-600/20 dark:bg-cyan-400 dark:hover:bg-cyan-300 dark:text-slate-950 transition-all"
              >
                Discuss System Integration
              </Link>
            </div>
          </aside>
        </div>

        {/* Previous / Next Project Navigation */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex items-center justify-between font-sans text-xs">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex items-center space-x-2 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase">Previous Project</span>
                <span className="text-slate-900 dark:text-white font-semibold">{prevProject.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex items-center space-x-2 text-right text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors ml-auto"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase">Next Project</span>
                <span className="text-slate-900 dark:text-white font-semibold">{nextProject.title}</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
}
