"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUp, EASE } from "@/lib/motion";
import type { PortfolioItem } from "@/lib/portfolio-data";

function StatusChip({ status }: { status: PortfolioItem["status"] }) {
  const isLive = status === "Live";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-tag border px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em]",
        isLive
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-line bg-surface text-dim"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isLive ? "bg-accent" : "bg-dim"
        )}
        aria-hidden
      />
      {status}
    </span>
  );
}

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  // Falls back to a placeholder surface until a real screenshot exists at
  // the item's thumbnail path — starts showing automatically once it does.
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.div
      layout
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="group/card flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors duration-250 hover:border-accent"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-bg">
        {imageFailed ? (
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover/card:scale-[1.03]">
            <span className="font-mono text-sm uppercase tracking-[0.14em] text-dim">
              {item.title}
            </span>
          </div>
        ) : (
          <Image
            src={item.thumbnail}
            alt={`${item.title} preview`}
            fill
            sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover/card:scale-[1.03]"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-xl font-medium">{item.title}</h3>
          <StatusChip status={item.status} />
        </div>

        <p className="text-sm text-dim">{item.description}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          {item.tags.map((tag, index) => (
            <span
              key={`${item.id}-tag-${index}`}
              className="rounded-tag border border-line px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-dim"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link mt-2 inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:text-accent"
        >
          Visit site
          <ArrowUpRight
            size={14}
            strokeWidth={1.5}
            className="transition-transform duration-200 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </a>
      </div>
    </motion.div>
  );
}
