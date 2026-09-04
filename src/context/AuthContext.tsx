"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface TraderProfile {
  id: string;
  email: string;
  full_name?: string;
  callsign?: string;
  trader_persona: "PROP_OPERATOR" | "DISCRETIONARY" | "QUANT" | "SWING";
  experience_level: "NOVICE" | "INTERMEDIATE" | "ADVANCED" | "INSTITUTIONAL";
  preferred_setups: string[];
  starting_capital: number;
  max_risk_pct: number;
  daily_drawdown_limit_pct: number;
  has_completed_onboarding: boolean;
}

export interface OnboardingData {
  callsign: string;
  trader_persona: TraderProfile["trader_persona"];
  experience_level: TraderProfile["experience_level"];
  preferred_setups: string[];
  starting_capital: number;
  max_risk_pct: number;
  daily_drawdown_limit_pct: number;
  primary_platform?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: TraderProfile | null;
  isLoading: boolean;
  isSupabaseLive: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: string | null; needsEmailVerification?: boolean }>;
  signInWithGitHub: () => Promise<{ error: string | null }>;
  signInDemoUser: () => void;
  signOut: () => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFILE: TraderProfile = {
  id: "demo-trader-01",
  email: "trader@synapsesinvestments.com",
  full_name: "Apex Operator",
  callsign: "SYNAPSE_ONE",
  trader_persona: "PROP_OPERATOR",
  experience_level: "INSTITUTIONAL",
  preferred_setups: ["Fair Value Gap (FVG)", "Order Block (OB)", "London Sweep"],
  starting_capital: 100000,
  max_risk_pct: 1.0,
  daily_drawdown_limit_pct: 4.0,
  has_completed_onboarding: true,
};

const LOCAL_STORAGE_AUTH_KEY = "synapses_auth_user_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<TraderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    // 1. If Supabase is configured, listen to real Auth events
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. Fallback local demo/persisted session
      try {
        const savedAuth = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        if (savedAuth) {
          const parsed = JSON.parse(savedAuth);
          setUser(parsed.user);
          setProfile(parsed.profile);
        }
      } catch (err) {
        console.error("Local auth restore error:", err);
      }
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data as TraderProfile);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message ?? null };
    }

    // Local sandbox simulation
    const mockUser = {
      id: "local-user-" + Date.now(),
      email,
      app_metadata: {},
      user_metadata: { full_name: email.split("@")[0] },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as unknown as User;

    const mockProfile: TraderProfile = {
      ...DEMO_PROFILE,
      id: mockUser.id,
      email,
      full_name: email.split("@")[0],
      callsign: email.split("@")[0].toUpperCase(),
    };

    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem(
      LOCAL_STORAGE_AUTH_KEY,
      JSON.stringify({ user: mockUser, profile: mockProfile })
    );

    return { error: null };
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName?: string
  ) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            callsign: fullName?.replace(/\s+/g, "_").toUpperCase() || email.split("@")[0].toUpperCase(),
          },
        },
      });

      const needsEmailVerification = Boolean(data.user && !data.session);
      return { error: error?.message ?? null, needsEmailVerification };
    }

    // Local sandbox signup
    const mockUser = {
      id: "local-user-" + Date.now(),
      email,
      app_metadata: {},
      user_metadata: { full_name: fullName },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as unknown as User;

    const mockProfile: TraderProfile = {
      ...DEMO_PROFILE,
      id: mockUser.id,
      email,
      full_name: fullName || email.split("@")[0],
      callsign: fullName?.replace(/\s+/g, "_").toUpperCase() || email.split("@")[0].toUpperCase(),
      has_completed_onboarding: false, // will direct to onboarding!
    };

    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem(
      LOCAL_STORAGE_AUTH_KEY,
      JSON.stringify({ user: mockUser, profile: mockProfile })
    );

    return { error: null, needsEmailVerification: false };
  };

  const signInWithGitHub = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      return { error: error?.message ?? null };
    }

    // Local sandbox simulation for GitHub login
    const mockUser = {
      id: "github-user-" + Date.now(),
      email: "github.operator@synapsesinvestments.com",
      app_metadata: { provider: "github" },
      user_metadata: { full_name: "GitHub Trader" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as unknown as User;

    setUser(mockUser);
    setProfile(DEMO_PROFILE);
    localStorage.setItem(
      LOCAL_STORAGE_AUTH_KEY,
      JSON.stringify({ user: mockUser, profile: DEMO_PROFILE })
    );

    return { error: null };
  };

  const signInDemoUser = () => {
    const mockUser = {
      id: DEMO_PROFILE.id,
      email: DEMO_PROFILE.email,
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as unknown as User;

    setUser(mockUser);
    setProfile(DEMO_PROFILE);
    localStorage.setItem(
      LOCAL_STORAGE_AUTH_KEY,
      JSON.stringify({ user: mockUser, profile: DEMO_PROFILE })
    );
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  };

  const completeOnboarding = async (data: OnboardingData) => {
    const updatedProfile: TraderProfile = {
      ...(profile || DEMO_PROFILE),
      callsign: data.callsign,
      trader_persona: data.trader_persona,
      experience_level: data.experience_level,
      preferred_setups: data.preferred_setups,
      starting_capital: data.starting_capital,
      max_risk_pct: data.max_risk_pct,
      daily_drawdown_limit_pct: data.daily_drawdown_limit_pct,
      has_completed_onboarding: true,
    };

    setProfile(updatedProfile);

    if (supabase && user) {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email!,
          ...data,
          has_completed_onboarding: true,
          updated_at: new Date().toISOString(),
        });
      if (error) return { error: error.message };
    } else {
      localStorage.setItem(
        LOCAL_STORAGE_AUTH_KEY,
        JSON.stringify({ user, profile: updatedProfile })
      );
    }

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isSupabaseLive: isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGitHub,
        signInDemoUser,
        signOut,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
