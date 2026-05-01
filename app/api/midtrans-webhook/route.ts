import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    const status = notification.transaction_status;
    const fullOrderId = notification.order_id; 

    const parts = fullOrderId.split("-");
    const targetDocId = parts[1];

    if (status === "settlement" || status === "capture") {
      const userRef = doc(db, "pendaftar", targetDocId);

      // Pastikan ada await di sini
      await updateDoc(userRef, {
        status: "Siswa",
        tagihan: "Lunas",
        updatedAt: new Date().toISOString(),
      });

      console.log("✅ Update Firestore Berhasil!");
      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    return NextResponse.json({ message: "Status not settled" }, { status: 200 });
  } catch (error: any) {
    console.error("Firestore Webhook Error:", error.message);
    // Tetap kirim 200 ke Midtrans agar mereka tidak kirim ulang terus menerus saat error
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}