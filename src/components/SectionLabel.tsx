interface SectionLabelProps {
  number?: string;
  label: string;
  className?: string;
}

/**
 * SectionLabel — Terminal / Operator style.
 * Renders as a mono "prompt" line: ▸ LABEL
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SectionLabel({ number, label, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-mono text-accent-bright/50 text-[10px]" aria-hidden="true">▸</span>
      <span className="font-mono text-[11px] text-white/40 tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}
