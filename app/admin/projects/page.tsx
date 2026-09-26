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
      className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all flex items-center justify-between gap-4 group shadow-md"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-blue-400 transition-colors"
        title="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Project Thumbnail */}
      <div className="w-14 h-14 rounded-lg bg-slate-950 overflow-hidden border border-slate-700 shrink-0">
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
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 font-medium">
            {project.category}
          </span>
          {project.featured && (
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 flex items-center space-x-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured</span>
            </span>
          )}
        </div>
        <div className="text-slate-300 text-xs font-sans truncate mt-1">
          {project.shortDescription}
        </div>
        <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1 font-mono">
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
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
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
              ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-400"
          }`}
          title="Toggle Featured"
        >
          <Star className="w-4 h-4" />
        </button>

        {/* Duplicate */}
        <button
          onClick={() => onDuplicate(project)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-blue-400 transition-colors"
          title="Duplicate Project"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(project)}
          className="p-2 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 transition-colors"
          title="Edit Project"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(project.id)}
          className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 transition-colors"
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
    <div className="flex-1 flex flex-col font-sans antialiased text-slate-200">
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
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>

            {saveStatus && (
              <span className="text-blue-400 font-bold flex items-center space-x-1.5 animate-pulse text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveStatus}</span>
              </span>
            )}
          </div>

          <div className="text-slate-400 text-sm">
            Total Projects: <span className="text-white font-bold">{projects.length}</span> (
            <span className="text-emerald-400 font-medium">
              {projects.filter((p) => p.published).length} Published
            </span>
            )
          </div>
        </div>

        {/* Drag-and-Drop Sortable Project List */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading projects matrix...</div>
        ) : projects.length === 0 ? (
          <div className="bg-slate-900/60 p-12 rounded-2xl text-center text-slate-400 border border-dashed border-slate-700">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  {isNew ? "Create New System Project" : `Edit Project: ${editingProject.title}`}
                </h2>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Title (English) *</label>
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold text-right">Title (Arabic)</label>
                    <input
                      type="text"
                      value={editingProject.titleAr || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, titleAr: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-right font-sans text-sm"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.slug}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, slug: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-blue-300 focus:border-blue-500 focus:outline-none font-mono text-sm"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-slate-200 uppercase font-semibold">
                        Category / التصنيف
                      </label>
                      <span className="text-xs text-blue-400 font-medium">اكتب أي تصنيف مخصص</span>
                    </div>
                    <input
                      type="text"
                      list="categories-list"
                      placeholder="e.g. AI Agents, Automation & n8n, AI & RAG, Web & Platforms..."
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                    />
                    <datalist id="categories-list">
                      <option value="AI Agents" />
                      <option value="Automation & n8n" />
                      <option value="AI & RAG" />
                      <option value="Web & Platforms" />
                    </datalist>
                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["AI Agents", "Automation & n8n", "AI & RAG", "Web & Platforms"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, category: cat })}
                          className={`px-2.5 py-1 rounded-lg text-xs border transition-colors cursor-pointer ${
                            editingProject.category === cat
                              ? "bg-blue-600/25 border-blue-500 text-blue-300 font-semibold"
                              : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Status</label>
                    <select
                      value={editingProject.status}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:border-blue-500 focus:outline-none text-sm"
                    >
                      <option value="Live Production">Live Production</option>
                      <option value="Completed">Completed</option>
                      <option value="In Development">In Development</option>
                      <option value="Prototype">Prototype</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Short Summary (EN) *</label>
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
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 font-sans text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Full Case Study Narrative</label>
                  <textarea
                    rows={4}
                    value={editingProject.fullDescription}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        fullDescription: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 font-sans text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">The Problem / Challenge</label>
                    <textarea
                      rows={2}
                      value={editingProject.problem || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, problem: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 font-sans text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">The Engineering Solution</label>
                    <textarea
                      rows={2}
                      value={editingProject.solution || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, solution: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 font-sans text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Architecture Pipeline</label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Thumbnail URL *</label>
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={editingProject.technologies.join(", ")}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Live Demo URL</label>
                    <input
                      type="text"
                      value={editingProject.liveDemoUrl || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          liveDemoUrl: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">GitHub URL</label>
                    <input
                      type="text"
                      value={editingProject.githubUrl || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          githubUrl: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">YouTube Showcase URL</label>
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-red-400 placeholder-slate-500 focus:border-red-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 uppercase font-semibold">Demo Video URL (MP4 / WebM)</label>
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-indigo-300 placeholder-slate-500 focus:border-indigo-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6 pt-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.published}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          published: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
                    />
                    <span className="text-white font-medium text-xs">Published to Live Site</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          featured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
                    />
                    <span className="text-white font-medium text-xs">Highlight as Featured</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
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
