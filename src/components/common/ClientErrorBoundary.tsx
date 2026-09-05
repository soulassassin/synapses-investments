"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ClientErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ClientErrorBoundary caught an error in [${this.props.componentName || "Component"}]:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 rounded-2xl bg-zinc-950/90 border border-red-500/20 backdrop-blur-xl text-center space-y-3 min-w-[200px]">
          <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-mono">
            <AlertTriangle className="w-4 h-4" />
            <span>Telemetry Module Offline</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-mono">
            {this.props.componentName || "Module"} encountered a transient glitch.
          </p>
          <button
            onClick={this.handleReset}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1.5 mx-auto transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Re-initialize</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
