export default function Profile() {
  return (
    <section id="profil" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Profil Sekolah</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Berdiri sejak tahun 2010, SMA Kawis berkomitmen untuk menciptakan lingkungan belajar yang adaptif terhadap teknologi tanpa meninggalkan nilai karakter.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-slate-100 aspect-video rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
             {/* Ganti dengan <img /> jika ada foto asli */}
             <img src="/gedung-kawis.jpeg" alt="Gedung Utama SMA Kawis" />
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-bold text-lg">Visi Kami</h4>
                <p className="text-slate-600">Menjadi lembaga pendidikan unggulan yang mencetak pemimpin masa depan dengan integritas tinggi.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-bold text-lg">Kurikulum Adaptif</h4>
                <p className="text-slate-600">Menggabungkan kurikulum nasional dengan penguatan pada literasi digital dan kemampuan bahasa asing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}