"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { CtaButton } from "@/components/CtaButton";
import { ContactForm } from "@/components/ContactForm";
import { EASE } from "@/lib/motion";
import type { ProjectType } from "@/lib/plan-select";

export type ModalPlan = Extract<ProjectType, "Foundation" | "Full Haus" | "Custom">;

const planSummaries: Record<ModalPlan, string> = {
  Foundation: "$990 launch price + $29/mo hosting",
  "Full Haus": "$1,490 setup + $249/mo",
  Custom: "From $3,000 · we'll schedule a call",
};

const MOBILE_QUERY = "(max-width: 639px)";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const noopSubscribe = () => () => {};

interface ContactModalProps {
  /** The plan to preselect; null keeps the modal closed. */
  plan: ModalPlan | null;
  onClose: () => void;
  /** Element that opened the modal — gets focus back on close. */
  returnFocusTo: HTMLElement | null;
}

export function ContactModal({ plan, onClose, returnFocusTo }: ContactModalProps) {
  // portal target only exists on the client; false during SSR + hydration
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const reduceMotion = useReducedMotion();
  const open = plan !== null;

  const [dirty, setDirty] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const summaryId = useId();

  const close = useCallback(() => {
    setConfirmDiscard(false);
    setDirty(false);
    onClose();
  }, [onClose]);

  // Lock page scroll, hide the chat launcher / back-to-top (see globals.css),
  // and hand focus back to the trigger on close.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const { body } = document;
    const scrollbar = window.innerWidth - root.clientWidth;
    root.setAttribute("data-contact-modal-open", "");
    body.style.paddingRight = scrollbar ? `${scrollbar}px` : "";
    return () => {
      root.removeAttribute("data-contact-modal-open");
      body.style.paddingRight = "";
      returnFocusTo?.focus({ preventScroll: true });
    };
  }, [open, returnFocusTo]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmDiscard) setConfirmDiscard(false);
      else close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, confirmDiscard, close]);

  // Mobile: same as the chat sheet — size the panel to the visual viewport
  // so the on-screen keyboard never covers the fields.
  useEffect(() => {
    if (!open) return;
    const vv = window.visualViewport;
    const mq = window.matchMedia(MOBILE_QUERY);
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

  const onFieldFocus = useCallback((field: HTMLElement) => {
    if (!window.matchMedia(MOBILE_QUERY).matches) return;
    // wait for the keyboard to resize the viewport
    setTimeout(() => field.scrollIntoView({ block: "nearest" }), 300);
  }, []);

  const onBackdropClick = () => {
    if (dirty) setConfirmDiscard(true);
    else close();
  };

  // focus trap
  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    ).filter((el) => el.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!isClient) return null;

  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  const hidden = isMobile ? { opacity: 0, y: 24 } : { opacity: 0, scale: 0.98 };
  const shown = isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 };
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.25, ease: EASE };

  return createPortal(
    <AnimatePresence>
      {plan && (
        <motion.div
          key="contact-modal"
          className="fixed inset-0 z-[80]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onBackdropClick}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center sm:p-6">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={summaryId}
              onKeyDown={onPanelKeyDown}
              className="contact-modal pointer-events-auto fixed inset-x-0 top-0 flex flex-col bg-surface sm:relative sm:inset-auto sm:max-h-[calc(100dvh-48px)] sm:w-full sm:max-w-[560px] sm:rounded-card sm:border sm:border-line sm:shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
              initial={reduceMotion ? false : hidden}
              animate={shown}
              exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : hidden}
              transition={transition}
            >
              <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 py-5">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-accent">
                    Start a project
                  </p>
                  <h2
                    id={titleId}
                    className="mt-2 font-display text-xl font-medium"
                  >
                    {plan}
                  </h2>
                  <p id={summaryId} className="mt-1.5 font-mono text-xs leading-relaxed text-dim">
                    {planSummaries[plan]}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className="-mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-dim transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <X size={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </header>

              {confirmDiscard && (
                <div
                  role="alert"
                  className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-accent/30 bg-accent/10 px-6 py-3"
                >
                  <p className="text-sm text-ink">Discard your message?</p>
                  <div className="flex gap-2">
                    <CtaButton
                      type="button"
                      autoFocus
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDiscard(false)}
                    >
                      Keep editing
                    </CtaButton>
                    <CtaButton type="button" size="sm" onClick={close}>
                      Discard
                    </CtaButton>
                  </div>
                </div>
              )}

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6"
              >
                <ContactForm
                  key={plan}
                  labelledBy={titleId}
                  initialProjectType={plan}
                  autoFocus
                  onDirtyChange={setDirty}
                  onFieldFocus={onFieldFocus}
                  successAction={
                    <CtaButton
                      type="button"
                      variant="outline"
                      size="sm"
                      autoFocus
                      onClick={close}
                      className="mt-5"
                    >
                      Close
                    </CtaButton>
                  }
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
