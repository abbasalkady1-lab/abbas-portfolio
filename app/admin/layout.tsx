"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setIsAuthenticated(Boolean(data.authenticated));
        } else {
          if (isMounted) {
            setIsAuthenticated(false);
            router.push(`/admin/login?from=${encodeURIComponent(pathname)}`);
          }
        }
      } catch (err) {
        if (isMounted) {
          setIsAuthenticated(false);
          router.push(`/admin/login?from=${encodeURIComponent(pathname)}`);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  // If on login page, don't show admin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If checking authentication, show encrypted verification gate
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#05070B] text-cyan-400 flex flex-col items-center justify-center p-4 font-mono text-xs">
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-cyan-500/20 shadow-[0_0_50px_rgba(0,240,255,0.08)] text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-white font-bold tracking-wider uppercase text-sm">
              AUTHENTICATING MATRIX
            </div>
            <p className="text-gray-400 text-[11px] mt-1">
              Verifying administrative credentials & cryptographic token...
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-cyan-400 pt-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[10px] uppercase tracking-widest">Checking Auth</span>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, do not render layout content
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex">
      {/* Fixed Sidebar */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col bg-[#05070B]">
        {children}
      </div>
    </div>
  );
}
