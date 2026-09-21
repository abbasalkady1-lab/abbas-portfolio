"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Menu, X, Globe, Sparkles, Shield, Sun, Moon } from "lucide-react";

interface NavbarProps {
  lang: "en" | "ar";
  theme?: "light" | "dark";
  onToggleLang: () => void;
  onToggleTheme?: () => void;
  onOpenNova: () => void;
}

export function Navbar({
  lang,
  theme = "light",
  onToggleLang,
  onToggleTheme,
  onOpenNova,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      const sections = [
        "#home",
        "#projects",
        "#capabilities",
        "#services",
        "#simulator",
        "#about",
        "#skills",
        "#experience",
        "#contact",
      ];

      for (const section of sections) {
        const el = document.querySelector(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", labelEn: "Home", labelAr: "الرئيسية" },
    { href: "#projects", labelEn: "Work", labelAr: "المشاريع" },
    { href: "#capabilities", labelEn: "Capabilities", labelAr: "القدرات" },
    { href: "#services", labelEn: "Services", labelAr: "خدماتي" },
    { href: "#simulator", labelEn: "Workflow", labelAr: "المحاكي" },
    { href: "#about", labelEn: "About", labelAr: "عن عباس" },
    { href: "#skills", labelEn: "Skills", labelAr: "المهارات" },
    { href: "#experience", labelEn: "Timeline", labelAr: "المسيرة" },
    { href: "#contact", labelEn: "Contact", labelAr: "تواصل" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-[#07111F]/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 py-3 shadow-md dark:shadow-black/50"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center space-x-3 rtl:space-x-reverse">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 group-hover:border-[#0066FF] dark:group-hover:border-[#00C2FF] shadow-sm transition-all duration-300">
            <span className="font-mono text-xs font-bold text-[#0066FF] dark:text-[#00C2FF]">
              AK
            </span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00C2FF] animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide text-slate-900 dark:text-white group-hover:text-[#0066FF] dark:group-hover:text-[#00C2FF] transition-colors">
              {lang === "ar" ? "عباس القاضي" : "Abbas El Kady"}
            </div>
            <div className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400">
              {lang === "ar" ? "ذكاء اصطناعي وأتمتة" : "AI & Automation Engineer"}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation with Animated Active Pill */}
        <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse font-sans text-[13px] font-medium text-slate-600 dark:text-slate-300 p-1 rounded-full bg-white/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-[#0066FF] dark:text-white font-bold"
                    : "hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.06]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-full bg-[#0066FF]/10 dark:bg-[#00C2FF]/15 border border-[#0066FF]/20 dark:border-[#00C2FF]/30 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{lang === "ar" ? link.labelAr : link.labelEn}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Controls Cluster */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse">
          {/* Theme Switcher */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1.5 rounded-xl bg-white dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all"
            title="Toggle Language (العربية / English)"
          >
            <Globe className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#00C2FF]" />
            <span className="uppercase font-bold">{lang === "en" ? "AR" : "EN"}</span>
          </button>

          {/* NOVA Assistant Trigger */}
          <button
            onClick={onOpenNova}
            className="p-2 rounded-xl bg-white dark:bg-white/[0.04] hover:bg-[#0066FF]/10 dark:hover:bg-[#00C2FF]/10 border border-slate-200 dark:border-white/10 text-[#0066FF] dark:text-[#00C2FF] shadow-sm transition-all group"
            title={lang === "ar" ? "المساعد الذكي NOVA" : "NOVA AI Assistant"}
            aria-label="Open NOVA AI Assistant"
          >
            <Bot className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          {/* Admin Login Link */}
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-white dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 shadow-sm transition-all"
            title="Admin Dashboard"
          >
            <Shield className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#07111F]/95 backdrop-blur-2xl px-6 py-5 space-y-2 font-sans text-sm shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-slate-700 dark:text-slate-200 hover:text-[#0066FF] dark:hover:text-[#00C2FF] border-b border-slate-100 dark:border-white/5 transition-colors font-medium"
              >
                {lang === "ar" ? link.labelAr : link.labelEn}
              </a>
            ))}
            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenNova();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#6D5DFB] text-white font-bold text-center flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-md"
              >
                <Bot className="w-4 h-4" />
                <span>{lang === "ar" ? "بدء التحدث مع NOVA" : "Launch NOVA AI"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
