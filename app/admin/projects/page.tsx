"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Project } from "@/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  X,
  Save,
} from "lucide-react";

// Sortable Row Component
function SortableProjectItem({
  project,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePublish,
  onToggleFeatured,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onDuplicate: (p: Project) => void;
  onTogglePublish: (p: Project) => void;
  onToggleFeatured: (p: Project) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-panel p-4 rounded-xl border border-white/10 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-4 group"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-gray-500 hover:text-cyan-400"
        title="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Project Thumbnail */}
      <div className="w-14 h-14 rounded-lg bg-gray-950 overflow-hidden border border-white/10 shrink-0">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-white text-sm truncate">{project.title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            {project.category}
          </span>
          {project.featured && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 shrink-0 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>Featured</span>
            </span>
          )}
        </div>
        <div className="text-gray-400 text-[11px] font-sans truncate mt-0.5">
          {project.shortDescription}
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-gray-500 mt-1 font-mono">
          <span>Order: #{project.order}</span>
          <span>Status: {project.status}</span>
          <span>Year: {project.year}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1.5 shrink-0">
        {/* Toggle Publish */}
        <button
          onClick={() => onTogglePublish(project)}
          className={`p-2 rounded-lg border transition-colors ${
            project.published
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
              : "bg-gray-800 border-gray-700 text-gray-500 hover:text-white"
          }`}
          title={project.published ? "Published (click to unpublish)" : "Draft (click to publish)"}
        >
          {project.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Toggle Featured */}
        <button
          onClick={() => onToggleFeatured(project)}
          className={`p-2 rounded-lg border transition-colors ${
            project.featured
              ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
              : "bg-white/[0.02] border-white/5 text-gray-500 hover:text-yellow-400"
          }`}
          title="Toggle Featured"
        >
          <Star className="w-4 h-4" />
        </button>

        {/* Duplicate */}
        <button
          onClick={() => onDuplicate(project)}
          className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 text-gray-400 hover:text-cyan-400 transition-colors"
          title="Duplicate Project"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(project)}
          className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 transition-colors"
          title="Edit Project"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(project.id)}
          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors"
          title="Delete Project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(projects, oldIndex, newIndex);
    // Update local order numbers
    const updated = reordered.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(updated);

    // Save to backend immediately
    try {
      setSaveStatus("Saving order...");
      await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: updated.map((p) => p.id) }),
      });
      setSaveStatus("Order saved!");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      setSaveStatus("Error saving order");
    }
  };

  const handleTogglePublish = async (proj: Project) => {
    const updated = { ...proj, published: !proj.published };
    setProjects((prev) => prev.map((p) => (p.id === proj.id ? updated : p)));
    await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  };

  const handleToggleFeatured = async (proj: Project) => {
    const updated = { ...proj, featured: !proj.featured };
    setProjects((prev) => prev.map((p) => (p.id === proj.id ? updated : p)));
    await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  };

  const handleDuplicate = async (proj: Project) => {
    const duplicate = {
      ...proj,
      id: undefined,
      title: `${proj.title} (Copy)`,
      slug: `${proj.slug}-copy-${Date.now().toString().slice(-4)}`,
      published: false,
    };
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(duplicate),
    });
    if (res.ok) fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (isNew) {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });
    } else {
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });
    }

    setEditingProject(null);
    fetchProjects();
  };

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="PROJECTS MANAGEMENT // CRUD & REORDER"
        subtitle="Drag & drop project cards to change their order on the live website immediately"
      />

      <main className="p-6 sm:p-8 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsNew(true);
                setEditingProject({
                  id: "",
                  slug: "",
                  title: "",
                  shortDescription: "",
                  fullDescription: "",
                  problem: "",
                  solution: "",
                  architecture: "",
                  category: "AI Agents",
                  technologies: ["Google Gemini", "Python", "TypeScript"],
                  thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
                  screenshots: [],
                  year: new Date().getFullYear().toString(),
                  status: "Live Production",
                  featured: false,
                  published: true,
                  order: projects.length + 1,
                });
              }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>

            {saveStatus && (
              <span className="text-cyan-400 font-bold flex items-center space-x-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveStatus}</span>
              </span>
            )}
          </div>

          <div className="text-gray-400">
            Total Projects: <span className="text-white font-bold">{projects.length}</span> (
            <span className="text-emerald-400">
              {projects.filter((p) => p.published).length} Published
            </span>
            )
          </div>
        </div>

        {/* Drag-and-Drop Sortable Project List */}
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading projects matrix...</div>
        ) : projects.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center text-gray-400 border border-dashed border-gray-700">
            No projects found. Click "Create New Project" to add your first project.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {projects.map((project) => (
                  <SortableProjectItem
                    key={project.id}
                    project={project}
                    onEdit={(p) => {
                      setIsNew(false);
                      setEditingProject(p);
                    }}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onTogglePublish={handleTogglePublish}
                    onToggleFeatured={handleToggleFeatured}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Project Edit / Create Modal */}
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  {isNew ? "Create New System Project" : `Edit Project: ${editingProject.title}`}
                </h2>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Title (English) *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          title: e.target.value,
                          slug: editingProject.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Title (Arabic)</label>
                    <input
                      type="text"
                      value={editingProject.titleAr || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, titleAr: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.slug}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, slug: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-cyan-300 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="AI Agents">AI Agents</option>
                      <option value="n8n">n8n Automation</option>
                      <option value="AI">AI & Machine Learning</option>
                      <option value="Software">Software & Full-Stack</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Experiments">Experiments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Status</label>
                    <select
                      value={editingProject.status}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B12] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Live Production">Live Production</option>
                      <option value="Completed">Completed</option>
                      <option value="In Development">In Development</option>
                      <option value="Prototype">Prototype</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Short Summary (EN) *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingProject.shortDescription}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        shortDescription: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Full Case Study Narrative</label>
                  <textarea
                    rows={4}
                    value={editingProject.fullDescription}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        fullDescription: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">The Problem / Challenge</label>
                    <textarea
                      rows={2}
                      value={editingProject.problem || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, problem: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">The Engineering Solution</label>
                    <textarea
                      rows={2}
                      value={editingProject.solution || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, solution: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Architecture Pipeline</label>
                  <input
                    type="text"
                    value={editingProject.architecture || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        architecture: e.target.value,
                      })
                    }
                    placeholder="e.g. Webhook -> n8n -> Gemini Pro -> Vector DB"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Thumbnail URL *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.thumbnail}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          thumbnail: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={editingProject.technologies.join(", ")}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Live Demo URL</label>
                    <input
                      type="text"
                      value={editingProject.liveDemoUrl || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          liveDemoUrl: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">GitHub URL</label>
                    <input
                      type="text"
                      value={editingProject.githubUrl || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          githubUrl: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">YouTube Showcase URL</label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      value={editingProject.youtubeUrl || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          youtubeUrl: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-red-300 focus:border-red-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Demo Video URL (MP4 / WebM)</label>
                    <input
                      type="text"
                      placeholder="/uploads/... or external video URL"
                      value={editingProject.demoVideo || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          demoVideo: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-violet-300 focus:border-violet-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.published}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          published: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                    />
                    <span className="text-white">Published to Live Site</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          featured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                    />
                    <span className="text-white">Highlight as Featured</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Project</span>
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
