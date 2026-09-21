"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, KeyRound, User, Lock, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") || "/admin";

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid access passcode or identity.");
      }

      // Successful auth -> redirect to intended admin path
      router.push(fromParam);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Passcode required.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative z-10 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-white">
          ADMINISTRATIVE MATRIX
        </h1>
        <p className="text-gray-400 text-[11px] font-sans">
          Abbas El Kady &bull; Digital Ecosystem Control Center
        </p>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-1.5 uppercase tracking-wider text-[10px]">
            Admin Identity
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username (e.g. admin or abbas)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 text-white font-mono text-xs focus:outline-none transition-colors placeholder:text-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-1.5 uppercase tracking-wider text-[10px]">
            Access Passcode *
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-violet-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Protected Passcode"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 text-white font-mono text-xs focus:outline-none transition-colors placeholder:text-gray-600"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          <span>{loading ? "Verifying Authorization..." : "Unlock Dashboard"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-white/5 text-center text-[10px] text-gray-500">
        <p>Restricted to Abbas El Kady. Passcode authorization strictly enforced.</p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-white font-mono text-xs relative overflow-hidden">
      {/* Background Cyber Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="text-cyan-400">Loading Matrix...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
