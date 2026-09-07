import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Coupon {
  code: string;
  discountPct: number;
  description: string;
  validPlans?: string[]; // "all" or ["monthly", "annual"]
  isTrialPass?: boolean;
}

const VALID_COUPONS: Record<string, Coupon> = {
  SYNAPSES20: {
    code: "SYNAPSES20",
    discountPct: 20,
    description: "20% Lifetime Discount applied",
  },
  TRADEZELLA: {
    code: "TRADEZELLA",
    discountPct: 30,
    description: "30% TradeZella Switcher Discount applied",
  },
  PROPEDGE50: {
    code: "PROPEDGE50",
    discountPct: 50,
    description: "50% Discount on your first billing cycle",
  },
  ALPHA100: {
    code: "ALPHA100",
    discountPct: 100,
    description: "100% Free Syndicate Access Pass",
    isTrialPass: true,
  },
  PROPFIRM: {
    code: "PROPFIRM",
    discountPct: 25,
    description: "25% Prop Firm Trader Discount",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, plan = "monthly" } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter a valid promo code." },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[normalizedCode];

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: `Promo code "${code}" is invalid or has expired.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPct: coupon.discountPct,
        description: coupon.description,
        isTrialPass: coupon.isTrialPass || false,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to validate coupon." },
      { status: 500 }
    );
  }
}
