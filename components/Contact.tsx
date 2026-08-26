"use client";

import { useId, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CtaButton } from "@/components/CtaButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fadeUp } from "@/lib/motion";
import { submitContact } from "@/lib/webhooks";
import { cn } from "@/lib/utils";

const projectTypes = [
  "Website",
  "Automation system",
  "Full business system",
  "Not sure yet",
];

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

export function Contact() {
  const [values, setValues] = useState<FormState>(initialState);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );
  const formHeadingId = useId();

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

  return (
    <Section id="contact">
      <Reveal variants={fadeUp} className="max-w-2xl">
        <p className="label">Contact</p>
        <h2
          id={formHeadingId}
          className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]"
        >
          Start a project
        </h2>
        <p className="mt-3 text-lg text-dim">
          Tell me what you&apos;re building. I&apos;ll reply personally.
        </p>
      </Reveal>

      <Reveal variants={fadeUp} className="mt-10 max-w-2xl">
        {status === "success" ? (
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
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby={formHeadingId}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="label">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={fieldClasses}
              />
              {errors.name && (
                <p id="name-error" className="text-xs text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="label">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={fieldClasses}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="label">
                Company (optional)
              </label>
              <Input
                id="company"
                name="company"
                type="text"
                value={values.company}
                onChange={(e) => update("company", e.target.value)}
                className={fieldClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="projectType" className="label">
                What do you need?
              </label>
              <select
                id="projectType"
                name="projectType"
                required
                value={values.projectType}
                onChange={(e) => update("projectType", e.target.value)}
                aria-invalid={Boolean(errors.projectType)}
                aria-describedby={
                  errors.projectType ? "projectType-error" : undefined
                }
                className={cn(
                  "h-8 w-full rounded-control border bg-transparent px-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                  fieldClasses
                )}
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
                <p id="projectType-error" className="text-xs text-destructive">
                  {errors.projectType}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="message" className="label">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                required
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "message-error" : undefined
                }
                className={fieldClasses}
              />
              {errors.message && (
                <p id="message-error" className="text-xs text-destructive">
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
            </div>
          </form>
        )}
      </Reveal>
    </Section>
  );
}
