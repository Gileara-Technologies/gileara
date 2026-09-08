"use client";

import { useState } from "react";

/**
 * Newsletter signup form — small, editorial, with three states:
 *   1. idle     — show the email input
 *   2. sending  — disable the button + show a spinner
 *   3. success  — replace the form with a thank-you line
 *   4. error    — show a soft error message inline
 *
 * Honeypot: a hidden input that real users never see/fill. Bots
 * tend to fill every input they find, so if it's non-empty we
 * silently no-op on the server (returns 200, never stores).
 *
 * Cooldown: 2 seconds after a successful submission, even if the
 * user clicks again, we don't refire. Just a belt-and-braces.
 */

type FormState = "idle" | "sending" | "success" | "error";

interface NewsletterFormProps {
  /** Caption shown above the input (e.g. "Stay in touch") */
  eyebrow?: string;
  /** Headline above the input (e.g. "One email a month, never more.") */
  headline?: string;
  /** Source label, written into the success message */
  source?: string;
  /** Variant controls padding + background; default is for use on light surface. */
  variant?: "surface" | "dark";
  /** Optional className passed to the outer wrapper */
  className?: string;
}

export default function NewsletterForm({
  eyebrow = "STAY IN TOUCH",
  headline = "One email a month, never more.",
  source = "footer",
  variant = "surface",
  className,
}: NewsletterFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const isDark = variant === "dark";
  const labelClass = isDark ? "text-accent-bright" : "text-accent-bright";
  const headlineClass = isDark ? "text-on-background" : "text-on-surface";
  const inputBg = isDark
    ? "bg-surface-container-low border-on-background/15"
    : "bg-surface-container border-on-surface/15";
  const buttonClass =
    "bg-accent-bright text-background hover:bg-accent-cyan transition-colors duration-200";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending" || state === "success") return;

    setState("sending");
    setError(null);

    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot, source }),
      });

      if (res.status === 404) {
        // Feature disabled. Show success anyway to avoid tipping off
        // anyone that the form is gated.
        setState("success");
        return;
      }

      if (res.status === 400) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error === "invalid email" ? "Please enter a valid email." : "Something looked off. Try again.");
        setState("error");
        return;
      }

      if (!res.ok) {
        setError("Something went wrong on our end. Please try again later.");
        setState("error");
        return;
      }

      setState("success");
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        className={`${className ?? ""} border-t border-b ${isDark ? "border-on-background/15" : "border-on-surface/15"} py-8`}
        role="status"
        aria-live="polite"
      >
        <div className={`font-mono text-label uppercase tracking-[0.2em] mb-2 ${labelClass}`}>
          ✓ Subscribed
        </div>
        <p className={`font-serif text-xl md:text-2xl leading-snug ${headlineClass}`}>
          Thanks — you&apos;re on the list. We&apos;ll send the next one to <span className="text-accent-bright">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={className}
    >
      <div className={`font-mono text-label uppercase tracking-[0.2em] mb-2 ${labelClass}`}>
        {eyebrow}
      </div>
      <p className={`font-serif text-xl md:text-2xl leading-snug mb-5 ${headlineClass}`}>
        {headline}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor={`newsletter-email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@business.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          disabled={state === "sending"}
          className={`flex-1 ${inputBg} border rounded-pill px-5 py-3 text-base text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:border-accent-bright disabled:opacity-50`}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className={`${buttonClass} rounded-pill px-6 py-3 text-sm font-semibold disabled:opacity-50`}
        >
          {state === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      {/* Honeypot — hidden from real users, visible to most bots */}
      <div aria-hidden="true" className="absolute opacity-0 pointer-events-none -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`newsletter-company-${source}`}>Company (leave blank)</label>
        <input
          id={`newsletter-company-${source}`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-on-surface-variant mt-3">
          {error}
        </p>
      ) : (
        <p className="text-xs text-on-surface-variant/70 mt-3">
          One email a month with a fresh insight, a service tip, and one thing worth your time. Unsubscribe with one click.
        </p>
      )}
    </form>
  );
}
