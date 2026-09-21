"use client";

import React, { useState, useEffect } from "react";
import { SiteDatabase } from "@/types";
import { IntroLoader } from "@/components/intro-loader";
import { CyberBackground } from "@/components/cyber-background";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProjectsGallery } from "@/components/projects-gallery";
import { CapabilitiesSection } from "@/components/capabilities-section";
import { WorkflowSimulator } from "@/components/workflow-simulator";
import { About } from "@/components/about";
import { SkillsMatrix } from "@/components/skills-matrix";
import { TimelineSection } from "@/components/timeline-section";
import { CertificatesSection } from "@/components/certificates-section";
import { ServicesSection } from "@/components/services-section";
import { CVSection } from "@/components/cv-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { NovaLauncher } from "@/components/nova/nova-launcher";
import { NovaModal } from "@/components/nova/nova-modal";

interface PortfolioViewProps {
  initialData: SiteDatabase;
}

export function PortfolioView({ initialData }: PortfolioViewProps) {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isNovaOpen, setIsNovaOpen] = useState<boolean>(false);

  useEffect(() => {
    // Sync theme on client mount
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      } else {
        setTheme("light");
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      if (next === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } catch (e) {}
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <div
      className={`min-h-screen bg-[#F8FAFC] dark:bg-[#090A0F] text-slate-900 dark:text-white relative overflow-x-hidden transition-colors duration-200 ${
        lang === "ar" ? "dir-rtl" : ""
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Short introductory sequence */}
      <IntroLoader />

      {/* Very subtle background texture */}
      <CyberBackground theme={theme} />

      {/* Floating Header */}
      <Navbar
        lang={lang}
        theme={theme}
        onToggleLang={toggleLanguage}
        onToggleTheme={toggleTheme}
        onOpenNova={() => setIsNovaOpen(true)}
      />

      {/* Main Sections */}
      <main className="relative z-10">
        {/* 1. Asymmetric Hero with Live Neural Matrix and Verification Badges */}
        <Hero
          profile={initialData.profile}
          lang={lang}
          onOpenNova={() => setIsNovaOpen(true)}
        />

        {/* 2. Flagship Proof: Projects Gallery with Runnova Deep Case Study */}
        <ProjectsGallery projects={initialData.projects} lang={lang} />

        {/* 3. Deep Technical Capabilities: 4 Engineering Pillars */}
        <CapabilitiesSection lang={lang} />

        {/* 4. Specialized Engineering Services (خدماتي) with Direct WhatsApp/Email */}
        <ServicesSection
          services={initialData.services}
          profile={initialData.profile}
          lang={lang}
        />

        {/* 5. Live Workflow & Pipeline Architecture Simulator */}
        <WorkflowSimulator lang={lang} />

        {/* 6. About Abbas El Kady & Engineering Philosophy */}
        <About profile={initialData.profile} lang={lang} />

        {/* 7. Technical Stack & Production Skills Matrix */}
        <SkillsMatrix skills={initialData.skills} lang={lang} />

        {/* 8. Career & Academic Journey */}
        <TimelineSection timeline={initialData.timeline} lang={lang} />

        {/* 9. Industry & AI Certifications */}
        <CertificatesSection
          certificates={initialData.certificates}
          lang={lang}
        />

        {/* 10. Verified Resume / CV Overview */}
        <CVSection cv={initialData.cv} lang={lang} />

        {/* 11. High-Value Contact & Consultation Direct Pipeline */}
        <ContactSection profile={initialData.profile} lang={lang} />
      </main>

      {/* Footer */}
      <Footer profile={initialData.profile} lang={lang} />

      {/* Persistent Floating NOVA Launcher */}
      <NovaLauncher onOpen={() => setIsNovaOpen(true)} lang={lang} theme={theme} />

      {/* Intelligent Floating Voice NOVA Assistant */}
      <NovaModal
        isOpen={isNovaOpen}
        onClose={() => setIsNovaOpen(false)}
        lang={lang}
        theme={theme}
      />
    </div>
  );
}
