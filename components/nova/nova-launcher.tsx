"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, Mic, Activity } from "lucide-react";

interface NovaLauncherProps {
  onOpen: () => void;
  lang: "en" | "ar";
  theme?: "light" | "dark";
}

export function NovaLauncher({ onOpen, lang, theme }: NovaLauncherProps) {
  const isAr = lang === "ar";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 select-none">
      {/* Subtle Gentle Idle Floating Wrapper */}
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-center justify-end"
      >
        {/* Breathing Energy Aura Rings */}
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#00C2FF]/30 via-[#6D5DFB]/25 to-[#0A84FF]/30 blur-lg animate-breathe-aura pointer-events-none" />
        <div className="absolute -inset-1 rounded-full border border-dashed border-[#00C2FF]/40 animate-spin-slow pointer-events-none" />

        {/* Main Interactive AI Presence Capsule */}
        <motion.button
          onClick={onOpen}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-full bg-white/95 dark:bg-[#07111F]/95 backdrop-blur-2xl border-2 border-[#0A84FF]/40 hover:border-[#00C2FF] shadow-xl shadow-[#0A84FF]/20 hover:shadow-2xl hover:shadow-[#00C2FF]/35 transition-all duration-300"
          aria-label="Activate NOVA AI Voice Assistant"
        >
          {/* Glowing Core Orb with Reactive Icon */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#0066FF] via-[#6D5DFB] to-[#00C2FF] p-[2px] shadow-md shadow-[#0066FF]/30">
            <div className="w-full h-full rounded-full bg-white dark:bg-[#0B1627] flex items-center justify-center relative overflow-hidden">
              <Bot className="w-4 h-4 text-[#0A84FF] dark:text-[#00C2FF] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
            </div>

            {/* Pulsing Active State Dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22C55E] border-2 border-white dark:border-[#0B1627]" />
            </span>
          </div>

          {/* AI Identity & Voice Status */}
          <div className="text-left rtl:text-right hidden sm:block">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-1 rtl:space-x-reverse tracking-wider">
              <span>NOVA AI</span>
              <Sparkles className="w-3 h-3 text-[#00C2FF] animate-pulse" />
            </div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center space-x-1 rtl:space-x-reverse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{isAr ? "المساعد الصوتي الحي" : "Voice AI Twin"}</span>
            </div>
          </div>

          {/* Hover Action Pill */}
          <div className="hidden group-hover:flex items-center pl-1 rtl:pl-0 rtl:pr-1 text-xs font-bold text-[#0066FF] dark:text-[#00C2FF] font-sans">
            <span className="whitespace-nowrap">
              {isAr ? "تحدث الآن" : "Talk to Nova"}
            </span>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
