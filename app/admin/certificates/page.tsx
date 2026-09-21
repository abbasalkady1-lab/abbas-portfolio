"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Certificate } from "@/types";
import { Plus, Edit2, Trash2, Award, ExternalLink, X, Save } from "lucide-react";

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchCerts = async () => {
    try {
      const res = await fetch("/api/certificates");
      const data = await res.json();
      setCerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    setCerts((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/certificates?id=${id}`, { method: "DELETE" });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    if (isNew) {
      await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCert),
      });
    } else {
      await fetch("/api/certificates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCert),
      });
    }

    setEditingCert(null);
    fetchCerts();
  };

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="CERTIFICATES & HONORS // VERIFIED CREDENTIALS"
        subtitle="Manage professional certifications, issuing organizations, dates, and verification links"
      />

      <main className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setIsNew(true);
              setEditingCert({
                id: "",
                title: "",
                issuer: "",
                date: "2024",
                credentialId: "",
                verificationUrl: "",
                order: certs.length + 1,
              });
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate</span>
          </button>

          <span className="text-gray-400">Total Credentials: {certs.length}</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading credentials...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-gray-500 font-mono text-[11px]">{cert.date}</span>
                  </div>

                  <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                    {cert.title}
                  </h3>
                  <div className="text-emerald-400 text-xs mt-1">{cert.issuer}</div>

                  {cert.credentialId && (
                    <div className="text-[10px] text-gray-500 mt-2">ID: {cert.credentialId}</div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  {cert.verificationUrl ? (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditingCert(cert);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {editingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white uppercase">
                  {isNew ? "Add Certificate" : `Edit: ${editingCert.title}`}
                </h3>
                <button onClick={() => setEditingCert(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Certificate Title *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.title}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Date / Year *</label>
                    <input
                      type="text"
                      required
                      value={editingCert.date}
                      onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 uppercase">Credential ID</label>
                    <input
                      type="text"
                      value={editingCert.credentialId || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Verification URL</label>
                  <input
                    type="text"
                    value={editingCert.verificationUrl || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, verificationUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                  >
                    Save Certificate
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
