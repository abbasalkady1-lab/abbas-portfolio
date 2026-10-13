"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function IntroLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if already shown in this session
    const hasLoaded = sessionStorage.getItem("intro_loaded");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("intro_loaded", "true");
          }, 350);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 12;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#070C16] text-slate-900 dark:text-white px-6 font-sans selection:bg-[#00C2FF]/25 transition-colors duration-200"
        >
          <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-[#0B1324]/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
            {/* Header / Logo */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C2FF] animate-pulse ring-4 ring-[#00C2FF]/20" />
                <span className="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200 font-mono font-bold">
                  ABBAS EL KADY // 2026
                </span>
              </div>
              <span className="text-xs font-mono text-[#0066FF] dark:text-[#00C2FF] font-bold">
                {Math.min(progress, 100)}%
              </span>
            </div>

            {/* Sub-messages */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <p className="flex items-center justify-between">
                <span>&gt; AI System Architecture:</span>
                <span className="text-[#0A84FF] dark:text-[#00C2FF] font-bold">ONLINE</span>
              </p>
              <p className="flex items-center justify-between">
                <span>&gt; Autonomous NOVA Voice Core:</span>
                <span className="text-[#6D5DFB] dark:text-[#818CF8] font-bold">STANDBY</span>
              </p>
              <p className="flex items-center justify-between">
                <span>&gt; n8n Enterprise Pipelines:</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-bold">ACTIVE</span>
              </p>
            </div>

            {/* Sleek Gradient Progress Bar */}
            <div className="w-full h-2 bg-slate-200/80 dark:bg-white/10 rounded-full overflow-hidden p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0066FF] via-[#00C2FF] to-[#6D5DFB] rounded-full shadow-[0_0_12px_rgba(0,194,255,0.6)]"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <p className="text-center text-[11px] font-mono text-slate-400 dark:text-slate-400 tracking-wider">
              INITIALIZING EXECUTIVE ENVIRONMENT...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
