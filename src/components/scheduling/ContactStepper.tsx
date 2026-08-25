"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import CalendarStep from './CalendarStep';
import { servicePackages } from '@/content/packages';

const GOAL_OPTIONS = [
  ...servicePackages.map((p) => ({ value: p.id, label: p.name })),
  { value: 'unsure', label: "Not sure yet — help me choose" },
];

type Step = 'details' | 'calendar' | 'success';

interface FormData {
  name: string;
  email: string;
  phone?: string;
  goal: string;
  message: string;
  date?: string;
  time?: string;
}

export default function ContactStepper() {
  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    goal: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('calendar');
  };

  // Fallback: hand-compiled mailto so a Calendar-API outage never loses the lead.
  const fallbackMailto = () => {
    const params = new URLSearchParams({
      subject: `Consultation request — ${formData.name}`,
      body:
        `Name: ${formData.name}\nEmail: ${formData.email}\n` +
        (formData.phone ? `Phone/WhatsApp: ${formData.phone}\n` : '') +
        `Goal: ${GOAL_OPTIONS.find((g) => g.value === formData.goal)?.label ?? formData.goal}\n\n${formData.message}` +
        (formData.date ? `\nPreferred slot: ${formData.date} ${formData.time} (GMT)` : ''),
    });
    return `mailto:tech.gileara@gmail.com?${params.toString()}`;
  };

  const handleScheduleSubmit = async (date: string, time: string) => {
    setIsSubmitting(true);
    setError(null);

    const finalData = { ...formData, date, time };

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();

      if (result.success) {
        setStep('success');
      } else {
        throw new Error(result.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-surface border border-outline-variant/20 focus:border-primary rounded-2xl p-4 text-on-surface focus:outline-none transition-colors";
  const labelClass = "text-sm font-medium text-on-surface-variant uppercase tracking-wider ml-1";

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        {step === 'details' && (
          <motion.form
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleDetailsSubmit}
            className="w-full max-w-2xl space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-3xl font-bold text-on-surface">Tell us about your business</h3>
              <p className="text-on-surface-variant text-lg">Thirty minutes, free — we&apos;ll come prepared.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="booking-name" className={labelClass}>Your Name</label>
                <input
                  id="booking-name"
                  required
                  type="text"
                  placeholder="e.g. Abena Mensah"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="booking-email" className={labelClass}>Email Address</label>
                <input
                  id="booking-email"
                  required
                  type="email"
                  placeholder="name@example.com"
                  className={inputClass}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="booking-goal" className={labelClass}>What do you need most right now?</label>
              <select
                id="booking-goal"
                required
                className={`${inputClass} appearance-none`}
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              >
                <option value="" disabled>Select a package or goal</option>
                {GOAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="booking-phone" className={labelClass}>
                Phone / WhatsApp <span className="normal-case text-outline">(optional)</span>
              </label>
              <input
                id="booking-phone"
                type="tel"
                placeholder="+233 …"
                className={inputClass}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="booking-message" className={labelClass}>Where does it hurt today?</label>
              <textarea
                id="booking-message"
                required
                rows={4}
                placeholder="Roughly where's the pain — spreadsheets, stock tracking, customer follow-ups, reporting…"
                className={`${inputClass} resize-none`}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-5 text-lg font-bold flex items-center justify-center gap-3 mt-4"
            >
              <span>Next: Pick a Time</span>
              <Send size={20} />
            </button>
          </motion.form>
        )}

        {step === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full"
          >
            <CalendarStep
              onSelect={handleScheduleSubmit}
              onBack={() => setStep('details')}
              isSubmitting={isSubmitting}
            />
            {error && (
              <div className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm space-y-3">
                <div className="flex items-center gap-3 text-red-500">
                  <AlertCircle size={20} />
                  <span>Booking system hiccup — your details are safe.</span>
                </div>
                <a
                  href={fallbackMailto()}
                  className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                >
                  Email us this instead
                  <Send size={16} />
                </a>
              </div>
            )}
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 max-w-md"
          >
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-3xl font-bold text-on-surface">You&apos;re booked!</h3>
            <p className="text-on-surface-variant text-lg">
              Your request is in. We&apos;ll confirm the slot in your calendar within 24 hours — and you&apos;ll hear from a real person, not a robot.
            </p>
            <Link href="/" className="text-primary hover:underline font-medium">
              Back to gileara.org
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
