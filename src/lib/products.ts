import type { ComparisonRow, Product, ProductPackage } from "@/lib/types";

const tierNames = [
  { id: "basic", name: "Basic" },
  { id: "pro", name: "Pro" },
  { id: "business", name: "Business" },
] as const;

function packages(
  prices: Array<[number, number]>,
  highlights: [string[], string[], string[]],
): ProductPackage[] {
  return tierNames.map((tier, index) => ({
    id: tier.id,
    name: tier.name,
    price: prices[index][0],
    promoPrice: prices[index][1],
    highlights: highlights[index],
  }));
}

function product(input: {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  features: string[];
  promoQuota: number;
  prices: Array<[number, number]>;
  highlights: [string[], string[], string[]];
  comparison: ComparisonRow[];
}): Product {
  return {
    slug: input.slug,
    name: input.name,
    category: input.category,
    summary: input.summary,
    description: input.description,
    features: input.features,
    promoQuota: input.promoQuota,
    packages: packages(input.prices, input.highlights),
    comparison: input.comparison,
  };
}

export const products: Product[] = [
  product({
    slug: "kodeva-kasir",
    name: "Kodeva Kasir",
    category: "operasional",
    summary: "Terima bayar, cetak struk, dan tutup kasir harian dari satu layar.",
    description:
      "Kodeva Kasir dipakai di konter, kafe, dan toko kelontong. Harga promo dihitung per lisensi, yaitu per pengguna atau outlet.",
    features: ["Struk digital dan cetak", "Tutup kasir per shift", "Metode bayar tunai dan QR"],
    promoQuota: 40,
    prices: [
      [99000, 79000],
      [199000, 149000],
      [349000, 279000],
    ],
    highlights: [
      ["1 perangkat", "Laporan harian"],
      ["3 perangkat", "Laporan shift"],
      ["10 perangkat", "Multi outlet"],
    ],
    comparison: [
      { label: "Perangkat kasir", basic: "1", pro: "3", business: "10" },
      { label: "Struk digital", basic: "Ya", pro: "Ya", business: "Ya" },
      { label: "Laporan shift", basic: "Tidak", pro: "Ya", business: "Ya" },
      { label: "Multi outlet", basic: "Tidak", pro: "Tidak", business: "Ya" },
    ],
  }),
  product({
    slug: "kodeva-inventori",
    name: "Kodeva Inventori",
    category: "operasional",
    summary: "Stok gudang dan etalase ikut bergerak setiap ada penjualan.",
    description:
      "Catat barang masuk, barang rusak, dan stok minimum. Cocok untuk usaha yang jual lebih dari satu lokasi.",
    features: ["Kartu stok", "Peringatan stok minimum", "Opname sederhana"],
    promoQuota: 25,
    prices: [
      [79000, 59000],
      [149000, 119000],
      [249000, 199000],
    ],
    highlights: [
      ["1 gudang", "500 SKU"],
      ["3 gudang", "SKU tidak dibatasi"],
      ["Transfer antar gudang", "Hak akses staf"],
    ],
    comparison: [
      { label: "Gudang", basic: "1", pro: "3", business: "10" },
      { label: "Batas SKU", basic: "500", pro: "Tidak dibatasi", business: "Tidak dibatasi" },
      { label: "Transfer stok", basic: "Tidak", pro: "Ya", business: "Ya" },
      { label: "Hak akses staf", basic: "Tidak", pro: "Tidak", business: "Ya" },
    ],
  }),
  product({
    slug: "kodeva-hr",
    name: "Kodeva HR & Payroll",
    category: "sdm",
    summary: "Hitung gaji, tunjangan, dan potongan tanpa spreadsheet terpisah.",
    description:
      "Tim HR mengisi kehadiran dan komponen gaji. Slip bisa diunduh karyawan. Satu lisensi untuk satu pengguna admin atau satu badan usaha, sesuai paket.",
    features: ["Slip gaji", "Komponen tunjangan", "Rekap bulanan"],
    promoQuota: 30,
    prices: [
      [129000, 99000],
      [249000, 189000],
      [449000, 349000],
    ],
    highlights: [
      ["Sampai 15 karyawan", "Slip PDF"],
      ["Sampai 80 karyawan", "Multi komponen"],
      ["Karyawan tidak dibatasi", "Multi perusahaan"],
    ],
    comparison: [
      { label: "Karyawan", basic: "15", pro: "80", business: "Tidak dibatasi" },
      { label: "Slip gaji", basic: "Ya", pro: "Ya", business: "Ya" },
      { label: "Lembur otomatis", basic: "Tidak", pro: "Ya", business: "Ya" },
      { label: "Multi perusahaan", basic: "Tidak", pro: "Tidak", business: "Ya" },
    ],
  }),
  product({
    slug: "kodeva-absensi",
    name: "Kodeva Absensi",
    category: "sdm",
    summary: "Absen tim toko dan tim lapangan, lalu kirim rekap ke payroll.",
    description:
      "Absensi berdiri sendiri atau dilanjutkan ke Kodeva HR. Kuota promo dihitung per lisensi perangkat admin.",
    features: ["Absen masuk dan pulang", "Rekap keterlambatan", "Ekspor ke payroll"],
    promoQuota: 50,
    prices: [
      [49000, 39000],
      [99000, 79000],
      [179000, 139000],
    ],
    highlights: [
      ["1 lokasi", "Rekap bulanan"],
      ["5 lokasi", "Shift"],
      ["Lokasi tidak dibatasi", "API ke payroll"],
    ],
    comparison: [
      { label: "Lokasi", basic: "1", pro: "5", business: "Tidak dibatasi" },
      { label: "Shift", basic: "Tidak", pro: "Ya", business: "Ya" },
      { label: "Foto absen", basic: "Tidak", pro: "Ya", business: "Ya" },
      { label: "Kirim ke payroll", basic: "Tidak", pro: "Tidak", business: "Ya" },
    ],
  }),
  product({
    slug: "kodeva-akuntansi",
    name: "Kodeva Akuntansi",
    category: "keuangan",
    summary: "Jurnal, laba rugi, dan arus kas yang siap diperiksa.",
    description:
      "Untuk pemilik yang ingin angka usaha rapi tanpa menunggu akhir tahun. Promo berlaku selama kuota lisensi produk ini masih ada.",
    features: ["Jurnal umum", "Laba rugi", "Arus kas"],
    promoQuota: 20,
    prices: [
      [149000, 119000],
      [279000, 219000],
      [499000, 399000],
    ],
    highlights: [
      ["1 buku", "Laporan bulanan"],
      ["3 buku", "Neraca"],
      ["Multi entitas", "Tutup buku"],
    ],
    comparison: [
      { label: "Buku usaha", basic: "1", pro: "3", business: "Tidak dibatasi" },
      { label: "Laba rugi", basic: "Ya", pro: "Ya", business: "Ya" },
      { label: "Neraca", basic: "Tidak", pro: "Ya", business: "Ya" },
      { label: "Tutup buku", basic: "Tidak", pro: "Tidak", business: "Ya" },
    ],
  }),
  product({
    slug: "kodeva-invoice",
    name: "Kodeva Invoice",
    category: "keuangan",
    summary: "Kirim tagihan dan tandai lunas tanpa mengejar lewat chat.",
    description:
      "Invoice punya tautan status yang bisa dibagikan ke pelanggan. Harga mengikuti paket dan jangka waktu yang dipilih.",
    features: ["Template tagihan", "Status lunas", "Pengingat jatuh tempo"],
    promoQuota: 35,
    prices: [
      [69000, 49000],
      [129000, 99000],
      [229000, 179000],
    ],
    highlights: [
      ["30 invoice / bulan", "1 pengguna"],
      ["Invoice tidak dibatasi", "3 pengguna"],
      ["Merek sendiri", "10 pengguna"],
    ],
    comparison: [
      { label: "Invoice per bulan", basic: "30", pro: "Tidak dibatasi", business: "Tidak dibatasi" },
      { label: "Pengguna", basic: "1", pro: "3", business: "10" },
      { label: "Pengingat", basic: "Tidak", pro: "Ya", business: "Ya" },
      { label: "Merek sendiri", basic: "Tidak", pro: "Tidak", business: "Ya" },
    ],
  }),
  product({
    slug: "kodeva-crm",
    name: "Kodeva CRM",
    category: "addon",
    summary: "Catat follow-up pelanggan supaya promo tidak berhenti di chat.",
    description:
      "Add-on untuk tim yang sudah memakai kasir atau invoice dan ingin jadwal follow-up yang jelas.",
    features: ["Pipeline sederhana", "Jadwal follow-up", "Catatan pelanggan"],
    promoQuota: 15,
    prices: [
      [89000, 69000],
      [169000, 129000],
      [299000, 239000],
    ],
    highlights: [
      ["200 kontak", "1 pipeline"],
      ["Kontak tidak dibatasi", "3 pipeline"],
      ["Tim penjualan", "Target bulanan"],
    ],
    comparison: [
      { label: "Kontak", basic: "200", pro: "Tidak dibatasi", business: "Tidak dibatasi" },
      { label: "Pipeline", basic: "1", pro: "3", business: "Tidak dibatasi" },
      { label: "Pengingat follow-up", basic: "Ya", pro: "Ya", business: "Ya" },
      { label: "Target tim", basic: "Tidak", pro: "Tidak", business: "Ya" },
    ],
  }),
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
