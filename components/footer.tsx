"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Shield } from "lucide-react";
import { ProfileData } from "@/types";

interface FooterProps {
  profile: ProfileData;
  lang: "en" | "ar";
}

export function Footer({ profile, lang }: FooterProps) {
  const isAr = lang === "ar";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#05060A] py-12 px-4 sm:px-6 lg:px-8 z-10 font-sans text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Title */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-center md:text-left rtl:md:text-right">
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-white/[0.04] border border-sky-200 dark:border-white/10 flex items-center justify-center text-sky-600 dark:text-cyan-400 font-mono font-bold">
            AK
          </div>
          <div>
            <div className="text-slate-900 dark:text-white font-semibold tracking-wide">
              {isAr ? profile.nameAr : profile.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {isAr ? profile.jobTitleAr : "CS & AI Specialist &bull; Agentic Systems"}
            </div>
          </div>
        </div>

        {/* Center: Intelligence statement */}
        <div className="text-center text-xs text-slate-500 max-w-sm">
          <span>
            {isAr
              ? "صُممت هذه المنصة كبيئة برمجية ذكية ونظام مستقل يمثل التوأم الرقمي لعباس القاضي."
              : "Architected as an autonomous digital system & portfolio ecosystem. Powered by Google AI."}
          </span>
        </div>

        {/* Right: Actions & Admin Link */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Link
            href="/admin"
            className="flex items-center space-x-1.5 rtl:space-x-reverse text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
            title="Admin Dashboard"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="font-sans text-xs">Admin</span>
          </Link>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 border border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-400 dark:hover:text-white dark:border-white/10 transition-all shadow-sm"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center text-[11px] text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>&copy; {new Date().getFullYear()} Abbas El Kady. All rights reserved.</span>
        <span className="font-mono">Verified Portfolio Domain</span>
      </div>
    </footer>
  );
}
