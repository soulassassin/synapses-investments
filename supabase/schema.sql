-- ==============================================================================
-- SYNAPSES INVESTMENTS: POSTGRESQL SUPABASE SCHEMA
-- Institutional Trading Terminal, Execution Journal & Quantitative Analytics
-- Monetization: 7-Week Trial, Demo Tier Guardrail & Multi-Rail Subscriptions
-- ==============================================================================

-- 1. Create Profiles Table (Linked to auth.users) with Subscription Status
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  callsign TEXT,
  trader_persona TEXT DEFAULT 'PROP_OPERATOR', -- 'PROP_OPERATOR' | 'DISCRETIONARY' | 'QUANT' | 'SWING'
  experience_level TEXT DEFAULT 'INTERMEDIATE', -- 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'INSTITUTIONAL'
  preferred_setups TEXT[] DEFAULT ARRAY['Fair Value Gap (FVG)', 'Order Block (OB)', 'London Sweep'],
  starting_capital NUMERIC DEFAULT 100000.00,
  max_risk_pct NUMERIC DEFAULT 1.00,
  daily_drawdown_limit_pct NUMERIC DEFAULT 4.00,
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  -- Subscription & Monetization fields (7-Week Trial = 49 days)
  subscription_tier TEXT DEFAULT 'trial' CHECK (subscription_tier IN ('demo', 'trial', 'pro', 'canceled')),
  trial_started_at TIMESTAMPTZ DEFAULT NOW(),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '49 days'),
  subscription_id TEXT,
  customer_id TEXT,
  payment_provider TEXT CHECK (payment_provider IN ('lemonsqueezy', 'stripe', 'paystack')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration safety: Add columns if table already existed in active Supabase DB
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_tier') THEN
    ALTER TABLE public.profiles ADD COLUMN subscription_tier TEXT DEFAULT 'trial' CHECK (subscription_tier IN ('demo', 'trial', 'pro', 'canceled'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='trial_started_at') THEN
    ALTER TABLE public.profiles ADD COLUMN trial_started_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='trial_ends_at') THEN
    ALTER TABLE public.profiles ADD COLUMN trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '49 days');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_id') THEN
    ALTER TABLE public.profiles ADD COLUMN subscription_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='customer_id') THEN
    ALTER TABLE public.profiles ADD COLUMN customer_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='payment_provider') THEN
    ALTER TABLE public.profiles ADD COLUMN payment_provider TEXT CHECK (payment_provider IN ('lemonsqueezy', 'stripe', 'paystack'));
  END IF;
END $$;

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Create Broker Accounts Table
CREATE TABLE IF NOT EXISTS public.broker_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'MT5' | 'cTrader' | 'TradingView' | 'IBKR' | 'NinjaTrader'
  account_number TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 100000.00,
  initial_balance NUMERIC NOT NULL DEFAULT 100000.00,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'CONNECTED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Broker Accounts
ALTER TABLE public.broker_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own accounts" ON public.broker_accounts;
CREATE POLICY "Users can view own accounts"
  ON public.broker_accounts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own accounts" ON public.broker_accounts;
CREATE POLICY "Users can manage own accounts"
  ON public.broker_accounts FOR ALL
  USING (auth.uid() = user_id);

-- 3. Create Trades Journal Table with Tier Guardrails
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.broker_accounts(id) ON DELETE SET NULL,
  ticker TEXT NOT NULL,
  asset_class TEXT NOT NULL DEFAULT 'INDICES', -- 'INDICES' | 'FOREX' | 'CRYPTO' | 'COMMODITIES'
  direction TEXT NOT NULL, -- 'LONG' | 'SHORT'
  entry_price NUMERIC NOT NULL,
  exit_price NUMERIC NOT NULL,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  quantity NUMERIC NOT NULL DEFAULT 1.0,
  pnl NUMERIC NOT NULL,
  pnl_r NUMERIC NOT NULL DEFAULT 0.0,
  outcome TEXT NOT NULL, -- 'WIN' | 'LOSS' | 'BE'
  strategy TEXT,
  setup TEXT,
  session TEXT, -- 'LONDON' | 'NY_AM' | 'NY_PM' | 'ASIA'
  mistake_tag TEXT,
  emotion_tag TEXT, -- 'CONFIDENT' | 'FOMO' | 'HESITANT' | 'REVENGE' | 'DISCIPLINED'
  discipline_score INTEGER DEFAULT 85,
  entry_time TIMESTAMPTZ DEFAULT NOW(),
  exit_time TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Trades
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own trades" ON public.trades;
CREATE POLICY "Users can view own trades"
  ON public.trades FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own trades" ON public.trades;
CREATE POLICY "Users can manage own trades"
  ON public.trades FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can CRUD own trades" ON public.trades;
CREATE POLICY "Users can CRUD own trades"
  ON public.trades FOR ALL
  USING (auth.uid() = user_id);

-- 4. Automatically create profile upon user sign-up in Supabase Auth (Defaults to 7-Week Trial)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    callsign,
    has_completed_onboarding,
    subscription_tier,
    trial_started_at,
    trial_ends_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'callsign', split_part(NEW.email, '@', 1)),
    FALSE,
    'trial',
    NOW(),
    NOW() + INTERVAL '49 days' -- 7-week trial period
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to invoke handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
