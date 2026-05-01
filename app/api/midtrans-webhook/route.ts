import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, deleteField } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const notification = await req.json();

    // Cek apakah status transaksi sukses
    const status = notification.transaction_status;
    const orderId = notification.order_id; // Ini adalah paymentCode

    if (status === "settlement" || status === "capture") {
      // 1. Cari pendaftar berdasarkan paymentCode (orderId)
      const q = query(collection(db, "pendaftar"), where("paymentCode", "==", orderId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, "pendaftar", userDoc.id);

        // 2. Update status menjadi Siswa dan hapus paymentCode
        await updateDoc(userRef, {
          status: "Siswa",
          tagihan: "Lunas",
          paymentCode: deleteField(), // Menghapus field dari database
          updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ message: "Database Updated" });
      }
    }

    return NextResponse.json({ message: "Status not settlement" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
  }
}