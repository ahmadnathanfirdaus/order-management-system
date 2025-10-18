const products = [
  {
    id: "prod_001",
    title: "Headphone ZX Pro",
    category: "Elektronik/Audio",
    price: 1099000,
    stock: 28,
    images: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Headphone wireless dengan active noise cancelling dan koneksi multipoint.",
    specs: {
      "Noise Cancelling": "Aktif",
      Baterai: "30 jam",
      Berat: "250 g"
    }
  },
  {
    id: "prod_002",
    title: "Smartwatch Pulse S3",
    category: "Elektronik/Wearable",
    price: 1799000,
    stock: 42,
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Smartwatch dengan sensor kesehatan lengkap dan GPS built-in.",
    specs: {
      Layar: "1.43\" AMOLED",
      Baterai: "10 hari",
      Ketahanan: "5ATM"
    }
  },
  {
    id: "prod_003",
    title: "Laptop Ultrabook Aero 14",
    category: "Elektronik/Laptop",
    price: 16999000,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484807352052-23338990c6c6?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ultrabook ringan dengan layar 14 inci dan prosesor Intel Core i7 generasi terbaru.",
    specs: {
      Prosesor: "Intel Core i7-1360P",
      RAM: "16 GB",
      Storage: "512 GB SSD"
    }
  },
  {
    id: "prod_004",
    title: "Kamera Mirrorless Vista M50",
    category: "Hobi/Fotografi",
    price: 12499000,
    stock: 9,
    images: [
      "https://images.unsplash.com/photo-1519183071298-a2962be90b8e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Kamera mirrorless sensor APS-C dengan layar flip dan Wi-Fi built-in.",
    specs: {
      Sensor: "24 MP APS-C",
      Video: "4K 30 fps",
      Berat: "387 g"
    }
  },
  {
    id: "prod_005",
    title: "Paket Meja Kerja Minimalis",
    category: "Kantor/Furniture",
    price: 2299000,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Meja kerja dengan finishing kayu natural dan rak penyimpanan terintegrasi.",
    specs: {
      Material: "Kayu MDF + Baja",
      Dimensi: "120 x 60 x 75 cm",
      "Beban Maks": "120 kg"
    }
  },
  {
    id: "prod_006",
    title: "Sneakers RunLite 2.0",
    category: "Fashion/Pria",
    price: 879000,
    stock: 36,
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Sepatu lari ringan dengan bantalan responsif untuk aktivitas sehari-hari.",
    specs: {
      Material: "Mesh breathable",
      Sol: "EVA + Rubber",
      Berat: "240 g"
    }
  },
  {
    id: "prod_007",
    title: "Coffee Maker DripPro",
    category: "Rumah Tangga/Dapur",
    price: 1299000,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Mesin kopi drip dengan timer otomatis dan tangki 1,5 liter.",
    specs: {
      Daya: "900 W",
      Kapasitas: "1.5 L",
      Fitur: "Timer 24 jam"
    }
  },
  {
    id: "prod_008",
    title: "Set Wajan Granite 5in1",
    category: "Rumah Tangga/Dapur",
    price: 999000,
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528731708534-816fe59f90cb?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Set wajan granite anti lengket terdiri dari 5 ukuran berbeda.",
    specs: {
      Material: "Granite coating",
      Isi: "5 pcs",
      Kompatibilitas: "Semua jenis kompor"
    }
  },
  {
    id: "prod_009",
    title: "Tas Ransel Urban Explorer",
    category: "Fashion/Aksesoris",
    price: 579000,
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522199992905-dc97e24c8475?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ransel 28 liter tahan air dengan kompartemen laptop 15 inci.",
    specs: {
      Kapasitas: "28 L",
      Material: "Polyester tahan air",
      "Kompartemen Laptop": "15\""
    }
  },
  {
    id: "prod_010",
    title: "Set Dumbbell Adjustable 20 kg",
    category: "Olahraga/Fitness",
    price: 799000,
    stock: 26,
    images: [
      "https://images.unsplash.com/photo-1599058917212-d750089bc07f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526404428533-46c7ffb0987f?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Dumbbell adjustable dengan pilihan beban 2 kg hingga 20 kg.",
    specs: {
      Material: "Iron + ABS",
      "Rentang Beban": "2-20 kg",
      Fitur: "Kunci pengaman cepat"
    }
  },
  {
    id: "prod_011",
    title: "Matras Yoga EcoGrip",
    category: "Olahraga/Yoga",
    price: 349000,
    stock: 55,
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Matras yoga TPE ramah lingkungan dengan grip anti-slip.",
    specs: {
      Material: "TPE",
      Tebal: "6 mm",
      Dimensi: "183 x 61 cm"
    }
  },
  {
    id: "prod_012",
    title: "Paket Skincare Glow Essentials",
    category: "Kecantikan/Perawatan",
    price: 459000,
    stock: 32,
    images: [
      "https://images.unsplash.com/photo-1586495578044-225f13f70b1e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Rangkaian skincare harian terdiri dari cleanser, toner, serum, dan moisturizer.",
    specs: {
      "Jenis Kulit": "Normal - Kombinasi",
      BPOM: "Terdaftar",
      "Isi Paket": "4 produk"
    }
  },
  {
    id: "prod_013",
    title: "Humidifier Aroma Mist",
    category: "Rumah Tangga/Decor",
    price: 289000,
    stock: 47,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Humidifier ultrasonik dengan lampu mood 7 warna dan timer otomatis.",
    specs: {
      Kapasitas: "300 ml",
      Durasi: "4-6 jam",
      Fitur: "Auto-off"
    }
  },
  {
    id: "prod_014",
    title: "Set Peralatan Masak ChefSteel",
    category: "Rumah Tangga/Dapur",
    price: 1499000,
    stock: 21,
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Peralatan masak stainless steel premium berisi 12 buah dengan rak gantung.",
    specs: {
      Material: "Stainless Steel 304",
      Isi: "12 pcs",
      Garansi: "12 bulan"
    }
  },
  {
    id: "prod_015",
    title: "Smart LED Bulb Wi-Fi",
    category: "Elektronik/Smart Home",
    price: 199000,
    stock: 70,
    images: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485115905815-74a5c9fda2fc?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Lampu LED pintar yang mendukung kontrol aplikasi dan asisten suara.",
    specs: {
      Watt: "9W",
      Kecerahan: "800 lumen",
      Konektivitas: "Wi-Fi 2.4 GHz"
    }
  },
  {
    id: "prod_016",
    title: "Helm Sepeda AeroLite",
    category: "Olahraga/Outdoor",
    price: 659000,
    stock: 19,
    images: [
      "https://images.unsplash.com/photo-1529429617124-aee82cd0b21c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Helm sepeda aerodinamis dengan ventilasi 20 lubang dan dial fit system.",
    specs: {
      Berat: "260 g",
      Ukuran: "M/L",
      Sertifikasi: "CE EN1078"
    }
  },
  {
    id: "prod_017",
    title: "Bundle Buku Produktivitas",
    category: "Buku/Motivasi",
    price: 349000,
    stock: 33,
    images: [
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Paket 3 buku best seller bertema produktivitas dan manajemen waktu.",
    specs: {
      "Jumlah Buku": "3",
      Bahasa: "Indonesia",
      Penerbit: "Gramedia"
    }
  },
  {
    id: "prod_018",
    title: "Set Gitar Akustik Beginner",
    category: "Musik/Instrumen",
    price: 1299000,
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1511378792491-7c39fc0b0c34?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Paket gitar akustik full-size lengkap dengan tas, tuner, dan pick.",
    specs: {
      Bahan: "Spruce & Mahogany",
      Ukuran: "41 inci",
      Bonus: "Tas + Tuner elektronik"
    }
  },
  {
    id: "prod_019",
    title: "Baby Carrier ComfortPlus",
    category: "Anak/Bayi",
    price: 749000,
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Gendongan bayi ergonomis dengan 6 posisi dan bantalan pinggang ekstra.",
    specs: {
      "Berat Bayi": "3-20 kg",
      Material: "Cotton breathable",
      Fitur: "Penopang kepala adjustable"
    }
  },
  {
    id: "prod_020",
    title: "Toolkit Otomotif 46 pcs",
    category: "Otomotif/Perawatan",
    price: 569000,
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561599921-990dced4db02?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Set toolkit otomotif 46 pcs dalam kotak ABS dengan kunci soket chrome vanadium.",
    specs: {
      Material: "Chrome vanadium",
      Isi: "46 pcs",
      Garansi: "18 bulan"
    }
  }
];

export default products;
