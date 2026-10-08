"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, type Transition } from "framer-motion";

import { auditQuestions, auditReportWhy, auditSection, type ServiceId } from "@/content/audit";
import { servicePackages } from "@/content/packages";
import { scoreAudit, type AuditResult } from "@/lib/audit-scoring";
import MagneticButton from "@/components/MagneticButton";
import NewsletterForm from "@/components/NewsletterForm";

/**
 * AuditTool — the interactive Operations Audit.
 *
 * Three views driven by one state machine:
 *   start     → "Start the audit"
 *   questions → step wizard over auditQuestions (Back / Next, one radio
 *               group per question, answers kept as questionId → optionId)
 *   report    → scoreAudit(answers), then name/tagline/why for the primary
 *               (and secondary when it exists), rendered from packages.ts
 *               + audit.ts — never duplicated here.
 *
 * Accessibility:
 *   - Native radios inside a labelled radiogroup: Tab reaches the group,
 *     arrows move between options, Space selects, Enter also selects (the
 *     one key native radios don't handle outside a form).
 *   - Each step change moves focus to that step's heading (or the start
 *     button) via a ref flag, so screen readers announce the new question.
 *     Focus never moves on first paint — page load keeps its natural focus.
 *   - Progress chrome is aria-hidden; a polite status line carries
 *     "Question N of 5" instead.
 *
 * Motion: Framer Motion fades/translates run under the app-wide
 * MotionConfig (reducedMotion="user"), and every CSS transition is
 * gated with motion-safe: so prefers-reduced-motion is honoured twice.
 */

type View = "start" | "questions" | "report";

const TOTAL = auditQuestions.length;

/** "1" → "01" for the mono progress chrome. */
const pad = (n: number): string => String(n).padStart(2, "0");

const STEP_TRANSITION: Transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };

const headingFocusClass =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright";

const secondaryButtonClass =
  "group inline-flex items-center gap-2 rounded-pill border border-on-background/20 px-6 py-3 text-sm font-medium text-on-background transition-colors motion-safe:duration-300 hover:border-accent-bright hover:text-accent-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest";

export default function AuditTool() {
  const [view, setView] = useState<View>("start");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AuditResult | null>(null);

  const startButtonRef = useRef<HTMLButtonElement>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const reportHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldMoveFocus = useRef(false);

  // Focus follows the wizard: every step change lands the reader on the
  // heading of the new step. The ref flag keeps the very first render from
  // stealing focus on page load.
  useEffect(() => {
    if (!shouldMoveFocus.current) return;
    shouldMoveFocus.current = false;
    if (view === "start") startButtonRef.current?.focus();
    else if (view === "report") reportHeadingRef.current?.focus();
    else questionHeadingRef.current?.focus();
  }, [view, index]);

  const question = auditQuestions[index];
  const answered = answers[question.id] !== undefined;

  const primaryId: ServiceId | null = result ? result.primary : null;
  const secondaryId: ServiceId | null = result ? result.secondary : null;
  const primaryPkg = primaryId ? servicePackages.find((pkg) => pkg.id === primaryId) : undefined;
  const secondaryPkg = secondaryId ? servicePackages.find((pkg) => pkg.id === secondaryId) : undefined;
  const primaryWhy = primaryId ? auditReportWhy[primaryId] : null;
  const secondaryWhy = secondaryId ? auditReportWhy[secondaryId] : null;

  const selectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleStart = () => {
    shouldMoveFocus.current = true;
    setIndex(0);
    setView("questions");
  };

  const handleBack = () => {
    shouldMoveFocus.current = true;
    if (index === 0) setView("start");
    else setIndex(index - 1);
  };

  const handleNext = () => {
    if (!answered) return; // aria-disabled guard — the hint explains why
    shouldMoveFocus.current = true;
    if (index < TOTAL - 1) {
      setIndex(index + 1);
      return;
    }
    setResult(scoreAudit(answers));
    setView("report");
  };

  const handleRestart = () => {
    shouldMoveFocus.current = true;
    setAnswers({});
    setResult(null);
    setIndex(0);
    setView("start");
  };

  // Native radios select on Space but not Enter (that's a form-submit key),
  // so Enter gets the same treatment here.
  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    questionId: string,
    optionId: string,
  ) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    selectOption(questionId, optionId);
  };

  return (
    <div className="rounded-2xl border border-on-background/10 bg-surface-container-lowest p-6 md:p-10">
      {/* ── Start ─────────────────────────────────────────────── */}
      {view === "start" && (
        <motion.div
          key="start"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={STEP_TRANSITION}
        >
          <div className="mb-8 flex items-baseline gap-4" aria-hidden="true">
            <span className="font-serif text-display-md leading-none text-on-background/[0.08] select-none">
              {pad(TOTAL)}
            </span>
            <span className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant">
              Questions
            </span>
          </div>
          <button
            ref={startButtonRef}
            type="button"
            onClick={handleStart}
            className="group inline-flex items-center justify-center gap-3 rounded-pill bg-accent-bright px-8 py-4 font-medium text-background transition-colors motion-safe:duration-300 hover:bg-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest"
          >
            {auditSection.startLabel}
            <span
              className="material-symbols-outlined text-xl transition-transform motion-safe:duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </button>
        </motion.div>
      )}

      {/* ── Questions ─────────────────────────────────────────── */}
      {view === "questions" && (
        <motion.div
          key={`question-${index}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={STEP_TRANSITION}
        >
          {/* Progress chrome — decorative; the status line below carries it for AT */}
          <div className="mb-7 flex items-center justify-between gap-6" aria-hidden="true">
            <span className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant">
              {pad(index + 1)} / {pad(TOTAL)}
            </span>
            <div className="flex gap-1.5">
              {auditQuestions.map((q, i) => (
                <span
                  key={q.id}
                  className={`h-1 w-8 rounded-full ${i <= index ? "bg-accent-bright" : "bg-on-background/15"}`}
                />
              ))}
            </div>
          </div>

          <p role="status" className="sr-only">
            Question {index + 1} of {TOTAL}
          </p>

          <h3
            id="audit-question-heading"
            ref={questionHeadingRef}
            tabIndex={-1}
            className={`mb-6 font-serif text-2xl leading-snug text-on-background md:text-3xl ${headingFocusClass}`}
          >
            {question.text}
          </h3>

          <div role="radiogroup" aria-labelledby="audit-question-heading" className="space-y-3">
            {question.options.map((option) => {
              const optionLabelId = `audit-option-${question.id}-${option.id}`;
              const isSelected = answers[question.id] === option.id;
              return (
                <label key={option.id} className="block cursor-pointer">
                  <input
                    type="radio"
                    name={`audit-${question.id}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => selectOption(question.id, option.id)}
                    onKeyDown={(event) => handleOptionKeyDown(event, question.id, option.id)}
                    // Question + option text together, so the answer is never
                    // announced without its context.
                    aria-labelledby={`audit-question-heading ${optionLabelId}`}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex items-start gap-4 rounded-xl border p-4 transition-colors motion-safe:duration-200 md:p-5 ${
                      isSelected
                        ? "border-accent-bright bg-accent-bright/10"
                        : "border-on-background/15 bg-surface-container hover:border-on-background/35"
                    } peer-focus-visible:ring-2 peer-focus-visible:ring-accent-bright peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-container-lowest`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors motion-safe:duration-200 ${
                        isSelected ? "border-accent-bright" : "border-on-background/30"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${isSelected ? "bg-accent-bright" : "bg-transparent"}`}
                      />
                    </span>
                    <span
                      id={optionLabelId}
                      className={`text-base leading-relaxed md:text-lg ${
                        isSelected ? "text-on-background" : "text-on-surface-variant"
                      }`}
                    >
                      {option.label}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          {/* Always-mounted hint so the status role exists before its text does */}
          <p
            role="status"
            aria-live="polite"
            className={`mt-4 min-h-[1rem] text-xs ${answered ? "text-transparent" : "text-on-surface-variant"}`}
          >
            {answered ? "\u00A0" : "Choose an answer to continue."}
          </p>

          <div className="mt-4 flex items-center justify-between gap-4 border-t border-on-background/10 pt-6">
            <button type="button" onClick={handleBack} className={secondaryButtonClass}>
              <span
                className="material-symbols-outlined text-lg transition-transform motion-safe:duration-300 group-hover:-translate-x-0.5"
                aria-hidden="true"
              >
                arrow_back
              </span>
              {auditSection.backLabel}
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-disabled={!answered}
              className={`group inline-flex items-center gap-2 rounded-pill px-7 py-3 text-sm font-semibold transition-colors motion-safe:duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest ${
                answered
                  ? "bg-accent-bright text-background hover:bg-accent-cyan"
                  : "cursor-not-allowed bg-on-background/15 text-on-background/50"
              }`}
            >
              {auditSection.nextLabel}
              <span
                className="material-symbols-outlined text-lg transition-transform motion-safe:duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Report ────────────────────────────────────────────── */}
      {view === "report" && result && primaryPkg && primaryWhy && (
        <motion.div
          key="report"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={STEP_TRANSITION}
        >
          <p className="mb-4 font-mono text-label uppercase tracking-[0.2em] text-accent-bright">
            {auditSection.reportEyebrow}
          </p>

          <h3
            id="audit-report-heading"
            ref={reportHeadingRef}
            tabIndex={-1}
            className={`mb-3 font-serif text-display-sm text-on-background ${headingFocusClass}`}
          >
            <span className="sr-only">{auditSection.reportEyebrow}: </span>
            {primaryPkg.name}
          </h3>
          <p className="mb-5 font-serif text-xl italic leading-snug text-accent-cyan md:text-2xl">
            {primaryPkg.tagline}
          </p>
          <p className="mb-8 max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
            {primaryWhy}
          </p>

          <div className="mb-10 flex flex-wrap items-center gap-4">
            <MagneticButton href={`/services/${primaryPkg.slug}`} variant="primary" size="md">
              See how this fits
            </MagneticButton>
            <MagneticButton href="/contact" variant="secondary" size="md">
              Talk through it
            </MagneticButton>
          </div>

          {secondaryPkg && secondaryWhy && (
            <div className="mb-10 border-t border-on-background/10 pt-6">
              <p className="mb-4 font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant">
                Another place to start
              </p>
              <div className="rounded-xl border border-on-background/15 bg-surface-container p-5">
                <Link
                  href={`/services/${secondaryPkg.slug}`}
                  className="group inline-flex items-center gap-2"
                >
                  <span className="font-serif text-xl text-on-background transition-colors motion-safe:duration-300 group-hover:text-accent-bright">
                    {secondaryPkg.name}
                  </span>
                  <span
                    className="material-symbols-outlined text-lg text-on-surface-variant transition-all motion-safe:duration-300 group-hover:translate-x-1 group-hover:text-accent-bright"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </Link>
                <p className="mt-2 mb-3 text-sm leading-relaxed text-on-surface-variant">
                  {secondaryPkg.tagline}
                </p>
                <p className="text-sm leading-relaxed text-on-surface">{secondaryWhy}</p>
              </div>
            </div>
          )}

          {/* Email capture — reuses NewsletterForm (honeypot + /api/newsletter) */}
          <div className="mb-8 border-t border-on-background/10 pt-6">
            <NewsletterForm source="audit" variant="dark" />
          </div>

          <button type="button" onClick={handleRestart} className={secondaryButtonClass}>
            <span
              className="material-symbols-outlined text-lg transition-transform motion-safe:duration-300 group-hover:-rotate-45"
              aria-hidden="true"
            >
              restart_alt
            </span>
            {auditSection.restartLabel}
          </button>
        </motion.div>
      )}
    </div>
  );
}
