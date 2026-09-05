import React from "react";
import { clsx } from "clsx";

interface SynapsesLogoProps {
  variant?: "horizontal" | "stacked" | "icon";
  theme?: "white" | "black";
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  iconOnly?: boolean;
}

export function SynapsesLogo({
  theme = "white",
  size = "md",
  className = "",
}: SynapsesLogoProps) {
  const isWhite = theme === "white";

  // Precision crisp size scale for v2 high-resolution logo
  const sizeStyles = {
    sm: { height: 32 },
    md: { height: 44 },
    lg: { height: 56 },
    xl: { height: 76 },
    hero: { height: 104 },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const logoSrc = isWhite ? "/synapses-logo-v2.png" : "/logo-black.svg";

  return (
    <div className={clsx("inline-flex items-center justify-center select-none shrink-0", className)}>
      <img
        src={logoSrc}
        alt="Synapses Investments"
        style={{
          height: `${currentSize.height}px`,
          width: "auto",
          maxWidth: "100%",
          objectFit: "contain",
        }}
        className="transition-opacity duration-200 block drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)] hover:opacity-90"
        loading="eager"
      />
    </div>
  );
}
