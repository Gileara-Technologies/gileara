"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import CalendarStep from './CalendarStep';

type Step = 'details' | 'calendar' | 'success';

interface FormData {
  name: string;
  email: string;
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
    goal: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('calendar');
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-surface border border-outline-variant/20 focus:border-primary rounded-2xl p-4 text-on-surface focus:outline-none transition-colors";

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
              <h3 className="text-3xl font-bold text-on-surface">The Mission Profile</h3>
              <p className="text-on-surface-variant text-lg">Tell us about your technical challenges.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider ml-1">Your Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Kofi Joe"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider ml-1">Email Address</label>
                <input
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
              <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider ml-1">Primary Objective</label>
              <select
                required
                className={`${inputClass} appearance-none`}
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              >
                <option value="" disabled>Select your primary goal</option>
                <option value="software">Custom Software Development</option>
                <option value="platforms">E-Commerce & Platforms</option>
                <option value="automation">CRM & Workflow Automation</option>
                <option value="strategy">Digital Strategy & Advisory</option>
                <option value="other">Other Technical Challenge</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider ml-1">Project Details</label>
              <textarea
                required
                rows={4}
                placeholder="Briefly describe your current situation or what you're looking to build..."
                className={`${inputClass} resize-none`}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-5 text-lg font-bold flex items-center justify-center gap-3 mt-4"
            >
              <span>Next: Select Time</span>
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
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle size={20} />
                <span>{error}</span>
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
            <h3 className="text-3xl font-bold text-on-surface">Objective Locked.</h3>
            <p className="text-on-surface-variant text-lg">
              Your consultation request has been received. We'll review the technical profile and confirm the meeting in your calendar within 24 hours.
            </p>
            <button
              onClick={() => setStep('details')}
              className="text-primary hover:underline font-medium"
            >
              Back to gileara.tech
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
