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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#090A0F] text-slate-900 dark:text-white px-6 font-sans selection:bg-sky-500/25 transition-colors duration-200"
        >
          <div className="w-full max-w-md space-y-6">
            {/* Header / Logo */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-400 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300 font-mono font-medium">
                  ABBAS EL KADY // PORTFOLIO
                </span>
              </div>
              <span className="text-xs font-mono text-sky-600 dark:text-cyan-400 font-semibold">{Math.min(progress, 100)}%</span>
            </div>

            {/* Sub-messages */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <p className="flex items-center justify-between">
                <span>&gt; AI System Architecture:</span>
                <span className="text-sky-600 dark:text-cyan-400 font-semibold">READY</span>
              </p>
              <p className="flex items-center justify-between">
                <span>&gt; NOVA Digital Assistant:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">STANDBY</span>
              </p>
              <p className="flex items-center justify-between">
                <span>&gt; Autonomous Pipelines:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ACTIVE</span>
              </p>
            </div>

            {/* Sleek Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sky-600 dark:bg-cyan-400 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <p className="text-center text-[11px] font-mono text-slate-400 dark:text-slate-500 tracking-wider">
              Initializing Experience...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
