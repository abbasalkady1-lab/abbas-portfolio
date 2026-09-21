"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Workflow,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Terminal,
} from "lucide-react";

interface CapabilitiesSectionProps {
  lang: "en" | "ar";
}

export function CapabilitiesSection({ lang }: CapabilitiesSectionProps) {
  const isAr = lang === "ar";
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      id: "agents",
      icon: Bot,
      color: "from-[#0A84FF] to-[#0066FF]",
      accent: "text-[#0A84FF] dark:text-[#00C2FF]",
      cardClass: "card-ai",
      titleEn: "Autonomous AI Agents",
      titleAr: "وكلاء الذكاء الاصطناعي الذاتية",
      subtitleEn: "Goal-Driven ReAct Loops & Multimodal Action Engines",
      subtitleAr: "أنظمة اتخاذ قرار مستقلة واستدعاء أدوات متعددة الوسائط",
      descEn:
        "Designing stateful agents powered by Google Gemini and advanced LLMs. Capable of multi-step task planning, live web browsing, structured tool invocation, and dynamic self-healing error recovery.",
      descAr:
        "بناء وكلاء أذكياء يعملون بنماذج Google Gemini وأحدث نماذج اللغة التوليدية. قادرون على التخطيط متعدد المراحل، وتصفح الويب، واستدعاء الأدوات البرمجية، والتعافي الذاتي من الأخطاء أثناء التنفيذ.",
      highlightsEn: [
        "ReAct & Tool Calling with Schema Validation",
        "Low-Latency Web Audio Streaming (< 450ms)",
        "Zero-Hallucination Grounded Memory",
        "Autonomous Decision Boundaries & Safe Guardrails",
      ],
      highlightsAr: [
        "تنفيذ أدوات ذاتي (ReAct) مع فحص صارم للمدخلات",
        "معالجة صوتية فورية فائقة السرعة (< 450 ملي ثانية)",
        "ذاكرة سياقية موثقة مانعة للهلوسة تماماً",
        "حدود أمان وحوكمة صارمة للقرارات الذكية",
      ],
      metrics: [
        { labelEn: "Intent Accuracy", labelAr: "دقة فهم النوايا", value: "99.4%" },
        { labelEn: "Response Cycle", labelAr: "دورة الاستجابة", value: "380ms" },
      ],
      codeSnippet: `// Agent ReAct Execution Loop
const agent = new AutonomousAgent({
  model: "gemini-1.5-pro",
  tools: [crmSyncTool, ragQueryTool, voiceSynthTool],
  grounding: "verified_knowledge_graph",
  maxIterations: 6
});
const result = await agent.solve(task);`,
    },
    {
      id: "automation",
      icon: Workflow,
      color: "from-[#6D5DFB] to-[#7C3AED]",
      accent: "text-[#6D5DFB] dark:text-[#818CF8]",
      cardClass: "card-automation",
      titleEn: "Enterprise n8n Automation",
      titleAr: "أتمتة العمليات المؤسسية عبر n8n",
      subtitleEn: "High-Throughput Webhook Orchestration & Zero-Data-Loss Pipelines",
      subtitleAr: "تنسيق خطافات الويب عالية الكفاءة مع منع فقدان البيانات",
      descEn:
        "Architecting distributed automation matrices using self-hosted and cloud n8n. Integrating CRMs, instant messaging (WhatsApp Cloud, Slack), and automated financial systems with idempotency and replay defense.",
      descAr:
        "هندسة مصفوفات أتمتة موزعة باستخدام n8n السحابي والمستضاف ذاتياً. ربط أنظمة إدارة العملاء وواتساب للأعمال وسلاك مع حماية فائقة ضد تكرار البيانات ومعالجة فورية.",
      highlightsEn: [
        "Distributed Webhook Replay Defense via Redis",
        "Automated Multi-Tier Lead Scoring & Routing",
        "Self-Healing Failure Retries & Dead Letter Queues",
        "Zero-Downtime Hot-Reload Workflow Deployments",
      ],
      highlightsAr: [
        "حماية خطافات الويب ضد هجمات الإعادة عبر Redis",
        "تقييم وفرز العملاء المحتملين آلياً عبر الذكاء الاصطناعي",
        "إعادة المحاولة الذاتية عند تعثر العمليات",
        "تحديث مسارات العمل في الوقت الفعلي دون انقطاع",
      ],
      metrics: [
        { labelEn: "Daily Executions", labelAr: "عملية يومية مؤتمتة", value: "50,000+" },
        { labelEn: "Sync Latency", labelAr: "زمن المزامنة الفورية", value: "< 3.2s" },
      ],
      codeSnippet: `// n8n Webhook Replay Defense Guard
export async function verifyWebhook(req: Request) {
  const signature = req.headers.get("x-n8n-hmac");
  const isValid = crypto.timingSafeEqual(expected, signature);
  if (!isValid) throw new SecurityError("HMAC verification failed");
  return await dispatchQueue(req.body);
}`,
    },
    {
      id: "rag",
      icon: Database,
      color: "from-[#22C55E] to-[#10B981]",
      accent: "text-[#22C55E] dark:text-[#34D399]",
      cardClass: "card-rag",
      titleEn: "Precision Cognitive RAG",
      titleAr: "الاسترجاع المعرفي المعزز فائق الدقة",
      subtitleEn: "Hybrid Vector + Lexical Search with Citation Backtracking",
      subtitleAr: "بحث هجين بين المتجهات والكلمات الدلالية مع توثيق المصادر",
      descEn:
        "Enterprise document intelligence extracting actionable answers from thousands of complex PDFs, legal contracts, and technical schemas. Incorporating reciprocal rank fusion and strict source citations.",
      descAr:
        "محركات استرجاع واستخلاص المعرفة من آلاف الوثائق وملفات PDF والعقود المعقدة. تعتمد على دمج الترتيب التبادلي وتوثيق الاقتباسات العكسي لمنع الهلوسة تماماً.",
      highlightsEn: [
        "Reciprocal Rank Fusion (BM25 + Dense Embeddings)",
        "Semantic Document Parsing & Table Extraction",
        "100% Verifiable Source Citation Backtracking",
        "Cross-Encoder Re-Ranking for Top-3 Precision",
      ],
      highlightsAr: [
        "دمج تبادلي لبحث الكلمات المفتاحية والمتجهات الدلالية",
        "استخراج دقيق للجداول والنصوص من ملفات PDF المعقدة",
        "توثيق المصادر بنسبة 100% مع تحديد الصفحة والفقرة",
        "إعادة ترتيب متقدمة لأعلى 3 نتائج دقة",
      ],
      metrics: [
        { labelEn: "Retrieval Precision", labelAr: "دقة استرجاع الإجابات", value: "96.7%" },
        { labelEn: "Hallucination Rate", labelAr: "معدل الهلوسة", value: "0.0%" },
      ],
      codeSnippet: `// Hybrid RAG Query Engine
const hybridResults = await rrfRetriever.search({
  query: userPrompt,
  denseWeight: 0.6,
  bm25Weight: 0.4,
  rerank: "cross-encoder-ms-marco"
});
return citationVerifier.annotate(hybridResults);`,
    },
    {
      id: "web",
      icon: Layers,
      color: "from-[#00C2FF] to-[#0A84FF]",
      accent: "text-[#00C2FF] dark:text-[#38BDF8]",
      cardClass: "card-voice",
      titleEn: "Intelligent Web Systems",
      titleAr: "هندسة الأنظمة والبرمجيات الذكية",
      subtitleEn: "Type-Safe Full-Stack SaaS Architectures with Low-Latency Streaming",
      subtitleAr: "تطبيقات سحابية متكاملة فائقة الأمان مع بث مباشر للبيانات",
      descEn:
        "Developing scalable, accessible, and high-performance digital products. Utilizing Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, and distributed serverless edge workers to create delightful user interfaces.",
      descAr:
        "تطوير منصات رقمية وحلول سحابية متكاملة فائقة السرعة والأمان. باستخدام Next.js و TypeScript و PostgreSQL والأنظمة الموزعة لتقديم تجربة استخدام استثنائية وسلسة.",
      highlightsEn: [
        "Next.js App Router & Server Components Optimization",
        "Multi-Tenant Context Isolation & Encryption (AES-256)",
        "Bilingual RTL/LTR Localization Architecture",
        "Core Web Vitals Perfection & 60 FPS Micro-Interactions",
      ],
      highlightsAr: [
        "استغلال مكونات الخادم الحديثة في Next.js للسرعة القصوى",
        "عزل كامل لبيانات الشركات والمستأجرين مع تشفير AES-256",
        "معمارية ثنائية اللغة تدعم الاتجاه العربي RTL بامتياز",
        "توافق كامل مع مؤشرات أداء الويب الأساسية وسلاسة تامة",
      ],
      metrics: [
        { labelEn: "Lighthouse Score", labelAr: "مؤشر الأداء العالمي", value: "98/100" },
        { labelEn: "Type Safety", labelAr: "أمان الأنواع البرمجية", value: "100%" },
      ],
      codeSnippet: `// Server Action with Type-Safe Guard
export async function executeAgentAction(input: ActionSchema) {
  const session = await auth();
  assertTenantContext(session.tenantId);
  return await dispatchIntelligentJob(input);
}`,
    },
  ];

  const current = pillars[activeTab];
  const Icon = current.icon;

  return (
    <section id="capabilities" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1.5 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-[#6D5DFB] dark:text-[#818CF8] font-mono text-xs mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#6D5DFB]" />
            <span className="font-bold tracking-wider uppercase">
              {isAr ? "الركائز الهندسية الأربعة" : "CORE ENGINEERING PILLARS"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "قدرات الذكاء الاصطناعي وهندسة الأتمتة" : "AI & Automation Engineering Capabilities"}
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "معايير برمجية متقدمة ومنهجيات عمل تضمن بناء حلول ذكية مستقرة وموثوقة وقابلة للتوسع في بيئات العمل الحقيقية."
              : "Rigorous engineering principles applied to real-world autonomous systems, distributed pipelines, and production web apps."}
          </p>
        </div>

        {/* 4 Interactive Capability Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {pillars.map((p, index) => {
            const PIcon = p.icon;
            const isSelected = activeTab === index;
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(index)}
                className={`p-4 rounded-2xl text-left rtl:text-right border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? `${p.cardClass} shadow-lg scale-[1.02] border-2`
                    : "bg-white/80 hover:bg-white dark:bg-[#0B1627]/60 dark:hover:bg-[#0B1627] border-slate-200/80 dark:border-white/10"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${p.color} flex items-center justify-center text-white mb-3 shadow-sm`}
                >
                  <PIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-sans">
                    {isAr ? p.titleAr : p.titleEn}
                  </div>
                  <div className="text-[11px] font-mono text-[#0066FF] dark:text-[#00C2FF] font-semibold mt-1">
                    {p.metrics[0].value} {isAr ? p.metrics[0].labelAr : p.metrics[0].labelEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Active Pillar Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`rounded-3xl border-2 shadow-2xl p-6 sm:p-8 lg:p-10 ${current.cardClass}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Info Column */}
              <div className="lg:col-span-7 space-y-5 text-left rtl:text-right">
                <div className={`flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono font-bold uppercase tracking-wider ${current.accent}`}>
                  <Icon className="w-4 h-4" />
                  <span>{isAr ? current.subtitleAr : current.subtitleEn}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
                  {isAr ? current.titleAr : current.titleEn}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  {isAr ? current.descAr : current.descEn}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5 pt-2">
                  {(isAr ? current.highlightsAr : current.highlightsEn).map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2.5 rtl:space-x-reverse font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Verified Pillar Metrics Strip */}
                <div className="pt-4 flex flex-wrap gap-4 border-t border-slate-200/60 dark:border-white/5">
                  {current.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-white/[0.04] px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-sm"
                    >
                      <div className="text-xl font-mono font-bold text-[#0066FF] dark:text-[#00C2FF]">
                        {m.value}
                      </div>
                      <div className="text-[11px] font-sans text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                        {isAr ? m.labelAr : m.labelEn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Code/Architecture Terminal */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs text-slate-300">
                  {/* Terminal Header */}
                  <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-[11px] text-slate-400 ml-2 font-mono">
                        {current.id}_pipeline.ts
                      </span>
                    </div>
                    <span className="text-[10px] text-[#00C2FF] bg-[#00C2FF]/10 px-2 py-0.5 rounded border border-[#00C2FF]/30 font-semibold">
                      Production Active
                    </span>
                  </div>

                  {/* Terminal Code Body */}
                  <div className="p-4 sm:p-5 overflow-x-auto text-[11px] sm:text-xs leading-relaxed text-[#00C2FF]">
                    <pre>
                      <code>{current.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
