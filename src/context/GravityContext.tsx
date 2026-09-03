"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type GravityType = "ZERO_G" | "SURFACE_GRAVITY" | "LUNAR";

interface GravityContextType {
  isZeroG: boolean;
  gravityMode: GravityType;
  setGravityMode: (mode: GravityType) => void;
  toggleGravity: () => void;
  physicsVelocityMultiplier: number;
  impulseTrigger: number;
  triggerImpulse: () => void;
}

const GravityContext = createContext<GravityContextType | undefined>(undefined);

export function GravityProvider({ children }: { children: React.ReactNode }) {
  const [gravityMode, setGravityMode] = useState<GravityType>("ZERO_G");
  const [impulseTrigger, setImpulseTrigger] = useState(0);

  const isZeroG = gravityMode === "ZERO_G";
  const physicsVelocityMultiplier = isZeroG ? 1.0 : gravityMode === "LUNAR" ? 0.4 : 1.8;

  const toggleGravity = () => {
    setGravityMode((prev) => (prev === "ZERO_G" ? "SURFACE_GRAVITY" : "ZERO_G"));
    setImpulseTrigger((prev) => prev + 1);
  };

  const triggerImpulse = () => {
    setImpulseTrigger((prev) => prev + 1);
  };

  return (
    <GravityContext.Provider
      value={{
        isZeroG,
        gravityMode,
        setGravityMode,
        toggleGravity,
        physicsVelocityMultiplier,
        impulseTrigger,
        triggerImpulse,
      }}
    >
      {children}
    </GravityContext.Provider>
  );
}

export function useGravity() {
  const context = useContext(GravityContext);
  if (!context) {
    throw new Error("useGravity must be used within a GravityProvider");
  }
  return context;
}
