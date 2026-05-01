import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { docId, nama, email, total } = await request.json();

    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY as string,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string,
    });

    // Format: INV-20karakterDocId-13karakterTimestamp (Total ~38 karakter)
    // Ini aman dari limit 50 karakter Midtrans
    const orderId = `INV-${docId}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
      customer_details: {
        first_name: nama,
        email: email,
      },
      enabled_payments: ["credit_card", "bca_va", "bni_va", "bri_va", "gopay", "shopeepay", "qris"],
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token });
  } catch (error: any) {
    console.error("Midtrans Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}