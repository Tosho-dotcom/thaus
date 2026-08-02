"use client";

import { useEffect, useRef } from "react";

const LINK_DISTANCE = 140;
/** one node per this many px² of canvas, clamped — the hero field is full-bleed */
const NODE_AREA = 16000;
const NODE_MIN = 30;
const NODE_MAX = 120;
const ACCENT = "#3B5BFF";

/**
 * prefers-reduced-motion fallback for HeroGraphic: draws the node network
 * once (nodes + proximity links) with no animation loop and no interactivity.
 */
export function StaticNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const draw = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth ?? canvas.clientWidth;
      const height = parent?.clientHeight ?? canvas.clientHeight;
      if (width === 0 || height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const count = Math.min(
        NODE_MAX,
        Math.max(NODE_MIN, Math.round((width * height) / NODE_AREA))
      );
      const nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 1.6,
      }));

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = ACCENT;
            ctx.globalAlpha = 0.22 * (1 - dist / LINK_DISTANCE);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 0.7;
      ctx.fillStyle = ACCENT;
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className ? `${className} h-full w-full` : "h-full w-full"}
    />
  );
}
