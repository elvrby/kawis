import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, deleteField } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    
    const status = notification.transaction_status;
    const fullOrderId = notification.order_id; // "INV-xcfsWKN9x4fC-1777618271258"

    // LOGIKA PEMOTONGAN: 
    // Split berdasarkan tanda "-" 
    // parts[0] = "INV"
    // parts[1] = "xcfsWKN9x4fC" (KODE YANG KITA CARI)
    // parts[2] = "1777618271258"
    const parts = fullOrderId.split("-");
    const paymentCodeToSearch = parts[1]; 

    console.log("Mencari pendaftar dengan kode:", paymentCodeToSearch);

    if (status === "settlement" || status === "capture") {
      const q = query(
        collection(db, "pendaftar"), 
        where("paymentCode", "==", paymentCodeToSearch)
      );
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, "pendaftar", userDoc.id);

        await updateDoc(userRef, {
          status: "Siswa",
          tagihan: "Lunas",
          paymentMethod: notification.payment_type, // akan terisi "qris"
          // paymentCode: deleteField(), // Aktifkan jika ingin hapus kode setelah lunas
          updatedAt: new Date().toISOString(),
        });

        console.log("✅ Berhasil update database untuk:", paymentCodeToSearch);
        return NextResponse.json({ message: "Success updated" });
      } else {
        console.error("❌ Data TIDAK ditemukan di Firestore untuk kode:", paymentCodeToSearch);
      }
    }

    return NextResponse.json({ message: "Notification received but no action taken" });
  } catch (error: any) {
    console.error("Midtrans Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}