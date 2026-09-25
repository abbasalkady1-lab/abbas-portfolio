"use client";

import React, { useState, useEffect, useRef } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Certificate } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  ExternalLink,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  Check,
  Sparkles,
  Link as LinkIcon,
  Tag,
  Calendar,
  FileText,
} from "lucide-react";

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCerts = async () => {
    try {
      const res = await fetch("/api/certificates");
      const data = await res.json();
      setCerts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const openNewModal = () => {
    setIsNew(true);
    setSkillsInput("");
    setEditingCert({
      id: "",
      title: "",
      titleAr: "",
      issuer: "",
      issuerAr: "",
      date: new Date().getFullYear().toString(),
      credentialId: "",
      verificationUrl: "",
      imageUrl: "",
      description: "",
      descriptionAr: "",
      skills: [],
      order: certs.length + 1,
    });
  };

  const openEditModal = (cert: Certificate) => {
    setIsNew(false);
    setSkillsInput((cert.skills || []).join(", "));
    setEditingCert({ ...cert });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    setCerts((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/certificates?id=${id}`, { method: "DELETE" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCert) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setEditingCert({ ...editingCert, imageUrl: data.url });
      } else {
        alert(data.error || "Failed to upload image to server");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while uploading certificate image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    const parsedSkills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Certificate = {
      ...editingCert,
      skills: parsedSkills,
    };

    if (isNew) {
      await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/certificates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setEditingCert(null);
    fetchCerts();
  };

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="CERTIFICATES & CREDENTIALS // MANAGEMENT"
        subtitle="Upload certificate images, edit titles, descriptions, verification links, and acquired skills"
      />

      <main className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={openNewModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate / إضافة شهادة</span>
          </button>

          <span className="text-gray-400">Total Credentials: {certs.length}</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading credentials...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="glass-panel rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-lg overflow-hidden bg-white/[0.02]"
              >
                {/* Certificate Image Banner */}
                {cert.imageUrl ? (
                  <div className="relative w-full h-40 bg-black/40 overflow-hidden border-b border-white/5">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-3 text-[10px] px-2 py-0.5 rounded-md bg-black/60 border border-white/20 text-emerald-400 font-mono">
                      {cert.date}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-24 bg-gradient-to-br from-emerald-950/20 to-cyan-950/20 flex items-center justify-center border-b border-white/5">
                    <Award className="w-8 h-8 text-emerald-500/40" />
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-xs">
                        <Award className="w-4 h-4" />
                        <span>{cert.issuer}</span>
                        {cert.issuerAr && (
                          <span className="text-gray-400 text-[11px]">({cert.issuerAr})</span>
                        )}
                      </div>
                      {!cert.imageUrl && (
                        <span className="text-gray-500 font-mono text-[11px]">{cert.date}</span>
                      )}
                    </div>

                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                      {cert.title}
                    </h3>
                    {cert.titleAr && (
                      <div className="text-gray-400 text-xs mt-0.5">{cert.titleAr}</div>
                    )}

                    {cert.description && (
                      <p className="text-gray-400 text-[11px] font-sans mt-2.5 line-clamp-2 leading-relaxed">
                        {cert.description}
                      </p>
                    )}

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {cert.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-gray-300 text-[10px]"
                          >
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 3 && (
                          <span className="text-[10px] text-gray-500 self-center">
                            +{cert.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {cert.credentialId && (
                      <div className="text-[10px] text-gray-500 mt-3 font-mono">
                        ID: <span className="text-gray-400">{cert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                    {cert.verificationUrl ? (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-colors"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-600 text-[11px]">No link attached</span>
                    )}

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(cert)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/[0.05] transition-all cursor-pointer"
                        title="Edit Certificate"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/[0.05] transition-all cursor-pointer"
                        title="Delete Certificate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit / Add Modal */}
        {editingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-2xl my-8 glass-panel p-6 sm:p-7 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-5 bg-[#0C111C]">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase">
                      {isNew ? "Add New Certificate" : `Edit: ${editingCert.title || "Certificate"}`}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Control images, verification links, and bilingual details
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingCert(null)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 font-mono text-xs">
                {/* 1. Certificate Image Upload & Preview */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <label className="block text-gray-300 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <span>Certificate Image / صورة الشهادة</span>
                    </span>
                    {editingCert.imageUrl && (
                      <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Image Linked</span>
                      </span>
                    )}
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Live Image Preview or Placeholder */}
                    <div className="relative w-full sm:w-44 h-28 rounded-xl bg-black/40 border border-white/15 overflow-hidden flex items-center justify-center shrink-0">
                      {editingCert.imageUrl ? (
                        <>
                          <img
                            src={editingCert.imageUrl}
                            alt="Certificate Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingCert({ ...editingCert, imageUrl: "" })}
                            className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/70 hover:bg-red-500/80 text-white transition-colors cursor-pointer"
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-3 text-gray-500 text-[11px] flex flex-col items-center space-y-1">
                          <ImageIcon className="w-6 h-6 text-gray-600" />
                          <span>No Image Selected</span>
                        </div>
                      )}
                    </div>

                    {/* Upload button & Direct URL input */}
                    <div className="w-full space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? "Uploading..." : "Upload from Device / رفع صورة"}</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400">Or paste external image URL:</span>
                        <input
                          type="text"
                          placeholder="https://example.com/certificate.jpg"
                          value={editingCert.imageUrl || ""}
                          onChange={(e) => setEditingCert({ ...editingCert, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Titles (English & Arabic) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase font-semibold">
                      Certificate Title (EN) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Generative AI Specialization"
                      value={editingCert.title}
                      onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase font-semibold text-right">
                      عنوان الشهادة (عربي)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="مثال: تخصص الذكاء الاصطناعي التوليدي"
                      value={editingCert.titleAr || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, titleAr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none text-right font-sans"
                    />
                  </div>
                </div>

                {/* 3. Issuing Organization (English & Arabic) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase font-semibold">
                      Issuing Organization (EN) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google Cloud, DeepLearning.AI, n8n"
                      value={editingCert.issuer}
                      onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase font-semibold text-right">
                      الجهة المانحة (عربي)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="مثال: جوجل، ديب ليرنينج، أكاديمية n8n"
                      value={editingCert.issuerAr || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, issuerAr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none text-right font-sans"
                    />
                  </div>
                </div>

                {/* 4. Date, Credential ID, Verification Link */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase font-semibold">Date / Year *</label>
                    <input
                      type="text"
                      required
                      placeholder="2024"
                      value={editingCert.date}
                      onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase font-semibold">Credential ID</label>
                    <input
                      type="text"
                      placeholder="e.g. GCP-AI-99120"
                      value={editingCert.credentialId || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase font-semibold flex items-center space-x-1">
                      <LinkIcon className="w-3 h-3 text-cyan-400" />
                      <span>Verification URL (Link)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://verify.coursera.org/..."
                      value={editingCert.verificationUrl || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, verificationUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 5. Acquired Skills / Tags */}
                <div>
                  <label className="block text-gray-400 mb-1 uppercase font-semibold flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Skills / Topics Covered (Comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ReAct Agents, Tool Calling, LangChain, n8n, Prompt Engineering"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-sans"
                  />
                </div>

                {/* 6. Descriptions (English & Arabic) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase font-semibold">
                      Full Details / Description (EN)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe what you learned, key projects built, or milestones accomplished..."
                      value={editingCert.description || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-sans text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase font-semibold text-right">
                      تفاصيل الشهادة والمحاور (عربي)
                    </label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      placeholder="اكتب نبذة عن المعارف المكتسبة، المهارات العملية، والمحاور التي تم اجتيازها..."
                      value={editingCert.descriptionAr || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, descriptionAr: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none text-right font-sans text-xs resize-none"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel / إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Certificate / حفظ الشهادة</span>
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
