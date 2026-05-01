"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

const formSchema = z.object({
  namaLengkap: z.string().min(3, "Nama minimal 3 karakter"),
  nisn: z.string().length(10, "NISN harus 10 digit"),
  tempatLahir: z.string().min(2, "Tempat lahir wajib diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"], {
    error: () => ({ message: "Pilih jenis kelamin" }),
  }),
  noKK: z.string().length(16, "Nomor KK harus 16 digit"),
  email: z.string().email("Email tidak valid"),
  whatsapp: z.string().min(10, "Minimal 10 digit"),
  asalSekolah: z.string().min(2, "Asal sekolah wajib diisi"),
  jurusan: z.string().min(1, "Pilih jurusan"),
});

type FormData = z.infer<typeof formSchema>;

export default function DaftarPage() {
  const router = useRouter();

  // State untuk Custom Alert
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  }>({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertConfig({ show: true, title, message, type });
  };

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    showAlert("Form Belum Lengkap", firstError.message, "warning");
  };

  const onSubmit = async (data: FormData) => {
    try {
      // 1. Generate Kode Pembayaran Acak
      const paymentCode = nanoid(12);

      // 2. Simpan ke Firestore dengan paymentCode
      await addDoc(collection(db, "pendaftar"), {
        ...data,
        status: "pending",
        tagihan: 100000,
        paymentCode: paymentCode,
        createdAt: serverTimestamp(),
      });

      // 3. Kirim Email Instruksi Pembayaran melalui API Route
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          nama: data.namaLengkap,
          link: `${window.location.origin}/pembayaran/${paymentCode}`,
          total: "100.000",
        }),
      });

      showAlert("Berhasil!", "Data pendaftaran telah terkirim. Cek email Anda untuk instruksi pembayaran.", "success");
      
      reset();

      // 4. Alihkan ke halaman pembayaran unik setelah 2 detik
      setTimeout(() => {
        router.push(`/pembayaran/${paymentCode}`);
      }, 2500);

    } catch (err) {
      console.error(err);
      showAlert("Kesalahan Sistem", "Gagal mengirim data, silakan coba lagi nanti.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans pb-20 relative">
      
      {/* CUSTOM MODAL ALERT */}
      {alertConfig.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border-[3px] border-black rounded-[24px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border-2 border-black ${
              alertConfig.type === 'success' ? 'bg-green-400' : 
              alertConfig.type === 'error' ? 'bg-red-400' : 'bg-yellow-400'
            }`}>
              {alertConfig.type === 'success' ? '✓' : alertConfig.type === 'error' ? '✕' : '!'}
            </div>
            <h3 className="text-xl font-extrabold uppercase mb-2 italic tracking-tight">{alertConfig.title}</h3>
            <p className="text-slate-600 font-medium text-sm mb-6 leading-relaxed">{alertConfig.message}</p>
            <button 
              onClick={() => setAlertConfig({ ...alertConfig, show: false })}
              className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white py-5 px-8 sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-extrabold tracking-tight italic">
            KAWIS<span className="text-blue-600">.EDU</span>
          </h1>
          <a href="/" className="text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition">Kembali</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 mt-12">
        <div className="bg-white border-[3px] border-black rounded-[32px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          
          <div className="p-8 md:p-12 border-b-2 border-slate-100">
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Registration 2026</div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Join the Academy</h2>
            <p className="text-slate-500 mt-2 font-medium">Lengkapi formulir di bawah untuk mendaftarkan diri.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="p-8 md:p-12 space-y-10">
            
            {/* DATA DIRI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Nama Lengkap</label>
                <input {...register("namaLengkap")} className="py-2 border-b border-slate-200 focus:border-blue-600 outline-none transition text-lg font-medium placeholder:text-slate-300" placeholder="Andi Pratama" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">NISN</label>
                <input {...register("nisn")} className="py-2 border-b border-slate-200 focus:border-blue-600 outline-none transition text-lg font-medium" placeholder="00xxxxxxxx" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tempat Lahir</label>
                <input {...register("tempatLahir")} className="py-2 border-b border-slate-200 focus:border-blue-600 outline-none transition text-lg font-medium" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tanggal Lahir</label>
                <input type="date" {...register("tanggalLahir")} className="py-2 border-b border-slate-200 focus:border-blue-600 outline-none transition text-lg font-medium" />
              </div>
              
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Jenis Kelamin</label>
                <div className="flex gap-4 mt-2">
                  {["Laki-laki", "Perempuan"].map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" value={item} {...register("jenisKelamin")} className="w-5 h-5 border-2 border-black checked:bg-blue-600 transition appearance-none rounded-full checked:border-[5px]" />
                      <span className="font-medium group-hover:text-blue-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ADMINISTRASI */}
            <div className="space-y-8 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">No. Kartu Keluarga</label>
                  <input {...register("noKK")} className="py-2 border-b border-slate-200 focus:border-blue-600 outline-none transition text-lg font-medium" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">No. WhatsApp</label>
                  <input {...register("whatsapp")} className="py-2 border-b border-slate-200 focus:border-blue-600 outline-none transition text-lg font-medium" placeholder="08..." />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Asal Sekolah</label>
                  <input {...register("asalSekolah")} className="py-2 border-b border-slate-200 focus:border-blue-600 outline-none transition text-lg font-medium" placeholder="SMP..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Email Aktif</label>
                  <input {...register("email")} className="py-2 border-b border-slate-200 focus:border-blue-600 outline-none transition text-lg font-medium" />
                </div>
              </div>
            </div>

            {/* PILIHAN JURUSAN */}
            <div className="pt-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-3 group focus-within:border-blue-600 transition">
                <label className="text-xs font-extrabold uppercase text-blue-600 tracking-widest">Pilih Jurusan</label>
                <select {...register("jurusan")} className="bg-transparent border-none text-2xl font-bold focus:ring-0 outline-none cursor-pointer appearance-none">
                  <option value="">Pilih Jurusan...</option>
                  <option value="IPA">MIPA (Sains)</option>
                  <option value="IPS">IPS (Sosial)</option>
                  <option value="BAHASA">Bahasa & Budaya</option>
                </select>
              </div>
            </div>

            {/* BUTTON DAFTAR */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl shadow-[0px_8px_0px_0px_rgba(30,58,138,1)] hover:shadow-none hover:translate-y-1 transition-all disabled:bg-slate-300 disabled:shadow-none active:scale-95"
              >
                {isSubmitting ? "Sedang Mengirim..." : "Daftar Sekarang"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}