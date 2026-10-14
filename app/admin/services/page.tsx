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
  Play,
  Image as ImageIcon,
  Coins,
  Clock,
  Flame,
  Link2,
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

const THUMBNAIL_PRESETS = [
  { label: "AI Agents", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" },
  { label: "n8n Automation", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" },
  { label: "RAG & Knowledge", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80" },
  { label: "Web Platform", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80" },
  { label: "Neural Network", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80" },
];

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=0&rel=0`;
  }
  return null;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [seo, setSeo] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "ar" | "media" | "commercial">("en");
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

  const openNewModal = () => {
    setIsNew(true);
    setActiveTab("en");
    setEditingService({
      id: "",
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      fullDescription: "",
      fullDescriptionAr: "",
      iconName: "Bot",
      thumbnail: THUMBNAIL_PRESETS[0].url,
      youtubeUrl: "",
      features: ["Autonomous Task Execution", "Custom Tool Calling", "Zero Hallucination Grounding"],
      featuresAr: ["تنفيذ المهام ذاتياً", "استدعاء الأدوات المخصصة", "منع الهلوسة بالتوثيق"],
      ctaText: "Build an Agent",
      ctaTextAr: "بناء وكيل ذكي",
      actionType: "both",
      contactMethod: "both",
      externalUrl: "",
      externalUrlLabel: "Get Service Online",
      externalUrlLabelAr: "طلب الخدمة أونلاين",
      whatsappMessage: "",
      whatsappMessageAr: "",
      emailSubject: "",
      price: "$499",
      priceAr: "٤٩٩$",
      priceEstimate: "Custom Scope",
      priceEstimateAr: "تسعير مخصص",
      deliveryTime: "2-3 Weeks",
      deliveryTimeAr: "٢-٣ أسابيع",
      badge: "Most Popular",
      badgeAr: "الأكثر طلباً",
      visible: true,
      order: services.length + 1,
    });
  };

  const openEditModal = (srv: Service) => {
    setIsNew(false);
    setActiveTab("en");
    setEditingService({
      ...srv,
      actionType: srv.actionType || srv.contactMethod || "both",
      price: srv.price || srv.priceEstimate || "",
      priceAr: srv.priceAr || srv.priceEstimateAr || "",
      thumbnail: srv.thumbnail || "",
      youtubeUrl: srv.youtubeUrl || "",
      fullDescription: srv.fullDescription || "",
      fullDescriptionAr: srv.fullDescriptionAr || "",
      externalUrl: srv.externalUrl || "",
      externalUrlLabel: srv.externalUrlLabel || "",
      externalUrlLabelAr: srv.externalUrlLabelAr || "",
      badge: srv.badge || "",
      badgeAr: srv.badgeAr || "",
    });
  };

  return (
    <div className="flex-1 flex flex-col font-sans antialiased text-slate-200">
      <AdminHeader
        title="SERVICES & SOLUTIONS // CLIENT OFFERINGS"
        subtitle="Manage bespoke services, thumbnails, YouTube explainer videos, pricing, and dynamic actions"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Contact Channels Configuration Banner */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white uppercase text-sm flex items-center space-x-2">
                <span>Direct Contact Channels (WhatsApp & Email)</span>
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Global Configuration
                </span>
              </div>
              <p className="text-slate-300 text-xs font-sans mt-0.5">
                These credentials power all instant WhatsApp buttons and Email inquiry links across all services.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-4 text-xs font-medium">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="font-mono">{profile?.whatsapp || "Not Set"}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-blue-400">
                <Mail className="w-3.5 h-3.5" />
                <span className="font-mono">{profile?.email || "Not Set"}</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingContact(!isEditingContact)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-blue-400" />
              <span>{isEditingContact ? "Close" : "Edit Channels"}</span>
            </button>
          </div>
        </div>

        {/* Inline Edit for Contact Channels */}
        {isEditingContact && (
          <form
            onSubmit={handleSaveContactChannels}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-4 shadow-xl"
          >
            <div className="font-bold text-blue-400 text-xs uppercase flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Update Global WhatsApp & Email for Service Inquiries</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-200 mb-1.5 uppercase font-semibold text-xs">WhatsApp Number (e.g. +201000000000)</label>
                <input
                  type="text"
                  required
                  value={tempWhatsapp}
                  onChange={(e) => setTempWhatsapp(e.target.value)}
                  placeholder="+201000000000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-200 mb-1.5 uppercase font-semibold text-xs">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="contact@abbaselkady.dev"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingContact(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 text-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Channels</span>
              </button>
            </div>
          </form>
        )}

        {contactFeedback && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{contactFeedback}</span>
          </div>
        )}

        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={openNewModal}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service Offering</span>
          </button>

          <div className="flex items-center space-x-3 text-slate-400 text-sm">
            <span>Total Services: <strong className="text-white">{services.length}</strong></span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-emerald-400 font-medium">
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
              const actionType = srv.actionType || srv.contactMethod || "both";

              return (
                <div
                  key={srv.id}
                  className={`bg-slate-900/90 rounded-2xl border transition-all flex flex-col justify-between group shadow-xl overflow-hidden ${
                    srv.visible === false
                      ? "border-slate-800 opacity-60 bg-slate-950/60"
                      : "border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5"
                  }`}
                >
                  {/* Thumbnail Banner Header on Card */}
                  {srv.thumbnail ? (
                    <div className="relative h-32 w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                      <img
                        src={srv.thumbnail}
                        alt={srv.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-slate-300 font-mono font-bold">
                          #{srv.order} &bull; {srv.iconName}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {srv.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/90 text-white font-bold flex items-center gap-1">
                              <Flame className="w-2.5 h-2.5" />
                              {srv.badge}
                            </span>
                          )}
                          {srv.youtubeUrl && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-600 text-white font-bold flex items-center gap-1" title="Has YouTube Video">
                              <Play className="w-2.5 h-2.5 fill-white" />
                              Video
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Cost & Action on Thumbnail */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                        {(srv.price || srv.priceEstimate) && (
                          <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 font-mono font-bold">
                            {srv.price || srv.priceEstimate}
                          </span>
                        )}

                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase font-semibold">
                          {actionType === "external" ? "External Link" : actionType === "whatsapp" ? "WhatsApp Only" : actionType === "email" ? "Email Only" : "Both Channels"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold uppercase font-mono">
                          #{srv.order} &bull; {srv.iconName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {(srv.price || srv.priceEstimate) && (
                          <span className="text-xs text-emerald-400 font-mono font-bold">
                            {srv.price || srv.priceEstimate}
                          </span>
                        )}
                        {srv.youtubeUrl && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-600 text-white font-bold flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-white" />
                            Video
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title & Subtitle */}
                      <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                        {srv.title}
                      </h4>
                      {srv.titleAr && (
                        <p className="text-xs text-slate-400 font-sans mt-0.5" dir="rtl">
                          {srv.titleAr}
                        </p>
                      )}

                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>

                      {/* External Link Indicator if present */}
                      {srv.externalUrl && (
                        <div className="mt-2.5 flex items-center gap-1 text-[11px] text-sky-400 truncate">
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{srv.externalUrl}</span>
                        </div>
                      )}

                      {/* Features Badges Preview */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {srv.features?.slice(0, 3).map((feat, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80 truncate max-w-[200px]"
                          >
                            &bull; {feat}
                          </span>
                        ))}
                        {(srv.features?.length || 0) > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{(srv.features?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Bottom Meta & Actions */}
                    <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
                      {/* Left: Reorder & Status */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleReorder(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReorder(index, "down")}
                          disabled={index === services.length - 1}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleVisibility(srv)}
                          className={`p-1.5 rounded-lg text-xs transition-colors ml-1 ${
                            srv.visible !== false
                              ? "text-emerald-400 hover:bg-emerald-500/10"
                              : "text-slate-600 hover:bg-slate-800"
                          }`}
                          title={srv.visible !== false ? "Visible on public site" : "Hidden"}
                        >
                          {srv.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Right: Edit & Delete buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-blue-600/20 text-xs transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(srv.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* Modal: Add or Edit Service (4 Clean Tabs)            */}
        {/* ══════════════════════════════════════════════════════ */}
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-2xl bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {isNew ? "Create Service Offering" : `Edit Service: ${editingService.title || "Untitled"}`}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Configure bilingual info, media, explainer video, pricing, and dynamic call-to-actions
                  </span>
                </div>
                <button
                  onClick={() => setEditingService(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "en"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  1. English Info
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ar")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "ar"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  2. التفاصيل بالعربية
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("media")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "media"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3. Media & Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("commercial")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "commercial"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span>4. Pricing & Actions</span>
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 font-sans text-xs">
                {/* ─── TAB 1: ENGLISH DETAILS ─── */}
                {activeTab === "en" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Service Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={editingService.title}
                        onChange={(e) =>
                          setEditingService({ ...editingService, title: e.target.value })
                        }
                        placeholder="e.g. Autonomous AI Agents Development"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Short Summary / Description (English) *</label>
                      <textarea
                        rows={2}
                        required
                        value={editingService.description}
                        onChange={(e) =>
                          setEditingService({ ...editingService, description: e.target.value })
                        }
                        placeholder="Concise overview displayed on the public card..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 font-sans text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 mb-1.5 uppercase font-semibold">
                        Extended Detailed Overview (EN) — Shown in Pop-up Modal
                      </label>
                      <textarea
                        rows={4}
                        value={editingService.fullDescription || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, fullDescription: e.target.value })
                        }
                        placeholder="In-depth explanation of technical architecture, implementation stages, enterprise benefits, and outcomes..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 font-sans text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 mb-1.5 uppercase font-semibold">
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
                        placeholder="Autonomous Task Execution, Custom Tool Calling, Zero Hallucination Grounding"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Badge Label (EN)</label>
                        <input
                          type="text"
                          value={editingService.badge || ""}
                          onChange={(e) =>
                            setEditingService({ ...editingService, badge: e.target.value })
                          }
                          placeholder="e.g. Most Popular"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Custom CTA Button Text (EN)</label>
                        <input
                          type="text"
                          value={editingService.ctaText || ""}
                          onChange={(e) =>
                            setEditingService({ ...editingService, ctaText: e.target.value })
                          }
                          placeholder="e.g. Build an Agent"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 2: ARABIC DETAILS ─── */}
                {activeTab === "ar" && (
                  <div className="space-y-4 animate-in fade-in" dir="rtl">
                    <div>
                      <label className="block text-slate-200 mb-1.5 uppercase font-semibold text-right">عنوان الخدمة (باللغة العربية)</label>
                      <input
                        type="text"
                        value={editingService.titleAr || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, titleAr: e.target.value })
                        }
                        placeholder="مثال: تطوير وكلاء الذكاء الاصطناعي الذاتية"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-right font-sans text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 mb-1.5 uppercase font-semibold text-right">وصف مختصر للخدمة (باللغة العربية)</label>
                      <textarea
                        rows={2}
                        value={editingService.descriptionAr || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, descriptionAr: e.target.value })
                        }
                        placeholder="شرح موجز يظهر على بطاقة الخدمة الأساسية..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 font-sans text-xs focus:border-blue-500 focus:outline-none text-right leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 mb-1.5 uppercase font-semibold text-right">
                        شرح تفصيلي موسع (بالعربية) — يظهر في نافذة التفاصيل
                      </label>
                      <textarea
                        rows={4}
                        value={editingService.fullDescriptionAr || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, fullDescriptionAr: e.target.value })
                        }
                        placeholder="شرح شامل وموسع لما تقدمه هذه الخدمة للعميل والمؤسسة، مراحل التنفيذ، وكيفية تسليم الحل..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 font-sans text-xs focus:border-blue-500 focus:outline-none text-right leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 mb-1.5 uppercase font-semibold text-right">
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-right font-sans text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-200 mb-1.5 uppercase font-semibold text-right">شارة الخدمة (بالعربية)</label>
                        <input
                          type="text"
                          value={editingService.badgeAr || ""}
                          onChange={(e) =>
                            setEditingService({ ...editingService, badgeAr: e.target.value })
                          }
                          placeholder="مثال: الأكثر طلباً"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-right font-sans text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-200 mb-1.5 uppercase font-semibold text-right">نص زر الإجراء (بالعربية)</label>
                        <input
                          type="text"
                          value={editingService.ctaTextAr || ""}
                          onChange={(e) =>
                            setEditingService({ ...editingService, ctaTextAr: e.target.value })
                          }
                          placeholder="مثال: بناء وكيل ذكي"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-right font-sans text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 3: MEDIA & VIDEO ─── */}
                {activeTab === "media" && (
                  <div className="space-y-4 animate-in fade-in">
                    {/* Thumbnail Image Section */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-200 font-bold uppercase text-xs flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-cyan-400" />
                          <span>Service Thumbnail / Cover Image (صورة الغلاف)</span>
                        </label>
                      </div>

                      <input
                        type="url"
                        value={editingService.thumbnail || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, thumbnail: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm font-mono"
                      />

                      {/* Quick Unsplash Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 font-sans mr-1">Quick Presets:</span>
                        {THUMBNAIL_PRESETS.map((preset, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setEditingService({ ...editingService, thumbnail: preset.url })
                            }
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white border border-slate-700 transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {/* Live Image Preview */}
                      {editingService.thumbnail && (
                        <div className="mt-2 relative h-36 rounded-xl overflow-hidden border border-slate-700 shadow-md">
                          <img
                            src={editingService.thumbnail}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-emerald-400 font-mono font-bold">
                            Live Preview
                          </div>
                        </div>
                      )}
                    </div>

                    {/* YouTube Explainer Video Section */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-200 font-bold uppercase text-xs flex items-center gap-1.5">
                          <Play className="w-4 h-4 text-red-500 fill-red-500" />
                          <span>YouTube Explainer Video URL (فيديو شرح الخدمة)</span>
                        </label>
                      </div>

                      <input
                        type="url"
                        value={editingService.youtubeUrl || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, youtubeUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm font-mono"
                      />

                      <p className="text-[11px] text-slate-400">
                        Supports standard YouTube links, youtu.be short links, and YouTube Shorts. When provided, clients can watch the explainer video directly inside the modal!
                      </p>

                      {/* Live YouTube Embed Preview */}
                      {editingService.youtubeUrl && getYouTubeEmbedUrl(editingService.youtubeUrl) && (
                        <div className="mt-2 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                            Embedded Video Player Preview:
                          </span>
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-700 shadow-lg">
                            <iframe
                              src={getYouTubeEmbedUrl(editingService.youtubeUrl)!}
                              title="Preview Player"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── TAB 4: PRICING & ACTIONS ─── */}
                {activeTab === "commercial" && (
                  <div className="space-y-4 animate-in fade-in">
                    {/* Cost / Pricing Inputs */}
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase">
                        <Coins className="w-4 h-4" />
                        <span>Pricing & Cost Configuration (التكلفة والتسعير)</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-200 mb-1 uppercase font-semibold text-[11px]">Cost / Price (EN)</label>
                          <input
                            type="text"
                            value={editingService.price || editingService.priceEstimate || ""}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                price: e.target.value,
                                priceEstimate: e.target.value,
                              })
                            }
                            placeholder="e.g. $499 or Starting from $300"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none text-sm font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-200 mb-1 uppercase font-semibold text-[11px] text-right">التكلفة / السعر (بالعربية)</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={editingService.priceAr || editingService.priceEstimateAr || ""}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                priceAr: e.target.value,
                                priceEstimateAr: e.target.value,
                              })
                            }
                            placeholder="مثال: ٤٩٩$ أو يبدأ من ٣٠٠$"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none text-right font-sans text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-200 mb-1 uppercase font-semibold text-[11px]">Delivery Timeframe (EN)</label>
                          <input
                            type="text"
                            value={editingService.deliveryTime || ""}
                            onChange={(e) =>
                              setEditingService({ ...editingService, deliveryTime: e.target.value })
                            }
                            placeholder="e.g. 2-3 Weeks"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-200 mb-1 uppercase font-semibold text-[11px] text-right">المدة الزمنية للتسليم (بالعربية)</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={editingService.deliveryTimeAr || ""}
                            onChange={(e) =>
                              setEditingService({ ...editingService, deliveryTimeAr: e.target.value })
                            }
                            placeholder="مثال: ٢-٣ أسابيع"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-right font-sans text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Mechanism (External Link / WhatsApp / Both) */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                        <Link2 className="w-4 h-4" />
                        <span>Action Mechanism & Direct Booking (طريقة طلب وتنفيذ الخدمة)</span>
                      </div>

                      <div>
                        <label className="block text-slate-200 mb-1.5 uppercase font-semibold">
                          Choose How Clients Book This Service *
                        </label>
                        <select
                          value={editingService.actionType || "both"}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              actionType: e.target.value as any,
                              contactMethod: e.target.value as any,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none text-sm"
                        >
                          <option value="both">Both WhatsApp & External Link / Email (موصى به - واتساب ولينك خارجي أو بريد)</option>
                          <option value="external">External Link Only (لينك خارجي فقط - صفحة شراء أو تسجيل أو منصة مستقلة)</option>
                          <option value="whatsapp">WhatsApp Only (واتساب مباشر فقط - محادثة فورية وحجز سريع)</option>
                          <option value="email">Email Only (بريد إلكتروني فقط - استفسار رسمي)</option>
                        </select>
                      </div>

                      {/* External Link Fields if selected or in both mode */}
                      {(editingService.actionType === "external" || editingService.actionType === "both") && (
                        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2.5">
                          <div>
                            <label className="block text-slate-200 mb-1 font-semibold text-xs">
                              External Service URL (رابط الحصول على الخدمة الخارجي)
                            </label>
                            <input
                              type="url"
                              value={editingService.externalUrl || ""}
                              onChange={(e) =>
                                setEditingService({ ...editingService, externalUrl: e.target.value })
                              }
                              placeholder="https://gumroad.com/... or https://client-portal.com/..."
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-300 mb-1 text-[11px]">External Button Label (EN)</label>
                              <input
                                type="text"
                                value={editingService.externalUrlLabel || ""}
                                onChange={(e) =>
                                  setEditingService({ ...editingService, externalUrlLabel: e.target.value })
                                }
                                placeholder="Get Service Now"
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-300 mb-1 text-[11px] text-right">نص الزر الخارجي (بالعربية)</label>
                              <input
                                type="text"
                                dir="rtl"
                                value={editingService.externalUrlLabelAr || ""}
                                onChange={(e) =>
                                  setEditingService({ ...editingService, externalUrlLabelAr: e.target.value })
                                }
                                placeholder="احصل على الخدمة الآن"
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs text-right"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* WhatsApp Pre-filled message */}
                      <div>
                        <label className="block text-slate-200 mb-1 text-xs">Custom WhatsApp Message (AR)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={editingService.whatsappMessageAr || ""}
                          onChange={(e) =>
                            setEditingService({ ...editingService, whatsappMessageAr: e.target.value })
                          }
                          placeholder={`مرحباً عباس، أود طلب خدمة "${editingService.titleAr || editingService.title}"`}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-right text-xs"
                        />
                      </div>
                    </div>

                    {/* Icon, Order & Visibility */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Icon Representation</label>
                        <select
                          value={editingService.iconName}
                          onChange={(e) =>
                            setEditingService({ ...editingService, iconName: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:border-blue-500 focus:outline-none text-sm"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Display Order</label>
                        <input
                          type="number"
                          value={editingService.order}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              order: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm font-mono"
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
                          className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0"
                        />
                        <span className="text-white font-medium text-xs">Visible on Public Portfolio Website (إظهار الخدمة بالموقع)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Modal Footer Controls */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    {["en", "ar", "media", "commercial"].map((t, idx) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setActiveTab(t as any)}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                          activeTab === t ? "bg-blue-500 scale-125" : "bg-slate-700"
                        }`}
                        title={`Tab ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
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
