import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, nama, link, total } = await req.json();

    // 1. Konfigurasi Transporter (Pengirim)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 2. Konten Email
    const mailOptions = {
      from: `"ADMIN KAWIS EDU" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Konfirmasi Pendaftaran - ${nama}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Halo, ${nama}!</h2>
          <p>Terima kasih telah mendaftar di KAWIS EDU.</p>
          <p>Langkah selanjutnya adalah melakukan pembayaran sebesar <b>Rp ${total}</b>.</p>
          <div style="margin: 30px 0;">
            <a href="${link}" style="background: #2563eb; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              BAYAR SEKARANG
            </a>
          </div>
          <p>Jika tombol tidak berfungsi, klik link berikut: <br/> ${link}</p>
          <hr />
          <p style="font-size: 12px; color: #888;">Ini adalah email otomatis, jangan dibalas.</p>
        </div>
      `,
    };

    // 3. Kirim
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email terkirim!" }, { status: 200 });
  } catch (error) {
    console.error("Gagal kirim email:", error);
    return NextResponse.json({ error: "Gagal mengirim email" }, { status: 500 });
  }
}