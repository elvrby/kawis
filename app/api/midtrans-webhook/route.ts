import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Inisialisasi Firebase Admin (Singleton)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Penting: Memastikan private key terbaca dengan benar di Vercel
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("🔥 Firebase Admin Initialized");
  } catch (error: any) {
    console.error("❌ Firebase Admin Init Error:", error.message);
  }
}

const dbAdmin = admin.firestore();

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    const fullOrderId = notification.order_id;
    const status = notification.transaction_status;

    console.log("--- WEBHOOK INCOMING ---");
    console.log("Full Order ID:", fullOrderId);
    console.log("Status Transaksi:", status);

    /**
     * Memisahkan ID Dokumen.
     * Jika formatnya INV-jMGf5HFDm2nCe6Xy8Zp1-171456, 
     * maka parts[1] adalah jMGf5HFDm2nCe6Xy8Zp1
     */
    const parts = fullOrderId.split("-");
    const targetDocId = parts[1]; 

    // Filter status yang dianggap sukses
    if (status === "settlement" || status === "capture") {
      if (!targetDocId) {
        throw new Error("ID Dokumen tidak ditemukan dalam format order_id");
      }

      const userRef = dbAdmin.collection("pendaftar").doc(targetDocId);
      
      // Verifikasi apakah dokumen memang ada di Firestore
      const docSnap = await userRef.get();

      if (!docSnap.exists) {
        console.error(`❌ GAGAL: Dokumen ID "${targetDocId}" tidak ditemukan di koleksi 'pendaftar'`);
        return NextResponse.json(
          { error: `ID ${targetDocId} tidak ditemukan` }, 
          { status: 404 }
        );
      }

      // Lakukan Update
      await userRef.update({
        status: "Siswa",
        tagihan: "Lunas",
        paymentMethod: `Online (${notification.payment_type})`,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ BERHASIL: Dokumen ${targetDocId} telah diupdate menjadi Siswa/Lunas`);
      return NextResponse.json({ message: "Update Success" }, { status: 200 });
    }

    // Status lain (pending, deny, expire, cancel)
    console.log(`ℹ️ Notifikasi diterima (Status: ${status}), tidak ada aksi database.`);
    return NextResponse.json({ message: "Notification received" }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Webhook Admin Error:", error.message);
    // Kita tetap kirim 200/500 sesuai kebutuhan. 
    // Jika 500, Midtrans akan mencoba mengirim ulang notifikasi nanti.
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}