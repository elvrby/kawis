import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteField } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    const status = notification.transaction_status;
    const fullOrderId = notification.order_id; 

    // Split: ["INV", "DOC_ID", "PAY_CODE", "TIMESTAMP"]
    const parts = fullOrderId.split("-");
    const targetDocId = parts[1]; // Mengambil ID Dokumen Firestore langsung

    console.log("Memproses update untuk Doc ID:", targetDocId);

    if (status === "settlement" || status === "capture") {
      const userRef = doc(db, "pendaftar", targetDocId);

      // Langsung update tanpa query!
      await updateDoc(userRef, {
        status: "Siswa",
        tagihan: "Lunas",
        paymentMethod: notification.payment_type,
        updatedAt: new Date().toISOString(),
      });

      console.log("✅ Database Berhasil Diupdate!");
      return NextResponse.json({ message: "OK" });
    }

    return NextResponse.json({ message: "Status not settlement" });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}