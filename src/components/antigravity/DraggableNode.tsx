"use client";

import React, { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { useGravity } from "@/context/GravityContext";

interface DraggableNodeProps {
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  driftAmplitude?: { x: number; y: number; rotate: number };
  driftDuration?: number;
  delay?: number;
  className?: string;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

export function DraggableNode({
  children,
  initialX = 0,
  initialY = 0,
  driftAmplitude = { x: 8, y: 12, rotate: 2 },
  driftDuration = 7,
  delay = 0,
  className = "",
  onDragEnd,
}: DraggableNodeProps) {
  const { isZeroG, gravityMode, impulseTrigger } = useGravity();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Floating zero-G drift maintains offset at initialX & initialY
  const driftVariants = {
    zeroG: {
      x: [
        initialX - driftAmplitude.x,
        initialX + driftAmplitude.x,
        initialX - driftAmplitude.x * 0.7,
        initialX + driftAmplitude.x * 0.5,
        initialX - driftAmplitude.x,
      ],
      y: [
        initialY - driftAmplitude.y,
        initialY + driftAmplitude.y * 0.8,
        initialY - driftAmplitude.y * 0.6,
        initialY + driftAmplitude.y,
        initialY - driftAmplitude.y,
      ],
      rotate: [
        -driftAmplitude.rotate,
        driftAmplitude.rotate,
        -driftAmplitude.rotate * 0.5,
        driftAmplitude.rotate,
        -driftAmplitude.rotate,
      ],
      transition: {
        x: { duration: driftDuration, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut", delay },
        y: { duration: driftDuration * 1.2, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut", delay },
        rotate: { duration: driftDuration * 1.5, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut", delay },
      },
    },
    surfaceGravity: {
      x: initialX,
      y: 360 + (Math.sin(delay * 3) * 40),
      rotate: (delay % 2 === 0 ? 1 : -1) * (10 + (delay * 4) % 20),
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 14,
        mass: 1.2,
      },
    },
    lunar: {
      x: initialX,
      y: initialY + 120 + (Math.cos(delay * 2) * 30),
      rotate: (delay % 2 === 0 ? -1 : 1) * 6,
      transition: {
        type: "spring",
        stiffness: 40,
        damping: 10,
        mass: 1.8,
      },
    },
  };

  const currentVariant = isZeroG ? "zeroG" : gravityMode === "LUNAR" ? "lunar" : "surfaceGravity";

  if (!mounted) {
    return (
      <div
        style={{
          transform: `translate3d(${initialX}px, ${initialY}px, 0px)`,
        }}
        className={`select-none absolute touch-none z-10 ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      drag
      dragElastic={0.2}
      dragMomentum={true}
      dragTransition={{ bounceStiffness: 250, bounceDamping: 25, power: 0.2 }}
      whileHover={{ scale: 1.04, zIndex: 40 }}
      whileDrag={{ scale: 1.08, zIndex: 50, cursor: "grabbing" }}
      variants={driftVariants}
      animate={currentVariant}
      key={impulseTrigger}
      initial={{ x: initialX, y: initialY }}
      onDragEnd={onDragEnd}
      className={`cursor-grab select-none absolute touch-none z-10 ${className}`}
    >
      {children}
    </motion.div>
  );
}
