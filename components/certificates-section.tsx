"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  Calendar,
  ShieldCheck,
  Eye,
  Copy,
  Check,
  Tag,
} from "lucide-react";
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
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };
    if (selectedCert) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert]);

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <section id="certificates" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "الاعتمادات والمؤهلات المعتمدة" : "ACCREDITATIONS // CERTIFICATES"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            {isAr ? "الشهادات والاعتمادات الدولية" : "Verified Credentials & Honors"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {isAr
              ? "شهادات متقدمة في الذكاء الاصطناعي التوليدي، الحوسبة السحابية، وأتمتة العمليات. انقر على أي شهادة للاطلاع على تفاصيلها الكاملة ورابط التحقق."
              : "Recognized certifications in generative AI, cloud platforms, and workflow automation. Click any credential to inspect details and official verification."}
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCerts.map((cert) => {
            const displayTitle = isAr && cert.titleAr ? cert.titleAr : cert.title;
            const displayIssuer = isAr && cert.issuerAr ? cert.issuerAr : cert.issuer;
            const displayDesc = isAr && cert.descriptionAr ? cert.descriptionAr : cert.description;

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedCert(cert)}
                className="bg-white dark:bg-[#0F121C] rounded-2xl border border-slate-200/90 dark:border-white/10 hover:border-[#0A84FF]/50 dark:hover:border-[#00C2FF]/50 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:shadow-[#0066FF]/10 cursor-pointer overflow-hidden"
              >
                <div>
                  {/* Certificate Image Thumbnail (if available) */}
                  {cert.imageUrl ? (
                    <div className="relative w-full h-44 bg-slate-100 dark:bg-black/40 overflow-hidden border-b border-slate-100 dark:border-white/5">
                      <img
                        src={cert.imageUrl}
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                      
                      {/* Floating View Details Badge */}
                      <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] flex items-center space-x-1.5 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3 h-3 text-[#00C2FF]" />
                        <span>{isAr ? "عرض التفاصيل" : "View Details"}</span>
                      </div>

                      <span className="absolute bottom-2.5 left-3 rtl:left-auto rtl:right-3 text-[11px] px-2 py-0.5 rounded-md bg-black/70 border border-white/20 text-emerald-400 font-mono font-semibold">
                        {cert.date}
                      </span>
                    </div>
                  ) : null}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
                        <Award className="w-5 h-5" />
                      </div>
                      {!cert.imageUrl && (
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {cert.date}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans group-hover:text-[#0066FF] dark:group-hover:text-[#00C2FF] transition-colors leading-snug">
                      {displayTitle}
                    </h3>

                    <p className="text-xs font-sans text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center space-x-1.5 rtl:space-x-reverse font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{displayIssuer}</span>
                    </p>

                    {displayDesc && (
                      <p className="text-xs font-sans text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                        {displayDesc}
                      </p>
                    )}

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3.5 pt-1">
                        {cert.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-sans font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center font-mono">
                            +{cert.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {cert.credentialId && (
                      <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-3">
                        ID: <span className="text-slate-600 dark:text-slate-300">{cert.credentialId}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 pb-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 group-hover:text-[#0066FF] dark:group-hover:text-[#00C2FF] flex items-center space-x-1 rtl:space-x-reverse transition-colors">
                    <span>{isAr ? "تفاصيل الشهادة" : "Inspect Credential"}</span>
                    <span className="text-xs">→</span>
                  </span>

                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center space-x-1 rtl:space-x-reverse text-xs text-sky-600 hover:text-sky-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-sans font-semibold p-1 hover:underline"
                      title={isAr ? "تحقق مباشر" : "Direct Verification"}
                    >
                      <span>{isAr ? "الرابط الرسمي" : "Verify"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Certificate Details Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0C111C] rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden z-10 my-8 text-left rtl:text-right"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Image Banner */}
              {selectedCert.imageUrl ? (
                <div className="relative w-full h-64 sm:h-80 bg-slate-950 overflow-hidden border-b border-slate-200 dark:border-white/10 group">
                  <img
                    src={selectedCert.imageUrl}
                    alt={selectedCert.title}
                    className="w-full h-full object-cover sm:object-contain bg-slate-950/80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {selectedCert.verificationUrl && (
                    <a
                      href={selectedCert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-bold text-xs flex items-center space-x-1.5 rtl:space-x-reverse shadow-lg transition-transform hover:scale-105"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isAr ? "اعتماد رسمي موثق" : "Officially Verified"}</span>
                    </a>
                  )}
                </div>
              ) : null}

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-sans text-xs font-semibold flex items-center space-x-1.5 rtl:space-x-reverse">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {isAr && selectedCert.issuerAr ? selectedCert.issuerAr : selectedCert.issuer}
                      </span>
                    </span>

                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-mono text-xs flex items-center space-x-1 rtl:space-x-reverse">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedCert.date}</span>
                    </span>

                    {selectedCert.credentialId && (
                      <button
                        onClick={(e) => handleCopyId(selectedCert.credentialId!, e)}
                        className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-mono text-xs flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer"
                        title="Click to copy Credential ID"
                      >
                        {copiedId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>ID: {selectedCert.credentialId}</span>
                      </button>
                    )}
                  </div>

                  {/* Bilingual Title */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans leading-tight">
                    {isAr && selectedCert.titleAr ? selectedCert.titleAr : selectedCert.title}
                  </h3>
                  {isAr && selectedCert.titleAr && selectedCert.title && (
                    <p className="text-xs sm:text-sm font-sans text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      {selectedCert.title}
                    </p>
                  )}
                </div>

                {/* Certificate Description & Knowledge details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-[#0066FF] dark:text-[#00C2FF] uppercase">
                    {isAr ? "تفاصيل الاعتماد ومحاور التدريب" : "CREDENTIAL DETAILS & DOMAIN KNOWLEDGE"}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                    {isAr && selectedCert.descriptionAr
                      ? selectedCert.descriptionAr
                      : selectedCert.description ||
                        (isAr
                          ? "تم اجتياز هذا الاعتماد بنجاح وتوثيق كافة متطلباته التقنية."
                          : "Successfully acquired and verified all technical requirements.")}
                  </p>
                </div>

                {/* Acquired Skills / Badges */}
                {selectedCert.skills && selectedCert.skills.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase flex items-center space-x-1.5 rtl:space-x-reverse">
                      <Tag className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isAr ? "المهارات والمحاور المكتسبة" : "SKILLS & TOPICS VERIFIED"}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-sans text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Action: Verification Link Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-sans text-xs font-semibold transition-colors"
                  >
                    {isAr ? "إغلاق النافذة" : "Close Window"}
                  </button>

                  {selectedCert.verificationUrl ? (
                    <a
                      href={selectedCert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0A84FF] hover:from-[#0A84FF] hover:to-[#00C2FF] text-white font-sans text-sm font-bold shadow-lg shadow-[#0066FF]/25 hover:shadow-[#0066FF]/35 transition-all"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isAr ? "التحقق من الشهادة عبر الرابط الرسمي" : "Verify on Official Credential Page"}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">
                      {isAr ? "شهادة داخلية موثقة" : "Internally Verified Credential"}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
