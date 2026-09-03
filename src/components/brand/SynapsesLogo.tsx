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

  // Precision crisp size scale for trimmed logo
  const sizeStyles = {
    sm: { height: 30 },
    md: { height: 42 },
    lg: { height: 52 },
    xl: { height: 72 },
    hero: { height: 96 },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const logoSrc = isWhite ? "/synapses-logo-white-trimmed.png" : "/logo-black.svg";

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
