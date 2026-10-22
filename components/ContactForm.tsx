"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { CtaButton } from "@/components/CtaButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/lib/webhooks";
import { projectTypes, type ProjectType } from "@/lib/plan-select";
import { cn } from "@/lib/utils";

const fieldClasses =
  "rounded-control border-line bg-transparent text-ink placeholder:text-dim focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40";

interface FormState {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  message: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.projectType) errors.projectType = "Choose what you need.";
  if (!values.message.trim()) errors.message = "Tell me a bit about it.";
  return errors;
}

interface ContactFormProps {
  /** Id of the heading that names the form. */
  labelledBy?: string;
  /** Preselects "What do you need?" — still editable. */
  initialProjectType?: ProjectType;
  /** Focus the first field on mount (modal). */
  autoFocus?: boolean;
  /** True once the visitor has typed anything (plan choice doesn't count). */
  onDirtyChange?: (dirty: boolean) => void;
  /** Extra content under the success message, e.g. a Close button. */
  successAction?: ReactNode;
  /** Lets a scrolling container keep the focused field above the keyboard. */
  onFieldFocus?: (field: HTMLElement) => void;
}

// Shared by the #contact section and the pricing modal. Field ids are
// prefixed so both instances can live on the page at once.
export function ContactForm({
  labelledBy,
  initialProjectType,
  autoFocus,
  onDirtyChange,
  successAction,
  onFieldFocus,
}: ContactFormProps) {
  const [values, setValues] = useState<FormState>({
    ...initialState,
    projectType: initialProjectType ?? "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) nameRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const dirty =
    status !== "success" &&
    Boolean(
      values.name || values.email || values.company || values.message.trim()
    );
  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");
    try {
      await submitContact({ ...values, honeypot });
      setStatus("success");
    } catch {
      setStatus("idle");
      setErrors({ message: "Something went wrong. Please try again." });
    }
  }

  const focusProps = onFieldFocus
    ? { onFocus: (e: { currentTarget: HTMLElement }) => onFieldFocus(e.currentTarget) }
    : {};

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-card border border-line bg-surface p-8"
        role="status"
      >
        <p className="font-display text-lg text-ink">
          Thanks — I&apos;ll get back to you soon.
        </p>
        {successAction}
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={labelledBy}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId("name")} className="label">
          Name
        </label>
        <Input
          ref={nameRef}
          id={fieldId("name")}
          name="name"
          type="text"
          required
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? fieldId("name-error") : undefined}
          className={fieldClasses}
          {...focusProps}
        />
        {errors.name && (
          <p id={fieldId("name-error")} className="text-xs text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId("email")} className="label">
          Email
        </label>
        <Input
          id={fieldId("email")}
          name="email"
          type="email"
          required
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? fieldId("email-error") : undefined}
          className={fieldClasses}
          {...focusProps}
        />
        {errors.email && (
          <p id={fieldId("email-error")} className="text-xs text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId("company")} className="label">
          Company (optional)
        </label>
        <Input
          id={fieldId("company")}
          name="company"
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
          className={fieldClasses}
          {...focusProps}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId("projectType")} className="label">
          What do you need?
        </label>
        <select
          id={fieldId("projectType")}
          name="projectType"
          required
          value={values.projectType}
          onChange={(e) => update("projectType", e.target.value)}
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={
            errors.projectType ? fieldId("projectType-error") : undefined
          }
          className={cn(
            "h-8 w-full rounded-control border bg-transparent px-2.5 text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40 md:text-sm",
            fieldClasses
          )}
          {...focusProps}
        >
          <option value="" disabled className="bg-surface">
            Select one
          </option>
          {projectTypes.map((option) => (
            <option key={option} value={option} className="bg-surface">
              {option}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <p
            id={fieldId("projectType-error")}
            className="text-xs text-destructive"
          >
            {errors.projectType}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor={fieldId("message")} className="label">
          Message
        </label>
        <Textarea
          id={fieldId("message")}
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? fieldId("message-error") : undefined
          }
          className={fieldClasses}
          {...focusProps}
        />
        {errors.message && (
          <p id={fieldId("message-error")} className="text-xs text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <div className="sm:col-span-2">
        <CtaButton
          type="submit"
          icon={Send}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </CtaButton>
        <p className="mt-3 text-xs text-dim">
          By sending this form you agree to our{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
