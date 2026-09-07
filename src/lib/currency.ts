export type SupportedCurrency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "ZAR";

export interface CurrencySpec {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateAgainstUSD: number; // 1 USD = rateAgainstUSD
  flag: string;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencySpec> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rateAgainstUSD: 1.0, flag: "🇺🇸" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rateAgainstUSD: 0.92, flag: "🇪🇺" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rateAgainstUSD: 0.79, flag: "🇬🇧" },
  CAD: { code: "CAD", symbol: "CA$", name: "Canadian Dollar", rateAgainstUSD: 1.36, flag: "🇨🇦" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", rateAgainstUSD: 1.52, flag: "🇦🇺" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", rateAgainstUSD: 155.0, flag: "🇯🇵" },
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand", rateAgainstUSD: 18.5, flag: "🇿🇦" },
};

export const BASE_PLANS_USD = {
  basic: {
    monthly: 19,
    annualMonthly: 15,
    name: "Basic Journal",
    isTrialEligible: false,
  },
  pro: {
    monthly: 29,
    annualMonthly: 24,
    name: "Institutional Pro (49-Day Trial)",
    isTrialEligible: true,
  },
  syndicate: {
    monthly: 99,
    annualMonthly: 79,
    name: "Syndicate Desk",
    isTrialEligible: false,
  },
};

export function convertUSD(amountUSD: number, currency: SupportedCurrency): number {
  const spec = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountUSD * spec.rateAgainstUSD;
  return currency === "JPY" ? Math.round(converted) : Math.round(converted * 10) / 10;
}

export function formatPrice(amountUSD: number, currency: SupportedCurrency = "USD"): string {
  const spec = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = convertUSD(amountUSD, currency);
  if (currency === "JPY") {
    return `${spec.symbol}${converted.toLocaleString()}`;
  }
  if (currency === "ZAR") {
    return `${spec.symbol}${converted.toFixed(0)}`;
  }
  return `${spec.symbol}${converted.toFixed(converted % 1 === 0 ? 0 : 2)}`;
}

export function getPlanPriceUSD(
  tier: "basic" | "pro" | "syndicate",
  billing: "monthly" | "annual"
): number {
  const plan = BASE_PLANS_USD[tier] || BASE_PLANS_USD.pro;
  return billing === "monthly" ? plan.monthly : plan.annualMonthly;
}

export function detectCurrencyFromCountry(countryCode: string): SupportedCurrency {
  switch (countryCode?.toUpperCase()) {
    case "US":
      return "USD";
    case "GB":
    case "UK":
      return "GBP";
    case "EU":
    case "DE":
    case "FR":
    case "IT":
    case "ES":
    case "NL":
      return "EUR";
    case "CA":
      return "CAD";
    case "AU":
    case "NZ":
      return "AUD";
    case "JP":
      return "JPY";
    case "ZA":
      return "ZAR";
    default:
      return "USD";
  }
}


