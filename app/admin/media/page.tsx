"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { MediaItem } from "@/types";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Eye,
  Image as ImageIcon,
  Video,
  Plus,
  X,
  Play,
  ExternalLink,
  Film,
  Sparkles,
} from "lucide-react";
import { YoutubeIcon } from "@/components/icons";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "image" | "video" | "youtube">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // YouTube / Video Link Modal state
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [customThumbnail, setCustomThumbnail] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        await fetch("/api/media", { method: "POST", body: formData });
      }
      fetchMedia();
    } catch (err) {
      alert("Failed to upload assets");
    } finally {
      setUploading(false);
    }
  };

  const handleAddYouTubeOrVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;

    setIsSubmittingVideo(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: videoUrl,
          title: videoTitle,
          thumbnailUrl: customThumbnail,
          description: videoDescription,
        }),
      });

      if (res.ok) {
        setVideoUrl("");
        setVideoTitle("");
        setCustomThumbnail("");
        setVideoDescription("");
        setShowAddVideoModal(false);
        fetchMedia();
      } else {
        alert("Failed to register video link");
      }
    } catch (err) {
      alert("An error occurred while registering video");
    } finally {
      setIsSubmittingVideo(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    setMedia((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/media?id=${id}`, { method: "DELETE" });
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = url.startsWith("http") ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyEmbed = (item: MediaItem) => {
    let embedCode = "";
    if (item.type === "youtube" && item.embedUrl) {
      embedCode = `<iframe width="560" height="315" src="${item.embedUrl}" title="${item.title || item.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else if (item.type.includes("video")) {
      embedCode = `<video controls src="${item.url}" poster="${item.thumbnailUrl || ""}" style="max-width:100%;"></video>`;
    } else {
      embedCode = `<img src="${item.url}" alt="${item.name}" />`;
    }

    navigator.clipboard.writeText(embedCode);
    setCopiedId(`embed-${item.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = media.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "youtube") return item.type === "youtube";
    if (filterType === "video") return item.type.includes("video");
    if (filterType === "image") return !item.type.includes("video") && item.type !== "youtube";
    return true;
  });

  return (
    <div className="flex-1 flex flex-col font-mono text-xs">
      <AdminHeader
        title="MEDIA & VIDEO MANAGEMENT // CMS ASSETS REPOSITORY"
        subtitle="Upload images and video files, integrate YouTube showcase links with expressive thumbnails, and copy embed codes"
      />

      <main className="p-6 sm:p-8 space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Upload Files Button */}
            <label className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
              <Upload className="w-4 h-4" />
              <span>{uploading ? "Uploading..." : "Upload Images & Videos"}</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {/* Add YouTube / Video Link Button */}
            <button
              onClick={() => setShowAddVideoModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
            >
              <YoutubeIcon className="w-4 h-4" />
              <span>Add YouTube / Video URL</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-white/[0.04] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === "all" ? "bg-cyan-500 text-black font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              All ({media.length})
            </button>
            <button
              onClick={() => setFilterType("image")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === "image" ? "bg-cyan-500 text-black font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Images ({media.filter((m) => !m.type.includes("video") && m.type !== "youtube").length})
            </button>
            <button
              onClick={() => setFilterType("video")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === "video" ? "bg-cyan-500 text-black font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              Videos ({media.filter((m) => m.type.includes("video")).length})
            </button>
            <button
              onClick={() => setFilterType("youtube")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === "youtube" ? "bg-red-500 text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              YouTube ({media.filter((m) => m.type === "youtube").length})
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading media library...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center text-gray-400 border border-dashed border-gray-700">
            No media assets found in this filter. Upload images, videos, or add YouTube links above.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => {
              const isYt = item.type === "youtube";
              const isVid = item.type.includes("video");
              const thumbnailSrc = item.thumbnailUrl || (isVid ? undefined : item.url);

              return (
                <div
                  key={item.id}
                  className="glass-panel rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
                >
                  {/* Media Display Container */}
                  <div
                    className="aspect-square bg-gray-950 relative overflow-hidden cursor-pointer"
                    onClick={() => setPreviewItem(item)}
                  >
                    {isYt || thumbnailSrc ? (
                      <img
                        src={thumbnailSrc || item.url}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : isVid ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      {isYt ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white font-mono text-[9px] font-bold shadow-sm">
                          <YoutubeIcon className="w-3 h-3" />
                          <span>YOUTUBE</span>
                        </span>
                      ) : isVid ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-violet-600/90 text-white font-mono text-[9px] font-bold shadow-sm">
                          <Video className="w-3 h-3" />
                          <span>VIDEO</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-600/90 text-white font-mono text-[9px] font-bold shadow-sm">
                          <ImageIcon className="w-3 h-3" />
                          <span>IMAGE</span>
                        </span>
                      )}
                    </div>

                    {/* Play / Preview Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      {isYt || isVid ? (
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-lg">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      ) : (
                        <Eye className="w-6 h-6 text-cyan-400" />
                      )}
                    </div>
                  </div>

                  {/* Info & Action Bar */}
                  <div className="p-3 space-y-2 border-t border-white/5">
                    <div className="truncate text-white text-[11px] font-medium" title={item.title || item.name}>
                      {item.title || item.name}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>{item.size ? `${Math.round(item.size / 1024)} KB` : isYt ? "YouTube Stream" : "Hosted Media"}</span>
                      <span>{item.uploadedAt}</span>
                    </div>

                    <div className="flex items-center space-x-1 pt-1">
                      {/* Copy URL */}
                      <button
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="flex-1 py-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 flex items-center justify-center space-x-1 transition-colors"
                        title="Copy direct URL"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-[9px] text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[9px]">URL</span>
                          </>
                        )}
                      </button>

                      {/* Copy Embed */}
                      <button
                        onClick={() => handleCopyEmbed(item)}
                        className="py-1.5 px-2 rounded-lg bg-white/[0.04] hover:bg-violet-500/20 text-gray-300 hover:text-violet-300 flex items-center justify-center space-x-1 transition-colors"
                        title="Copy HTML Embed Code"
                      >
                        {copiedId === `embed-${item.id}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Film className="w-3 h-3" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL 1: ADD YOUTUBE / VIDEO URL */}
      {showAddVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-red-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/25">
                  <YoutubeIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">ADD YOUTUBE / VIDEO ASSET</h3>
                  <p className="text-gray-400 text-[10px]">
                    Enter a YouTube video URL or hosted video with custom expressive thumbnail
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddVideoModal(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddYouTubeOrVideo} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1 uppercase tracking-wider text-[10px]">
                  Video Link (YouTube URL or Direct Video) *
                </label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-red-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 uppercase tracking-wider text-[10px]">
                  Video Title / Showcase Label
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. Runnova Autonomous AI Employee Live Voice Walkthrough"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-red-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 uppercase tracking-wider text-[10px]">
                  Expressive Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  value={customThumbnail}
                  onChange={(e) => setCustomThumbnail(e.target.value)}
                  placeholder="Leave empty to auto-extract high-res YouTube thumbnail"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-red-400 focus:outline-none"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  For YouTube videos, the high-res maxres thumbnail is auto-resolved automatically.
                </span>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 uppercase tracking-wider text-[10px]">
                  Description / Showcase Notes
                </label>
                <textarea
                  rows={2}
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Brief description of the demo or architecture featured in the video..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-red-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddVideoModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingVideo}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmittingVideo ? "Registering..." : "Add to Media Repository"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE PREVIEW (YOUTUBE / VIDEO / IMAGE) */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/15 p-6 overflow-hidden space-y-4 shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
              <div className="flex items-center space-x-2">
                {previewItem.type === "youtube" ? (
                  <YoutubeIcon className="w-5 h-5 text-red-500" />
                ) : previewItem.type.includes("video") ? (
                  <Video className="w-5 h-5 text-violet-400" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-cyan-400" />
                )}
                <span className="font-bold text-white text-sm truncate max-w-md">
                  {previewItem.title || previewItem.name}
                </span>
              </div>

              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Player / Image Area */}
            <div className="flex-1 min-h-[300px] max-h-[60vh] flex items-center justify-center bg-black/60 rounded-2xl overflow-hidden border border-white/10">
              {previewItem.type === "youtube" && previewItem.embedUrl ? (
                <iframe
                  src={previewItem.embedUrl}
                  title={previewItem.title || previewItem.name}
                  className="w-full h-[55vh] rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : previewItem.type.includes("video") ? (
                <video
                  src={previewItem.url}
                  controls
                  autoPlay
                  poster={previewItem.thumbnailUrl}
                  className="w-full max-h-[55vh] rounded-xl object-contain"
                />
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="max-h-[55vh] max-w-full object-contain rounded-xl"
                />
              )}
            </div>

            {/* Bottom Actions & Details */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] shrink-0 border-t border-white/10">
              <div className="text-gray-400 truncate max-w-md">
                <span>URL: </span>
                <span className="text-cyan-300 font-mono select-all">{previewItem.url}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyUrl(previewItem.url, previewItem.id)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white flex items-center space-x-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy Direct URL</span>
                </button>

                <button
                  onClick={() => handleCopyEmbed(previewItem)}
                  className="px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/30 flex items-center space-x-1.5 transition-colors"
                >
                  <Film className="w-3.5 h-3.5 text-violet-400" />
                  <span>Copy Embed Code</span>
                </button>

                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white"
                  title="Open source link in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
