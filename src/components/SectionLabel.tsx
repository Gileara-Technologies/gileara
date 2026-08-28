interface SectionLabelProps {
  number?: string; // "01", "02", "03"
  label: string;    // "THE REALITY"
  className?: string;
}

/**
 * Oversized numbered section label. The number is huge (96–120px)
 * and low-opacity, the label is small uppercase mono. Together they
 * anchor the section in the Andela-style "editorial numbered" rhythm.
 */
export default function SectionLabel({ number, label, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-baseline gap-4 md:gap-6 ${className}`}>
      {number && (
        <span
          className="font-serif text-display-md leading-none text-on-background/[0.08] select-none"
          aria-hidden="true"
        >
          {number}
        </span>
      )}
      <span className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}
