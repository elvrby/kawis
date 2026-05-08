export default function Fees() {
  return (
    <section id="biaya" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Estimasi Biaya</h2>
          <p className="text-slate-600">Transparansi biaya pendaftaran untuk tahun ajaran 2026/2027.</p>
        </div>
        
        <div className="overflow-hidden border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 font-bold">Keterangan</th>
                <th className="p-4 font-bold text-right">Biaya (Rp)</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-100">
                <td className="p-4">Pendaftaran (Formulir Online)</td>
                <td className="p-4 text-right">250.000</td>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <td className="p-4">Uang Pangkal (Gedung & Sarana)</td>
                <td className="p-4 text-right">15.000.000</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-4">Seragam & Buku (Paket Lengkap)</td>
                <td className="p-4 text-right">3.500.000</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">SPP per Bulan</td>
                <td className="p-4 text-right font-bold text-blue-600">1.250.000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-4 italic text-center">*Biaya dapat berubah sewaktu-waktu sesuai kebijakan yayasan.</p>
      </div>
    </section>
  );
}