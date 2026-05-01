import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, deleteField } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    console.log("Notifikasi Masuk:", notification);

    const status = notification.transaction_status;
    const fullOrderId = notification.order_id; // Contoh: "INV-PAY123-1714567"

    // Ambil ID aslinya (ambil bagian tengah antara INV- dan -Timestamp)
    // Jika formatnya INV-KODE-TIME, maka kita split berdasarkan "-"
    const parts = fullOrderId.split("-");
    const originalPaymentCode = parts[1]; 

    if (status === "settlement" || status === "capture") {
      // Cari dokumen yang memiliki paymentCode tersebut
      const q = query(collection(db, "pendaftar"), where("paymentCode", "==", originalPaymentCode));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, "pendaftar", userDoc.id);

        await updateDoc(userRef, {
          status: "Siswa",
          tagihan: "Lunas",
          paymentMethod: notification.payment_type, // Simpan metode spesifik (misal: gopay/qris)
          paymentCode: deleteField(), // Hapus kode agar tidak bisa dipakai bayar lagi
          updatedAt: new Date().toISOString(),
        });

        console.log(`Berhasil Update: ${originalPaymentCode}`);
        return NextResponse.json({ message: "OK" });
      } else {
        console.error("Data tidak ditemukan untuk kode:", originalPaymentCode);
      }
    }

    return NextResponse.json({ message: "Notification handled" });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}