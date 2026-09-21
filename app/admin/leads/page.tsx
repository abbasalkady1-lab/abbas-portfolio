"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Lead } from "@/types";
import { Mail, Phone, Building, CheckCircle2, Trash2, ExternalLink, Filter } from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "new" | "read" | "replied" | "archived">("all");

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, status: Lead["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch("/api/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
  };

  const filteredLeads = leads.filter((l) => (activeTab === "all" ? true : l.status === activeTab));

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="CLIENT INQUIRIES // LEAD MANAGEMENT"
        subtitle="Review client proposals, service requests, update statuses, and dispatch direct responses"
      />

      <main className="p-6 sm:p-8 space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            {[
              { key: "all", label: "All Inquiries", count: leads.length },
              { key: "new", label: "New", count: leads.filter((l) => l.status === "new").length },
              { key: "read", label: "Read", count: leads.filter((l) => l.status === "read").length },
              { key: "replied", label: "Replied", count: leads.filter((l) => l.status === "replied").length },
              { key: "archived", label: "Archived", count: leads.filter((l) => l.status === "archived").length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === tab.key
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                    : "bg-white/[0.04] text-gray-400 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>

          <div className="text-gray-400 text-[11px]">
            Unread Attention Needed:{" "}
            <span className="text-amber-400 font-bold">
              {leads.filter((l) => l.status === "new").length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading inquiries...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center text-gray-400 border border-dashed border-gray-700">
            No inquiries match this filter status.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className={`glass-panel p-6 rounded-2xl border transition-all space-y-4 shadow-xl ${
                  lead.status === "new"
                    ? "border-cyan-500/40 bg-cyan-950/[0.04]"
                    : "border-white/10"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-base font-bold text-white">{lead.name}</h3>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          lead.status === "new"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse"
                            : lead.status === "replied"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : lead.status === "read"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-1.5 font-mono">
                      <span className="text-cyan-400">{lead.email}</span>
                      {lead.phone && <span>&bull; {lead.phone}</span>}
                      {lead.company && (
                        <span className="flex items-center space-x-1 text-gray-300">
                          <Building className="w-3.5 h-3.5" />
                          <span>{lead.company}</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] text-white">
                        Service: {lead.service || "General"}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-500 text-[11px]">
                    {new Date(lead.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Lead Message */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-sans text-xs text-gray-200 leading-relaxed">
                  {lead.message}
                </div>

                {/* Actions bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  {/* Status buttons */}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 text-[10px] uppercase">Set Status:</span>
                    {(["new", "read", "replied", "archived"] as Lead["status"][]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(lead.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] uppercase transition-all ${
                          lead.status === st
                            ? "bg-white/20 text-white font-bold"
                            : "bg-white/[0.03] text-gray-400 hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Direct Contact triggers */}
                  <div className="flex items-center space-x-2">
                    <a
                      href={`mailto:${lead.email}?subject=Re: Inquiry for Abbas El Kady`}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply Email</span>
                    </a>

                    {lead.phone && (
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
