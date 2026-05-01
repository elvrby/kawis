import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Inisialisasi Firebase Admin (Singleton)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // Ambil dari Service Account
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const dbAdmin = admin.firestore();

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    console.log("Webhook Received:", notification.order_id);

    const status = notification.transaction_status;
    const fullOrderId = notification.order_id; 

    // Ambil docId: INV-[docId]-[timestamp]
    const parts = fullOrderId.split("-");
    const targetDocId = parts[1];

    if (status === "settlement" || status === "capture") {
      // Menggunakan Firebase Admin (dbAdmin) jauh lebih stabil di server
      const userRef = dbAdmin.collection("pendaftar").doc(targetDocId);

      await userRef.update({
        status: "Siswa",
        tagihan: "Lunas",
        paymentMethod: `Online (${notification.payment_type})`,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Berhasil Update Doc: ${targetDocId}`);
      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    return NextResponse.json({ message: "No Action" }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Webhook Admin Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}