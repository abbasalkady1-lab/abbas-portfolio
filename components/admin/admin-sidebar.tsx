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
    { href: "/admin/cv", label: "CV & Resume", icon: FileText },
    { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    { href: "/admin/nova", label: "NOVA AI Studio", icon: Bot },
    { href: "/admin/leads", label: "Inquiries / Leads", icon: Mail },
    { href: "/admin/settings", label: "SEO & Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#080B12] border-r border-cyan-500/15 flex flex-col justify-between h-screen fixed top-0 left-0 z-30 font-mono text-xs">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              AK
            </div>
            <div>
              <div className="text-white font-bold tracking-wider">COMMAND CENTER</div>
              <div className="text-[10px] text-cyan-400">Abbas El Kady &bull; Admin</div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-cyan-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Quick Live Link & Logout */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <span className="flex items-center space-x-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </span>
          <span className="text-[9px] px-1 rounded bg-cyan-500/10 text-cyan-400">LIVE</span>
        </Link>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
}
