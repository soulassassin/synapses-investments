"use client";

import React, { createContext, useContext } from "react";
import { useDMAFeed, DMAFeedState, TickerInfo } from "@/hooks/useDMAFeed";

const DMAContext = createContext<DMAFeedState | undefined>(undefined);

export function DMAProvider({ children }: { children: React.ReactNode }) {
  const feed = useDMAFeed();

  return <DMAContext.Provider value={feed}>{children}</DMAContext.Provider>;
}

export function useDMA(): DMAFeedState {
  const context = useContext(DMAContext);
  if (!context) {
    throw new Error("useDMA must be used within a DMAProvider");
  }
  return context;
}

export const useDMAContext = useDMA;

