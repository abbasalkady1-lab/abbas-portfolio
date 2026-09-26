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
      <div className="min-h-screen bg-[#0B0F19] text-[#00C2FF] flex flex-col items-center justify-center p-4 font-sans antialiased">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-center space-y-4 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#0066FF]/15 border border-[#00C2FF]/30 flex items-center justify-center mx-auto text-[#00C2FF] shadow-lg shadow-blue-500/10">
            <Lock className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="text-white font-bold tracking-wide uppercase text-base">
              AUTHENTICATING ACCESS
            </div>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              Verifying administrative credentials & cryptographic token...
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-[#00C2FF] pt-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs uppercase tracking-widest font-semibold font-mono">Verifying Session</span>
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
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex font-sans antialiased selection:bg-[#0066FF]/30 selection:text-white">
      {/* Fixed Sidebar */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col bg-[#0B0F19]">
        {children}
      </div>
    </div>
  );
}
