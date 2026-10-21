"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="my-6 overflow-hidden rounded-card border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="label text-[0.65rem]">{language ?? "text"}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-tag px-2 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-colors",
            copied ? "text-accent" : "text-dim hover:text-ink"
          )}
        >
          {copied ? (
            <Check size={14} strokeWidth={1.5} aria-hidden />
          ) : (
            <Copy size={14} strokeWidth={1.5} aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[0.82rem] leading-relaxed text-ink">
        <code>{code}</code>
      </pre>
      <span className="sr-only" role="status">
        {copied ? "Code copied to clipboard" : ""}
      </span>
    </div>
  );
}
