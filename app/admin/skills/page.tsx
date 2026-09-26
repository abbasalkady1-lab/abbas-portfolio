"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Skill } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Code2,
  Brain,
  Bot,
  Workflow,
  Network,
  Zap,
  Layers,
  Server,
  Database,
  GitBranch,
  ExternalLink,
  Link2,
  Tag,
  Clock,
  FileText,
  Award,
} from "lucide-react";

const availableIcons = [
  "Brain", "Bot", "Sparkles", "Workflow", "Network", "Zap",
  "Code2", "Layers", "Server", "Database", "GitBranch", "FileCode",
  "Flame", "Boxes", "Palette",
];

const defaultCategories = [
  "Artificial Intelligence",
  "Automation & n8n",
  "Programming & Frameworks",
  "Backend & Databases",
  "Tools & DevOps",
];

type ModalTab = "general" | "details" | "links";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalTab, setModalTab] = useState<ModalTab>("general");
  const [customCategory, setCustomCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Derive categories from existing skills + defaults
  const allCategories = Array.from(
    new Set([...defaultCategories, ...skills.map((s) => s.category)])
  ).filter(Boolean);

  const handleToggleVisible = async (skill: Skill) => {
    const updated = { ...skill, visible: !skill.visible };
    setSkills((prev) => prev.map((s) => (s.id === skill.id ? updated : s)));
    await fetch("/api/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    setSkills((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
  };

  const openNewModal = () => {
    setIsNew(true);
    setModalTab("general");
    setCustomCategory("");
    setTagsInput("");
    setEditingSkill({
      id: "",
      name: "",
      nameAr: "",
      category: "Artificial Intelligence",
      level: 90,
      iconName: "Brain",
      order: skills.length + 1,
      visible: true,
      description: "",
      descriptionAr: "",
      link: "",
      linkLabel: "",
      linkLabelAr: "",
      proofUrl: "",
      proofLabel: "",
      proofLabelAr: "",
      tags: [],
      yearsOfExperience: "",
    });
  };

  const openEditModal = (skill: Skill) => {
    setIsNew(false);
    setModalTab("general");
    setCustomCategory("");
    setTagsInput((skill.tags || []).join(", "));
    setEditingSkill({ ...skill });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    // Parse tags from comma-separated input
    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const finalSkill = {
      ...editingSkill,
      category: customCategory || editingSkill.category,
      tags: parsedTags,
    };

    if (isNew) {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalSkill),
      });
    } else {
      await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalSkill),
      });
    }

    setEditingSkill(null);
    fetchSkills();
  };

  const filteredSkills =
    selectedCategory === "All"
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-sans text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 placeholder:text-slate-500 transition-colors";
  const labelClass = "block text-slate-300 font-sans text-xs font-semibold mb-1.5 uppercase tracking-wide";
  const tabClass = (active: boolean) =>
    `px-4 py-2 rounded-xl font-sans text-xs font-semibold transition-all ${
      active
        ? "bg-blue-600 text-white shadow-md"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`;

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="SKILLS & PROFICIENCIES"
        subtitle="Manage technical competencies with full details, links, proof & tags"
      />

      <main className="p-6 sm:p-8 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={openNewModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-sans font-bold text-sm shadow-lg shadow-blue-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Skill</span>
            </button>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-sans text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Categories ({skills.length})</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c} ({skills.filter((s) => s.category === c).length})
                </option>
              ))}
            </select>
          </div>

          <div className="text-slate-400 font-sans text-sm">
            Active:{" "}
            <span className="text-blue-400 font-bold">
              {skills.filter((s) => s.visible).length}
            </span>{" "}
            / {skills.length} Total
          </div>
        </div>

        {/* Skills Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-sans">
            Loading skills matrix...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-sans font-medium">
                      {skill.iconName}
                    </span>
                    <span className="text-blue-400 font-bold font-sans text-sm">
                      {skill.level}%
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-sans group-hover:text-blue-300 transition-colors">
                    {skill.name}
                  </h3>
                  {skill.nameAr && (
                    <p className="text-xs text-slate-500 font-sans mt-0.5">
                      {skill.nameAr}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 font-sans mt-1">
                    {skill.category}
                  </p>

                  {/* Tags preview */}
                  {skill.tags && skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {skill.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-sans"
                        >
                          {tag}
                        </span>
                      ))}
                      {skill.tags.length > 3 && (
                        <span className="text-[9px] text-slate-500 font-sans">
                          +{skill.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Indicators row */}
                  <div className="flex items-center gap-2 mt-2">
                    {skill.link && (
                      <span title="Has link"><Link2 className="w-3 h-3 text-green-400" /></span>
                    )}
                    {skill.proofUrl && (
                      <span title="Has proof"><Award className="w-3 h-3 text-amber-400" /></span>
                    )}
                    {skill.description && (
                      <span title="Has description"><FileText className="w-3 h-3 text-cyan-400" /></span>
                    )}
                    {skill.yearsOfExperience && (
                      <span className="text-[9px] text-slate-400 font-sans">
                        {skill.yearsOfExperience} yrs
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleVisible(skill)}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      skill.visible
                        ? "text-emerald-400 hover:bg-emerald-500/10"
                        : "text-slate-600 hover:bg-slate-800"
                    }`}
                    title={skill.visible ? "Visible on site" : "Hidden"}
                  >
                    {skill.visible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(skill)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title="Edit Skill"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/*  EDIT / ADD MODAL — 3 TABS                */}
        {/* ═══════════════════════════════════════════ */}
        {editingSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#0D1322] p-6 rounded-3xl border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <h3 className="font-bold text-white font-sans text-lg">
                  {isNew ? "Add New Skill" : `Edit: ${editingSkill.name}`}
                </h3>
                <button
                  onClick={() => setEditingSkill(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6">
                <button onClick={() => setModalTab("general")} className={tabClass(modalTab === "general")}>
                  General
                </button>
                <button onClick={() => setModalTab("details")} className={tabClass(modalTab === "details")}>
                  Details & Tags
                </button>
                <button onClick={() => setModalTab("links")} className={tabClass(modalTab === "links")}>
                  Links & Proof
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-5">
                {/* ─── TAB: General ─── */}
                {modalTab === "general" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Skill Name (EN) *</label>
                        <input
                          type="text"
                          required
                          value={editingSkill.name}
                          onChange={(e) =>
                            setEditingSkill({ ...editingSkill, name: e.target.value })
                          }
                          className={inputClass}
                          placeholder="e.g. Python for Machine Learning"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Skill Name (AR)</label>
                        <input
                          type="text"
                          value={editingSkill.nameAr || ""}
                          onChange={(e) =>
                            setEditingSkill({ ...editingSkill, nameAr: e.target.value })
                          }
                          className={inputClass}
                          placeholder="اسم المهارة بالعربي"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Category</label>
                        <select
                          value={customCategory || editingSkill.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "__custom__") {
                              setCustomCategory("");
                            } else {
                              setCustomCategory("");
                              setEditingSkill({ ...editingSkill, category: val });
                            }
                          }}
                          className={inputClass}
                        >
                          {allCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                          <option value="__custom__">+ Custom Category</option>
                        </select>
                        {(customCategory !== "" ||
                          (!allCategories.includes(editingSkill.category) &&
                            editingSkill.category)) && (
                          <input
                            type="text"
                            value={customCategory || editingSkill.category}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className={`${inputClass} mt-2`}
                            placeholder="Type your custom category name..."
                          />
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>Icon</label>
                        <select
                          value={editingSkill.iconName}
                          onChange={(e) =>
                            setEditingSkill({ ...editingSkill, iconName: e.target.value })
                          }
                          className={inputClass}
                        >
                          {availableIcons.map((ico) => (
                            <option key={ico} value={ico}>
                              {ico}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={labelClass}>Proficiency Level</label>
                        <span className="text-blue-400 font-bold font-sans text-sm">
                          {editingSkill.level}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={editingSkill.level}
                        onChange={(e) =>
                          setEditingSkill({ ...editingSkill, level: Number(e.target.value) })
                        }
                        className="w-full accent-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Years of Experience</label>
                        <input
                          type="text"
                          value={editingSkill.yearsOfExperience || ""}
                          onChange={(e) =>
                            setEditingSkill({
                              ...editingSkill,
                              yearsOfExperience: e.target.value,
                            })
                          }
                          className={inputClass}
                          placeholder="e.g. 3+"
                        />
                      </div>
                      <div className="flex items-end pb-1">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingSkill.visible}
                            onChange={(e) =>
                              setEditingSkill({ ...editingSkill, visible: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400"
                          />
                          <span className="text-white font-sans text-sm">
                            Visible on public site
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB: Details & Tags ─── */}
                {modalTab === "details" && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Description (EN)</label>
                      <textarea
                        rows={3}
                        value={editingSkill.description || ""}
                        onChange={(e) =>
                          setEditingSkill({ ...editingSkill, description: e.target.value })
                        }
                        className={inputClass}
                        placeholder="Describe this skill, your experience level, and what you've built with it..."
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Description (AR)</label>
                      <textarea
                        rows={3}
                        value={editingSkill.descriptionAr || ""}
                        onChange={(e) =>
                          setEditingSkill({ ...editingSkill, descriptionAr: e.target.value })
                        }
                        className={inputClass}
                        placeholder="وصف المهارة بالعربي..."
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. LLM, GPT, Gemini, NLP, Deep Learning"
                      />
                      {tagsInput && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {tagsInput
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                            .map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-sans"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── TAB: Links & Proof ─── */}
                {modalTab === "links" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <h4 className="text-slate-200 font-sans font-semibold text-sm flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-blue-400" />
                        Skill Link (docs, website, resource)
                      </h4>
                      <div>
                        <label className={labelClass}>URL</label>
                        <input
                          type="url"
                          value={editingSkill.link || ""}
                          onChange={(e) =>
                            setEditingSkill({ ...editingSkill, link: e.target.value })
                          }
                          className={inputClass}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Link Label (EN)</label>
                          <input
                            type="text"
                            value={editingSkill.linkLabel || ""}
                            onChange={(e) =>
                              setEditingSkill({ ...editingSkill, linkLabel: e.target.value })
                            }
                            className={inputClass}
                            placeholder="Official Docs"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Link Label (AR)</label>
                          <input
                            type="text"
                            value={editingSkill.linkLabelAr || ""}
                            onChange={(e) =>
                              setEditingSkill({ ...editingSkill, linkLabelAr: e.target.value })
                            }
                            className={inputClass}
                            placeholder="الموقع الرسمي"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <h4 className="text-slate-200 font-sans font-semibold text-sm flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        Proof / Certificate / Portfolio
                      </h4>
                      <div>
                        <label className={labelClass}>Proof URL</label>
                        <input
                          type="url"
                          value={editingSkill.proofUrl || ""}
                          onChange={(e) =>
                            setEditingSkill({ ...editingSkill, proofUrl: e.target.value })
                          }
                          className={inputClass}
                          placeholder="https://certificate-link-or-project..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Proof Label (EN)</label>
                          <input
                            type="text"
                            value={editingSkill.proofLabel || ""}
                            onChange={(e) =>
                              setEditingSkill({ ...editingSkill, proofLabel: e.target.value })
                            }
                            className={inputClass}
                            placeholder="View Certificate"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Proof Label (AR)</label>
                          <input
                            type="text"
                            value={editingSkill.proofLabelAr || ""}
                            onChange={(e) =>
                              setEditingSkill({ ...editingSkill, proofLabelAr: e.target.value })
                            }
                            className={inputClass}
                            placeholder="عرض الشهادة"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save / Cancel */}
                <div className="pt-5 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingSkill(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-sans text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-sans font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Skill
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
