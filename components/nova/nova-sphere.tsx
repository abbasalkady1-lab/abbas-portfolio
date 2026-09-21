"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export type NovaState = "IDLE" | "LISTENING" | "THINKING" | "SPEAKING" | "ERROR";

interface NovaSphereProps {
  state: NovaState;
  audioLevel?: number; // 0 to 1
}

export function NovaSphere({ state, audioLevel = 0 }: NovaSphereProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create Holographic Particle Sphere
    const geometry = new THREE.IcosahedronGeometry(1.5, 30);
    const count = geometry.attributes.position.count;
    const originalPositions = new Float32Array(geometry.attributes.position.array);

    // Particle material
    const material = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Outer quantum glow ring
    const ringGeo = new THREE.TorusGeometry(1.85, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    // Second orbital ring
    const ringGeo2 = new THREE.TorusGeometry(2.1, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const pos = geometry.attributes.position;

      // Color and dynamics based on state
      if (state === "IDLE") {
        material.color.setHex(0x00f0ff);
        ringMat.color.setHex(0x8b5cf6);
        particles.rotation.y = elapsedTime * 0.25;
        particles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;
        ring.rotation.z = elapsedTime * 0.4;
        ring2.rotation.y = elapsedTime * 0.3;

        // Gentle breathing deformation
        for (let i = 0; i < count; i++) {
          const u = i * 3;
          const ox = originalPositions[u];
          const oy = originalPositions[u + 1];
          const oz = originalPositions[u + 2];
          const noise = Math.sin(elapsedTime * 2 + ox * 2 + oy * 2) * 0.06;
          pos.setXYZ(i, ox + ox * noise, oy + oy * noise, oz + oz * noise);
        }
      } else if (state === "LISTENING") {
        material.color.setHex(0x00f0ff);
        ringMat.color.setHex(0x38bdf8);
        particles.rotation.y = elapsedTime * 0.8;
        ring.rotation.z = elapsedTime * 1.2;

        const soundBoost = audioLevel * 0.6;
        for (let i = 0; i < count; i++) {
          const u = i * 3;
          const ox = originalPositions[u];
          const oy = originalPositions[u + 1];
          const oz = originalPositions[u + 2];
          const noise = Math.sin(elapsedTime * 6 + ox * 3 + oz * 3) * (0.12 + soundBoost);
          pos.setXYZ(i, ox * (1 + noise), oy * (1 + noise), oz * (1 + noise));
        }
      } else if (state === "THINKING") {
        material.color.setHex(0x8b5cf6);
        ringMat.color.setHex(0x00f0ff);
        particles.rotation.y = elapsedTime * 2.2;
        particles.rotation.x = Math.sin(elapsedTime * 4) * 0.4;
        ring.rotation.x = elapsedTime * 2.5;
        ring2.rotation.y = -elapsedTime * 3.0;

        for (let i = 0; i < count; i++) {
          const u = i * 3;
          const ox = originalPositions[u];
          const oy = originalPositions[u + 1];
          const oz = originalPositions[u + 2];
          const noise = Math.sin(elapsedTime * 10 + oy * 5) * 0.18;
          pos.setXYZ(i, ox * (1 + noise), oy * (1 + noise), oz * (1 + noise));
        }
      } else if (state === "SPEAKING") {
        material.color.setHex(0x00f0ff);
        ringMat.color.setHex(0x38bdf8);
        particles.rotation.y = elapsedTime * 0.9;
        ring.rotation.z = elapsedTime * 0.8;

        const voiceWave = Math.sin(elapsedTime * 8) * 0.2 + (audioLevel || 0.3) * 0.4;
        for (let i = 0; i < count; i++) {
          const u = i * 3;
          const ox = originalPositions[u];
          const oy = originalPositions[u + 1];
          const oz = originalPositions[u + 2];
          const ripple = Math.sin(elapsedTime * 12 + ox * 4 + oy * 4) * voiceWave;
          pos.setXYZ(i, ox * (1 + ripple), oy * (1 + ripple), oz * (1 + ripple));
        }
      } else if (state === "ERROR") {
        material.color.setHex(0xf43f5e);
        ringMat.color.setHex(0xfb7185);
        particles.rotation.y = elapsedTime * 0.2;

        for (let i = 0; i < count; i++) {
          const u = i * 3;
          const ox = originalPositions[u];
          const oy = originalPositions[u + 1];
          const oz = originalPositions[u + 2];
          const jitter = (Math.random() - 0.5) * 0.08;
          pos.setXYZ(i, ox + jitter, oy + jitter, oz + jitter);
        }
      }

      pos.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 240;
      const h = container.clientHeight || 240;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [state, audioLevel]);

  return <div ref={mountRef} className="w-full h-full flex items-center justify-center pointer-events-none" />;
}
