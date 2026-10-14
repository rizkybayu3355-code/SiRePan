const PATHOGENS_DATABASE = [
    {
        "id": "PATH_001",
        "nama_patogen": "Staphylococcus aureus (Enterotoksin)",
        "referensi_lembaga": "CDC / BPOM",
        "min_inkubasi_jam": 1,
        "max_inkubasi_jam": 8,
        "gejala_khas": ["Mual", "Muntah hebat", "Kram perut", "Diare ringan"],
        "makanan_berisiko": ["Produk olahan daging", "Santan", "Keju", "Salad", "Makanan berprotein tinggi di suhu ruang"],
        "pertolongan_pertama": [
            "Istirahat total dan hindari makanan padat selama fase akut muntah.",
            "Rehidrasi bertahap menggunakan oralit atau air kaldu hangat dalam jumlah kecil namun sering.",
            "Jangan langsung meminum obat penghenti muntah/diare tanpa anjuran medis."
        ],
        "lab_inspection_steps": [
            "Uji mikrobiologi untuk mendeteksi enterotoksin stafilokokus pada sampel sisa makanan.",
            "Kultur bakteri dari spesimen muntahan atau usap luka penjamah makanan."
        ]
    },
    {
        "id": "PATH_002",
        "nama_patogen": "Salmonella spp. (Salmonelosis Non-Tifoid)",
        "referensi_lembaga": "WHO / CDC",
        "min_inkubasi_jam": 6,
        "max_inkubasi_jam": 72,
        "gejala_khas": ["Demam", "Diare berdarah/mukoid", "Kram perut", "Mual", "Menggigil"],
        "makanan_berisiko": ["Daging unggas setengah matang", "Telur mentah", "Susu tidak dipasteurisasi", "Produk segar terkontaminasi"],
        "pertolongan_pertama": [
            "Segera ganti cairan tubuh dengan larutan rehidrasi oral untuk mencegah dehidrasi berat.",
            "Kompres hangat untuk meredakan kram perut.",
            "Segera konsultasi ke dokter jika demam tinggi tidak kunjung turun."
        ],
        "lab_inspection_steps": [
            "Kultur feses atau darah pada media selektif (misal: SS Agar, XLD Agar).",
            "Uji biokimia dan serologis untuk konfirmasi spesies Salmonella."
        ]
    },
    {
        "id": "PATH_003",
        "nama_patogen": "Escherichia coli Patogenik (ETEC/EHEC)",
        "referensi_lembaga": "WHO / BPOM",
        "min_inkubasi_jam": 12,
        "max_inkubasi_jam": 72,
        "gejala_khas": ["Diare cair parah", "Kram perut hebat", "Mual", "Demam ringan", "Darah dalam feses (kasus berat)"],
        "makanan_berisiko": ["Air tercemar", "Sayuran mentah", "Daging sapi kurang matang", "Buah potong tidak higienis"],
        "pertolongan_pertama": [
            "Lakukan rehidrasi agresif menggunakan cairan elektrolit.",
            "Hindari konsumsi produk susu dan makanan berserat tinggi sementara waktu.",
            "Waspadai tanda dehidrasi berat dan segera ke fasilitas medis terdekat."
        ],
        "lab_inspection_steps": [
            "Uji isolasi kultur pada media MacConkey / EMB Agar.",
            "Deteksi gen toksin menggunakan metode PCR atau uji aglutinasi."
        ]
    },
    {
        "id": "PATH_004",
        "nama_patogen": "Bacillus cereus (Tipe Emetik & Diare)",
        "referensi_lembaga": "FDA / CDC",
        "min_inkubasi_jam": 1,
        "max_inkubasi_jam": 16,
        "gejala_khas": ["Muntah", "Mual", "Kram perut", "Diare berair"],
        "makanan_berisiko": ["Nasi sisa yang dibiarkan di suhu ruang", "Pasta", "Makanan berpati yang tidak segera didinginkan"],
        "pertolongan_pertama": [
            "Istirahat cukup dan konsumsi air putih atau oralit sedikit demi sedikit.",
            "Hindari makanan berat berlemak atau pedas.",
            "Pantau frekuensi muntah untuk menghindari syok dehidrasi."
        ],
        "lab_inspection_steps": [
            "Enumerasi spora dan sel B. cereus pada sampel makanan sisa.",
            "Identifikasi toksin emetik (cereulide) atau enterotoksin diare."
        ]
    },
    {
        "id": "PATH_005",
        "nama_patogen": "Clostridium perfringens",
        "referensi_lembaga": "CDC / USDA",
        "min_inkubasi_jam": 8,
        "max_inkubasi_jam": 16,
        "gejala_khas": ["Kram perut hebat", "Diare berair", "Mual tanpa muntah"],
        "makanan_berisiko": ["Daging sapi", "Daging unggas", "Hidangan berkuah kental (stew) yang dimasak dalam jumlah besar dan dibiarkan hangat lama"],
        "pertolongan_pertama": [
            "Perbanyak istirahat dan konsumsi cairan elektrolit.",
            "Biasanya gejala akan membaik dengan sendirinya dalam 24 jam.",
            "Segera periksa ke dokter jika gejala bertahan lebih dari 2 hari."
        ],
        "lab_inspection_steps": [
            "Hitung jumlah spora C. perfringens pada sampel tinja atau sisa makanan.",
            "Uji deteksi enterotoksin dalam feses."
        ]
    },
    {
        "id": "PATH_006",
        "nama_patogen": "Vibrio parahaemolyticus",
        "referensi_lembaga": "WHO / BPOM",
        "min_inkubasi_jam": 12,
        "max_inkubasi_jam": 24,
        "gejala_khas": ["Diare cair", "Kram perut", "Mual", "Muntah", "Demam ringan"],
        "makanan_berisiko": ["Ikan laut mentah/setengah matang", "Kerang", "Udang", "Makanan laut (seafood) kontaminan"],
        "pertolongan_pertama": [
            "Cukupi kebutuhan cairan tubuh dengan larutan rehidrasi.",
            "Hindari makanan laut dan makanan pedas selama pemulihan.",
            "Konsultasikan ke tenaga medis untuk pemberian antibiotik jika diperlukan."
        ],
        "lab_inspection_steps": [
            "Kultur pada agar TCBS (Thiosulfate-Citrate-Bile Salts-Sucrose).",
            "Uji biokimia toleransi garam (NaCl)."
        ]
    },
    {
        "id": "PATH_007",
        "nama_patogen": "Clostridium botulinum (Botulisme Pangan)",
        "referensi_lembaga": "CDC / WHO",
        "min_inkubasi_jam": 18,
        "max_inkubasi_jam": 36,
        "gejala_khas": ["Penglihatan ganda", "Sulit menelan", "Kelumpuhan otot", "Mulut kering", "Pingsan", "Sesak"],
        "makanan_berisiko": ["Makanan kaleng rumahan berasam rendah", "Fermentasi ikan/daging anaerobik", "Madu (pada bayi)"],
        "pertolongan_pertama": [
            "Segera bawa pasien ke Instalasi Gawat Darurat (IGD) rumah sakit karena bersifat darurat medis.",
            "Jangan memicu muntah mandiri tanpa pengawasan tenaga medis.",
            "Dibutuhkan penanganan antitoksin secepatnya."
        ],
        "lab_inspection_steps": [
            "Uji bioassay netralisasi toksin pada hewan uji atau ELISA untuk mendeteksi toksin botulinum.",
            "Kultur anaerobik dari sampel makanan."
        ]
    },
    {
        "id": "PATH_008",
        "nama_patogen": "Listeria monocytogenes (Listeriosis)",
        "referensi_lembaga": "FDA / CDC",
        "min_inkubasi_jam": 24,
        "max_inkubasi_jam": 720,
        "gejala_khas": ["Demam", "Menggigil", "Nyeri otot", "Kejang", "Kaku kuduk", "Gangguan pencernaan"],
        "makanan_berisiko": ["Susu mentah", "Keju lunak (brie, feta)", "Daging olahan siap santap (deli meats)", "Sayuran mentah terkontaminasi"],
        "pertolongan_pertama": [
            "Segera konsultasikan ke dokter untuk mendapatkan terapi antibiotik spesifik.",
            "Hindari makanan tinggi risiko terutama bagi ibu hamil dan kelompok rentan.",
            "Istirahat total dan pantau suhu tubuh secara berkala."
        ],
        "lab_inspection_steps": [
            "Isolasi bakteri menggunakan media selektif Fraser Broth / Oxford Agar.",
            "Uji konfirmasi biokimia dan hemolisis."
        ]
    },
    {
        "id": "PATH_009",
        "nama_patogen": "Norovirus (Gastroenteritis Virus)",
        "referensi_lembaga": "CDC / WHO",
        "min_inkubasi_jam": 12,
        "max_inkubasi_jam": 48,
        "gejala_khas": ["Muntah hebat", "Diare cair", "Mual", "Kram perut", "Demam ringan", "Lemmas"],
        "makanan_berisiko": ["Kerang mentah", "Buah beri segar", "Sayuran selada", "Makanan yang terkontaminasi oleh penjamah makanan terinfeksi"],
        "pertolongan_pertama": [
            "Cukupi cairan tubuh dengan oralit atau air putih karena risiko dehidrasi tinggi akibat muntah.",
            "Istirahat total di rumah untuk mencegah penularan ke orang lain.",
            "Hindari penggunaan antibiotik karena infeksi disebabkan oleh virus."
        ],
        "lab_inspection_steps": [
            "Uji RT-PCR pada sampel feses atau muntahan.",
            "Uji immunoassay enzim (EIA) untuk deteksi antigen virus."
        ]
    },
    {
        "id": "PATH_010",
        "nama_patogen": "Campylobacter jejuni",
        "referensi_lembaga": "WHO / CDC",
        "min_inkubasi_jam": 24,
        "max_inkubasi_jam": 120,
        "gejala_khas": ["Diare berdarah", "Kram perut parah", "Demam tinggi", "Mual", "Nyeri otot"],
        "makanan_berisiko": ["Daging ayam mentah/kurang matang", "Susu tidak dipasteurisasi", "Air tercemar"],
        "pertolongan_pertama": [
            "Lakukan rehidrasi oral secara intensif.",
            "Konsultasikan ke dokter jika diare berdarah berlangsung lebih dari 2 hari.",
            "Jaga kebersihan tangan setelah dari toilet untuk menghindari penyebaran."
        ],
        "lab_inspection_steps": [
            "Kultur mikroaerofilik pada media selektif (misal: Skirrow atau Campy-Blood Agar) pada suhu 42°C.",
            "Pemeriksaan mikroskopis dengan pewarnaan gram."
        ]
    }
];