"use client";

import { useState, useEffect } from "react";
import { CreditCard, Banknote } from "lucide-react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function PembayaranPage() {
  const params = useParams();
  const paymentCodeUrl = params.id as string; 
  
  const [userData, setUserData] = useState<any>(null);
  const [method, setMethod] = useState<"Cash" | "Online" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!paymentCodeUrl) return;

    const q = query(collection(db, "pendaftar"), where("paymentCode", "==", paymentCodeUrl));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setUserData({ docId: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setUserData("LUNAS");
      }
    });

    return () => unsubscribe();
  }, [paymentCodeUrl]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleProsesPembayaran = async () => {
    if (!userData || userData === "LUNAS" || !method) return;
    
    setLoading(true);
    try {
      // 1. Update Metode Pembayaran ke Firestore terlebih dahulu
      const userRef = doc(db, "pendaftar", userData.docId);
      await updateDoc(userRef, {
        paymentMethod: method,
      });

      if (method === "Online") {
        // 2. Jika Online, panggil Midtrans
        const response = await fetch("/api/tokenizer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userData.paymentCode,
            nama: userData.namaLengkap,
            email: userData.email,
            total: 100000, 
          }),
        });

        const data = await response.json();
        if (!data.token) throw new Error("Gagal mengambil token");

        // @ts-ignore
        window.snap.pay(data.token, {
          onSuccess: () => alert("Pembayaran Berhasil!"),
          onPending: () => alert("Harap selesaikan pembayaran."),
          onError: () => alert("Pembayaran gagal, silakan coba lagi."),
        });
      } else {
        // 3. Jika Cash
        alert("Metode Tunai dipilih. Silakan datang ke TU Sekolah dan tunjukkan Kode Pendaftaran Anda.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  if (userData === "LUNAS" || userData?.status === "Siswa") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center border-[3px] border-black p-10 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-20 h-20 bg-green-400 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
          <h2 className="text-3xl font-black italic uppercase">PEMBAYARAN LUNAS</h2>
          <p className="font-bold text-slate-500 mt-2">Selamat! Anda sekarang resmi menjadi Siswa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 pb-20">
      <main className="max-w-2xl mx-auto px-6 mt-16">
        <div className="bg-white border-[3px] border-black rounded-[32px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
          <header className="text-center mb-10">
             <h2 className="text-3xl font-black uppercase text-blue-600 italic">Metode Pembayaran</h2>
             <p className="text-slate-500 font-bold mt-2 italic">KODE: {paymentCodeUrl}</p>
          </header>

          <div className="grid grid-cols-1 gap-4">
             <button
              onClick={() => setMethod("Cash")}
              className={`flex items-center p-6 border-2 rounded-2xl transition-all ${
                method === "Cash" ? "border-black bg-blue-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-slate-200"
              }`}
            >
              <Banknote className="mr-4 text-green-600" />
              <div className="text-left">
                <h4 className="font-extrabold text-lg italic uppercase">Cash / Tunai</h4>
                <p className="text-xs text-slate-500 font-bold">Bayar di sekolah</p>
              </div>
            </button>

            <button
              onClick={() => setMethod("Online")}
              className={`flex items-center p-6 border-2 rounded-2xl transition-all ${
                method === "Online" ? "border-black bg-blue-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-slate-200"
              }`}
            >
              <CreditCard className="mr-4 text-blue-600" />
              <div className="text-left">
                <h4 className="font-extrabold text-lg italic uppercase">Online Payment</h4>
                <p className="text-xs text-slate-500 font-bold">QRIS, VA, E-Wallet</p>
              </div>
            </button>
          </div>

          <div className="mt-10 pt-8 border-t-2">
            <button
              disabled={!method || loading}
              onClick={handleProsesPembayaran}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl uppercase shadow-[0px_8px_0px_0px_rgba(30,58,138,1)] active:shadow-none active:translate-y-1 transition-all disabled:bg-slate-200"
            >
              {loading ? "Memproses..." : "Konfirmasi & Bayar"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}