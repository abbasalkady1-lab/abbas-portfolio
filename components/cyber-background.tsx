"use client";

import React, { useEffect, useRef } from "react";

interface CyberBackgroundProps {
  theme?: "light" | "dark";
}

export function CyberBackground({ theme = "light" }: CyberBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const isLight = theme === "light";
    // Sparse, refined particle count for crisp technical ambience
    const particleCount = Math.min(Math.floor((width * height) / 48000), 22);

    const lightColors = ["#0A84FF", "#6D5DFB", "#00C2FF"];
    const darkColors = ["#00C2FF", "#0A84FF", "#7C3AED"];
    const colors = isLight ? lightColors : darkColors;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      color: string;
      phase: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.2 + 0.6,
        baseAlpha: isLight ? Math.random() * 0.12 + 0.04 : Math.random() * 0.18 + 0.08,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = width * 0.7;
    let mouseY = height * 0.3;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let tick = 0;

    const render = () => {
      tick += 0.01;
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Subtle dynamic radial glow following mouse
      const gradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        15,
        mouseX,
        mouseY,
        width * 0.4
      );

      if (isLight) {
        gradient.addColorStop(0, "rgba(10, 132, 255, 0.035)");
        gradient.addColorStop(0.5, "rgba(109, 93, 251, 0.015)");
        gradient.addColorStop(1, "rgba(247, 249, 252, 0)");
      } else {
        gradient.addColorStop(0, "rgba(0, 194, 255, 0.04)");
        gradient.addColorStop(0.5, "rgba(109, 93, 251, 0.02)");
        gradient.addColorStop(1, "rgba(7, 17, 31, 0)");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render micro-particles with organic breathing
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.baseAlpha + Math.sin(tick + p.phase) * 0.03;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.02, currentAlpha);
        ctx.fill();

        // Connect nearby particles with faint lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 130) * (isLight ? 0.04 : 0.06);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Layer 1: Ambient Radial Bursts for Deep Depth */}
      {/* 1A. Hero AI Visual Light Burst (Top Right) */}
      <div className="absolute -top-[15%] -right-[10%] w-[650px] sm:w-[850px] h-[650px] sm:h-[850px] rounded-full bg-gradient-to-br from-brand-blue/10 via-brand-cyan/5 to-transparent dark:from-brand-blue/20 dark:via-brand-cyan/10 blur-[130px] opacity-70" />

      {/* 1B. Hero Editorial Glow (Top Left) */}
      <div className="absolute -top-[10%] -left-[10%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-gradient-to-tr from-brand-violet/8 via-brand-blue/4 to-transparent dark:from-brand-violet/15 dark:via-brand-deepBlue/10 blur-[120px] opacity-60" />

      {/* 1C. Mid-Page Subtle Accent Mesh */}
      <div className="absolute top-[45%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-brand-cyan/4 via-brand-emerald/3 to-transparent dark:from-brand-cyan/8 dark:via-brand-blue/6 blur-[140px] opacity-50" />

      {/* Layer 2: Technical Precision Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,18,32,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,18,32,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:38px_38px]" />

      {/* Layer 3: Micro Dot Intersections */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(11,18,32,0.06)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:38px_38px]" />

      {/* Layer 4: Canvas Particles & Mouse-Tracking Glow */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
