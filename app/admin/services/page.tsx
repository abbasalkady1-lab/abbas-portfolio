"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Service, ProfileData, SEOSettings } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  X,
  Save,
  CheckCircle2,
  MessageCircle,
  Mail,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Bot,
  Workflow,
  Database,
  Code2,
  Zap,
  Network,
  ShieldCheck,
  Cpu,
  Layers,
  ExternalLink,
  Settings,
  Phone,
} from "lucide-react";

const ICON_OPTIONS = [
  { value: "Bot", label: "Bot (AI Agents)", icon: Bot },
  { value: "Workflow", label: "Workflow (n8n & Automation)", icon: Workflow },
  { value: "Database", label: "Database (RAG & Knowledge)", icon: Database },
  { value: "Code2", label: "Code2 (Web Platforms)", icon: Code2 },
  { value: "Zap", label: "Zap (Real-time & APIs)", icon: Zap },
  { value: "Network", label: "Network (Distributed Systems)", icon: Network },
  { value: "ShieldCheck", label: "ShieldCheck (AI Security)", icon: ShieldCheck },
  { value: "Cpu", label: "Cpu (ML & Hardware)", icon: Cpu },
  { value: "Sparkles", label: "Sparkles (Consulting)", icon: Sparkles },
  { value: "Layers", label: "Layers (Full-Stack Architecture)", icon: Layers },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [seo, setSeo] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "ar" | "contact" | "commercial">("en");
  const [contactFeedback, setContactFeedback] = useState<string>("");
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [tempWhatsapp, setTempWhatsapp] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  const fetchData = async () => {
    try {
      const [servicesRes, settingsRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/settings"),
      ]);
      const servicesData = await servicesRes.json();
      const settingsData = await settingsRes.json();

      setServices(servicesData);
      if (settingsData.profile) {
        setProfile(settingsData.profile);
        setTempWhatsapp(settingsData.profile.whatsapp || "");
        setTempEmail(settingsData.profile.email || "");
      }
      if (settingsData.seo) {
        setSeo(settingsData.seo);
      }
    } catch (e) {
      console.error("Failed to load services data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service offering?")) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/services?id=${id}`, { method: "DELETE" });
  };

  const handleToggleVisibility = async (service: Service) => {
    const updated = { ...service, visible: service.visible === false ? true : false };
    setServices((prev) => prev.map((s) => (s.id === service.id ? updated : s)));
    await fetch("/api/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === services.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...services];
    const current = reordered[index];
    const target = reordered[targetIndex];

    const currentOrder = current.order;
    current.order = target.order;
    target.order = currentOrder;

    reordered[index] = target;
    reordered[targetIndex] = current;

    setServices(reordered);

    // Save both updated items
    await Promise.all([
      fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      }),
      fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      }),
    ]);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (isNew) {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });
      const created = await res.json();
      setServices((prev) => [...prev, created]);
    } else {
      await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? editingService : s))
      );
    }

    setEditingService(null);
  };

  const handleSaveContactChannels = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !seo) return;

    try {
      const updatedProfile = {
        ...profile,
        whatsapp: tempWhatsapp,
        email: tempEmail,
      };

      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: updatedProfile, seo }),
      });

      setProfile(updatedProfile);
      setIsEditingContact(false);
      setContactFeedback("Contact channels updated successfully!");
      setTimeout(() => setContactFeedback(""), 3500);
    } catch (err) {
      alert("Failed to save contact channels");
    }
  };

  const cleanPhone = (profile?.whatsapp || "+201000000000").replace(/[^0-9]/g, "");

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="SERVICES & SOLUTIONS // CLIENT OFFERINGS"
        subtitle="Manage client-facing services, feature bullets, custom CTAs, WhatsApp/Email channels, and order"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Contact Channels Configuration Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-[#0D111A] to-cyan-950/30 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white uppercase text-sm flex items-center space-x-2">
                <span>Direct Contact Channels (WhatsApp & Email)</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                  Global Configuration
                </span>
              </div>
              <p className="text-gray-400 text-xs font-sans mt-0.5">
                These credentials power all instant WhatsApp buttons and Email inquiry links across all services.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="font-mono">{profile?.whatsapp || "Not Set"}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-sky-400">
                <Mail className="w-3.5 h-3.5" />
                <span className="font-mono">{profile?.email || "Not Set"}</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingContact(!isEditingContact)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white font-bold transition-all flex items-center space-x-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEditingContact ? "Close" : "Edit Channels"}</span>
            </button>
          </div>
        </div>

        {/* Inline Edit for Contact Channels */}
        {isEditingContact && (
          <form
            onSubmit={handleSaveContactChannels}
            className="p-5 rounded-2xl bg-[#080B12] border border-cyan-500/40 space-y-4 animate-in fade-in"
          >
            <div className="font-bold text-cyan-300 text-xs uppercase flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Update Global WhatsApp & Email for Service Inquiries</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 uppercase">WhatsApp Number (e.g. +201000000000)</label>
                <input
                  type="text"
                  required
                  value={tempWhatsapp}
                  onChange={(e) => setTempWhatsapp(e.target.value)}
                  placeholder="+201000000000"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 uppercase">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="contact@abbaselkady.dev"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingContact(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Channels</span>
              </button>
            </div>
          </form>
        )}

        {contactFeedback && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{contactFeedback}</span>
          </div>
        )}

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setIsNew(true);
              setEditingService({
                id: "",
                title: "",
                titleAr: "",
                description: "",
                descriptionAr: "",
                iconName: "Bot",
                features: ["Autonomous Task Execution", "Custom Tool Calling", "Zero Hallucination Grounding"],
                featuresAr: ["تنفيذ المهام ذاتياً", "استدعاء الأدوات المخصصة", "منع الهلوسة بالتوثيق"],
                ctaText: "Build an Agent",
                ctaTextAr: "بناء وكيل ذكي",
                contactMethod: "both",
                priceEstimate: "Custom Engineering",
                priceEstimateAr: "تسعير مخصص",
                deliveryTime: "2-3 Weeks",
                deliveryTimeAr: "٢-٣ أسابيع",
                visible: true,
                order: services.length + 1,
              });
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service Offering</span>
          </button>

          <div className="flex items-center space-x-3 text-gray-400">
            <span>Total Services: {services.length}</span>
            <span className="text-gray-600">&bull;</span>
            <span className="text-emerald-400">
              Active: {services.filter((s) => s.visible !== false).length}
            </span>
          </div>
        </div>

        {/* Services List Grid */}
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading services...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((srv, index) => {
              const matchedIcon = ICON_OPTIONS.find((i) => i.value === srv.iconName);
              const IconComp = matchedIcon?.icon || Bot;

              return (
                <div
                  key={srv.id}
                  className={`glass-panel p-6 rounded-2xl border transition-all flex flex-col justify-between group shadow-lg ${
                    srv.visible === false
                      ? "border-white/5 opacity-60 bg-black/40"
                      : "border-white/10 hover:border-cyan-500/30"
                  }`}
                >
                  <div>
                    {/* Top Status Bar */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-300 font-bold uppercase">
                          #{srv.order} &bull; {srv.iconName}
                        </span>

                        {/* Contact Method Badge */}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center space-x-1 ${
                            srv.contactMethod === "whatsapp"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : srv.contactMethod === "email"
                              ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                              : "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                          }`}
                        >
                          {srv.contactMethod === "whatsapp" ? (
                            <>
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </>
                          ) : srv.contactMethod === "email" ? (
                            <>
                              <Mail className="w-3 h-3" />
                              <span>Email</span>
                            </>
                          ) : (
                            <>
                              <MessageCircle className="w-3 h-3" />
                              <span>+</span>
                              <Mail className="w-3 h-3" />
                              <span>Both</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleToggleVisibility(srv)}
                          title={srv.visible === false ? "Show on site" : "Hide from site"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            srv.visible === false ? "text-gray-500 hover:text-white" : "text-emerald-400 hover:text-emerald-300"
                          }`}
                        >
                          {srv.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        <button
                          disabled={index === 0}
                          onClick={() => handleReorder(index, "up")}
                          title="Move Up"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        <button
                          disabled={index === services.length - 1}
                          onClick={() => handleReorder(index, "down")}
                          title="Move Down"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setIsNew(false);
                            setEditingService(srv);
                            setActiveTab("en");
                          }}
                          title="Edit Service"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(srv.id)}
                          title="Delete Service"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {srv.title}
                      </h3>
                      {srv.titleAr && (
                        <div className="text-sm font-semibold text-gray-300" dir="rtl">
                          {srv.titleAr}
                        </div>
                      )}
                    </div>

                    {/* Descriptions */}
                    <p className="text-gray-400 text-xs font-sans mt-2 leading-relaxed">
                      {srv.description}
                    </p>
                    {srv.descriptionAr && (
                      <p className="text-gray-400 text-xs font-sans mt-1 leading-relaxed" dir="rtl">
                        {srv.descriptionAr}
                      </p>
                    )}

                    {/* Features List Preview */}
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">
                        Features / Deliverables ({srv.features?.length || 0}):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {srv.features?.slice(0, 4).map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-300 border border-white/5"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-gray-400 text-[11px]">
                    <div className="flex items-center space-x-2">
                      {srv.deliveryTime && (
                        <span className="text-gray-400">&bull; {srv.deliveryTime}</span>
                      )}
                      {srv.priceEstimate && (
                        <span className="text-emerald-400 font-semibold">&bull; {srv.priceEstimate}</span>
                      )}
                    </div>

                    {/* Direct Test Links */}
                    <div className="flex items-center space-x-2">
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          srv.whatsappMessage || `Inquiry about: ${srv.title}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                        title="Test WhatsApp Link"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Test WA</span>
                      </a>
                      <span className="text-gray-600">|</span>
                      <a
                        href={`mailto:${profile?.email || "contact@abbaselkady.dev"}?subject=${encodeURIComponent(
                          srv.emailSubject || `Inquiry: ${srv.title}`
                        )}`}
                        className="text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                        title="Test Email Link"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Test Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Add or Edit Service */}
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-2xl glass-panel p-6 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-bold text-white uppercase text-sm">
                    {isNew ? "Create Service Offering" : `Edit Service: ${editingService.title || "Untitled"}`}
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    Configure bilingual information, deliverables, pricing scope, and contact channels
                  </span>
                </div>
                <button
                  onClick={() => setEditingService(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Navigation Tabs */}
              <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "en"
                      ? "bg-cyan-500 text-black shadow-sm"
                      : "bg-white/[0.04] text-gray-400 hover:text-white"
                  }`}
                >
                  1. English Details
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ar")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "ar"
                      ? "bg-cyan-500 text-black shadow-sm"
                      : "bg-white/[0.04] text-gray-400 hover:text-white"
                  }`}
                >
                  2. التفاصيل بالعربية
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("contact")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "contact"
                      ? "bg-cyan-500 text-black shadow-sm"
                      : "bg-white/[0.04] text-gray-400 hover:text-white"
                  }`}
                >
                  3. Contact & Channels
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("commercial")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "commercial"
                      ? "bg-cyan-500 text-black shadow-sm"
                      : "bg-white/[0.04] text-gray-400 hover:text-white"
                  }`}
                >
                  4. Scope & Specs
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 font-mono text-xs">
                {/* TAB 1: ENGLISH DETAILS */}
                {activeTab === "en" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">Service Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={editingService.title}
                        onChange={(e) =>
                          setEditingService({ ...editingService, title: e.target.value })
                        }
                        placeholder="e.g. Autonomous AI Agents Development"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">Description (English) *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingService.description}
                        onChange={(e) =>
                          setEditingService({ ...editingService, description: e.target.value })
                        }
                        placeholder="Detailed technical description of this service..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">
                        Key Features / Deliverables (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editingService.features?.join(", ") || ""}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Autonomous Task Execution, Custom Tool Calling, Zero Hallucination"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">Custom CTA Button Text (EN)</label>
                      <input
                        type="text"
                        value={editingService.ctaText || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, ctaText: e.target.value })
                        }
                        placeholder="e.g. Build an Agent"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: ARABIC DETAILS */}
                {activeTab === "ar" && (
                  <div className="space-y-4 animate-in fade-in" dir="rtl">
                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">عنوان الخدمة (باللغة العربية)</label>
                      <input
                        type="text"
                        value={editingService.titleAr || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, titleAr: e.target.value })
                        }
                        placeholder="مثال: تطوير وكلاء الذكاء الاصطناعي الذاتية"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">وصف الخدمة (باللغة العربية)</label>
                      <textarea
                        rows={3}
                        value={editingService.descriptionAr || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, descriptionAr: e.target.value })
                        }
                        placeholder="شرح تفصيلي لما تقدمه هذه الخدمة للعميل والمؤسسة..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">
                        المخرجات والميزات (مفصولة بفواصل)
                      </label>
                      <input
                        type="text"
                        value={editingService.featuresAr?.join(", ") || ""}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            featuresAr: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="تنفيذ المهام ذاتياً، ربط واستدعاء الأدوات، منع الهلوسة بالتوثيق"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">نص زر الإجراء (بالعربية)</label>
                      <input
                        type="text"
                        value={editingService.ctaTextAr || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, ctaTextAr: e.target.value })
                        }
                        placeholder="مثال: بناء وكيل ذكي"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: CONTACT & CHANNELS */}
                {activeTab === "contact" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">Preferred Contact Channel *</label>
                      <select
                        value={editingService.contactMethod || "both"}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            contactMethod: e.target.value as "whatsapp" | "email" | "both",
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="both">Both Channels (واتساب وبريد إلكتروني معاً - Recommended)</option>
                        <option value="whatsapp">WhatsApp Only (واتساب فقط - Fast Instant Booking)</option>
                        <option value="email">Email Only (بريد إلكتروني فقط - Formal Inquiry)</option>
                      </select>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Determines which action buttons are shown on this service card on the public portfolio.
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">
                        Custom WhatsApp Pre-filled Message (English)
                      </label>
                      <input
                        type="text"
                        value={editingService.whatsappMessage || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, whatsappMessage: e.target.value })
                        }
                        placeholder={`Hello Abbas, I would like to inquire about: ${editingService.title || "this service"}`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">
                        رسالة الواتساب التلقائية (بالعربية)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={editingService.whatsappMessageAr || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, whatsappMessageAr: e.target.value })
                        }
                        placeholder={`مرحباً عباس، أود الاستفسار عن خدمة: ${editingService.titleAr || "هذه الخدمة"}`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 uppercase">Custom Email Subject Line</label>
                      <input
                        type="text"
                        value={editingService.emailSubject || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, emailSubject: e.target.value })
                        }
                        placeholder={`[Service Inquiry] ${editingService.title || "New Project"}`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 4: COMMERCIAL & SPECS */}
                {activeTab === "commercial" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-1 uppercase">Icon Representation</label>
                        <select
                          value={editingService.iconName}
                          onChange={(e) =>
                            setEditingService({ ...editingService, iconName: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1 uppercase">Display Order Number</label>
                        <input
                          type="number"
                          value={editingService.order}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              order: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-1 uppercase">Delivery Timeframe (EN)</label>
                        <input
                          type="text"
                          value={editingService.deliveryTime || ""}
                          onChange={(e) =>
                            setEditingService({ ...editingService, deliveryTime: e.target.value })
                          }
                          placeholder="e.g. 2-3 Weeks"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1 uppercase">المدة الزمنية (بالعربية)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={editingService.deliveryTimeAr || ""}
                          onChange={(e) =>
                            setEditingService({ ...editingService, deliveryTimeAr: e.target.value })
                          }
                          placeholder="مثال: ٢-٣ أسابيع"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-1 uppercase">Pricing Estimate (EN)</label>
                        <input
                          type="text"
                          value={editingService.priceEstimate || ""}
                          onChange={(e) =>
                            setEditingService({ ...editingService, priceEstimate: e.target.value })
                          }
                          placeholder="e.g. Custom Engineering"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1 uppercase">تقدير السعر (بالعربية)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={editingService.priceEstimateAr || ""}
                          onChange={(e) =>
                            setEditingService({ ...editingService, priceEstimateAr: e.target.value })
                          }
                          placeholder="مثال: تسعير مخصص"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center space-x-2.5 text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingService.visible !== false}
                          onChange={(e) =>
                            setEditingService({ ...editingService, visible: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-cyan-500 bg-white/[0.05] border-white/20 focus:ring-0"
                        />
                        <span>Visible on Public Portfolio Website (إظهار الخدمة بالموقع)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Modal Footer Controls */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {["en", "ar", "contact", "commercial"].map((t, idx) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setActiveTab(t as any)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          activeTab === t ? "bg-cyan-400 scale-125" : "bg-white/20"
                        }`}
                        title={`Tab ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isNew ? "Create Service" : "Save Changes"}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
