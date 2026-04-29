export interface Pendaftar {
  id?: string;
  namaLengkap: string;
  asalSekolah: string;
  whatsapp: string;
  email: string;
  status: 'pending' | 'diverifikasi' | 'ditolak' | 'diterima';
  createdAt: any; // Menggunakan Firestore Timestamp
}