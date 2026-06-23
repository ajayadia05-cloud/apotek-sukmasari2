/**
 * Application Logic - Apotek SUKMASARI 2 E-Katalog
 * Features: Automatic Categorization, Advanced Multi-Filtering, Page-by-Page Pagination,
 *           Enriched Details, and WhatsApp Ordering.
 */

// Global State
let currentProducts = []; // Live array of products
let currentCategory = "Semua";
let currentUnit = "Semua";
let currentLetter = "";
let currentSearch = "";
let minPrice = null;
let maxPrice = null;
let currentSort = "az";

// Pagination Settings
const pageSize = 20;
let currentPage = 1;

// Category Icons Mapping for Kategori Grid (13 Categories)
const categoryIcons = {
    "Tablet": { icon: "fa-tablets", desc: "Sediaan tablet/pil obat" },
    "Kapsul": { icon: "fa-capsules", desc: "Obat kapsul lepas lambat" },
    "Sirup": { icon: "fa-prescription-bottle", desc: "Obat cair & suspensi" },
    "Injeksi": { icon: "fa-syringe", desc: "Obat ampul & vial medis" },
    "Salep/Krim": { icon: "fa-pump-medical", desc: "Obat luar krim & salep" },
    "Tetes Mata": { icon: "fa-eye-dropper", desc: "Cairan khusus steril mata" },
    "Vitamin & Suplemen": { icon: "fa-pills", desc: "Multivitamin daya tahan" },
    "Alat Kesehatan": { icon: "fa-stethoscope", desc: "Perlengkapan medis resmi" },
    "Infus": { icon: "fa-kit-medical", desc: "Cairan infus & elektrolit" },
    "Produk Bayi": { icon: "fa-baby", desc: "Kebutuhan bayi & balita" },
    "Produk Perawatan Luka": { icon: "fa-band-aid", desc: "Plester, verban, antiseptik" },
    "Herbal": { icon: "fa-leaf", desc: "Madu & jamu kesehatan alami" },
    "Produk Kesehatan Lainnya": { icon: "fa-box-tissue", desc: "Produk sanitasi & lainnya" }
};

// --- 1. Automatic Categorization & Enrichment Helpers ---

function getAutoCategory(name, currentCat, unit) {
    const uppercaseName = name.toUpperCase();
    const uppercaseUnit = unit ? unit.toUpperCase() : "";
    
    // Injeksi
    if (uppercaseName.includes("INJEKSI") || uppercaseName.includes("INJ") || 
        uppercaseUnit.includes("AMPUL") || uppercaseUnit.includes("VIAL") || 
        uppercaseName.includes("PEHACAIN") || uppercaseName.includes("ANESTESI") || 
        uppercaseName.includes("LIDOCAIN") || uppercaseName.includes("FUROSEMIDE INJ")) {
        return "Injeksi";
    }
    // Tetes Mata / Telinga
    if (uppercaseName.includes("TETES MATA") || uppercaseName.includes("CENDO") || 
        uppercaseName.includes("EYE DROP") || uppercaseName.includes("INSTO") || 
        uppercaseName.includes("ROHTO") || uppercaseName.includes("VASCON-A") || 
        uppercaseName.includes("GENOINT TETES") || uppercaseName.includes("RECO TETES") ||
        uppercaseName.includes("EYE FRESH") || uppercaseName.includes("TETES TELINGA") ||
        uppercaseName.includes("ERLAMYCETIN TETES")) {
        return "Tetes Mata";
    }
    // Infus
    if (uppercaseName.includes("INFUS") || uppercaseName.includes("NACL") || 
        uppercaseName.includes("SATORIA") || uppercaseName.includes("OTSU") || 
        uppercaseName.includes("RL 500ML") || uppercaseName.includes("AQUADEST") || 
        uppercaseName.includes("KA-EN 3B") || uppercaseName.includes("DOUBLE SPIKE") ||
        uppercaseName.includes("JASA INFUS") || uppercaseName.includes("INFUS SET")) {
        return "Infus";
    }
    // Vitamin & Suplemen
    if (uppercaseName.includes("VITAMIN") || uppercaseName.includes("VIT ") || 
        uppercaseName.includes("VITACIMIN") || uppercaseName.includes("BECOM") || 
        uppercaseName.includes("CAVIPLEX") || uppercaseName.includes("SANGOBION") || 
        uppercaseName.includes("BLACKMORES") || uppercaseName.includes("IMUNOS") || 
        uppercaseName.includes("HB-VIT") || uppercaseName.includes("IMBOOST") || 
        uppercaseName.includes("ESTER C") || uppercaseName.includes("VITALONG") || 
        uppercaseName.includes("PROGYNOVA") || uppercaseName.includes("MEGAZING") || 
        uppercaseName.includes("NATURE E") || uppercaseName.includes("NATURE-E") || 
        uppercaseName.includes("CDR") || uppercaseName.includes("CAL-95") || 
        uppercaseName.includes("CALCIFAR") || uppercaseName.includes("NEUROBION") || 
        uppercaseName.includes("NEURODEX") || uppercaseName.includes("HEMAVITON") || 
        uppercaseName.includes("FATIGON") || uppercaseName.includes("SACATONIK") ||
        uppercaseName.includes("D3 IPI") || uppercaseName.includes("ASCORBIC ACID")) {
        return "Vitamin & Suplemen";
    }
    // Produk Bayi
    if (uppercaseName.includes("BABY") || uppercaseName.includes("BAYI") || 
        uppercaseName.includes("MY BABY") || uppercaseName.includes("TELON") || 
        uppercaseName.includes("ACTIFED KUNING") || uppercaseName.includes("BODREXIN DEMAM") || 
        uppercaseName.includes("TEMPRA DROPS") || uppercaseName.includes("TEMPRA F") ||
        uppercaseName.includes("TERMOREX PLUS") || uppercaseName.includes("LASERIN ANAK")) {
        return "Produk Bayi";
    }
    // Produk Perawatan Luka
    if (uppercaseName.includes("KASA") || uppercaseName.includes("STERIL") || 
        uppercaseName.includes("VERBAN") || uppercaseName.includes("DERMAFIX") || 
        uppercaseName.includes("PLESTER") || uppercaseName.includes("HANSAPLAST") || 
        uppercaseName.includes("MODRES") || uppercaseName.includes("HYDROCOLLOID") || 
        uppercaseName.includes("FOAM DRESSING") || uppercaseName.includes("ALGINATE") || 
        uppercaseName.includes("SABUN LUKA") || uppercaseName.includes("METCOVAZIN") || 
        uppercaseName.includes("ALCOHOL SWAB") || uppercaseName.includes("BETADINE") || 
        uppercaseName.includes("BETHADINE") || uppercaseName.includes("IODINE") || 
        uppercaseName.includes("ISOPORE") || uppercaseName.includes("LEUKOPLAST") || 
        uppercaseName.includes("ULTRAFIX") || uppercaseName.includes("ONE SWABS") ||
        uppercaseName.includes("EASYTOUCH")) {
        return "Produk Perawatan Luka";
    }
    // Salep/Krim (Obat Luar)
    if (uppercaseUnit === "TUBE" || uppercaseUnit === "POT" || 
        uppercaseName.includes("SALEP") || uppercaseName.includes("KRIM") || 
        uppercaseName.includes("CREAM") || uppercaseName.includes("GEL") || 
        uppercaseName.includes("BETAMETHASONE") || uppercaseName.includes("HYDROCORTISONE") || 
        uppercaseName.includes("ACYCLOVIR KRIM") || uppercaseName.includes("COUNTERPAIN") || 
        uppercaseName.includes("ZALF") || uppercaseName.includes("BENZOLAC") || 
        uppercaseName.includes("THROMBOPHOB") || uppercaseName.includes("SCABIMITE") || 
        uppercaseName.includes("ACIFAR CREAM") || uppercaseName.includes("GENALTEN") || 
        uppercaseName.includes("KLORFESON") || uppercaseName.includes("NISAGON") || 
        uppercaseName.includes("PAGODA") || uppercaseName.includes("PI KANG") || 
        uppercaseName.includes("VITACID") || uppercaseName.includes("BIOPLACENTON") || 
        uppercaseName.includes("BORRAGINOL") || uppercaseName.includes("ARMACORT") || 
        uppercaseName.includes("HOT IN CREAM") || uppercaseName.includes("AMARCORT")) {
        return "Salep/Krim";
    }
    // Herbal (Jamu / Madu / Tradisional)
    if (uppercaseName.includes("MADU") || uppercaseName.includes("HERBAL") || 
        uppercaseName.includes("TOLAK ANGIN") || uppercaseName.includes("KAYUPUTIH") || 
        uppercaseName.includes("GPU") || uppercaseName.includes("GANDAPURA") || 
        uppercaseName.includes("MINYAK ANGIN") || uppercaseName.includes("MA KAPAK") || 
        uppercaseName.includes("OB HERBAL") || uppercaseName.includes("KAPSIDA") || 
        uppercaseName.includes("CURCUMA") || uppercaseName.includes("TEMULAWAK") || 
        uppercaseName.includes("LARUTAN CAP") || uppercaseName.includes("LASEGAR") || 
        uppercaseName.includes("STIMUNO") || uppercaseName.includes("KAPAS") || 
        uppercaseName.includes("SALONPAS") || uppercaseName.includes("KOYO") || 
        uppercaseName.includes("PEPPERMINT") || uppercaseName.includes("KOMIX") || 
        uppercaseName.includes("ANTANGIN") || uppercaseName.includes("ADEM SARI") || 
        uppercaseName.includes("VEGETA") || uppercaseName.includes("L-BIO") || 
        uppercaseName.includes("ENTROSTOP HERBAL") || uppercaseName.includes("EGOJI") ||
        uppercaseName.includes("FRESH CARE") || uppercaseName.includes("FRESHCARE")) {
        return "Herbal";
    }
    // Alat Kesehatan (Alkes)
    if (uppercaseName.includes("MASKER") || uppercaseName.includes("HANDSCOON") || 
        uppercaseName.includes("SPUIT") || uppercaseName.includes("NEEDLE") || 
        uppercaseName.includes("THERMOMETER") || uppercaseName.includes("TENSI") || 
        uppercaseName.includes("DEVICE") || uppercaseName.includes("SURGICAL") || 
        uppercaseName.includes("CUKUR") || uppercaseName.includes("ARM SLING") || 
        uppercaseName.includes("URINE BAG") || uppercaseName.includes("GLOVE") || 
        uppercaseName.includes("ELASTIC BANDAGE") || uppercaseName.includes("LANCET") || 
        uppercaseName.includes("AUTOCHEK") || uppercaseName.includes("DIGITAL TENSI") || 
        uppercaseName.includes("EASY TOUCH") || uppercaseName.includes("TEST PACK") || 
        uppercaseName.includes("SENSITIF TEST") || uppercaseName.includes("STOPCOOK") || 
        uppercaseName.includes("CATGUT") || uppercaseName.includes("COLOSTOMY") || 
        uppercaseName.includes("URINAL") || uppercaseName.includes("NEBULIZER") || 
        uppercaseName.includes("CANULA") || uppercaseName.includes("CANULLA") || 
        uppercaseName.includes("TENSIONE") || uppercaseName.includes("PULSE OXIMETER") || 
        uppercaseName.includes("KINESIOLOGY") || uppercaseName.includes("FEEDING TUBE") || 
        uppercaseName.includes("ICE BAG") || uppercaseName.includes("THERMO ONE") || 
        uppercaseName.includes("UNDERPAD") || uppercaseName.includes("NURSE CAP") ||
        uppercaseName.includes("SARUNG TANGAN")) {
        return "Alat Kesehatan";
    }
    // Kapsul
    if (uppercaseUnit === "KAPSUL" || uppercaseName.includes("KAPSUL") || 
        uppercaseName.includes("CAPSUL") || uppercaseName.includes("SUPER TETRA") || 
        uppercaseName.includes("LERZIN KAPSUL") || uppercaseName.includes("AMBEVEN") || 
        uppercaseName.includes("VERMINT") || uppercaseName.includes("LAXING") ||
        uppercaseName.includes("KAPS")) {
        return "Kapsul";
    }
    // Sirup (Cairan obat non-mata/non-infus)
    if (uppercaseUnit === "BOTOL" || uppercaseUnit === "SIRUP" || 
        uppercaseName.includes("SIRUP") || uppercaseName.includes("SYR") || 
        uppercaseName.includes("OBH") || uppercaseName.includes("DROP") || 
        uppercaseName.includes("SUSP") || uppercaseName.includes("LIQUID") || 
        uppercaseName.includes("OBAT BATUK") || uppercaseName.includes("ACTIFED") || 
        uppercaseName.includes("OB COMBI") || uppercaseName.includes("SANMOL SIRUP") || 
        uppercaseName.includes("AMBROXOL SIRUP") || uppercaseName.includes("TERMOREX") || 
        uppercaseName.includes("TRAMENZA SYR") || uppercaseName.includes("TRIAMINIC") || 
        uppercaseName.includes("WOODS") || uppercaseName.includes("YUSIMOX SYR") || 
        uppercaseName.includes("ALOCLAIR SPRAY") || uppercaseName.includes("CALADINE LOTION") ||
        uppercaseName.includes("CARSIDA") || uppercaseName.includes("CURVIT") ||
        uppercaseName.includes("FASIDOL FORTE SYR") || uppercaseName.includes("COMBANTRIN SYR") ||
        uppercaseName.includes("COPARCETIN") || uppercaseName.includes("LACTULOSE")) {
        return "Sirup";
    }
    // Tablet
    if (uppercaseUnit === "TABLET" || uppercaseUnit === "BIJI" || uppercaseUnit === "STRIP" || 
        uppercaseName.includes("TAB") || uppercaseName.includes("TABLET") || 
        uppercaseName.includes("MG") || uppercaseName.includes("PIL") || 
        uppercaseName.includes("AMLO") || uppercaseName.includes("PARA") || 
        uppercaseName.includes("ACIP") || uppercaseName.includes("ALLO") || 
        uppercaseName.includes("AMX") || uppercaseName.includes("CAPTOPRIL") || 
        uppercaseName.includes("SIMVASTATIN") || uppercaseName.includes("CATAFLAM") || 
        uppercaseName.includes("DEXAMETHASON") || uppercaseName.includes("ATENOLOL") || 
        uppercaseName.includes("BISOPROLOL") || uppercaseName.includes("GLIMEPIRIDE") || 
        uppercaseName.includes("GLIMIPIRID") || uppercaseName.includes("METFORMIN") || 
        uppercaseName.includes("RANITIDINE") || uppercaseName.includes("SALBUTAMOL") || 
        uppercaseName.includes("MELOXICAM") || uppercaseName.includes("METHYLPREDNISOLONE") ||
        uppercaseName.includes("BODREX") || uppercaseName.includes("OSKADON") ||
        uppercaseName.includes("PARAMEX") || uppercaseName.includes("SARIDON")) {
        return "Tablet";
    }

    // Default Fallbacks
    if (currentCat === "Tablet") return "Tablet";
    if (currentCat === "Sirup") return "Sirup";
    if (currentCat === "Tube") return "Salep/Krim";
    if (currentCat === "Kapsul") return "Kapsul";
    if (currentCat === "Botol") return "Sirup";
    if (currentCat === "Sachet") return "Herbal";
    if (currentCat === "Biji") return "Tablet";
    
    return "Produk Kesehatan Lainnya";
}

function getAutoRxStatus(name) {
    const n = name.toUpperCase();
    
    // Antipsikotik, narkotika, benzodiazepine, obat bius & antibiotik, antihipertensi keras
    const isKeras = n.includes("PSIKO") || n.includes("ALPRAZOLAM") || n.includes("INJEKSI") || 
                    n.includes("INJ") || n.includes("AMOXICILLIN") || n.includes("CEFIXIME") || 
                    n.includes("CEFADROXIL") || n.includes("CIPROFLOXACIN") || n.includes("BIMAFLOX") || 
                    n.includes("AZITHOMYCIN") || n.includes("DOXYCYCLIN") || n.includes("CAPTOPRIL") || 
                    n.includes("FUROSEMIDE") || n.includes("ATENOLOL") || n.includes("BISOPROLOL") || 
                    n.includes("GLIMEPIRIDE") || n.includes("GLIMIPIRID") || n.includes("METFORMIN") || 
                    n.includes("RANITIDINE") || n.includes("SALBUTAMOL") || n.includes("MELOXICAM") || 
                    n.includes("METHYLPREDNISOLONE") || n.includes("DEXAMETHASON") || n.includes("CATAFLAM") || 
                    n.includes("ASAM MEFENAMAT") || n.includes("PONSTAN") || n.includes("MEFINAL") || 
                    n.includes("EPERISONE") || n.includes("GABAPENTIN") || n.includes("VALISANBE") ||
                    n.includes("TRANEXAMID ACID") || n.includes("AMBROXOL") || n.includes("RHEMAFAR") ||
                    n.includes("SELVIM") || n.includes("SPIRONOLACTONE") || n.includes("ZOLYSAN") ||
                    n.includes("CEFTRIAXONE") || n.includes("KETOROLAC") || n.includes("PANTOPRAZOLE");
                    
    if (isKeras) return "Resep";

    // Antihistamin, pencahar, obat batuk flu bebas terbatas
    const isBebasTerbatas = n.includes("CETIRIZINE") || n.includes("CITIRIZEN") || n.includes("LERZIN") || 
                            n.includes("HISTAPAN") || n.includes("CTM") || n.includes("DEMACOLIN") || 
                            n.includes("ACTIFED") || n.includes("RHINOS") || n.includes("TREMENZA") || 
                            n.includes("TUZALOS") || n.includes("SILADEX") || n.includes("WOODS") ||
                            n.includes("LACTULOSE") || n.includes("SCOPMA") || n.includes("EPISOLA") ||
                            n.includes("NEO REMACYL") || n.includes("FLUCADEX") || n.includes("FLUTAMOL");
                            
    if (isBebasTerbatas) return "Bebas Terbatas";

    return "Bebas"; // Obat Bebas Hijau
}

function getAutoDetails(product) {
    const n = product.name.toUpperCase();
    const c = product.category;
    
    let activeIng = product.name;
    let mainFunc = "Digunakan untuk meringankan gejala penyakit sesuai anjuran medis.";
    let usage = "Sesuai petunjuk dokter atau 3x sehari 1 tablet setelah makan.";
    let warning = "Konsultasikan dengan apoteker atau dokter jika gejala tidak kunjung membaik. Simpan di tempat kering dan sejuk.";

    // Active Ingredients parsing helper
    let cleanName = product.name.replace(/(TAB|INJ|INJEKSI|KAP|KAPSUL|SYR|SIRUP|DRIP|DROP|10-S|DWS|HJ|NOVA|DEXA|MEGA|TRIMAN|IFARS|SAMPHARINDO|MEMPRO|EXELTIS|NOVAPHARIN|DIPA|OTSU|SATORIA|ONMED|GEA|ONE HEALTH|TUBE|VIAL|AMPUL|POT|ROLL|SACHET|STRIP)/gi, '').trim();
    cleanName = cleanName.replace(/\s+/g, ' ');
    activeIng = cleanName || product.name;

    // Specific logic mapping by keywords
    if (n.includes("AMOXICILLIN") || n.includes("AMPICILIN") || n.includes("CEFADROXIL") || 
        n.includes("CEFIXIME") || n.includes("CIPROFLOXACIN") || n.includes("BIMAFLOX") || 
        n.includes("AZITHOMYCIN") || n.includes("DOXYCYCLIN") || n.includes("SUPER TETRA")) {
        mainFunc = "Antibiotik golongan keras untuk mematikan dan mencegah perkembangan infeksi bakteri.";
        usage = "Harus dihabiskan sesuai resep dokter agar tidak terjadi resistensi bakteri.";
        warning = "Harus dengan resep dokter. Habiskan obat sesuai dosis. Hentikan pemakaian jika terjadi reaksi alergi parah.";
    }
    else if (n.includes("PARACETAMOL") || n.includes("PANADOL") || n.includes("FASIDOL") || 
             n.includes("SANMOL") || n.includes("TEMPRA") || n.includes("INFALGIN") || 
             n.includes("ANALSIX") || n.includes("ANALTRAM")) {
        mainFunc = "Obat analgesik pereda nyeri ringan hingga sedang dan antipiretik penurun demam.";
        usage = "Dewasa: 3-4 kali sehari 1 tablet. Anak-anak: Sesuai berat badan dan petunjuk dokter.";
        warning = "Hati-hati penggunaan pada penderita gangguan fungsi hati. Jangan melebihi dosis harian yang dianjurkan.";
    }
    else if (n.includes("ASAM MEFENAMAT") || n.includes("MEFINAL") || n.includes("PONSTAN") || 
             n.includes("CATAFLAM") || n.includes("DEXKETOPROFEN") || n.includes("KADITIC")) {
        mainFunc = "Antiinflamasi Non-Steroid (NSAID) untuk meredakan nyeri gigi, nyeri haid, nyeri sendi, dan sakit kepala.";
        usage = "Dewasa: 3x sehari 1 tablet/kapsul. Wajib diminum sesudah makan untuk melindungi lambung.";
        warning = "Hindari penggunaan pada penderita sakit maag akut atau tukak lambung. Konsultasi dokter sebelum digunakan.";
    }
    else if (n.includes("AMLODIPIN") || n.includes("BISOPROLOL") || n.includes("CANDESARTAN") || n.includes("FUROSEMIDE")) {
        mainFunc = "Obat antihipertensi untuk menurunkan tekanan darah tinggi dan memelihara fungsi kerja jantung.";
        usage = "Umumnya 1x sehari 1 tablet di pagi hari, atau sesuai petunjuk dokter.";
        warning = "Penggunaan jangka panjang memerlukan pengawasan dokter. Periksa tekanan darah secara berkila.";
    }
    else if (n.includes("ATORVASTATIN") || n.includes("SIMVASTATIN") || n.includes("SELVIM")) {
        mainFunc = "Obat penurun kolesterol jahat (LDL) dan trigliserida untuk mengurangi risiko serangan jantung.";
        usage = "Diminum 1x sehari di malam hari sebelum tidur, atau sesuai instruksi resep dokter.";
        warning = "Hindari konsumsi alkohol berlebih. Hubungi dokter jika mengalami nyeri otot yang tidak biasa.";
    }
    else if (n.includes("OMEPRAZOLE") || n.includes("LANSOPRAZOLE") || n.includes("RANITIDINE") || 
             n.includes("ANTASIDA") || n.includes("PROMAG") || n.includes("MYLANTA") || 
             n.includes("POLYSILANE") || n.includes("DEXANTA") || n.includes("HUFAMAAG")) {
        mainFunc = "Menurnkan kadar asam lambung berlebih, meredakan nyeri ulu hati, kembung, begah, dan gejala sakit maag.";
        usage = "Sebaiknya diminum 30-60 menit sebelum makan (saat perut kosong).";
        warning = "Jika gejala terus berlanjut lebih dari 3 hari, konsultasikan ke dokter spesialis lambung.";
    }
    else if (n.includes("BODREX") || n.includes("PROCOLD") || n.includes("NEOZEP") || 
             n.includes("MIXAGRIP") || n.includes("FLUCADEX") || n.includes("FLUTAMOL") || 
             n.includes("DEMACOLIN") || n.includes("ACTIFED") || n.includes("RHINOS") || 
             n.includes("TREMENZA") || n.includes("TUZALOS")) {
        mainFunc = "Meredakan gejala influenza seperti hidung tersumbat, bersin-bersin, demam, dan sakit kepala.";
        usage = "Dewasa: 3x sehari 1 tablet. Anak-anak: Sesuai petunjuk dokter.";
        warning = "Dapat menyebabkan kantuk. Hindari mengoperasikan mesin atau mengemudi setelah minum obat.";
    }
    else if (n.includes("AMBROXOL") || n.includes("OB COMBI") || n.includes("OBH") || 
             n.includes("SILADEX") || n.includes("LASERIN")) {
        mainFunc = "Membantu mengencerkan dahak kental di saluran pernapasan agar lebih mudah dikeluarkan saat batuk.";
        usage = "Diminum sesudah makan. Dewasa: 3x sehari 1 tablet atau 10 ml sirup.";
        warning = "Gunakan sesuai takaran. Simpan rapat di wadah tertutup terhindar dari paparan sinar matahari.";
    }
    else if (n.includes("CETIRIZINE") || n.includes("CITIRIZEN") || n.includes("LERZIN") || 
             n.includes("HISTAPAN") || n.includes("CTM")) {
        mainFunc = "Antihistamin generasi terbaru untuk meredakan reaksi alergi seperti gatal kulit, pilek alergi, dan bersin.";
        usage = "Dewasa & anak di atas 12 tahun: 1x sehari 1 tablet sebelum tidur.";
        warning = "Dapat menyebabkan kantuk ringan. Hindari meminum obat ini bersamaan dengan minuman beralkohol.";
    }
    else if (n.includes("IMBOOST") || n.includes("BECOM") || n.includes("CAVIPLEX") || 
             n.includes("SANGOBION") || n.includes("BLACKMORES") || n.includes("VITAMIN") || 
             n.includes("VIT C") || n.includes("VIT D3") || n.includes("NEUROBION") || 
             n.includes("NEURODEX")) {
        mainFunc = "Meningkatkan daya tahan tubuh (imunomodulator), memenuhi kebutuhan vitamin harian dan mempercepat masa pemulihan.";
        usage = "Umumnya 1x sehari 1 tablet/kapsul setelah makan pagi.";
        warning = "Jangan melebihi dosis vitamin harian yang dianjurkan kecuali atas petunjuk medis dokter.";
    }
    else if (n.includes("MADU") || n.includes("HERBAL") || n.includes("TOLAK ANGIN") || 
             n.includes("KAYUPUTIH") || n.includes("GPU") || n.includes("GANDAPURA") || 
             n.includes("MINYAK ANGIN") || n.includes("MA KAPAK") || n.includes("OB HERBAL") || 
             n.includes("KAPSIDA") || n.includes("CURCUMA") || n.includes("TEMULAWAK") || 
             n.includes("LARUTAN CAP") || n.includes("LASEGAR") || n.includes("STIMUNO")) {
        mainFunc = "Membantu memelihara kesehatan tubuh, meredakan masuk angin, perut kembung, dan pegal-pegal secara alami.";
        usage = "Sesuai petunjuk pada kemasan atau diminum saat badan terasa kurang fit.";
        warning = "Simpan di tempat sejuk di bawah 30 C. Jauhkan dari jangkauan anak-anak.";
    }
    else if (n.includes("KASA") || n.includes("STERIL") || n.includes("VERBAN") || 
             n.includes("DERMAFIX") || n.includes("PLESTER") || n.includes("HANSAPLAST") || 
             n.includes("MODRES") || n.includes("HYDROCOLLOID") || n.includes("FOAM DRESSING") || 
             n.includes("ALGINATE") || n.includes("SABUN LUKA") || n.includes("METCOVAZIN") || 
             n.includes("ALCOHOL SWAB") || n.includes("BETADINE") || n.includes("BETHADINE")) {
        mainFunc = "Alat kesehatan steril untuk penutup luka, disinfeksi area kulit, atau pembalut luka pasca operasi.";
        usage = "Gunakan sesuai kebutuhan medis dalam kondisi steril.";
        warning = "Hanya untuk sekali pakai. Segera buang setelah digunakan. Simpan di tempat bersih dan kering.";
    }
    else if (c === "Alat Kesehatan") {
        mainFunc = "Peralatan kesehatan standar medis resmi untuk pemeriksaan mandiri maupun penggunaan klinis.";
        usage = "Gunakan sesuai panduan manual alat yang terlampir pada box kemasan.";
        warning = "Simpan di tempat yang aman dan terhindar dari kelembapan tinggi.";
    }

    return {
        activeIngredients: activeIng,
        mainFunction: mainFunc,
        usageInstructions: usage,
        warnings: warning
    };
}

// --- 2. Database Persistence Initialization ---

function initProductDatabase() {
    // Enrich and map productsData directly (no localStorage modifications since admin panel is removed)
    currentProducts = productsData.map(product => {
        const mappedCat = getAutoCategory(product.name, product.category, product.unit);
        const rxStatus = getAutoRxStatus(product.name);
        const enriched = getAutoDetails({ ...product, category: mappedCat });
        
        let finalImg = product.image;
        if (!product.image || product.image.includes("unsplash")) {
            finalImg = ""; // Fallback will show modern clean icon
        }

        return {
            id: product.id,
            name: product.name,
            category: mappedCat,
            unit: product.unit,
            price: product.price,
            image: finalImg,
            icon: product.icon || "fa-prescription-bottle-medical",
            rxStatus: rxStatus,
            activeIngredients: enriched.activeIngredients,
            mainFunction: enriched.mainFunction,
            usageInstructions: enriched.usageInstructions,
            warnings: enriched.warnings
        };
    });
}

// --- 3. Dynamic Homepage Render Operations ---

function renderKategoriGrid() {
    const grid = document.getElementById("kategoriGridContainer");
    if (!grid) return;
    grid.innerHTML = "";

    const categoryCounts = {};
    Object.keys(categoryIcons).forEach(cat => {
        categoryCounts[cat] = 0;
    });

    currentProducts.forEach(p => {
        if (categoryCounts[p.category] !== undefined) {
            categoryCounts[p.category]++;
        } else {
            categoryCounts["Produk Kesehatan Lainnya"]++;
        }
    });

    Object.keys(categoryIcons).forEach(cat => {
        const info = categoryIcons[cat];
        const count = categoryCounts[cat] || 0;
        
        const card = document.createElement("div");
        card.className = "kategori-card";
        card.innerHTML = `
            <div class="kategori-icon-wrapper">
                <i class="fa-solid ${info.icon}"></i>
            </div>
            <h4>${cat}</h4>
            <span class="kategori-count">${count} Produk</span>
        `;
        
        card.addEventListener("click", () => {
            currentCategory = cat;
            document.getElementById("filterCategorySelect").value = cat;
            syncFilterActivePills();
            currentPage = 1;
            renderCatalogGrid();
            
            document.getElementById("catalogSection").scrollIntoView({ behavior: "smooth" });
        });
        
        grid.appendChild(card);
    });
}

function renderFeaturedProducts() {
    const container = document.getElementById("unggulanGridContainer");
    if (!container) return;
    container.innerHTML = "";

    const featuredKeywords = ["PARACETAMOL", "AMOXICILLIN", "VITAMIN C", "IMBOOST", "BODREX", "OB COMBI"];
    let featured = currentProducts.filter(p => {
        return featuredKeywords.some(kw => p.name.toUpperCase().includes(kw));
    }).slice(0, 6);

    if (featured.length < 6) {
        featured = currentProducts.slice(0, 6);
    }

    featured.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        let rxTag = "";
        if (product.rxStatus === "Resep") rxTag = `<span class="product-rx-tag">Resep</span>`;

        card.innerHTML = `
            <span class="product-category-tag">${product.category}</span>
            ${rxTag}
            <div class="product-image-container">
                ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                <div class="product-fallback-icon" style="${product.image ? 'display: none;' : 'display: flex;'}">
                    <i class="fa-solid ${categoryIcons[product.category]?.icon || 'fa-prescription-bottle-medical'}"></i>
                </div>
            </div>
            <div class="product-info">
                <span class="product-unit">SEDIAAN: ${product.unit}</span>
                <h4 class="product-name" title="${product.name}">${product.name}</h4>
                <span class="product-price">${product.price > 0 ? formatRupiah(product.price) : 'Hubungi Apotek'}</span>
                <button class="btn-whatsapp order-btn">
                    <i class="fa-brands fa-whatsapp"></i> Pesan via WhatsApp
                </button>
            </div>
        `;
        
        card.addEventListener("click", (e) => {
            if (e.target.closest(".btn-whatsapp")) {
                e.stopPropagation();
                triggerWhatsAppOrder(product);
            } else {
                openProductDetailModal(product);
            }
        });
        
        container.appendChild(card);
    });
}

// --- 4. Main Catalog Engine (Filters, Search, Sort & Pagination) ---

function populateUnitFilterOptions() {
    const select = document.getElementById("filterUnitSelect");
    if (!select) return;
    
    const units = [...new Set(currentProducts.map(p => p.unit))].filter(Boolean).sort();
    
    select.innerHTML = `<option value="Semua">Semua Sediaan</option>`;
    units.forEach(unit => {
        const opt = document.createElement("option");
        opt.value = unit;
        opt.textContent = unit;
        select.appendChild(opt);
    });
}

function renderAlphabetFilters() {
    const container = document.getElementById("alphabetButtonsContainer");
    if (!container) return;
    container.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.className = `alpha-btn ${currentLetter === "" ? "active" : ""}`;
    allBtn.textContent = "ALL";
    allBtn.addEventListener("click", () => {
        currentLetter = "";
        document.querySelectorAll(".alpha-btn").forEach(b => b.classList.remove("active"));
        allBtn.classList.add("active");
        currentPage = 1;
        syncFilterActivePills();
        renderCatalogGrid();
    });
    container.appendChild(allBtn);

    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        const btn = document.createElement("button");
        btn.className = `alpha-btn ${currentLetter === char ? "active" : ""}`;
        btn.textContent = char;
        btn.addEventListener("click", () => {
            currentLetter = char;
            document.querySelectorAll(".alpha-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentPage = 1;
            syncFilterActivePills();
            renderCatalogGrid();
        });
        container.appendChild(btn);
    }
}

function getFilteredProducts() {
    return currentProducts.filter(p => {
        const matchesSearch = currentSearch === "" || 
                              p.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              p.activeIngredients.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              p.mainFunction.toLowerCase().includes(currentSearch.toLowerCase());
                              
        const matchesCategory = currentCategory === "Semua" || p.category === currentCategory;
        
        const matchesUnit = currentUnit === "Semua" || p.unit === currentUnit;
        
        const matchesLetter = currentLetter === "" || p.name.toUpperCase().startsWith(currentLetter);
        
        let matchesPrice = true;
        if (minPrice !== null && minPrice !== "") {
            matchesPrice = matchesPrice && p.price >= parseFloat(minPrice);
        }
        if (maxPrice !== null && maxPrice !== "") {
            matchesPrice = matchesPrice && p.price <= parseFloat(maxPrice);
        }
        
        return matchesSearch && matchesCategory && matchesUnit && matchesLetter && matchesPrice;
    }).sort((a, b) => {
        if (currentSort === "az") {
            return a.name.localeCompare(b.name);
        } else if (currentSort === "za") {
            return b.name.localeCompare(a.name);
        } else if (currentSort === "lowPrice") {
            return a.price - b.price;
        } else if (currentSort === "highPrice") {
            return b.price - a.price;
        }
        return 0;
    });
}

function renderCatalogGrid() {
    const grid = document.getElementById("productGrid");
    const empty = document.getElementById("emptyState");
    const countSpan = document.getElementById("resultsCount");
    const totalSpan = document.getElementById("totalCount");
    const pagination = document.getElementById("paginationContainer");
    
    if (!grid) return;
    
    const filteredList = getFilteredProducts();
    
    countSpan.textContent = filteredList.length;
    totalSpan.textContent = currentProducts.length;

    if (filteredList.length === 0) {
        grid.style.display = "none";
        pagination.style.display = "none";
        empty.style.display = "block";
        return;
    }

    grid.style.display = "grid";
    empty.style.display = "none";
    grid.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredList.length);
    const paginatedItems = filteredList.slice(startIndex, endIndex);

    paginatedItems.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        let rxTag = "";
        if (product.rxStatus === "Resep") rxTag = `<span class="product-rx-tag">Resep</span>`;

        card.innerHTML = `
            <span class="product-category-tag">${product.category}</span>
            ${rxTag}
            <div class="product-image-container">
                ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                <div class="product-fallback-icon" style="${product.image ? 'display: none;' : 'display: flex;'}">
                    <i class="fa-solid ${categoryIcons[product.category]?.icon || 'fa-prescription-bottle-medical'}"></i>
                </div>
            </div>
            <div class="product-info">
                <span class="product-unit">SEDIAAN: ${product.unit}</span>
                <h4 class="product-name" title="${product.name}">${product.name}</h4>
                <span class="product-price">${product.price > 0 ? formatRupiah(product.price) : 'Hubungi Apotek'}</span>
                <button class="btn-whatsapp order-btn">
                    <i class="fa-brands fa-whatsapp"></i> Pesan via WhatsApp
                </button>
            </div>
        `;
        
        card.addEventListener("click", (e) => {
            if (e.target.closest(".btn-whatsapp")) {
                e.stopPropagation();
                triggerWhatsAppOrder(product);
            } else {
                openProductDetailModal(product);
            }
        });
        
        grid.appendChild(card);
    });

    renderCatalogPagination(filteredList.length);
}

function renderCatalogPagination(totalFiltered) {
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    container.innerHTML = "";
    
    const totalPages = Math.ceil(totalFiltered / pageSize);
    if (totalPages <= 1) {
        container.style.display = "none";
        return;
    }
    
    container.style.display = "flex";

    const prevBtn = document.createElement("button");
    prevBtn.className = `page-btn ${currentPage === 1 ? "disabled" : ""}`;
    prevBtn.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
        currentPage--;
        renderCatalogGrid();
        document.getElementById("catalogSection").scrollIntoView({ behavior: "smooth" });
    });
    container.appendChild(prevBtn);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.className = `page-btn ${currentPage === i ? "active" : ""}`;
        btn.textContent = i;
        btn.addEventListener("click", () => {
            currentPage = i;
            renderCatalogGrid();
            document.getElementById("catalogSection").scrollIntoView({ behavior: "smooth" });
        });
        container.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.className = `page-btn ${currentPage === totalPages ? "disabled" : ""}`;
    nextBtn.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
        currentPage++;
        renderCatalogGrid();
        document.getElementById("catalogSection").scrollIntoView({ behavior: "smooth" });
    });
    container.appendChild(nextBtn);
}

// --- 5. Active Filters Indicators Handler ---

function syncFilterActivePills() {
    const container = document.getElementById("activePillsList");
    const row = document.getElementById("activeFiltersRow");
    if (!container || !row) return;

    container.innerHTML = "";
    let activeCount = 0;

    if (currentCategory !== "Semua") {
        createActivePill(container, `Kategori: ${currentCategory}`, () => {
            currentCategory = "Semua";
            document.getElementById("filterCategorySelect").value = "Semua";
            triggerFilterReset();
        });
        activeCount++;
    }

    if (currentUnit !== "Semua") {
        createActivePill(container, `Sediaan: ${currentUnit}`, () => {
            currentUnit = "Semua";
            document.getElementById("filterUnitSelect").value = "Semua";
            triggerFilterReset();
        });
        activeCount++;
    }

    if (currentLetter !== "") {
        createActivePill(container, `Huruf Awal: ${currentLetter}`, () => {
            currentLetter = "";
            document.querySelectorAll(".alpha-btn").forEach(b => b.classList.remove("active"));
            document.querySelector(".alpha-btn:first-child")?.classList.add("active");
            triggerFilterReset();
        });
        activeCount++;
    }

    if (minPrice) {
        createActivePill(container, `Min: Rp ${parseInt(minPrice).toLocaleString("id-ID")}`, () => {
            minPrice = null;
            document.getElementById("filterPriceMin").value = "";
            triggerFilterReset();
        });
        activeCount++;
    }

    if (maxPrice) {
        createActivePill(container, `Max: Rp ${parseInt(maxPrice).toLocaleString("id-ID")}`, () => {
            maxPrice = null;
            document.getElementById("filterPriceMax").value = "";
            triggerFilterReset();
        });
        activeCount++;
    }

    if (activeCount > 0) {
        row.style.display = "flex";
    } else {
        row.style.display = "none";
    }
}

function createActivePill(container, label, onRemove) {
    const pill = document.createElement("span");
    pill.className = "active-pill";
    pill.innerHTML = `${label} <i class="fa-solid fa-xmark"></i>`;
    pill.querySelector("i").addEventListener("click", onRemove);
    container.appendChild(pill);
}

function triggerFilterReset() {
    currentPage = 1;
    syncFilterActivePills();
    renderCatalogGrid();
}

// --- 6. Product Detail Modal & WhatsApp Ordering ---

function openProductDetailModal(product) {
    const modal = document.getElementById("detailModal");
    if (!modal) return;

    document.getElementById("modalProductCategory").textContent = product.category;
    document.getElementById("modalProductName").textContent = product.name;
    document.getElementById("modalProductUnit").textContent = `Satuan Resmi: ${product.unit}`;
    
    document.getElementById("modalProductFunction").textContent = product.mainFunction;
    document.getElementById("modalProductIngredients").textContent = product.activeIngredients;
    document.getElementById("modalProductUsage").textContent = product.usageInstructions;
    document.getElementById("modalProductWarning").textContent = product.warnings;
    
    document.getElementById("modalProductPrice").textContent = product.price > 0 ? formatRupiah(product.price) : 'Hubungi Apotek (HET Tidak Tertera)';

    const rxBadge = document.getElementById("modalProductRx");
    rxBadge.className = "modal-rx-badge";
    if (product.rxStatus === "Resep") {
        rxBadge.textContent = "Obat Keras - Harus dengan Resep Dokter";
        rxBadge.classList.add("rx-keras");
    } else if (product.rxStatus === "Bebas Terbatas") {
        rxBadge.textContent = "Obat Bebas Terbatas";
        rxBadge.classList.add("rx-bebas-terbatas");
    } else {
        rxBadge.textContent = "Obat Bebas";
        rxBadge.classList.add("rx-bebas");
    }

    const imgReal = document.getElementById("modalProductImg");
    const imgFallback = document.getElementById("modalFallbackIcon");
    if (product.image) {
        imgReal.style.display = "block";
        imgFallback.style.display = "none";
        imgReal.src = product.image;
    } else {
        imgReal.style.display = "none";
        imgFallback.style.display = "flex";
        imgFallback.innerHTML = `<i class="fa-solid ${categoryIcons[product.category]?.icon || 'fa-prescription-bottle-medical'}"></i>`;
    }

    const waBtn = document.getElementById("modalWhatsAppBtn");
    const textMsg = `Halo Apotek SUKMASARI 2, saya melihat produk *${product.name}* (${product.unit}) di E-Katalog seharga *${formatRupiah(product.price)}*. Apakah produk ini tersedia? Saya ingin memesan.`;
    waBtn.href = `https://wa.me/6285388708996?text=${encodeURIComponent(textMsg)}`;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function triggerWhatsAppOrder(product) {
    const textMsg = `Halo Apotek SUKMASARI 2, saya ingin memesan *${product.name}* (${product.unit}) seharga *${formatRupiah(product.price)}* via E-Katalog. Apakah produk ini tersedia?`;
    const waUrl = `https://wa.me/6285388708996?text=${encodeURIComponent(textMsg)}`;
    window.open(waUrl, "_blank");
}

// --- 7. Utility Functions ---

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// --- 8. Initialization & Event Listeners ---

document.addEventListener("DOMContentLoaded", () => {
    
    // Initialize Database directly
    initProductDatabase();

    // Render Landing Page elements
    renderKategoriGrid();
    renderFeaturedProducts();
    populateUnitFilterOptions();
    renderAlphabetFilters();
    renderCatalogGrid();

    // Header scroll background effect
    window.addEventListener("scroll", () => {
        const header = document.getElementById("mainHeader");
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Mobile Drawer events
    const toggle = document.getElementById("mobileMenuToggle");
    const drawer = document.getElementById("mobileDrawer");
    const overlay = document.getElementById("drawerOverlay");
    const closeDrawer = document.getElementById("closeDrawerBtn");

    if (toggle && drawer && overlay && closeDrawer) {
        toggle.addEventListener("click", () => {
            drawer.classList.add("active");
            overlay.classList.add("active");
        });
        
        const closeFunc = () => {
            drawer.classList.remove("active");
            overlay.classList.remove("active");
        };
        
        closeDrawer.addEventListener("click", closeFunc);
        overlay.addEventListener("click", closeFunc);
        document.querySelectorAll(".drawer-link").forEach(lnk => {
            lnk.addEventListener("click", closeFunc);
        });
    }

    // Advanced Filter collapsible toggle
    const toggleFilters = document.getElementById("toggleFiltersBtn");
    const coll = document.getElementById("filtersCollapsible");
    if (toggleFilters && coll) {
        toggleFilters.addEventListener("click", () => {
            coll.classList.toggle("active");
            toggleFilters.classList.toggle("active");
        });
    }

    // Filters event listeners
    const searchInp = document.getElementById("catalogSearchInput");
    const clearInp = document.getElementById("clearSearchInput");
    const catSelect = document.getElementById("filterCategorySelect");
    const unitSelect = document.getElementById("filterUnitSelect");
    const priceMin = document.getElementById("filterPriceMin");
    const priceMax = document.getElementById("filterPriceMax");
    const sortSelect = document.getElementById("catalogSortSelect");
    const clearAllBtn = document.getElementById("clearAllFiltersBtn");

    if (searchInp) {
        searchInp.addEventListener("input", (e) => {
            currentSearch = e.target.value.trim();
            if (currentSearch) {
                clearInp.style.display = "flex";
            } else {
                clearInp.style.display = "none";
            }
            currentPage = 1;
            renderCatalogGrid();
        });
        
        clearInp.addEventListener("click", () => {
            searchInp.value = "";
            currentSearch = "";
            clearInp.style.display = "none";
            currentPage = 1;
            renderCatalogGrid();
        });
    }

    if (catSelect) {
        catSelect.addEventListener("change", (e) => {
            currentCategory = e.target.value;
            triggerFilterReset();
        });
    }

    if (unitSelect) {
        unitSelect.addEventListener("change", (e) => {
            currentUnit = e.target.value;
            triggerFilterReset();
        });
    }

    if (priceMin) {
        priceMin.addEventListener("input", (e) => {
            minPrice = e.target.value;
            triggerFilterReset();
        });
    }

    if (priceMax) {
        priceMax.addEventListener("input", (e) => {
            maxPrice = e.target.value;
            triggerFilterReset();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            renderCatalogGrid();
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", () => {
            currentCategory = "Semua";
            currentUnit = "Semua";
            currentLetter = "";
            minPrice = null;
            maxPrice = null;
            
            if (catSelect) catSelect.value = "Semua";
            if (unitSelect) unitSelect.value = "Semua";
            if (priceMin) priceMin.value = "";
            if (priceMax) priceMax.value = "";
            
            document.querySelectorAll(".alpha-btn").forEach(b => b.classList.remove("active"));
            document.querySelector(".alpha-btn:first-child")?.classList.add("active");
            
            triggerFilterReset();
        });
    }

    // Modal Close events
    const detailModal = document.getElementById("detailModal");
    const closeDetail = document.getElementById("modalCloseBtn");
    if (detailModal && closeDetail) {
        const closeFunc = () => {
            detailModal.classList.remove("active");
            document.body.style.overflow = "";
        };
        closeDetail.addEventListener("click", closeFunc);
        detailModal.addEventListener("click", (e) => {
            if (e.target === detailModal) closeFunc();
        });
    }
});
