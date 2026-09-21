import React from "react";
import Link from "next/link";
import { getDatabase } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import {
  FolderGit2,
  Cpu,
  Download,
  Eye,
  Bot,
  Mail,
  ArrowUpRight,
  Sparkles,
  Plus,
  FileText,
  Activity,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const db = await getDatabase();

  const totalProjects = db.projects.length;
  const publishedProjects = db.projects.filter((p) => p.published).length;
  const totalSkills = db.skills.length;
  const cvDownloads = db.analytics.cvDownloads || db.cv.downloadCount || 0;
  const pageViews = db.analytics.pageViews || 0;
  const novaConversations = db.analytics.novaConversations || 0;
  const leadsCount = db.leads.length;
  const unreadLeads = db.leads.filter((l) => l.status === "new").length;

  const statCards = [
    {
      title: "Total Projects",
      value: totalProjects,
      sub: `${publishedProjects} Live in Production`,
      icon: FolderGit2,
      color: "text-cyan-400",
      href: "/admin/projects",
    },
    {
      title: "Skills & Models",
      value: totalSkills,
      sub: "Active Technical Matrix",
      icon: Cpu,
      color: "text-violet-400",
      href: "/admin/skills",
    },
    {
      title: "CV Downloads",
      value: cvDownloads,
      sub: `Active: ${db.cv.activeLanguage.toUpperCase()} PDF`,
      icon: Download,
      color: "text-emerald-400",
      href: "/admin/cv",
    },
    {
      title: "Website Traffic",
      value: pageViews,
      sub: "Total Public Telemetry",
      icon: Eye,
      color: "text-blue-400",
      href: "/admin",
    },
    {
      title: "NOVA AI Dialogues",
      value: novaConversations,
      sub: "Voice & Text Inquiries",
      icon: Bot,
      color: "text-cyan-300",
      href: "/admin/nova",
    },
    {
      title: "Client Leads",
      value: leadsCount,
      sub: `${unreadLeads} Pending / Unread`,
      icon: Mail,
      color: "text-amber-400",
      href: "/admin/leads",
    },
  ];

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="SYSTEM CONTROL MATRIX // OVERVIEW"
        subtitle="Live telemetry and centralized management for Abbas El Kady's digital platform"
      />

      <main className="p-6 sm:p-8 space-y-8">
        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Link>
          <Link
            href="/admin/skills"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Skill</span>
          </Link>
          <Link
            href="/admin/cv"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Manage CV Files</span>
          </Link>
          <Link
            href="/admin/nova"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 transition-colors"
          >
            <Bot className="w-4 h-4 text-violet-400" />
            <span>Configure NOVA AI</span>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                href={card.href}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 uppercase tracking-wider text-[10px]">
                      {card.title}
                    </span>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-300 group-hover:scale-110 transition-transform">
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white">{card.value}</div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-gray-400 text-[11px]">
                  <span>{card.sub}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Lower Double Column: Recent Activity & Recent Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Inquiries (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white uppercase tracking-wider">
                  Latest Inquiries / Leads
                </h3>
              </div>
              <Link
                href="/admin/leads"
                className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center space-x-1"
              >
                <span>View All Leads ({db.leads.length})</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {db.leads.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No inquiries received yet. Submit a test message on the contact form!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {db.leads.slice(0, 5).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{lead.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            lead.status === "new"
                              ? "bg-cyan-500/20 text-cyan-300"
                              : lead.status === "replied"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {lead.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-gray-400 text-[11px] mt-0.5">{lead.email}</div>
                      <p className="text-gray-300 text-xs font-sans mt-2 line-clamp-2">
                        {lead.message}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-500 shrink-0">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Status & Quick Links (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* System Status Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Activity className="w-4 h-4" />
                <h3 className="font-bold uppercase tracking-wider text-white">
                  System Health & Services
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-gray-300">NOVA Voice Core:</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>OPERATIONAL</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-gray-300">Database Engine:</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SYNCHRONIZED</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-gray-300">Google Gemini Grounding:</span>
                  <span className="text-cyan-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ACTIVE</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-gray-300">Custom Domain:</span>
                  <span className="text-violet-400 font-bold">abbaselkady.dev</span>
                </div>
              </div>
            </div>

            {/* Profile Snapshot */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-violet-950/20 space-y-3 shadow-xl">
              <div className="flex items-center space-x-3">
                <img
                  src={db.profile.avatarUrl}
                  alt={db.profile.name}
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40"
                />
                <div>
                  <div className="font-bold text-white">{db.profile.name}</div>
                  <div className="text-[10px] text-cyan-400">{db.profile.jobTitle}</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs font-sans">
                {db.profile.shortBio}
              </p>
              <Link
                href="/admin/settings"
                className="inline-block text-cyan-400 hover:text-cyan-300 font-mono text-xs mt-2"
              >
                &gt; Edit Identity & Socials &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
