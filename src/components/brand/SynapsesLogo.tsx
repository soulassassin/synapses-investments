import React from "react";
import { clsx } from "clsx";
import { LOGO_WHITE_BASE64, LOGO_BLACK_BASE64 } from "./logoData";

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

  // Generous, crisp size scale
  const sizeStyles = {
    sm: { height: 38 },
    md: { height: 50 },
    lg: { height: 60 },
    xl: { height: 86 },
    hero: { height: 116 },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const logoSrc = isWhite ? LOGO_WHITE_BASE64 : LOGO_BLACK_BASE64;

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
        className="transition-all duration-200 block drop-shadow-md"
        loading="eager"
      />
    </div>
  );
}
