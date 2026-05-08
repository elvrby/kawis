import Link from 'next/link';
import Profile from '@/components/Profile';
import Facilities from '@/components/Facilities';
import Fees from '@/components/Fees';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* --- NAVBAR --- */}
      <nav className="border-b border-slate-100 py-4 px-6 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter text-blue-700">
            KA<span className="text-slate-900">WIS</span>
          </div>
          <div className="hidden md:flex gap-8 font-semibold text-sm text-slate-600">
            <a href="#profil" className="hover:text-blue-600 transition">Profil</a>
            <a href="#fasilitas" className="hover:text-blue-600 transition">Fasilitas</a>
            {/* Ganti Akademik ke Biaya */}
            <a href="#biaya" className="hover:text-blue-600 transition">Biaya</a>
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
            Bergabunglah bersama kami di SMA Kawis, tempat di mana potensi akademik dan karakter siswa dikembangkan secara maksimal.
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
              Liat Profil Sekolah
            </a>
          </div>
        </div>
      </header>

      {/* --- RENDER KOMPONEN DI SINI --- */}
      <Profile />
      <Facilities />
      <Fees />

      {/* --- INFO PENDAFTARAN --- */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white border-2 border-blue-600 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold mb-4">Siap untuk Melangkah?</h2>
              <p className="text-slate-600 font-medium">
                Pendaftaran online dibuka hingga <span className="text-slate-900 font-bold underline">30 Juni 2026</span>. 
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

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white py-12 px-6 text-center md:text-left">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div>
            <p className="text-2xl font-black mb-4">KAWIS</p>
            <p className="text-slate-400 max-w-xs mx-auto md:mx-0 text-sm">Jl. Pendidikan No. 45, Jakarta Selatan. Terwujudnya sekolah digital unggulan masa depan.</p>
          </div>
          <div className="flex justify-center md:justify-end gap-16">
            <div>
              <p className="font-bold mb-4 uppercase text-xs tracking-widest">Aksi</p>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li><Link href="/pendaftaran-siswa" className="hover:text-white transition">Daftar Sekarang</Link></li>
                <li><a 
                      href="https://wa.me/6285743742360?text=Halo%20Admin%20SMA%20Kawis,%20saya%20ingin%20bertanya%20tentang%20pendaftaran." 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-blue-600 transition"
                    >
                      Kontak Kami
                    </a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}