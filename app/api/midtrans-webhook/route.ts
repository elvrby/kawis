import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";

// Inisialisasi Firebase Admin (Singleton)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("🔥 Firebase Admin Initialized");
  } catch (error: any) {
    console.error("❌ Firebase Admin Init Error:", error.message);
  }
}

const dbAdmin = admin.firestore();

// --- KONFIGURASI EMAIL ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Alamat Gmail kamu
    pass: process.env.EMAIL_PASS, // App Password (bukan password login)
  },
});

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    const fullOrderId = notification.order_id;
    const status = notification.transaction_status;
    const grossAmount = notification.gross_amount;

    const parts = fullOrderId.split("-");
    const targetDocId = parts[1]; 

    if (status === "settlement" || status === "capture") {
      if (!targetDocId) throw new Error("ID Dokumen tidak valid");

      const userRef = dbAdmin.collection("pendaftar").doc(targetDocId);
      const docSnap = await userRef.get();

      if (!docSnap.exists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userData = docSnap.data();

      // 1. UPDATE DATABASE
      await userRef.update({
        status: "Siswa",
        tagihan: "Lunas",
        paymentMethod: `Online (${notification.payment_type})`,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 2. KIRIM EMAIL NOTA
      try {
        await transporter.sendMail({
          from: '"SMA Kawis" <no-reply@smakawis.sch.id>',
          to: userData?.email, // Pastikan field 'email' ada di dokumen pendaftar
          subject: `Nota Pembayaran Lunas - ${userData?.namaLengkap}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
              <h2 style="color: #2563eb; text-align: center;">PEMBAYARAN BERHASIL</h2>
              <p>Halo <strong>${userData?.namaLengkap}</strong>,</p>
              <p>Terima kasih! Pembayaran pendaftaran Anda telah kami terima. Anda sekarang resmi terdaftar sebagai siswa di SMA Kawis.</p>
              
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0;">Detail Nota:</h4>
                <table style="width: 100%; font-size: 14px;">
                  <tr><td>Order ID</td><td>: ${fullOrderId}</td></tr>
                  <tr><td>Total Bayar</td><td>: <strong>Rp ${Number(grossAmount).toLocaleString("id-ID")}</strong></td></tr>
                  <tr><td>Metode</td><td>: ${notification.payment_type}</td></tr>
                  <tr><td>Status</td><td>: <strong style="color: green;">LUNAS</strong></td></tr>
                </table>
              </div>

              <p style="font-size: 12px; color: #64748b;">*Mohon simpan email ini sebagai bukti pembayaran yang sah.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="text-align: center; font-weight: bold;">SMA KAWIS</p>
            </div>
          `,
        });
        console.log(`📧 Email nota terkirim ke: ${userData?.email}`);
      } catch (mailError: any) {
        console.error("❌ Gagal mengirim email:", mailError.message);
        // Kita tidak throw error di sini supaya status DB tetap dianggap sukses
      }

      return NextResponse.json({ message: "Database & Email Success" }, { status: 200 });
    }

    return NextResponse.json({ message: "Notification received" }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}