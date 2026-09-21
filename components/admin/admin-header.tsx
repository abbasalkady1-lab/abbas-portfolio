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
    <header className="h-16 bg-[#080B12]/80 backdrop-blur-xl border-b border-cyan-500/15 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 font-mono text-xs">
      <div>
        <h1 className="text-base font-bold text-white tracking-wider flex items-center space-x-2">
          <span>{title}</span>
        </h1>
        {subtitle && <p className="text-[11px] text-gray-400 font-sans">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        {/* Live system clock */}
        <div className="hidden sm:flex items-center space-x-2 text-gray-400 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>SYS.TIME: {time}</span>
        </div>

        {/* Security badge */}
        <div className="flex items-center space-x-1.5 text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SECURE ROOT</span>
        </div>
      </div>
    </header>
  );
}
