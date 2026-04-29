"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Pendaftar } from "@/types/pendaftaran"; // Pastikan path ini sesuai dengan file types kamu

export default function DummyPage() {
  const [listPendaftar, setListPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil data dan mengurutkan berdasarkan waktu pendaftaran terbaru
        const q = query(collection(db, "pendaftar"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pendaftar[];

        setListPendaftar(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">DATA PENDAFTAR (Cuma Test)</h1>
            <p className="text-slate-500"> semua data siswa yang masuk ke database Firestore.</p>
          </div>
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
            Total: {listPendaftar.length} Siswa
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-sm uppercase tracking-wider text-slate-700">Nama Lengkap</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider text-slate-700">Asal Sekolah</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider text-slate-700">WhatsApp</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listPendaftar.length > 0 ? (
                  listPendaftar.map((siswa) => (
                    <tr key={siswa.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-semibold text-slate-900">{siswa.namaLengkap}</td>
                      <td className="p-4 text-slate-600">{siswa.asalSekolah}</td>
                      <td className="p-4 text-slate-600">{siswa.whatsapp}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          siswa.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          siswa.status === 'diterima' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {siswa.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-slate-400 italic">
                      Belum ada data pendaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/" className="text-sm font-bold text-blue-600 hover:underline">
            ← Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}