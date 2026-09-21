"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { NovaKnowledgeItem, NovaSettings } from "@/types";
import {
  Bot,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  Volume2,
  Sliders,
  Shield,
  HelpCircle,
} from "lucide-react";

export default function AdminNovaPage() {
  const [knowledge, setKnowledge] = useState<NovaKnowledgeItem[]>([]);
  const [settings, setSettings] = useState<NovaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"knowledge" | "persona" | "actions">("knowledge");
  const [editingItem, setEditingItem] = useState<NovaKnowledgeItem | null>(null);
  const [isNewKnowledge, setIsNewKnowledge] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const fetchData = async () => {
    try {
      const [kRes, sRes] = await Promise.all([
        fetch("/api/nova/knowledge"),
        fetch("/api/nova/settings"),
      ]);
      const [kData, sData] = await Promise.all([kRes.json(), sRes.json()]);
      setKnowledge(kData);
      setSettings(sData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleEnable = async (item: NovaKnowledgeItem) => {
    const updated = { ...item, enabled: !item.enabled };
    setKnowledge((prev) => prev.map((k) => (k.id === item.id ? updated : k)));
    await fetch("/api/nova/knowledge", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  };

  const handleDeleteKnowledge = async (id: string) => {
    if (!confirm("Delete this knowledge entry?")) return;
    setKnowledge((prev) => prev.filter((k) => k.id !== id));
    await fetch(`/api/nova/knowledge?id=${id}`, { method: "DELETE" });
  };

  const handleSaveKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isNewKnowledge) {
      await fetch("/api/nova/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
    } else {
      await fetch("/api/nova/knowledge", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
    }

    setEditingItem(null);
    fetchData();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaveStatus("Saving NOVA parameters...");
      await fetch("/api/nova/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaveStatus("NOVA configuration successfully updated!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      alert("Failed to update settings");
    }
  };

  const toggleAction = (actionName: string) => {
    if (!settings) return;
    const exists = settings.allowedActions.includes(actionName);
    const updatedActions = exists
      ? settings.allowedActions.filter((a) => a !== actionName)
      : [...settings.allowedActions, actionName];

    setSettings({ ...settings, allowedActions: updatedActions });
  };

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="NOVA AI CORE // INTELLIGENCE & KNOWLEDGE BASE"
        subtitle="Manage verified facts, system prompt grounding, persona voice settings, and allowed actions"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-5xl">
        {saveStatus && (
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === "knowledge"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                : "bg-white/[0.04] text-gray-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Knowledge Base & FAQs ({knowledge.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("persona")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === "persona"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                : "bg-white/[0.04] text-gray-400 hover:text-white"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Persona & Voice Configuration</span>
          </button>

          <button
            onClick={() => setActiveTab("actions")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === "actions"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                : "bg-white/[0.04] text-gray-400 hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Structured Allowed Actions</span>
          </button>
        </div>

        {/* TAB 1: KNOWLEDGE BASE */}
        {activeTab === "knowledge" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setIsNewKnowledge(true);
                  setEditingItem({
                    id: "",
                    question: "",
                    questionAr: "",
                    answer: "",
                    answerAr: "",
                    category: "Bio",
                    enabled: true,
                  });
                }}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Knowledge Entry / FAQ</span>
              </button>
              <span className="text-gray-400">Strict Ground Truth Source</span>
            </div>

            <div className="space-y-3">
              {knowledge.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-4 group shadow-lg"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 uppercase font-semibold">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          item.enabled
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-gray-800 text-gray-500"
                        }`}
                      >
                        {item.enabled ? "ACTIVE FACT" : "DISABLED"}
                      </span>
                    </div>

                    <h4 className="text-white font-bold text-sm">Q: {item.question}</h4>
                    {item.questionAr && (
                      <p className="text-gray-400 text-xs font-sans" dir="rtl">
                        س: {item.questionAr}
                      </p>
                    )}

                    <p className="text-gray-300 text-xs font-sans leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                      A: {item.answer}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleEnable(item)}
                      className={`p-1.5 rounded-lg ${
                        item.enabled ? "text-emerald-400" : "text-gray-600"
                      }`}
                      title={item.enabled ? "Disable fact" : "Enable fact"}
                    >
                      {item.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => {
                        setIsNewKnowledge(false);
                        setEditingItem(item);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteKnowledge(item.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PERSONA & VOICE SETTINGS */}
        {activeTab === "persona" && settings && (
          <form onSubmit={handleSaveSettings} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white uppercase tracking-wider">
                  Persona & Voice Core Settings
                </h3>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  className="w-4 h-4 text-cyan-500 rounded"
                />
                <span className="text-white font-bold">NOVA Enabled Globally</span>
              </label>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 uppercase">Welcome Greeting (English)</label>
              <textarea
                rows={2}
                value={settings.welcomeMessageEn}
                onChange={(e) => setSettings({ ...settings, welcomeMessageEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 uppercase">Welcome Greeting (Arabic)</label>
              <textarea
                rows={2}
                value={settings.welcomeMessageAr}
                onChange={(e) => setSettings({ ...settings, welcomeMessageAr: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 uppercase">Strict System Prompt & Instructions</label>
              <textarea
                rows={5}
                value={settings.systemInstructions}
                onChange={(e) => setSettings({ ...settings, systemInstructions: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 uppercase">Speaking Tone</label>
                <select
                  value={settings.speakingTone}
                  onChange={(e) => setSettings({ ...settings, speakingTone: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="innovative">Innovative & Futuristic</option>
                  <option value="professional">Executive Professional</option>
                  <option value="friendly">Warm & Approachable</option>
                  <option value="concise">Direct & Concise</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 uppercase">Voice Gender Model</label>
                <select
                  value={settings.voiceGender}
                  onChange={(e) => setSettings({ ...settings, voiceGender: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="female">Female (Siri/Gemini Aura)</option>
                  <option value="male">Male (Deep Neural)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save NOVA Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: ALLOWED ACTIONS */}
        {activeTab === "actions" && settings && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
            <div>
              <h3 className="font-bold text-white uppercase tracking-wider">
                Safe Structured Navigation Actions
              </h3>
              <p className="text-gray-400 text-xs font-sans mt-1">
                Toggle which programmatic site actions NOVA is authorized to dispatch upon visitor voice requests.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { key: "NAVIGATE_SECTION", desc: "Automatically scroll to site sections (projects, skills, contact, etc.)" },
                { key: "OPEN_PROJECT", desc: "Open dedicated project case study pages by slug on voice command" },
                { key: "FILTER_PROJECTS", desc: "Filter the project portfolio gallery by category" },
                { key: "OPEN_CV", desc: "Direct the user to preview or download Abbas's CV" },
                { key: "CONTACT_ABBAS", desc: "Focus and navigate directly to the contact lead capture form" },
              ].map((act) => {
                const isAllowed = settings.allowedActions.includes(act.key);
                return (
                  <div
                    key={act.key}
                    onClick={() => toggleAction(act.key)}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-white font-bold">{act.key}</div>
                      <div className="text-gray-400 text-[11px] font-sans">{act.desc}</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        isAllowed ? "bg-cyan-500 text-black" : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {isAllowed ? "ALLOWED" : "BLOCKED"}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              Save Action Permissions
            </button>
          </div>
        )}

        {/* Knowledge Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white uppercase">
                  {isNewKnowledge ? "Add Knowledge Chunk" : "Edit Knowledge Chunk"}
                </h3>
                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveKnowledge} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Bio">Bio & Identity</option>
                    <option value="Skills">Skills & Technologies</option>
                    <option value="Projects">Projects & Case Studies</option>
                    <option value="Work & Hire">Hiring & Collaboration</option>
                    <option value="Education">Education & Academia</option>
                    <option value="General">General FAQ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Question / Prompt (EN) *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.question}
                    onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Question / Prompt (Arabic)</label>
                  <input
                    type="text"
                    value={editingItem.questionAr || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, questionAr: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Factual Verified Answer (EN) *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingItem.answer}
                    onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Factual Verified Answer (Arabic)</label>
                  <textarea
                    rows={3}
                    value={editingItem.answerAr || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, answerAr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                    dir="rtl"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                  >
                    Save Knowledge
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
