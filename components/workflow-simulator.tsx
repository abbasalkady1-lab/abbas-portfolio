"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, CheckCircle2, Bot, Workflow, Database, Zap, Shield, ArrowRight, Activity, Sparkles } from "lucide-react";

interface WorkflowSimulatorProps {
  lang: "en" | "ar";
}

interface Scenario {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  nodes: {
    nameEn: string;
    nameAr: string;
    type: "trigger" | "guard" | "reasoning" | "action" | "output";
    icon: React.ElementType;
    detailEn: string;
    detailAr: string;
  }[];
}

export function WorkflowSimulator({ lang }: WorkflowSimulatorProps) {
  const isAr = lang === "ar";
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);

  const scenarios: Scenario[] = [
    {
      id: "lead-qual",
      titleEn: "Autonomous Lead Qualification",
      titleAr: "تأهيل العملاء المحتملين ذاتياً",
      descriptionEn: "Event-driven webhook ingest, LLM intent scoring, and sub-3s multi-channel follow-up.",
      descriptionAr: "التقاط فوري لبيانات العميل، تحليل النوايا بالذكاء الاصطناعي، وإرسال رد ذكي ومزامنة CRM في أقل من 3 ثوانٍ.",
      nodes: [
        {
          nameEn: "Webhook Trigger",
          nameAr: "خطاف الويب (Webhook)",
          type: "trigger",
          icon: Zap,
          detailEn: "Inbound payload captured from WhatsApp/Landing",
          detailAr: "استقبال بيانات العميل عبر واتساب أو استمارة الموقع",
        },
        {
          nameEn: "Replay & Rate Guard",
          nameAr: "فحص الأمان ومنع التكرار",
          type: "guard",
          icon: Shield,
          detailEn: "Redis atomic key lock verified (Zero duplicates)",
          detailAr: "التحقق من قفل المفتاح في Redis ومنع أي تكرار",
        },
        {
          nameEn: "Gemini Reasoning",
          nameAr: "محرك التفكير والتقييم",
          type: "reasoning",
          icon: Bot,
          detailEn: "Lead intent classified as High-Value (Score: 94/100)",
          detailAr: "تقييم العميل كفرصة ذهبية عالية الأهمية (درجة 94/100)",
        },
        {
          nameEn: "CRM & DB Dispatch",
          nameAr: "مزامنة CRM وقاعدة البيانات",
          type: "action",
          icon: Database,
          detailEn: "Contact created, lead status set to 'VIP Contact'",
          detailAr: "إنشاء جهة الاتصال وتحديث الحالة إلى 'عميل مهم'",
        },
        {
          nameEn: "Instant Action Executed",
          nameAr: "إرسال التنبيه والرد الفوري",
          type: "output",
          icon: Workflow,
          detailEn: "Personalized WhatsApp sent + Slack team alerted (< 3.2s)",
          detailAr: "إرسال رسالة مخصصة للعميل وتنبيه فريق العمل (< 3.2 ث)",
        },
      ],
    },
    {
      id: "voice-agent",
      titleEn: "Real-time Voice AI Pipeline",
      titleAr: "مسار المكالمات الصوتية الذكية",
      descriptionEn: "Sub-450ms voice streaming with strict RAG knowledge grounding and action execution.",
      descriptionAr: "معالجة صوتية حية في أقل من 450 ملي ثانية مع استرجاع معرفي موثق وتنفيذ الإجراءات.",
      nodes: [
        {
          nameEn: "Audio Stream Inbound",
          nameAr: "تدفق الصوت الحي",
          type: "trigger",
          icon: Activity,
          detailEn: "Web Audio WebSocket stream active",
          detailAr: "استقبال صوت العميل عبر بث مقبس الويب المباشر",
        },
        {
          nameEn: "Speech-to-Intent",
          nameAr: "التعرف على الكلام والنوايا",
          type: "guard",
          icon: Bot,
          detailEn: "Bilingual Egyptian/English voice recognized",
          detailAr: "فهم الكلام باللهجة المصرية أو الإنجليزية بدقة",
        },
        {
          nameEn: "Grounded RAG Lookup",
          nameAr: "استرجاع المعرفة الموثقة",
          type: "reasoning",
          icon: Database,
          detailEn: "Semantic vector retrieval with zero hallucination",
          detailAr: "استخراج المعلومات الصحيحة من قاعدة البيانات المعتمدة",
        },
        {
          nameEn: "Tool Call Execution",
          nameAr: "استدعاء الأداة البرمجية",
          type: "action",
          icon: Zap,
          detailEn: "Agent invokes 'book_consultation_slot'",
          detailAr: "الوكيل يستدعي دالة 'حجز موعد استشارة' فورياً",
        },
        {
          nameEn: "Synthesized Voice Stream",
          nameAr: "بث الرد الصوتي الطبيعي",
          type: "output",
          icon: Workflow,
          detailEn: "Natural voice output delivered in 380ms",
          detailAr: "وصول الرد الصوتي الطبيعي لأذن العميل في 380 ملي ثانية",
        },
      ],
    },
  ];

  const currentScenario = scenarios[selectedScenarioIndex];

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(0);
    setLogs([isAr ? "بدء تشغيل مسار الأتمتة..." : "Pipeline execution initialized..."]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < currentScenario.nodes.length) {
        setCurrentStep(step);
        const node = currentScenario.nodes[step];
        setLogs((prev) => [
          ...prev,
          `[${node.type.toUpperCase()}] ${isAr ? node.nameAr : node.nameEn}: ${isAr ? node.detailAr : node.detailEn}`,
        ]);
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setLogs((prev) => [
          ...prev,
          isAr
            ? "✅ اكتمل تنفيذ المسار بنجاح بنسبة 100% دون أي أخطاء (Zero-Drop)."
            : "✅ Pipeline completed successfully with 100% integrity (Zero-Drop).",
        ]);
      }
    }, 1200);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setLogs([]);
  };

  return (
    <section id="simulator" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-50/50 dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/25 text-cyan-700 dark:text-cyan-400 font-mono text-xs mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "محاكي الأتمتة التفاعلي المباشر" : "LIVE AUTOMATION SIMULATOR"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "شاهد كيف تعمل مسارات الأتمتة الذكية" : "Interactive Automation Workflow Simulator"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "جرّب محاكاة حية لمسارات n8n والوكلاء الأذكياء. اختر السيناريو واضغط على زر التشغيل لتتبع حركة حزم البيانات."
              : "Test real-world agentic and n8n pipelines in real time. Select a scenario and trigger live data packet transit across execution nodes."}
          </p>
        </div>

        {/* Main Simulator Card */}
        <div className="rounded-3xl bg-white dark:bg-[#0C101D] border border-slate-200/90 dark:border-white/10 shadow-2xl p-6 sm:p-8 lg:p-10">
          {/* Scenario Selector & Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/80 dark:border-white/10">
            {/* Scenario Tabs */}
            <div className="flex flex-wrap gap-2">
              {scenarios.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedScenarioIndex(idx);
                    resetSimulation();
                  }}
                  className={`px-4 py-2 rounded-xl font-sans text-xs font-semibold transition-all ${
                    selectedScenarioIndex === idx
                      ? "bg-sky-600 text-white dark:bg-cyan-400 dark:text-slate-950 shadow-md shadow-sky-600/20"
                      : "bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {isAr ? s.titleAr : s.titleEn}
                </button>
              ))}
            </div>

            {/* Play & Reset Buttons */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className={`inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-2.5 rounded-xl font-sans text-xs font-semibold transition-all ${
                  isRunning
                    ? "bg-slate-200 text-slate-400 dark:bg-white/10 dark:text-slate-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:scale-[1.02]"
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? (isAr ? "جاري المعالجة..." : "Simulating...") : (isAr ? "تشغيل المسار الآن" : "Trigger Simulation")}</span>
              </button>

              <button
                onClick={resetSimulation}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.09] text-slate-600 dark:text-slate-300 transition-colors"
                title={isAr ? "إعادة تعيين" : "Reset"}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pipeline Visual Stages Track */}
          <div className="relative py-6 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[720px] gap-2 relative">
              {/* Connecting Background Line */}
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 dark:bg-white/10 -translate-y-1/2 z-0" />

              {/* Connecting Active Animated Line */}
              <motion.div
                className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 -translate-y-1/2 z-0"
                style={{
                  width: `${(currentStep / (currentScenario.nodes.length - 1)) * 92}%`,
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Node Stages */}
              {currentScenario.nodes.map((node, i) => {
                const NodeIcon = node.icon;
                const isPassed = currentStep >= i;
                const isCurrent = currentStep === i && isRunning;

                return (
                  <div key={i} className="relative z-10 flex flex-col items-center text-center w-36">
                    {/* Node Orb */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? "bg-sky-600 text-white shadow-xl shadow-sky-500/40 ring-4 ring-sky-300 dark:ring-cyan-500/40 scale-110"
                          : isPassed
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                          : "bg-white dark:bg-[#131826] text-slate-400 border border-slate-200 dark:border-white/10"
                      }`}
                    >
                      <NodeIcon className="w-6 h-6" />
                    </div>

                    {/* Node Title */}
                    <div className="mt-3 font-sans font-bold text-xs text-slate-900 dark:text-white">
                      {isAr ? node.nameAr : node.nameEn}
                    </div>

                    {/* Detail Snippet */}
                    <div className="mt-1 font-sans text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {isAr ? node.detailAr : node.detailEn}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Execution Telemetry Logs */}
          <div className="mt-10 rounded-2xl bg-slate-950 p-4 sm:p-5 border border-slate-800 text-left rtl:text-left font-mono text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>EXECUTION_TELEMETRY // LIVE STREAM</span>
              </span>
              <span>STATE: {isRunning ? "IN_PROGRESS" : currentStep > 0 ? "COMPLETED" : "IDLE"}</span>
            </div>

            <div className="min-h-[90px] space-y-1.5 pt-1">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic">
                  {isAr ? "اضغط على 'تشغيل المسار الآن' لبدء تتبع حزم البيانات..." : "Click 'Trigger Simulation' to trace live data packets across nodes..."}
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-sky-300 text-[11px] flex items-center space-x-2">
                    <span className="text-slate-500 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
