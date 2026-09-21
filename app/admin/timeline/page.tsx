"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { TimelineItem } from "@/types";
import { Plus, Edit2, Trash2, GraduationCap, Briefcase, ExternalLink, X, Save } from "lucide-react";

export default function AdminTimelinePage() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchTimeline = async () => {
    try {
      const res = await fetch("/api/timeline");
      const data = await res.json();
      setTimeline(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setTimeline((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/timeline?id=${id}`, { method: "DELETE" });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isNew) {
      await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
    } else {
      await fetch("/api/timeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
    }

    setEditingItem(null);
    fetchTimeline();
  };

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="EXPERIENCE & EDUCATION // CHRONOLOGY MATRIX"
        subtitle="Manage academic degrees, courses, work experience, consultancies, and credentials"
      />

      <main className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setIsNew(true);
              setEditingItem({
                id: "",
                type: "experience",
                title: "",
                organization: "",
                description: "",
                startDate: "2024",
                endDate: "Present",
                verificationLink: "",
                order: timeline.length + 1,
              });
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Timeline Entry</span>
          </button>

          <span className="text-gray-400">Total Entries: {timeline.length}</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading timeline...</div>
        ) : (
          <div className="space-y-3">
            {timeline.map((item) => {
              const isEdu = item.type === "education";
              return (
                <div
                  key={item.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-4 group shadow-lg"
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`p-2.5 rounded-xl border mt-0.5 ${
                        isEdu
                          ? "bg-violet-500/10 border-violet-500/30 text-violet-400"
                          : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      }`}
                    >
                      {isEdu ? <GraduationCap className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{item.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                            isEdu ? "bg-violet-500/20 text-violet-300" : "bg-cyan-500/20 text-cyan-300"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                      <div className="text-cyan-400 text-xs mt-0.5">{item.organization}</div>
                      <div className="text-gray-400 text-[11px] font-sans mt-2 leading-relaxed max-w-2xl">
                        {item.description}
                      </div>
                      <div className="text-gray-500 text-[10px] mt-2 font-mono">
                        {item.startDate} &mdash; {item.endDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditingItem(item);
                      }}
                      className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/[0.04]"
                      title="Edit Entry"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white uppercase">
                  {isNew ? "Create Timeline Entry" : `Edit Entry: ${editingItem.title}`}
                </h3>
                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Type</label>
                    <select
                      value={editingItem.type}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, type: e.target.value as any })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="experience">Experience (Work/Consulting)</option>
                      <option value="education">Education (University/Courses)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Organization *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.organization}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, organization: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Role or Degree Title *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Start Date *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.startDate}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, startDate: e.target.value })
                      }
                      placeholder="e.g. 2023"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">End Date *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.endDate}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, endDate: e.target.value })
                      }
                      placeholder="e.g. Present"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Description</label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Verification Link (optional)</label>
                  <input
                    type="text"
                    value={editingItem.verificationLink || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, verificationLink: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
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
                    Save Entry
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
