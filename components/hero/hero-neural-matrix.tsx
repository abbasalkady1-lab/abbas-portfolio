"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Cpu,
  Workflow,
  Database,
  Mic,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface HeroNeuralMatrixProps {
  lang: "en" | "ar";
}

interface SatelliteNode {
  id: string;
  titleEn: string;
  titleAr: string;
  tagEn: string;
  tagAr: string;
  icon: React.ElementType;
  metric: string;
  metricLabelEn: string;
  metricLabelAr: string;
  color: string;
  borderGlow: string;
  coords: { x: number; y: number };
  floatDuration: number;
  floatDeltaY: number;
  floatDeltaX: number;
  pathD: string;
}

export function HeroNeuralMatrix({ lang }: HeroNeuralMatrixProps) {
  const isAr = lang === "ar";
  const [activeNodeId, setActiveNodeId] = useState<string>("agents");
  const [telemetryIndex, setTelemetryIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const satellites: SatelliteNode[] = [
    {
      id: "agents",
      titleEn: "Autonomous Agents",
      titleAr: "وكلاء الذكاء الاصطناعي",
      tagEn: "ReAct & Tool Calling",
      tagAr: "اتخاذ القرار وتنفيذ الأدوات",
      icon: Bot,
      metric: "99.4%",
      metricLabelEn: "Decision Accuracy",
      metricLabelAr: "دقة القرارات",
      color: "from-[#0A84FF] to-[#0066FF]",
      borderGlow: "rgba(10, 132, 255, 0.4)",
      coords: { x: 18, y: 16 },
      floatDuration: 3.6,
      floatDeltaY: -5,
      floatDeltaX: 2,
      pathD: "M 50 50 Q 32 30 18 16",
    },
    {
      id: "automation",
      titleEn: "n8n Automation",
      titleAr: "أتمتة العمليات n8n",
      tagEn: "Distributed Pipelines",
      tagAr: "مسارات عمل موزعة",
      icon: Workflow,
      metric: "50k+",
      metricLabelEn: "Daily Executions",
      metricLabelAr: "عملية يومية",
      color: "from-[#6D5DFB] to-[#7C3AED]",
      borderGlow: "rgba(109, 93, 251, 0.4)",
      coords: { x: 82, y: 16 },
      floatDuration: 4.4,
      floatDeltaY: 6,
      floatDeltaX: -3,
      pathD: "M 50 50 Q 68 30 82 16",
    },
    {
      id: "rag",
      titleEn: "Precision RAG",
      titleAr: "الاسترجاع المعرفي",
      tagEn: "Vector + BM25 Hybrid",
      tagAr: "استرجاع هجين دقيق",
      icon: Database,
      metric: "100%",
      metricLabelEn: "Citation Grounding",
      metricLabelAr: "توثيق واقتباس",
      color: "from-[#22C55E] to-[#10B981]",
      borderGlow: "rgba(34, 197, 94, 0.4)",
      coords: { x: 12, y: 52 },
      floatDuration: 5.1,
      floatDeltaY: -4,
      floatDeltaX: 1,
      pathD: "M 50 50 Q 28 52 12 52",
    },
    {
      id: "voice",
      titleEn: "Real-time Voice",
      titleAr: "الذكاء الصوتي الحي",
      tagEn: "Bilingual Web Audio",
      tagAr: "معالجة صوتية فورية",
      icon: Mic,
      metric: "< 420ms",
      metricLabelEn: "Stream Latency",
      metricLabelAr: "زمن الاستجابة",
      color: "from-[#00C2FF] to-[#0A84FF]",
      borderGlow: "rgba(0, 194, 255, 0.4)",
      coords: { x: 88, y: 52 },
      floatDuration: 3.2,
      floatDeltaY: 5,
      floatDeltaX: -2,
      pathD: "M 50 50 Q 72 52 88 52",
    },
    {
      id: "tools",
      titleEn: "Tools & APIs",
      titleAr: "استدعاء الأدوات",
      tagEn: "Schema Execution",
      tagAr: "استدعاء برمجيات موثق",
      icon: Zap,
      metric: "77+",
      metricLabelEn: "Live API Routes",
      metricLabelAr: "مسار برمجي نشط",
      color: "from-amber-500 to-orange-500",
      borderGlow: "rgba(245, 158, 11, 0.4)",
      coords: { x: 26, y: 84 },
      floatDuration: 4.1,
      floatDeltaY: -5,
      floatDeltaX: 3,
      pathD: "M 50 50 Q 36 70 26 84",
    },
    {
      id: "security",
      titleEn: "Safe Guardrails",
      titleAr: "الحوكمة والأمان",
      tagEn: "Zero Hallucination",
      tagAr: "منع الهلوسة الصارم",
      icon: ShieldCheck,
      metric: "0.00%",
      metricLabelEn: "False Claims",
      metricLabelAr: "نسبة ادعاءات خاطئة",
      color: "from-[#6D5DFB] to-[#00C2FF]",
      borderGlow: "rgba(109, 93, 251, 0.4)",
      coords: { x: 74, y: 84 },
      floatDuration: 4.8,
      floatDeltaY: 4,
      floatDeltaX: -2,
      pathD: "M 50 50 Q 64 70 74 84",
    },
  ];

  const telemetryEvents = [
    {
      actionEn: "ReAct Agent Loop: Trigger Ingest -> Intent Validated (0.98) -> Tool 'ScheduleCall'",
      actionAr: "وكيل ReAct: استقبال طلب العميل -> فحص النوايا (0.98) -> تنفيذ أداة الجدولة",
      sub: "AGENT_RUNTIME // ONLINE",
    },
    {
      actionEn: "n8n Webhook Pipeline: CRM Synced -> Replay Attack Defense (HMAC Passed) -> 120ms",
      actionAr: "أتمتة n8n: مزامنة CRM فورية -> التحقق من حماية الـ Webhooks -> ١٢٠ ملي ثانية",
      sub: "N8N_CLUSTER // HEALTHY",
    },
    {
      actionEn: "RAG Hybrid Retrieval: 4 Chunks Grounded -> Reciprocal Rank Fusion -> 100% Citations",
      actionAr: "استرجاع RAG: دمج هجين للمتجهات و BM25 -> 4 مقاطع موثقة بدون هلوسة",
      sub: "VECTOR_DB // ACCURATE",
    },
    {
      actionEn: "Voice Stream: Sub-420ms Speech-to-Speech Generated -> Natural Arabic Nuances",
      actionAr: "بث صوتي حي: توليد استجابة صوتية فورية (< 420 ملي ثانية) بنبرة طبيعية",
      sub: "VOICE_CORE // ULTRA_FAST",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryIndex((prev) => (prev + 1) % telemetryEvents.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [telemetryEvents.length]);

  const activeNode = satellites.find((s) => s.id === activeNodeId) || satellites[0];

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Dynamic Radial Ambient Backing */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0A84FF]/15 via-[#6D5DFB]/10 to-[#00C2FF]/15 rounded-3xl blur-3xl -z-10" />

      {/* Main AI Matrix Glass Container */}
      <div className="relative w-full rounded-3xl bg-white/85 dark:bg-[#0B1627]/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-300/40 dark:shadow-black/70 p-5 sm:p-7 flex flex-col justify-between overflow-hidden">
        {/* Fine Technical Grid Layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,18,32,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,18,32,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:26px_26px] pointer-events-none" />

        {/* Top Status Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-slate-100/90 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 font-mono text-[11px] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold tracking-wider uppercase">
              {isAr ? "مصفوفة الوكلاء الذاتية" : "AUTONOMOUS AGENTIC NETWORK"}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-[#0A84FF] dark:text-[#00C2FF] font-semibold">Gemini 1.5 Core</span>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono text-[10px] text-slate-500 dark:text-slate-400">
            <Activity className="w-3.5 h-3.5 text-[#0A84FF] animate-pulse" />
            <span className="font-semibold">60 FPS REALTIME</span>
          </div>
        </div>

        {/* Center Arena: Central Core & Satellite Nodes */}
        <div className="relative my-4 w-full h-80 sm:h-96 flex items-center justify-center select-none">
          {/* SVG Animated Connecting Curved Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="coreLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#6D5DFB" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#00C2FF" stopOpacity="0.8" />
              </linearGradient>

              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {satellites.map((node) => {
              const isActive = activeNodeId === node.id;
              return (
                <g key={node.id}>
                  {/* Subtle Background Path */}
                  <path
                    d={node.pathD}
                    fill="none"
                    stroke={isActive ? "url(#coreLineGrad)" : "rgba(100, 116, 139, 0.2)"}
                    strokeWidth={isActive ? "1.6" : "0.9"}
                    strokeDasharray={isActive ? "none" : "2 2"}
                    className="transition-all duration-300"
                  />

                  {/* Traveling Pulse 1 */}
                  <circle r={isActive ? "1.8" : "1.2"} fill={isActive ? "#00C2FF" : "#0A84FF"}>
                    <animateMotion
                      path={node.pathD}
                      dur={`${isActive ? "1.8s" : "3.2s"}`}
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Traveling Pulse 2 (Reverse / Offset) */}
                  {isActive && (
                    <circle r="1.4" fill="#6D5DFB" filter="url(#glowFilter)">
                      <animateMotion
                        path={node.pathD}
                        dur="2.4s"
                        begin="0.9s"
                        repeatCount="indefinite"
                        keyPoints="1;0"
                        keyTimes="0;1"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* CENTRAL NODE: NOVA / AI CORE */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            {/* Outer Rotating Kinetic Ring */}
            <div className="absolute -inset-6 rounded-full border border-dashed border-[#0A84FF]/30 dark:border-[#00C2FF]/30 animate-spin-slow pointer-events-none" />

            {/* Inner Reverse Rotating Ring */}
            <div className="absolute -inset-3.5 rounded-full border border-dotted border-[#6D5DFB]/40 dark:border-[#6D5DFB]/50 animate-spin-reverse-slow pointer-events-none" />

            {/* Pulsing Breathing Aura */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#0A84FF]/20 via-[#6D5DFB]/20 to-[#00C2FF]/20 blur-md animate-breathe-aura pointer-events-none" />

            {/* Core Orb */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#0066FF] via-[#6D5DFB] to-[#00C2FF] p-[2px] shadow-lg shadow-[#0066FF]/35 cursor-pointer"
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-[#07111F] flex flex-col items-center justify-center text-center p-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A84FF]/10 to-[#6D5DFB]/10" />
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#0066FF] dark:text-[#00C2FF] animate-pulse relative z-10" />
                <span className="text-[9px] sm:text-[10px] font-mono font-extrabold text-slate-900 dark:text-white tracking-widest uppercase relative z-10 mt-0.5">
                  NOVA
                </span>
                <span className="text-[7px] font-mono text-[#0A84FF] dark:text-[#00C2FF] font-bold uppercase relative z-10">
                  AI CORE
                </span>
              </div>
            </motion.div>
          </div>

          {/* 6 SATELLITE NODES WITH ASYNCHRONOUS FLOATING */}
          {satellites.map((node) => {
            const Icon = node.icon;
            const isActive = activeNodeId === node.id;

            return (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                style={{
                  left: `${node.coords.x}%`,
                  top: `${node.coords.y}%`,
                }}
                onClick={() => setActiveNodeId(node.id)}
              >
                {/* Independent Floating Wrapper — Asynchronous timing prevents mechanical sync */}
                <motion.div
                  animate={
                    isMounted
                      ? {
                          y: [0, node.floatDeltaY, 0],
                          x: [0, node.floatDeltaX, 0],
                        }
                      : undefined
                  }
                  transition={{
                    duration: node.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.08 }}
                  className={`group relative p-2.5 sm:p-3 rounded-2xl transition-all duration-300 backdrop-blur-xl flex items-center space-x-2 rtl:space-x-reverse ${
                    isActive
                      ? "bg-white dark:bg-[#0D1626] border-2 shadow-xl"
                      : "bg-white/90 dark:bg-[#0D1626]/80 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md"
                  }`}
                  style={{
                    borderColor: isActive
                      ? node.borderGlow
                      : undefined,
                    boxShadow: isActive
                      ? `0 0 20px -2px ${node.borderGlow}`
                      : undefined,
                  }}
                >
                  {/* Icon Container */}
                  <div
                    className={`p-2 rounded-xl bg-gradient-to-tr ${node.color} text-white shadow-sm shrink-0`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>

                  {/* Compact Node Label & Metric */}
                  <div className="text-left rtl:text-right hidden xs:block sm:block">
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white font-sans whitespace-nowrap">
                      {isAr ? node.titleAr : node.titleEn}
                    </div>
                    <div className="text-[9px] font-mono text-[#0A84FF] dark:text-[#00C2FF] font-semibold flex items-center space-x-1 rtl:space-x-reverse">
                      <span>{node.metric}</span>
                      <span className="text-slate-400 font-normal">
                        {isAr ? node.metricLabelAr : node.metricLabelEn}
                      </span>
                    </div>
                  </div>

                  {/* Tiny active ping on active node */}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00C2FF] animate-ping" />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stage: Active Node Highlight + Real-time Telemetry Stream */}
        <div className="relative z-10 pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
          {/* Active Node Detail Strip */}
          <div className="flex items-center justify-between text-xs px-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE SUBSYSTEM:</span>
              <span className="font-bold text-slate-900 dark:text-white font-sans flex items-center space-x-1">
                <span>{isAr ? activeNode.titleAr : activeNode.titleEn}</span>
                <span className="text-[10px] font-mono text-[#0A84FF] dark:text-[#00C2FF]">
                  ({activeNode.metric})
                </span>
              </span>
            </div>

            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 dark:border-emerald-500/20">
              {isAr ? activeNode.tagAr : activeNode.tagEn}
            </span>
          </div>

          {/* Live Telemetry Log Terminal */}
          <div className="p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] sm:text-[11px] flex items-center justify-between border border-slate-800 shadow-inner overflow-hidden">
            <div className="flex items-center space-x-2 rtl:space-x-reverse min-w-0">
              <Terminal className="w-3.5 h-3.5 text-[#00C2FF] shrink-0" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={telemetryIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="truncate text-slate-300"
                >
                  {isAr
                    ? telemetryEvents[telemetryIndex].actionAr
                    : telemetryEvents[telemetryIndex].actionEn}
                </motion.span>
              </AnimatePresence>
            </div>

            <span className="text-[9px] text-[#00C2FF] bg-[#00C2FF]/10 px-2 py-0.5 rounded shrink-0 ml-2 font-semibold">
              {telemetryEvents[telemetryIndex].sub}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
