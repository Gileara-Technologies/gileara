"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import CalendarStep from './CalendarStep';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
      // Even if calendar fails, we can tell them we received their info via email fallback (if implemented in API)
      // For now, just show the error.
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <h3 className="text-3xl font-bold text-brand-text">The Mission Profile</h3>
              <p className="text-brand-muted text-lg">Tell us about your technical challenges.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-muted uppercase tracking-wider ml-1">Your Name</label>
                <input
                  required
                  type="text"
                  placeholder="Commander"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-brand-text focus:outline-none focus:border-brand-primary transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-muted uppercase tracking-wider ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-brand-text focus:outline-none focus:border-brand-primary transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-muted uppercase tracking-wider ml-1">Primary Objective</label>
              <select
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-brand-text focus:outline-none focus:border-brand-primary transition-colors appearance-none"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              >
                <option value="" disabled>Select your goal</option>
                <option value="scaling">Performance & Scaling</option>
                <option value="security">System Security Audit</option>
                <option value="modernization">Legacy Modernization</option>
                <option value="ai">AI Integration</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-muted uppercase tracking-wider ml-1">Message Context</label>
              <textarea
                required
                rows={4}
                placeholder="Briefly describe your current situation..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-brand-text focus:outline-none focus:border-brand-primary transition-colors resize-none"
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
            <h3 className="text-3xl font-bold text-brand-text">Objective Locked.</h3>
            <p className="text-brand-muted text-lg">
              Your consultation request has been received. We'll review the technical profile and confirm the meeting in your calendar within 24 hours.
            </p>
            <button
              onClick={() => setStep('details')}
              className="text-brand-primary hover:underline font-medium"
            >
              Back to gileara.tech
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
