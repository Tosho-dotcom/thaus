"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  number?: string;
  title: string;
}

/** A section counts as active once its top passes this line from the viewport top. */
const ACTIVE_OFFSET = 140;

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}

function TocLink({
  item,
  active,
  onClick,
}: {
  item: TocItem;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={`#${item.id}`}
      onClick={onClick}
      aria-current={active ? "location" : undefined}
      className={cn(
        "group/toc flex gap-3 border-l py-1.5 pl-4 text-sm leading-snug transition-colors duration-200",
        active
          ? "border-accent text-accent"
          : "border-line text-dim hover:border-dim hover:text-ink"
      )}
    >
      <span className="w-5 shrink-0 font-mono text-[0.7rem] leading-[1.6]">
        {item.number ?? "→"}
      </span>
      <span>{item.title}</span>
    </a>
  );
}

/** Sticky sidebar contents, desktop only (>= lg). */
export function BlueprintToc({ items }: { items: TocItem[] }) {
  const [ids] = useState(() => items.map((item) => item.id));
  const active = useActiveSection(ids);

  return (
    <nav aria-label="Contents" className="sticky top-10">
      <p className="label mb-4">Contents</p>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.id}>
            <TocLink item={item} active={item.id === active} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Collapsible contents block shown at the top of the article below lg. */
export function BlueprintTocMobile({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Contents"
      className="rounded-card border border-line bg-surface lg:hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="blueprint-toc-mobile"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="label text-ink">Contents</span>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          aria-hidden
          className={cn(
            "text-dim transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180"
          )}
        />
      </button>
      <ul
        id="blueprint-toc-mobile"
        hidden={!open}
        className="flex flex-col border-t border-line px-5 py-4"
      >
        {items.map((item) => (
          <li key={item.id}>
            <TocLink item={item} onClick={() => setOpen(false)} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
