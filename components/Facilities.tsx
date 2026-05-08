"use client";

import { useState, useEffect } from "react";

export default function Profile() {
  const images = [
    "/foto-kawis1.jpeg",
    "/foto-kawis2.jpeg", 
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [currentIndex]);

  return (
    <section id="profil" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Fasilitas Sekolah</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Berdiri sejak tahun 2010, SMA Kawis berkomitmen untuk menciptakan lingkungan belajar yang adaptif terhadap teknologi tanpa meninggalkan nilai karakter.
          </p>
        </div>
        
        {/* Grid Container */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* --- 1. TEKS KONTEN (SEKARANG DI KIRI) --- */}
          <div className="space-y-8 order-2 md:order-1">
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-blue-200">
                1
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-slate-900">Visi Kami</h4>
                <p className="text-slate-600 leading-relaxed">
                  Menjadi lembaga pendidikan unggulan yang mencetak pemimpin masa depan dengan integritas tinggi dan wawasan global.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-blue-200">
                2
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-slate-900">Kurikulum Adaptif</h4>
                <p className="text-slate-600 leading-relaxed">
                  Menggabungkan kurikulum nasional dengan penguatan pada literasi digital, coding, dan penguasaan bahasa asing.
                </p>
              </div>
            </div>
          </div>

          {/* --- 2. SLIDE IMAGE CONTAINER (SEKARANG DI KANAN) --- */}
          <div className="relative group bg-slate-100 aspect-video rounded-3xl overflow-hidden shadow-2xl order-1 md:order-2">
            <img 
              src={images[currentIndex]} 
              alt={`Slide ${currentIndex + 1}`} 
              className="w-full h-full object-cover transition-all duration-700"
            />

            {/* Navigasi */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-slate-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-slate-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${index === currentIndex ? "bg-white w-8" : "bg-white/40 w-1.5"}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}