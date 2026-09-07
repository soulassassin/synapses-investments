import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CRYPTO_DEPOSIT_ADDRESSES: Record<string, { network: string; address: string; qrUrl: string }> = {
  USDT_TRC20: {
    network: "TRON (TRC20)",
    address: "TX9SynapsesInvestTRC20DepositVault799",
    qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TX9SynapsesInvestTRC20DepositVault799",
  },
  USDT_ERC20: {
    network: "Ethereum (ERC20)",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  },
  USDC: {
    network: "Solana / Ethereum (SPL/ERC20)",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  },
  BTC: {
    network: "Bitcoin Native SegWit",
    address: "bc1qsynapsesinvestmentsquantedge9924824",
    qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bc1qsynapsesinvestmentsquantedge9924824",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, userId, plan = "monthly", currency = "USDT_TRC20", amount = 29 } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required for crypto invoice generation." },
        { status: 400 }
      );
    }

    const selectedAsset = CRYPTO_DEPOSIT_ADDRESSES[currency] || CRYPTO_DEPOSIT_ADDRESSES.USDT_TRC20;
    const paymentId = `crypto_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return NextResponse.json({
      success: true,
      paymentId,
      currency,
      amount,
      network: selectedAsset.network,
      depositAddress: selectedAsset.address,
      qrCodeUrl: selectedAsset.qrUrl,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiry
      instructions: `Send exactly ${amount} ${currency.split("_")[0]} over the ${selectedAsset.network} network. Your account will automatically activate upon 1 network confirmation.`,
    });
  } catch (error: any) {
    console.error("Crypto checkout error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to initialize crypto checkout." },
      { status: 500 }
    );
  }
}
