import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    const status = notification.transaction_status;
    const fullOrderId = notification.order_id; // "INV-xxx-123"

    // Split string berdasarkan "-"
    const parts = fullOrderId.split("-");
    const targetDocId = parts[1]; // Mengambil docId asli Firestore

    if (status === "settlement" || status === "capture") {
      const userRef = doc(db, "pendaftar", targetDocId);

      await updateDoc(userRef, {
        status: "Siswa",
        tagihan: "Lunas",
        paymentMethod: `Online (${notification.payment_type})`,
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ Sukses: Dokumen ${targetDocId} telah menjadi Siswa.`);
      return NextResponse.json({ message: "Update Berhasil" });
    }

    return NextResponse.json({ message: "Notifikasi diterima" });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}