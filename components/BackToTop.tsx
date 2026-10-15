"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const SHOW_AFTER = 400;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="back-to-top fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 12 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
        >
          <button
            type="button"
            aria-label="Back to top"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
            }
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-ink transition-[transform,border-color,color] duration-[250ms] hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <ArrowUp size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
