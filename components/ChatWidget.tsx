"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Send, X } from "lucide-react";

type Role = "user" | "assistant";
type ChatMessage = { id: string; role: Role; text: string };

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  text: "Hi. I can answer questions about Thaus — services, pricing, timelines. What are you working on?",
};

const QUICK_QUESTIONS = [
  "What do you build?",
  "How much does it cost?",
  "How long does a project take?",
  "Can I see examples?",
];

const FALLBACK_REPLY =
  "Sorry, something went wrong. Please try again or use the contact form.";
const MAX_LENGTH = 500;
const COUNTER_FROM = 400;
const MAX_INPUT_HEIGHT = 96; // 4 lines (20px) + 16px padding
const EASE = [0.22, 1, 0.36, 1] as const;

const SESSION_KEY = "thaus-chat-session";
const MESSAGES_KEY = "thaus-chat-messages";
const PULSE_KEY = "thaus-chat-pulsed";

function readStorage(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode, quota); chat still works in memory
  }
}

function newId() {
  return crypto.randomUUID();
}

function getSessionId(): string {
  const existing = readStorage(SESSION_KEY);
  if (existing) return existing;
  const id = newId();
  writeStorage(SESSION_KEY, id);
  return id;
}

function loadMessages(): ChatMessage[] {
  const raw = readStorage(MESSAGES_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m.id === "string" &&
        typeof m.text === "string" &&
        (m.role === "user" || m.role === "assistant"),
    );
  } catch {
    return [];
  }
}

// URLs and email addresses become links; everything else stays plain text.
const LINK_RE =
  /(https?:\/\/[^\s<>"']+|[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)/g;
const TRAILING_PUNCT_RE = /[.,;:!?)\]]+$/;

function linkify(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(LINK_RE)) {
    const start = match.index ?? 0;
    let token = match[0];
    const trailing = token.match(TRAILING_PUNCT_RE)?.[0] ?? "";
    if (trailing) token = token.slice(0, -trailing.length);
    if (start > last) nodes.push(line.slice(last, start));

    const isEmail = !token.startsWith("http");
    nodes.push(
      <a
        key={start}
        href={isEmail ? `mailto:${token}` : token}
        {...(isEmail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        className="break-words underline underline-offset-2 hover:opacity-80"
      >
        {token}
      </a>,
    );
    last = start + token.length;
  }
  if (last < line.length) nodes.push(line.slice(last));
  return nodes;
}

function MessageText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {linkify(line)}
        </Fragment>
      ))}
    </>
  );
}

export default function ChatWidget() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [pulse, setPulse] = useState(false);

  const sessionIdRef = useRef<string>("");
  const sendingRef = useRef(false);
  const hydratedRef = useRef(false);
  const wasOpenRef = useRef(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Restore conversation after mount (sessionStorage is client-only).
  useEffect(() => {
    sessionIdRef.current = getSessionId();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from sessionStorage
    setMessages(loadMessages());
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    writeStorage(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  // One-time pulse ring per browser session.
  useEffect(() => {
    if (reduceMotion || readStorage(PULSE_KEY)) return;
    const start = setTimeout(() => {
      writeStorage(PULSE_KEY, "1");
      setPulse(true);
    }, 3000);
    const stop = setTimeout(() => setPulse(false), 5000);
    return () => {
      clearTimeout(start);
      clearTimeout(stop);
    };
  }, [reduceMotion]);

  // Let global CSS hide BackToTop / lock scroll while the mobile sheet is open.
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.setAttribute("data-chat-open", "");
    else root.removeAttribute("data-chat-open");
    return () => root.removeAttribute("data-chat-open");
  }, [open]);

  // Mobile: keep the panel exactly above the on-screen keyboard.
  useEffect(() => {
    if (!open) return;
    const vv = window.visualViewport;
    const mq = window.matchMedia("(max-width: 639px)");
    const panel = panelRef.current;
    if (!vv || !panel) return;
    const reset = () => {
      panel.style.height = "";
      panel.style.top = "";
    };
    const sync = () => {
      if (!mq.matches) return reset();
      panel.style.height = `${vv.height}px`;
      panel.style.top = `${vv.offsetTop}px`;
      const el = scrollRef.current;
      if (el && document.activeElement === inputRef.current) el.scrollTop = el.scrollHeight;
    };
    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
      reset();
    };
  }, [open]);

  // Focus management: input when opened, launcher when closed.
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      inputRef.current?.focus({ preventScroll: true });
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      launcherRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Auto-scroll to newest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, waiting, open]);

  // Grow textarea up to 4 lines.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, [input, open]);

  const send = useCallback(async (raw: string) => {
    const text = raw.trim().slice(0, MAX_LENGTH);
    if (!text || sendingRef.current) return;
    sendingRef.current = true;
    setWaiting(true);
    setInput("");
    setMessages((prev) => [...prev, { id: newId(), role: "user", text }]);

    let replyText = FALLBACK_REPLY;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current, message: text }),
      });
      const data: unknown = await res.json().catch(() => null);
      const r = (data as { reply?: unknown } | null)?.reply;
      if (typeof r === "string" && r.trim()) replyText = r;
    } catch {
      // network failure: fall through to the generic message
    }

    setMessages((prev) => [...prev, { id: newId(), role: "assistant", text: replyText }]);
    sendingRef.current = false;
    setWaiting(false);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  };

  const goToContact = () => {
    setOpen(false);
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  const hasUserMessage = messages.some((m) => m.role === "user");
  const canSend = !waiting && input.trim().length > 0;
  const panelTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: EASE };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Thaus assistant chat"
            className="chat-panel fixed inset-0 z-[60] flex flex-col bg-surface sm:inset-auto sm:right-4 sm:bottom-[144px] sm:h-[min(560px,calc(100dvh-160px))] sm:w-[380px] sm:rounded-xl sm:border sm:border-line sm:shadow-[0_12px_40px_rgba(0,0,0,0.45)] md:right-5 md:bottom-[152px] md:h-[min(560px,calc(100dvh-168px))]"
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: 12, scale: 0.98 }
            }
            transition={panelTransition}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-widest text-ink">
                  Thaus · Assistant
                </span>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-dim transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <X size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </header>

            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {[GREETING, ...messages].map((m) => (
                <div
                  key={m.id}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-xl bg-accent px-3 py-2 text-sm leading-5 text-white"
                        : "max-w-[85%] rounded-xl border border-line bg-surface-hover px-3 py-2 text-sm leading-5 text-ink"
                    }
                  >
                    <MessageText text={m.text} />
                  </div>
                </div>
              ))}

              {!hasUserMessage && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={waiting}
                      onClick={() => void send(q)}
                      className="rounded-lg border border-line px-3 py-1.5 text-left text-xs text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {waiting && (
                <div className="flex justify-start" aria-label="Assistant is typing">
                  <div className="flex items-center gap-1 rounded-xl border border-line bg-surface-hover px-3 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-dim"
                        animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-line px-4 pt-3 pb-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  rows={1}
                  maxLength={MAX_LENGTH}
                  placeholder="Ask a question…"
                  aria-label="Message"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  onFocus={() => {
                    if (!window.matchMedia("(max-width: 639px)").matches) return;
                    // wait for the keyboard to resize the viewport
                    setTimeout(() => {
                      const el = scrollRef.current;
                      if (el) el.scrollTop = el.scrollHeight;
                      inputRef.current?.scrollIntoView({ block: "nearest" });
                    }, 300);
                  }}
                  className="chat-input max-h-24 min-h-9 flex-1 resize-none rounded-[10px] border border-line bg-bg px-3 py-2 text-sm leading-5 text-ink placeholder:text-dim focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Send message"
                  disabled={!canSend}
                  onClick={() => void send(input)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={16} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-2 flex items-start justify-between gap-3 text-[11px] leading-4 text-dim">
                <p>
                  AI assistant — may make mistakes. Conversations may be saved to improve
                  the service.{" "}
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      goToContact();
                    }}
                    className="underline underline-offset-2 hover:text-ink"
                  >
                    Contact form
                  </a>
                </p>
                {input.length > COUNTER_FROM && (
                  <span className="shrink-0 font-mono">
                    {input.length}/{MAX_LENGTH}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed right-3 bottom-[76px] z-50 md:right-5 md:bottom-[84px]">
        {pulse && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-accent"
            initial={{ opacity: 0.45, scale: 1 }}
            animate={{ opacity: 0, scale: 1.7 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />
        )}
        <button
          ref={launcherRef}
          type="button"
          aria-label={open ? "Close chat" : "Open chat"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white transition-[transform,background-color] duration-[250ms] hover:-translate-y-0.5 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {open ? (
            <X size={24} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <MessageSquare size={24} strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  );
}
