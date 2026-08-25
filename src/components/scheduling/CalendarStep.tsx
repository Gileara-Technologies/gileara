"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarStepProps {
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const TIME_SLOTS = [
  { label: 'Morning', times: ['09:00', '10:00', '11:00'] },
  { label: 'Afternoon', times: ['13:00', '14:00', '15:00', '16:00'] },
  { label: 'Evening', times: ['18:00', '19:00', '20:00'] },
];

export default function CalendarStep({ onSelect, onBack, isSubmitting }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Next 14 business days (Ghana Time) — weekends excluded.
  const days = (() => {
    const out: Date[] = [];
    const d = new Date();
    while (out.length < 14) {
      d.setDate(d.getDate() + 1);
      const dow = d.getDay();
      if (dow !== 0 && dow !== 6) out.push(new Date(d));
    }
    return out;
  })();

  // One-time render snapshot: slots must start at least 60 min from first paint.
  const [slotCutoff] = useState(() => Date.now() + 60 * 60 * 1000);

  // Disable slots that have already passed for same-day selections (60-min lead).
  const isSlotPassed = (time: string) => {
    if (!selectedDate) return false;
    const slot = new Date(`${selectedDate.toISOString().split('T')[0]}T${time}:00`);
    return slot.getTime() < slotCutoff;
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      onSelect(dateStr, selectedTime);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-2xl">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-on-surface">Pick a time</h3>
        <p className="text-on-surface-variant">All slots shown in Ghana Time (GMT).</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant uppercase tracking-wider">
          <CalendarIcon size={16} />
          <span>Pick a Date</span>
        </div>
        <div className="flex overflow-x-auto gap-3 pb-4 snap-x scrollbar-hide">
          {days.map((day, i) => {
            const isSelected = selectedDate?.toDateString() === day.toDateString();
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex-shrink-0 w-20 py-4 rounded-2xl border transition-all duration-300 snap-start",
                  isSelected 
                    ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/30 scale-105" 
                    : "bg-surface-container border-outline-variant/20 text-on-surface-variant hover:border-primary/50"
                )}
              >
                <div className="text-xs uppercase opacity-70 mb-1">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xl font-bold">
                  {day.getDate()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: selectedDate ? 1 : 0, y: selectedDate ? 0 : 10 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant uppercase tracking-wider">
          <Clock size={16} />
          <span>Select Time Block</span>
        </div>
        
        <div className="space-y-6">
          {TIME_SLOTS.map((group) => (
            <div key={group.label} className="space-y-3">
              <div className="text-xs font-semibold text-on-surface-variant/60 uppercase">{group.label}</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {group.times.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    disabled={isSlotPassed(time)}
                    className={cn(
                      "py-2 rounded-xl border text-sm font-medium transition-all duration-300",
                      selectedTime === time
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-surface-container border-outline-variant/20 text-on-surface hover:border-outline-variant/60",
                      isSlotPassed(time) && "opacity-30 cursor-not-allowed line-through"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center justify-between pt-8 border-t border-outline-variant/20">
        <button
          onClick={onBack}
          className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <button
          disabled={!selectedDate || !selectedTime || isSubmitting}
          onClick={handleConfirm}
          className={cn(
            "btn-primary px-8 py-3 flex items-center gap-2",
            (!selectedDate || !selectedTime || isSubmitting) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <>
              <span>Lock in Proposal</span>
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
