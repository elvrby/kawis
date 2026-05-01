import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

// Gunakan 'as string' untuk mengatasi error 'string | undefined'
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.MIDTRANS_CLIENT_KEY as string,
});

export async function POST(request: Request) {
  try {
    const { id, nama, email, total } = await request.json();

    const parameter = {
      transaction_details: {
        order_id: `INV-${id}-${Date.now()}`,
        gross_amount: total,
      },
      customer_details: {
        first_name: nama,
        email: email,
      },
    };

    // Gunakan .createTransaction(parameter).then(res => res.token) 
    // karena pada versi terbaru method-nya seringkali bernama createTransaction
    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({ token: transaction.token });
  } catch (error: any) {
    console.error("Midtrans Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}