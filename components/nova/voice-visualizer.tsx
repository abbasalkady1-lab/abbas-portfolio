"use client";

import React from "react";

interface VoiceVisualizerProps {
  isActive: boolean;
  audioLevel?: number; // 0 to 1
  barsCount?: number;
}

export function VoiceVisualizer({ isActive, audioLevel = 0, barsCount = 20 }: VoiceVisualizerProps) {
  const bars = Array.from({ length: barsCount });

  return (
    <div className="flex items-center justify-center space-x-1.5 h-8">
      {bars.map((_, i) => {
        // Calculate dynamic height based on sin wave and audio level
        const offset = (i / barsCount) * Math.PI * 2;
        const dynamicH = isActive
          ? Math.max(15, Math.min(100, Math.sin(offset + Date.now() / 200) * 40 + audioLevel * 70))
          : 12;

        return (
          <div
            key={i}
            className="w-1 rounded-full bg-gradient-to-t from-cyan-500 to-violet-400 transition-all duration-75 shadow-[0_0_8px_rgba(0,240,255,0.4)]"
            style={{
              height: `${dynamicH}%`,
              opacity: isActive ? 0.9 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
}
