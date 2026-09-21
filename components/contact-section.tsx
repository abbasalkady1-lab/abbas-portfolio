"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import {
  LinkedinIcon,
  GithubIcon,
  YoutubeIcon,
  TelegramIcon,
} from "@/components/icons";
import confetti from "canvas-confetti";
import { ProfileData } from "@/types";

interface ContactSectionProps {
  profile: ProfileData;
  lang: "en" | "ar";
}

export function ContactSection({ profile, lang }: ContactSectionProps) {
  const isAr = lang === "ar";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "AI Agent Development",
    message: "",
    website_hp: "", // Honeypot spam trap
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const cleanPhone = (profile.whatsapp || profile.phone || "+201000000000").replace(/[^0-9]/g, "");

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const serviceOptions = [
    "AI Agent Development",
    "Enterprise n8n Automation",
    "Knowledge RAG & Document AI",
    "Custom Software & Web Platform",
    "Technical Consultation & Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Spam honeypot detection
    if (formData.website_hp) {
      setSubmitted(true);
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage(isAr ? "يرجى ملء الحقول الإلزامية." : "Please fill in required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          message: formData.message,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0284C7", "#38BDF8", "#6366F1"],
      });
    } catch (err) {
      setErrorMessage(
        isAr ? "حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً." : "Failed to transmit message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1 rounded-full bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/25 text-sky-700 dark:text-cyan-400 font-mono text-xs mb-3 shadow-sm hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "تواصل معي // قنوات مباشرة" : "COMMUNICATION // DIRECT ENGAGEMENT"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "تواصل مع عباس القاضي" : "Initiate Direct Contact"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "اختر وسيلة التواصل الأنسب لك (واتساب مباشر، بريد، هاتف، أو شبكات التواصل) أو أرسل تفاصيل مشروعك واستفسارك عبر النموذج أدناه."
              : "Reach out via your preferred direct channel (WhatsApp, Email, Phone, or social platforms) or submit your project requirements below."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct channels sidebar (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="bg-white dark:bg-[#0F121C] p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isAr ? "قنوات التواصل الفوري" : "Direct Channels"}</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase">
                  {isAr ? "متاح للعمل" : "Active & Responsive"}
                </span>
              </div>

              {/* 1. WhatsApp Direct */}
              {profile.whatsapp && (
                <div className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 dark:bg-white/[0.02] dark:hover:bg-emerald-500/10 border border-slate-200/80 hover:border-emerald-300 dark:border-white/5 dark:hover:border-emerald-500/30 transition-all">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      isAr ? "مرحباً عباس، أود التواصل معك بخصوص مشروع ذكاء اصطناعي" : "Hello Abbas, I would like to connect regarding an AI project"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 rtl:space-x-reverse flex-1 min-w-0"
                  >
                    <div className="p-2 rounded-xl bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                        {isAr ? "واتساب مباشر" : "WhatsApp Direct"}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate block">
                        {profile.whatsapp}
                      </span>
                    </div>
                  </a>
                  <button
                    onClick={() => handleCopy(profile.whatsapp, "wa")}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    title={isAr ? "نسخ الرقم" : "Copy WhatsApp"}
                  >
                    {copiedKey === "wa" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* 2. Official Email */}
              {profile.email && (
                <div className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50/60 dark:bg-white/[0.02] dark:hover:bg-sky-500/10 border border-slate-200/80 hover:border-sky-300 dark:border-white/5 dark:hover:border-sky-500/30 transition-all">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center space-x-3 rtl:space-x-reverse flex-1 min-w-0"
                  >
                    <div className="p-2 rounded-xl bg-sky-100/80 dark:bg-cyan-500/20 text-sky-600 dark:text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                        {isAr ? "البريد الإلكتروني" : "Official Email"}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors truncate block">
                        {profile.email}
                      </span>
                    </div>
                  </a>
                  <button
                    onClick={() => handleCopy(profile.email, "email")}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-cyan-400 transition-colors"
                    title={isAr ? "نسخ البريد" : "Copy Email"}
                  >
                    {copiedKey === "email" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* 3. Phone Call */}
              {profile.phone && (
                <div className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] border border-slate-200/80 hover:border-slate-300 dark:border-white/5 dark:hover:border-white/15 transition-all">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center space-x-3 rtl:space-x-reverse flex-1 min-w-0"
                  >
                    <div className="p-2 rounded-xl bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-200 group-hover:scale-110 transition-transform shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                        {isAr ? "الاتصال الهاتفي" : "Direct Phone"}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors truncate block">
                        {profile.phone}
                      </span>
                    </div>
                  </a>
                  <button
                    onClick={() => handleCopy(profile.phone, "phone")}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    title={isAr ? "نسخ الهاتف" : "Copy Phone"}
                  >
                    {copiedKey === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* 4. LinkedIn */}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 dark:bg-white/[0.02] dark:hover:bg-blue-500/10 border border-slate-200/80 hover:border-blue-300 dark:border-white/5 dark:hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse truncate">
                    <div className="p-2 rounded-xl bg-blue-100/80 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                      <LinkedinIcon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                        {isAr ? "لينكد إن" : "LinkedIn Network"}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate block">
                        Abbas El Kady
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
                </a>
              )}

              {/* 5. GitHub */}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] border border-slate-200/80 hover:border-slate-300 dark:border-white/5 dark:hover:border-white/15 transition-all"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse truncate">
                    <div className="p-2 rounded-xl bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-white group-hover:scale-110 transition-transform shrink-0">
                      <GithubIcon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                        {isAr ? "جيت هب" : "GitHub Repositories"}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors truncate block">
                        @abbasalkady1-lab
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors shrink-0" />
                </a>
              )}

              {/* 6. YouTube Channel */}
              {profile.youtube && (
                <a
                  href={profile.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-red-50/60 dark:bg-white/[0.02] dark:hover:bg-red-500/10 border border-slate-200/80 hover:border-red-300 dark:border-white/5 dark:hover:border-red-500/30 transition-all"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse truncate">
                    <div className="p-2 rounded-xl bg-red-100/80 dark:bg-red-500/20 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform shrink-0">
                      <YoutubeIcon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                        {isAr ? "قناة اليوتيوب" : "YouTube Channel"}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate block">
                        Abbas El Kady AI
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors shrink-0" />
                </a>
              )}

              {/* 7. Telegram */}
              {profile.telegram && (
                <a
                  href={profile.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50/60 dark:bg-white/[0.02] dark:hover:bg-sky-500/10 border border-slate-200/80 hover:border-sky-300 dark:border-white/5 dark:hover:border-sky-500/30 transition-all"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse truncate">
                    <div className="p-2 rounded-xl bg-sky-100/80 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform shrink-0">
                      <TelegramIcon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                        {isAr ? "تيليجرام" : "Telegram Channel / Chat"}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate block">
                        {profile.telegram.replace("https://t.me/", "@")}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors shrink-0" />
                </a>
              )}
            </div>

            {/* Response Latency Badge */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-xs font-sans text-slate-600 dark:text-slate-400 flex items-center space-x-2.5 rtl:space-x-reverse shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>{isAr ? "متوسط سرعة الرد: أقل من ساعتين" : "Typical response latency: Under 2 hours"}</span>
            </div>
          </motion.div>

          {/* Contact form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 bg-white dark:bg-[#0F121C] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm"
          >
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/30 text-sky-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
                  {isAr ? "تم استلام رسالتك بنجاح!" : "Transmission Received Successfully!"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? "شكراً لتواصلك مع عباس القاضي. تم تسجيل بيانات مشروعك واستفسارك وسيتم الرد عليك في أسرع وقت."
                    : "Thank you for reaching out. Your inquiry has been logged into the lead management queue."}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      company: "",
                      service: "AI Agent Development",
                      message: "",
                      website_hp: "",
                    });
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-sans text-sky-700 hover:text-sky-800 border border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-cyan-400 dark:border-white/10 transition-colors shadow-sm"
                >
                  {isAr ? "إرسال رسالة أخرى" : "Send Another Inquiry"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot Spam Trap */}
                <input
                  type="text"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {isAr ? "الاسم الكريم *" : "Your Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isAr ? "مثال: م. أحمد سامي" : "e.g. John Doe"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-sans text-xs focus:outline-none focus:border-sky-500 dark:focus:border-cyan-400 transition-colors shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {isAr ? "البريد الإلكتروني *" : "Official Email *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={isAr ? "name@company.com" : "name@company.com"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-sans text-xs focus:outline-none focus:border-sky-500 dark:focus:border-cyan-400 transition-colors shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {isAr ? "رقم الهاتف / الواتساب" : "Phone / WhatsApp"}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+20 100 ..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-sans text-xs focus:outline-none focus:border-sky-500 dark:focus:border-cyan-400 transition-colors shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {isAr ? "الجهة أو الشركة" : "Organization / Company"}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={isAr ? "اسم الشركة أو المشروع" : "e.g. Acme AI Corp"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-sans text-xs focus:outline-none focus:border-sky-500 dark:focus:border-cyan-400 transition-colors shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {isAr ? "نوع الخدمة أو المشروع المطلوب" : "Target Domain / Service"}
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080B12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-sans text-xs focus:outline-none focus:border-sky-500 dark:focus:border-cyan-400 transition-colors shadow-xs"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {isAr ? "تفاصيل المتطلبات أو الاستفسار *" : "Project Requirements & Narrative *"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      isAr
                        ? "اكتب نبذة عن متطلبات المشروع، الهدف المطلوب تحقيقه، والجدول الزمني التقريبي..."
                        : "Describe the scope, objectives, technical expectations, and timeline..."
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-sans text-xs focus:outline-none focus:border-sky-500 dark:focus:border-cyan-400 transition-colors shadow-xs leading-relaxed"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center space-x-2 rtl:space-x-reverse">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-sans text-xs font-bold shadow-md hover:shadow-sky-500/25 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submitting
                      ? isAr
                        ? "جاري إرسال الرسالة..."
                        : "Transmitting Inquiry..."
                      : isAr
                      ? "إرسال الرسالة وتأكيد الطلب"
                      : "Transmit Message & Inquire"}
                  </span>
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
