"use client";

import type { SceneQuality } from "@/lib/scene/quality";

export const TEAL = "#5EEAD4"; // accent-bright, the one brand teal
export const TEAL_DEEP = "#0A5A50"; // --brand-teal-deep
export const ICE = "#CFFAF3";
export const BACKGROUND = "#030A0C"; // --background

/**
 * Crystal glass. "high" uses real transmission (three renders the
 * opaque scene into a texture once per frame and refracts it through
 * every transmissive mesh, so the cost is one shared pass, not one per
 * object). "low" fakes it with a transparent, reflective standard
 * material: no extra pass, far cheaper on phones.
 */
export function GlassMaterial({
  quality,
  tint = ICE,
  thickness = 1.2,
}: {
  quality: Exclude<SceneQuality, "off">;
  tint?: string;
  thickness?: number;
}) {
  if (quality === "high") {
    return (
      <meshPhysicalMaterial
        color={tint}
        transmission={1}
        thickness={thickness}
        roughness={0.06}
        ior={1.45}
        iridescence={0.35}
        iridescenceIOR={1.3}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={1.4}
        attenuationColor={TEAL}
        attenuationDistance={4}
        flatShading
      />
    );
  }
  return (
    <meshStandardMaterial
      color={tint}
      transparent
      opacity={0.32}
      roughness={0.1}
      metalness={0.6}
      envMapIntensity={1.6}
      flatShading
      depthWrite={false}
    />
  );
}

/** Solid emissive teal for glowing cores and accents. Fog-aware. */
export function GlowMaterial({ intensity = 2.2, color = TEAL }: { intensity?: number; color?: string }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />;
}
