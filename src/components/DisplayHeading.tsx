import { type ReactNode, type CSSProperties } from "react";

type Size = "xl" | "lg" | "md" | "sm";

interface DisplayHeadingProps {
  children: ReactNode;
  size?: Size;
  as?: "h1" | "h2" | "h3";
  className?: string;
  italic?: boolean;
  accent?: boolean;
}

const sizeClasses: Record<Size, string> = {
  xl: "text-display-xl md:text-display-xl",
  lg: "text-display-lg md:text-display-lg",
  md: "text-display-md md:text-display-md",
  sm: "text-display-sm md:text-display-sm",
};

/**
 * Oversized editorial heading. Serif by default, with optional italic
 * accent for the key phrase. Sizes map to the Andela-style display
 * scale (96–120px on desktop).
 *
 * `accent` colors the entire heading in the bright accent — used for
 * the "little aspects of white" bright-cyan visual breaks.
 */
export default function DisplayHeading({
  children,
  size = "lg",
  as: Tag = "h2",
  className = "",
  italic = false,
  accent = false,
}: DisplayHeadingProps) {
  const style: CSSProperties = { letterSpacing: "-0.03em" };
  return (
    <Tag
      className={`font-serif font-normal leading-[0.95] ${sizeClasses[size]} ${
        italic ? "italic" : ""
      } ${accent ? "text-accent-cyan" : "text-on-background"} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
