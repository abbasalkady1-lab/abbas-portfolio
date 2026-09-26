"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { FeaturedVideo } from "@/types";
import { YoutubeIcon } from "@/components/icons";
import {
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Play,
  RotateCcw,
  Eye,
} from "lucide-react";

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = trimmed.match(regExp);
  if (match) return match[1];
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes(".")) {
    return trimmed;
  }
  return null;
}

export default function AdminFeaturedVideoPage() {
  const [video, setVideo] = useState<FeaturedVideo>({
    title: "Autonomous AI Agents & Enterprise Architecture Walkthrough",
    titleAr: "شرح معماري متقدم لوكلاء الذكاء الاصطناعي والأتمتة المؤسسية",
    subtitle: "A deep technical breakdown of autonomous agent loops, low-latency voice pipelines, and self-healing n8n automations.",
    subtitleAr: "نظرة تفصيلية متعمقة في دورات عمل الوكلاء الذاتية، خطوط المعالجة الصوتية فائقة السرعة، ومسارات الأتمتة ذاتية التعافي.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    badge: "FEATURED SYSTEM DEMO",
    badgeAr: "عرض توضيحي مميز",
    enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchVideo();
  }, []);

  const fetchVideo = async () => {
    try {
      const res = await fetch("/api/featured-video");
      if (res.ok) {
        const data = await res.json();
        if (data) setVideo(data);
      }
    } catch (e) {
      console.error("Failed to load featured video", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("جاري حفظ وتحديث بيانات الفيديو...");

    try {
      const res = await fetch("/api/featured-video", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(video),
      });

      if (res.ok) {
        setSaveStatus("تم حفظ بيانات الفيديو وتحديث الصفحة الرئيسية بنجاح!");
        setTimeout(() => setSaveStatus(""), 4000);
      } else {
        alert("فشل في حفظ التعديلات");
      }
    } catch (err) {
      alert("حدث خطأ أثناء حفظ الفيديو");
    } finally {
      setIsSaving(false);
    }
  };

  const ytId = extractYouTubeId(video.youtubeUrl);

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="FEATURED VIDEO MANAGEMENT // التحكم في فيديو اليوتيوب"
        subtitle="إدارة وتحديث بوكس الفيديو الرئيسي المعروض في واجهة الموقع، تعديل العناوين باللغتين، ومعاينة حية فورية"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-5xl">
        {saveStatus && (
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center space-x-2 rtl:space-x-reverse">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-sans text-sm">{saveStatus}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-gray-400">جاري تحميل بيانات الفيديو...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
              {/* Header with Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <YoutubeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                      YouTube Showcase Card Settings
                    </h3>
                    <p className="text-gray-400 text-xs font-sans mt-0.5">
                      يحل هذا البوكس محل قسم المحاكي السابق مع إمكانية التغيير في أي وقت
                    </p>
                  </div>
                </div>

                {/* Enable / Disable toggle */}
                <label className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2.5 rounded-2xl border border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={video.enabled !== false}
                    onChange={(e) => setVideo({ ...video, enabled: e.target.checked })}
                    className="rounded text-red-500 focus:ring-red-400 h-4 w-4 bg-black/40 border-white/20"
                  />
                  <span className="text-xs font-sans text-white font-medium">
                    {video.enabled !== false ? "🟢 القسم مفعل في الموقع" : "⚪ القسم مخفي حالياً"}
                  </span>
                </label>
              </div>

              {/* YouTube URL input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-gray-300 uppercase font-bold text-xs">
                    رابط فيديو اليوتيوب (YouTube Video URL or ID) *
                  </label>
                  <span className="text-[11px] text-gray-500 font-sans">
                    يدعم جميع صيغ الروابط (watch?v=, youtu.be, shorts, embed)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    value={video.youtubeUrl}
                    onChange={(e) => setVideo({ ...video, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:border-red-500 focus:outline-none font-mono text-sm"
                  />
                  {video.youtubeUrl && (
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white flex items-center space-x-2 transition-colors text-xs shrink-0"
                    >
                      <ExternalLink className="w-4 h-4 text-red-400" />
                      <span className="font-sans">فتح في يوتيوب</span>
                    </a>
                  )}
                </div>

                {/* Validation Status */}
                {ytId ? (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-emerald-400 pt-1 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>تم التعرف على معرف الفيديو بنجاح: <strong className="underline">{ytId}</strong></span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-amber-400 pt-1 font-sans">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>تنبيه: يرجى كتابة رابط يوتيوب صالح ليتم تضمين الفيديو ومعاينته بشكل سليم.</span>
                  </div>
                )}
              </div>

              {/* Live Embedded Preview */}
              {ytId && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-bold flex items-center space-x-2 rtl:space-x-reverse">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span className="font-sans">معاينة تفاعلية حية (Live Interactive Preview):</span>
                    </span>
                    <span className="text-red-400 font-mono text-[11px] px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                      1080p / 4K UHD
                    </span>
                  </div>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
                      title="Featured Video Preview"
                      className="w-full h-full border-0 absolute inset-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Titles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                <div>
                  <label className="block text-gray-300 mb-1.5 uppercase font-bold text-xs">
                    عنوان البوكس الرئيسي (English Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={video.title}
                    onChange={(e) => setVideo({ ...video, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:border-cyan-400 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 uppercase font-bold text-xs">
                    عنوان البوكس الرئيسي (العنوان العربي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={video.titleAr}
                    onChange={(e) => setVideo({ ...video, titleAr: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:border-cyan-400 focus:outline-none text-sm"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Subtitles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-300 mb-1.5 uppercase text-xs">
                    الوصف التفصيلي (English Subtitle / Description)
                  </label>
                  <textarea
                    rows={3}
                    value={video.subtitle || ""}
                    onChange={(e) => setVideo({ ...video, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:border-cyan-400 focus:outline-none text-xs font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 uppercase text-xs">
                    الوصف التفصيلي (الوصف بالعربية)
                  </label>
                  <textarea
                    rows={3}
                    value={video.subtitleAr || ""}
                    onChange={(e) => setVideo({ ...video, subtitleAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:border-cyan-400 focus:outline-none text-xs font-sans leading-relaxed"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Badge Tag Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-300 mb-1.5 uppercase text-xs">
                    نص الشارة العلوية (Badge EN)
                  </label>
                  <input
                    type="text"
                    value={video.badge || ""}
                    onChange={(e) => setVideo({ ...video, badge: e.target.value })}
                    placeholder="FEATURED SYSTEM DEMO"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:border-cyan-400 focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 uppercase text-xs">
                    نص الشارة العلوية (الشارة بالعربية)
                  </label>
                  <input
                    type="text"
                    value={video.badgeAr || ""}
                    onChange={(e) => setVideo({ ...video, badgeAr: e.target.value })}
                    placeholder="عرض توضيحي مميز"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:border-cyan-400 focus:outline-none text-xs"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <a
                  href="/#featured-video"
                  target="_blank"
                  className="flex items-center space-x-2 rtl:space-x-reverse text-gray-400 hover:text-cyan-400 text-xs font-sans transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>معاينة القسم في الموقع المباشر</span>
                </a>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all font-sans text-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "جاري الحفظ..." : "حفظ التعديلات ونشرها"}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
