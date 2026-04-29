import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* --- NAVBAR --- */}
      <nav className="border-b border-slate-100 py-4 px-6 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter text-blue-700">
            KA<span className="text-slate-900">WIS</span>
          </div>
          <div className="hidden md:flex gap-8 font-semibold text-sm">
            <a href="#profil" className="hover:text-blue-600 transition">Profil</a>
            <a href="#fasilitas" className="hover:text-blue-600 transition">Fasilitas</a>
            <a href="#akademik" className="hover:text-blue-600 transition">Akademik</a>
          </div>
          <Link 
            href="/pendaftaran-siswa" 
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition"
          >
            Daftar Sekarang
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            Penerimaan Siswa Baru 2026/2027
          </span>
          <h1 className="text-5xl md:text-7xl font-black mt-6 mb-6 leading-tight">
            Membangun Generasi <br /> 
            <span className="text-blue-600 underline decoration-slate-200">Cerdas & Kreatif.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Bergabunglah bersama kami di SMA Kawis, tempat di mana potensi akademik dan karakter siswa dikembangkan secara maksimal dengan fasilitas modern.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link 
              href="/pendaftaran-siswa" 
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              Mulai Pendaftaran Online
            </Link>
            <a 
              href="#profil" 
              className="bg-white border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:border-slate-400 transition-all"
            >
              Lihat Profil Sekolah
            </a>
          </div>
        </div>
      </header>

      {/* --- INFO PENDAFTARAN (DIBUAT SANGAT JELAS) --- */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white border-2 border-blue-600 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold mb-4">Siap untuk Melangkah?</h2>
              <p className="text-slate-600 font-medium">
                Pendaftaran online dibuka hingga <span className="text-slate-900 font-bold underline">30 Juni 2026</span>. 
                Siapkan dokumen seperti KK, Akta Kelahiran, dan Ijazah untuk mempercepat proses.
              </p>
            </div>
            <Link 
              href="/pendaftaran-siswa" 
              className="w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              ISI FORMULIR SEKARANG
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* --- PROFIL & FITUR --- */}
      <section id="profil" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto md:mx-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4v10l-8 4-8-4V6Z"/><path d="M12 22v-10"/><path d="m12 12 8-4"/><path d="m12 12-8-4"/></svg>
            </div>
            <h3 className="text-xl font-bold">Akreditasi A</h3>
            <p className="text-slate-500 leading-relaxed">Menjamin standar kualitas pendidikan internasional dengan kurikulum nasional terbaru.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto md:mx-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3 className="text-xl font-bold">Fasilitas Modern</h3>
            <p className="text-slate-500 leading-relaxed">Lab Komputer, Perpustakaan Digital, dan Lapangan Olahraga standar nasional.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto md:mx-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-2-2"/></svg>
            </div>
            <h3 className="text-xl font-bold">Lulusan Terjamin</h3>
            <p className="text-slate-500 leading-relaxed">Lebih dari 90% alumni diterima di Perguruan Tinggi Negeri ternama setiap tahunnya.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div>
            <p className="text-2xl font-black mb-4">EDUCORE</p>
            <p className="text-slate-400 max-w-xs">Jl. Pendidikan No. 45, Jakarta Selatan. Terwujudnya sekolah digital unggulan masa depan.</p>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="font-bold mb-4 uppercase text-xs tracking-widest">Informasi</p>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Biaya Sekolah</a></li>
                <li><a href="#" className="hover:text-white transition">Beasiswa</a></li>
                <li><a href="#" className="hover:text-white transition">Kontak Kami</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4 uppercase text-xs tracking-widest">Aksi</p>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li><Link href="/pendaftaran-siswa" className="hover:text-white transition">Daftar Sekarang</Link></li>
                <li><a href="#" className="hover:text-white transition">Cek Status</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
          &copy; 2026 SMA EduCore. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}