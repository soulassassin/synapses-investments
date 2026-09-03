import { useState, useEffect } from "react";

export interface PhysicsDriftConfig {
  xAmplitude?: number;
  yAmplitude?: number;
  rotationAmplitude?: number;
  duration?: number;
  delay?: number;
}

export function usePhysicsDrift(config: PhysicsDriftConfig = {}) {
  const {
    xAmplitude = 8,
    yAmplitude = 12,
    rotationAmplitude = 3,
    duration = 6,
    delay = 0,
  } = config;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const floatingAnimation = {
    x: [-xAmplitude, xAmplitude, -xAmplitude * 0.7, xAmplitude * 0.5, -xAmplitude],
    y: [-yAmplitude, yAmplitude * 0.8, -yAmplitude * 0.5, yAmplitude, -yAmplitude],
    rotate: [-rotationAmplitude, rotationAmplitude * 0.8, -rotationAmplitude * 0.5, rotationAmplitude, -rotationAmplitude],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut",
    },
  };

  return {
    floatingAnimation,
    mounted,
  };
}
