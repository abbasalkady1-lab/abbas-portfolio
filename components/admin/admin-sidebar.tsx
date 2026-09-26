"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Bot,
  Mail,
  Search,
  Settings,
  LogOut,
  ExternalLink,
  Video,
} from "lucide-react";

interface AdminSidebarProps {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
    { href: "/admin/skills", label: "Skills Matrix", icon: Cpu },
    { href: "/admin/timeline", label: "Experience & Edu", icon: GraduationCap },
    { href: "/admin/certificates", label: "Certificates", icon: Award },
    { href: "/admin/services", label: "Services", icon: Sparkles },
    { href: "/admin/video", label: "Featured Video", icon: Video },
    { href: "/admin/cv", label: "CV & Resume", icon: FileText },
    { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    { href: "/admin/nova", label: "NOVA AI Studio", icon: Bot },
    { href: "/admin/leads", label: "Inquiries / Leads", icon: Mail },
    { href: "/admin/settings", label: "SEO & Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0D1322] border-r border-slate-800 flex flex-col justify-between h-screen fixed top-0 left-0 z-30 font-sans text-[13px] antialiased shadow-xl">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3 rtl:space-x-reverse group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00C2FF] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              AK
            </div>
            <div>
              <div className="text-white font-bold tracking-wide text-sm leading-tight">
                ADMIN CONTROL
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                Abbas El Kady Studio
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white font-semibold shadow-md shadow-blue-500/25"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Quick Live Link & Logout */}
      <div className="p-3 border-t border-slate-800 space-y-1.5 bg-[#0A0F1D]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors font-medium text-xs"
        >
          <span className="flex items-center space-x-2 rtl:space-x-reverse">
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>عرض الموقع المباشر</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
            LIVE
          </span>
        </Link>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition-all font-medium text-xs"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>تسجيل الخروج (Exit)</span>
        </button>
      </div>
    </aside>
  );
}
