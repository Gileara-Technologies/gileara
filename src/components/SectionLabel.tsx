interface SectionLabelProps {
  number?: string;
  label: string;
  className?: string;
}

/**
 * SectionLabel — a small mono caption line above a section heading.
 *
 * Mono is this project's own established label face (JetBrains Mono,
 * used throughout the admin UI and content modules), so it stays --
 * but untracked and sentence case, not the tracked-uppercase-plus-
 * decorative-glyph treatment Hallmark's gates 63/67 flag as a reflex
 * default regardless of typeface choice. Every call site now passes
 * `label` already in sentence case (not forced via CSS `lowercase`,
 * which would also lowercase a proper noun like "Gileara" inside a
 * label such as "About Gileara").
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SectionLabel({ number, label, className = "" }: SectionLabelProps) {
  return (
    <div className={className}>
      <span className="font-mono text-[13px] text-white/50">
        {label}
      </span>
    </div>
  );
}
