"use client";

import { useState, useEffect } from "react";
import { CreditCard, Banknote } from "lucide-react";
import { useParams } from "next/navigation"; // Ambil ID dari URL
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function PembayaranPage() {
  const params = useParams();
  const paymentCodeUrl = params.id as string; // Asumsi folder [id]
  
  const [userData, setUserData] = useState<any>(null);
  const [method, setMethod] = useState<"cash" | "online" | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Monitor data pendaftar secara Real-time
  useEffect(() => {
    if (!paymentCodeUrl) return;

    const q = query(collection(db, "pendaftar"), where("paymentCode", "==", paymentCodeUrl));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setUserData({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        // Jika data tidak ada atau paymentCode sudah dihapus (sudah lunas)
        setUserData("LUNAS");
      }
    });

    return () => unsubscribe();
  }, [paymentCodeUrl]);

  // 2. Load Snap Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleOnlinePayment = async () => {
    if (!userData || userData === "LUNAS") return;
    setLoading(true);
    try {
      const response = await fetch("/api/tokenizer", {
        method: "POST",
        body: JSON.stringify({
          id: userData.paymentCode,
          nama: userData.namaLengkap,
          email: userData.email,
          total: 100000, // Sesuaikan nominal
        }),
      });

      const { token } = await response.json();

      // @ts-ignore
      window.snap.pay(token, {
        onSuccess: () => alert("Pembayaran Berhasil! Tunggu sebentar..."),
        onPending: () => alert("Selesaikan pembayaran Anda segera."),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tampilan Jika Sudah Lunas
  if (userData === "LUNAS" || userData?.status === "Siswa") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center border-[3px] border-black p-10 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-20 h-20 bg-green-400 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
          <h2 className="text-3xl font-black italic uppercase">PEMBAYARAN LUNAS</h2>
          <p className="font-bold text-slate-500 mt-2">Selamat! Anda sekarang resmi menjadi Siswa.</p>
          <button onClick={() => window.location.href = '/'} className="mt-6 bg-black text-white px-8 py-3 rounded-xl font-bold uppercase">Kembali ke Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans pb-20">
      <main className="max-w-2xl mx-auto px-6 mt-16">
        <div className="bg-white border-[3px] border-black rounded-[32px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
          <header className="text-center mb-10">
             <h2 className="text-3xl font-black uppercase tracking-tight text-blue-600 italic">Selesaikan Pembayaran</h2>
             <p className="text-slate-500 font-bold mt-2 italic text-sm">TAGIHAN: RP 100.000</p>
          </header>

          <div className="grid grid-cols-1 gap-4">
             <button
              onClick={() => setMethod("cash")}
              className={`flex items-center p-6 border-2 rounded-2xl transition-all ${
                method === "cash" ? "border-black bg-blue-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-slate-200"
              }`}
            >
              <Banknote className="mr-4 text-green-600" />
              <div className="text-left">
                <h4 className="font-extrabold text-lg italic uppercase">Cash / Tunai</h4>
                <p className="text-xs text-slate-500 font-bold">Bayar di loket sekolah</p>
              </div>
            </button>

            <button
              onClick={() => setMethod("online")}
              className={`flex items-center p-6 border-2 rounded-2xl transition-all ${
                method === "online" ? "border-black bg-blue-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-slate-200"
              }`}
            >
              <CreditCard className="mr-4 text-blue-600" />
              <div className="text-left">
                <h4 className="font-extrabold text-lg italic uppercase">Online Payment</h4>
                <p className="text-xs text-slate-500 font-bold">QRIS, Transfer, E-Wallet</p>
              </div>
            </button>
          </div>

          <div className="mt-10 pt-8 border-t-2 border-slate-100">
            <button
              disabled={!method || loading}
              onClick={() => method === 'online' ? handleOnlinePayment() : alert("Silakan datang ke sekolah untuk pembayaran tunai.")}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl uppercase shadow-[0px_8px_0px_0px_rgba(30,58,138,1)] hover:shadow-none hover:translate-y-1 transition-all disabled:bg-slate-200"
            >
              {loading ? "Menyiapkan..." : "Bayar Sekarang"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}