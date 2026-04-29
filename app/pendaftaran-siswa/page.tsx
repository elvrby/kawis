"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Schema Validasi
const formSchema = z.object({
  namaLengkap: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  whatsapp: z.string().min(10, "Minimal 10 digit"),
  asalSekolah: z.string().min(2, "Asal sekolah wajib diisi"),
  jurusan: z.string().min(1, "Pilih jurusan"),
});

type FormData = z.infer<typeof formSchema>;

export default function DaftarPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addDoc(collection(db, "pendaftar"), {
        ...data,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      alert("Pendaftaran Berhasil!");
      reset();
    } catch (err) {
      alert("Terjadi kesalahan, coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation / Header */}
      <nav className="border-b border-slate-200 py-4 px-6 mb-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-blue-700">SMA NEGERI KAWIS</h1>
          <a href="/" className="text-sm font-medium hover:text-blue-600 transition">Kembali ke Beranda</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pb-20">
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Formulir Pendaftaran</h2>
          <p className="text-slate-600 text-lg">
            Tahun Ajaran 2026/2027. Pastikan data yang dimasukkan sesuai dengan dokumen asli.
          </p>
        </div>

        {/* Form Card */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Input Nama */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700">Nama Lengkap Siswa</label>
              <input
                {...register("namaLengkap")}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:ring-0 outline-none transition text-slate-900 placeholder:text-slate-400"
                placeholder="Contoh: Andi Pratama"
              />
              {errors.namaLengkap && <p className="text-red-600 text-sm font-medium">{errors.namaLengkap.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-700">Email Aktif</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-none transition text-slate-900"
                  placeholder="name@email.com"
                />
                {errors.email && <p className="text-red-600 text-sm font-medium">{errors.email.message}</p>}
              </div>

              {/* Input WA */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-700">No. WhatsApp</label>
                <input
                  {...register("whatsapp")}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-none transition text-slate-900"
                  placeholder="0812xxxx"
                />
                {errors.whatsapp && <p className="text-red-600 text-sm font-medium">{errors.whatsapp.message}</p>}
              </div>
            </div>

            {/* Input Asal Sekolah */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700">Asal Sekolah (SMP/MTS)</label>
              <input
                {...register("asalSekolah")}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-none transition text-slate-900"
              />
            </div>

            {/* Select Jurusan */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700">Pilihan Jurusan</label>
              <select
                {...register("jurusan")}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-none transition text-slate-900 appearance-none"
              >
                <option value="">Pilih Jurusan...</option>
                <option value="IPA">MIPA (Matematika & IPA)</option>
                <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                <option value="Bahasa">Bahasa & Budaya</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-[0.98] disabled:bg-slate-300 shadow-lg shadow-slate-200"
              >
                {isSubmitting ? "MENGIRIM DATA..." : "KIRIM PENDAFTARAN SEKARANG"}
              </button>
              <p className="text-center text-xs text-slate-500 mt-4">
                Dengan mengklik tombol, Anda menyetujui syarat dan ketentuan yang berlaku.
              </p>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}