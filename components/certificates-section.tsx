"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { Certificate } from "@/types";

interface CertificatesSectionProps {
  certificates: Certificate[];
  lang: "en" | "ar";
}

export function CertificatesSection({ certificates, lang }: CertificatesSectionProps) {
  // Empty state principle: If certificates = 0, automatically hide section
  if (!certificates || certificates.length === 0) {
    return null;
  }

  const isAr = lang === "ar";
  const sortedCerts = [...certificates].sort((a, b) => a.order - b.order);

  return (
    <section id="certificates" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "الاعتمادات والمؤهلات المعتمدة" : "ACCREDITATIONS // CERTIFICATES"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "الشهادات والاعتمادات الدولية" : "Verified Credentials & Honors"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "شهادات متقدمة في الذكاء الاصطناعي التوليدي، الحوسبة السحابية، وأتمتة العمليات."
              : "Recognized certifications in generative AI, cloud platforms, and workflow automation."}
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedCerts.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="bg-white dark:bg-[#0F121C] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 dark:bg-white/[0.04] dark:border-white/10 dark:text-emerald-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{cert.date}</span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-white font-sans group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  {isAr && cert.titleAr ? cert.titleAr : cert.title}
                </h3>

                <p className="text-xs font-sans text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{cert.issuer}</span>
                </p>

                {cert.credentialId && (
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2">
                    ID: {cert.credentialId}
                  </p>
                )}
              </div>

              {cert.verificationUrl && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-sky-600 hover:text-sky-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-sans font-medium"
                  >
                    <span>{isAr ? "التحقق من الشهادة" : "Verify Credential"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
