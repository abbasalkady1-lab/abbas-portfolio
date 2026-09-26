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
    <div className="flex-1 flex flex-col font-sans antialiased text-slate-200">
      <AdminHeader
        title="SYSTEM CONTROL MATRIX // OVERVIEW"
        subtitle="Live telemetry and centralized management for Abbas El Kady's digital platform"
      />

      <main className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-[#0052CC] hover:to-[#0040A8] text-white font-semibold shadow-md shadow-blue-500/25 transition-all text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مشروع جديد (Add Project)</span>
          </Link>
          <Link
            href="/admin/video"
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-colors text-xs font-medium"
          >
            <Sparkles className="w-4 h-4 text-red-400" />
            <span>فيديو اليوتيوب (Featured Video)</span>
          </Link>
          <Link
            href="/admin/skills"
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-colors text-xs font-medium"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>إضافة مهارة (Add Skill)</span>
          </Link>
          <Link
            href="/admin/cv"
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-colors text-xs font-medium"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>السيرة الذاتية (CV Files)</span>
          </Link>
          <Link
            href="/admin/nova"
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-colors text-xs font-medium"
          >
            <Bot className="w-4 h-4 text-violet-400" />
            <span>المساعد الذكي (NOVA AI)</span>
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
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all duration-300 group shadow-lg flex flex-col justify-between hover:translate-y-[-2px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 uppercase tracking-wider text-xs font-semibold">
                      {card.title}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-gray-300 group-hover:scale-110 transition-transform">
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">{card.value}</div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>{card.sub}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Lower Double Column: Recent Activity & Recent Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Inquiries (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 p-6 sm:p-7 rounded-3xl space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Mail className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Latest Inquiries / رسائل العملاء
                </h3>
              </div>
              <Link
                href="/admin/leads"
                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center space-x-1 rtl:space-x-reverse"
              >
                <span>عرض الكل ({db.leads.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {db.leads.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <p>لم يتم استلام رسائل بعد. يمكنك تجربة إرسال رسالة من نموذج التواصل بالموقع!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {db.leads.slice(0, 5).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="font-bold text-white text-sm">{lead.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                            lead.status === "new"
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                              : lead.status === "replied"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {lead.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5 font-mono">{lead.email}</div>
                      <p className="text-slate-300 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {lead.message}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0">
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
            <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-7 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-400">
                <Activity className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  حالة المنظومة والخدمات (System Health)
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-300 font-medium">محرك الذكاء الصوتي (NOVA Voice):</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>OPERATIONAL</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-300 font-medium">قاعدة البيانات المحلية (Database):</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SYNCHRONIZED</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-300 font-medium">استرجاع المعرفة (Gemini Grounding):</span>
                  <span className="text-cyan-400 font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ACTIVE</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-300 font-medium">النطاق الشخصي (Personal Domain):</span>
                  <span className="text-violet-400 font-mono font-bold text-xs">abbaselkady.dev</span>
                </div>
              </div>
            </div>

            {/* Profile Snapshot */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0F172A] border border-slate-800 p-6 sm:p-7 rounded-3xl space-y-3.5 shadow-xl">
              <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                <img
                  src={db.profile.avatarUrl}
                  alt={db.profile.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
                />
                <div>
                  <div className="font-bold text-white text-base">{db.profile.name}</div>
                  <div className="text-xs text-cyan-400 font-medium">{db.profile.jobTitle}</div>
                </div>
              </div>
              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                {db.profile.shortBio}
              </p>
              <Link
                href="/admin/settings"
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-cyan-400 hover:text-cyan-300 font-semibold text-xs mt-2"
              >
                <span>تعديل الهوية والروابط الاجتماعية</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
