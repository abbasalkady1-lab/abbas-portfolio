"use client";

import React, { useState, useEffect } from "react";
import { Bell, ShieldCheck, Activity } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-[#0D1322]/90 backdrop-blur-xl border-b border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 font-sans antialiased shadow-sm">
      <div className="min-w-0 pr-4">
        <h1 className="text-base sm:text-lg font-bold text-white tracking-wide truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-300 font-sans mt-0.5 truncate leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-3 rtl:space-x-reverse shrink-0">
        {/* Live system clock */}
        <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse text-slate-300 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 font-mono text-xs">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{time}</span>
        </div>

        {/* Security badge */}
        <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 font-medium text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">AUTHENTICATED</span>
        </div>
      </div>
    </header>
  );
}
