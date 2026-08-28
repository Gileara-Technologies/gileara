import { type ReactNode } from "react";

type Size = "xl" | "lg" | "md" | "sm";

interface DisplayHeadingProps {
  children: ReactNode;
  size?: Size;
  as?: "h1" | "h2" | "h3";
  className?: string;
  italic?: boolean;
  accent?: boolean;
  id?: string;
}

const sizeClasses: Record<Size, string> = {
  xl: "text-display-xl",
  lg: "text-display-lg",
  md: "text-display-md",
  sm: "text-display-sm",
};

/**
 * Oversized editorial heading. Serif by default, with optional italic
 * accent for the key phrase. Sizes are fluid `clamp()` (defined in
 * tailwind.config.js) so they scale from mobile to desktop without
 * overflowing the viewport.
 *
 * `accent` colors the entire heading in the bright cyan accent.
 */
export default function DisplayHeading({
  children,
  size = "lg",
  as: Tag = "h2",
  className = "",
  italic = false,
  accent = false,
  id,
}: DisplayHeadingProps) {
  return (
    <Tag
      id={id}
      className={`font-serif font-normal ${sizeClasses[size]} ${italic ? "italic" : ""} ${
        accent ? "text-accent-cyan" : "text-on-background"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
