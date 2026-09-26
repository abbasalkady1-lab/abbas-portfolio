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
    <div className="flex-1 flex flex-col font-sans antialiased text-slate-200">
      <AdminHeader
        title="CERTIFICATES & CREDENTIALS // MANAGEMENT"
        subtitle="Upload certificate images, edit titles, descriptions, verification links, and acquired skills"
      />

      <main className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={openNewModal}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate / إضافة شهادة</span>
          </button>

          <span className="text-slate-400 text-sm font-medium">Total Credentials: <strong className="text-white">{certs.length}</strong></span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading credentials...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between group shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5"
              >
                {/* Certificate Image Banner */}
                {cert.imageUrl ? (
                  <div className="relative w-full h-44 bg-slate-950 overflow-hidden border-b border-slate-800">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2.5 left-3 text-xs px-2.5 py-0.5 rounded-md bg-slate-950/80 border border-slate-700 text-blue-400 font-mono font-semibold">
                      {cert.date}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-28 bg-gradient-to-br from-blue-950/30 to-indigo-950/30 flex items-center justify-center border-b border-slate-800">
                    <Award className="w-9 h-9 text-blue-400/50" />
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5 text-blue-400 font-semibold text-xs">
                        <Award className="w-4 h-4" />
                        <span>{cert.issuer}</span>
                        {cert.issuerAr && (
                          <span className="text-slate-400 text-xs">({cert.issuerAr})</span>
                        )}
                      </div>
                      {!cert.imageUrl && (
                        <span className="text-slate-400 font-mono text-xs">{cert.date}</span>
                      )}
                    </div>

                    <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors leading-snug">
                      {cert.title}
                    </h3>
                    {cert.titleAr && (
                      <div className="text-slate-300 text-xs mt-1 font-medium">{cert.titleAr}</div>
                    )}

                    {cert.description && (
                      <p className="text-slate-300 text-xs font-sans mt-3 line-clamp-2 leading-relaxed">
                        {cert.description}
                      </p>
                    )}

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {cert.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 3 && (
                          <span className="text-xs text-slate-400 self-center font-medium">
                            +{cert.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {cert.credentialId && (
                      <div className="text-xs text-slate-400 mt-3 font-mono">
                        ID: <span className="text-slate-200 font-medium">{cert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between">
                    {cert.verificationUrl ? (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium text-xs flex items-center space-x-1.5 transition-colors"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-slate-500 text-xs">No link attached</span>
                    )}

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(cert)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all cursor-pointer"
                        title="Edit Certificate"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all cursor-pointer"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-2xl my-8 p-6 sm:p-8 rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {isNew ? "Add New Certificate" : `Edit: ${editingCert.title || "Certificate"}`}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Control images, verification links, and bilingual details
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingCert(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 font-sans text-xs">
                {/* 1. Certificate Image Upload & Preview */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <label className="text-slate-200 font-semibold uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                      <span>Certificate Image / صورة الشهادة</span>
                    </span>
                    {editingCert.imageUrl && (
                      <span className="text-xs text-emerald-400 flex items-center space-x-1 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>Image Linked</span>
                      </span>
                    )}
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Live Image Preview or Placeholder */}
                    <div className="relative w-full sm:w-44 h-28 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
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
                            className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-slate-950/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-3 text-slate-500 text-xs flex flex-col items-center space-y-1">
                          <ImageIcon className="w-6 h-6 text-slate-600" />
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
                          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? "Uploading..." : "Upload from Device / رفع صورة"}</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-slate-400">Or paste external image URL:</span>
                        <input
                          type="text"
                          placeholder="https://example.com/certificate.jpg"
                          value={editingCert.imageUrl || ""}
                          onChange={(e) => setEditingCert({ ...editingCert, imageUrl: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Titles (English & Arabic) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold text-xs uppercase tracking-wide">
                      Certificate Title (EN) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Generative AI Specialization"
                      value={editingCert.title}
                      onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold text-xs uppercase tracking-wide text-right">
                      عنوان الشهادة (عربي)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="مثال: تخصص الذكاء الاصطناعي التوليدي"
                      value={editingCert.titleAr || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, titleAr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-right font-sans text-sm"
                    />
                  </div>
                </div>

                {/* 3. Issuing Organization (English & Arabic) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold text-xs uppercase tracking-wide">
                      Issuing Organization (EN) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google Cloud, DeepLearning.AI, n8n"
                      value={editingCert.issuer}
                      onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold text-xs uppercase tracking-wide text-right">
                      الجهة المانحة (عربي)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="مثال: جوجل، ديب ليرنينج، أكاديمية n8n"
                      value={editingCert.issuerAr || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, issuerAr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-right font-sans text-sm"
                    />
                  </div>
                </div>

                {/* 4. Date, Credential ID, Verification Link */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold text-xs uppercase tracking-wide">Date / Year *</label>
                    <input
                      type="text"
                      required
                      placeholder="2024"
                      value={editingCert.date}
                      onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold text-xs uppercase tracking-wide">Credential ID</label>
                    <input
                      type="text"
                      placeholder="e.g. GCP-AI-99120"
                      value={editingCert.credentialId || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold text-xs uppercase tracking-wide flex items-center space-x-1">
                      <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>Verification URL</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://verify.coursera.org/..."
                      value={editingCert.verificationUrl || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, verificationUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* 5. Acquired Skills / Tags */}
                <div>
                  <label className="block text-slate-200 mb-1.5 font-semibold text-xs uppercase tracking-wide flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                    <span>Skills / Topics Covered (Comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ReAct Agents, Tool Calling, LangChain, n8n, Prompt Engineering"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-sans text-sm"
                  />
                </div>

                {/* 6. Descriptions (English & Arabic) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold text-xs uppercase tracking-wide">
                      Full Details / Description (EN)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe what you learned, key projects built, or milestones accomplished..."
                      value={editingCert.description || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-sans text-sm resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold text-xs uppercase tracking-wide text-right">
                      تفاصيل الشهادة والمحاور (عربي)
                    </label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      placeholder="اكتب نبذة عن المعارف المكتسبة، المهارات العملية، والمحاور التي تم اجتيازها..."
                      value={editingCert.descriptionAr || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, descriptionAr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-right font-sans text-sm resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-colors cursor-pointer"
                  >
                    Cancel / إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
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
