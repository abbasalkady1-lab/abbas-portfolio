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
  Sparkles,
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
} from "lucide-react";

const availableIcons = [
  "Brain",
  "Bot",
  "Sparkles",
  "Workflow",
  "Network",
  "Zap",
  "Code2",
  "Layers",
  "Server",
  "Database",
  "GitBranch",
  "FileCode",
];

const categoryOptions = [
  "Artificial Intelligence",
  "Automation & n8n",
  "Programming & Frameworks",
  "Backend & Databases",
  "Tools & DevOps",
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    if (isNew) {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSkill),
      });
    } else {
      await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSkill),
      });
    }

    setEditingSkill(null);
    fetchSkills();
  };

  const filteredSkills =
    selectedCategory === "All"
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="SKILLS & PROFICIENCIES // CAPABILITY MATRIX"
        subtitle="Manage technical competencies, categories, icons, proficiency scores, and visibility"
      />

      <main className="p-6 sm:p-8 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsNew(true);
                setEditingSkill({
                  id: "",
                  name: "",
                  category: "Artificial Intelligence",
                  level: 90,
                  iconName: "Brain",
                  order: skills.length + 1,
                  visible: true,
                });
              }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Skill</span>
            </button>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="All">All Categories ({skills.length})</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c} ({skills.filter((s) => s.category === c).length})
                </option>
              ))}
            </select>
          </div>

          <div className="text-gray-400">
            Active: <span className="text-cyan-400 font-bold">{skills.filter((s) => s.visible).length}</span> /{" "}
            {skills.length} Total
          </div>
        </div>

        {/* Skills Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading skills matrix...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-400 border border-white/5">
                      {skill.iconName}
                    </span>
                    <span className="text-cyan-400 font-bold">{skill.level}%</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1">{skill.category}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleVisible(skill)}
                    className={`p-1.5 rounded-lg text-xs ${
                      skill.visible
                        ? "text-emerald-400 hover:bg-emerald-500/10"
                        : "text-gray-600 hover:bg-gray-800"
                    }`}
                    title={skill.visible ? "Visible on site" : "Hidden"}
                  >
                    {skill.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditingSkill(skill);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/[0.04]"
                      title="Edit Skill"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
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

        {/* Edit Modal */}
        {editingSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white uppercase">
                  {isNew ? "Add New Skill" : `Edit Skill: ${editingSkill.name}`}
                </h3>
                <button
                  onClick={() => setEditingSkill(null)}
                  className="p-1.5 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Skill Name *</label>
                  <input
                    type="text"
                    required
                    value={editingSkill.name}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Category</label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, category: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Icon Representation</label>
                  <select
                    value={editingSkill.iconName}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, iconName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {availableIcons.map((ico) => (
                      <option key={ico} value={ico}>
                        {ico}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-400 uppercase">Proficiency Level</label>
                    <span className="text-cyan-400 font-bold">{editingSkill.level}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={editingSkill.level}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, level: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="visible_check"
                    checked={editingSkill.visible}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, visible: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <label htmlFor="visible_check" className="text-white cursor-pointer">
                    Visible on public portfolio
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingSkill(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  >
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
