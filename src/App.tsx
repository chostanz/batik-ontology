import { FormEvent, useMemo, useState, useEffect, useRef } from "react";
import ontologyBundle from "@/lib/ontologyData.json";
import { searchSemanticBatik, BatikItem } from "@/lib/semanticEngine";
import { BatikImage } from "@/components/BatikImage";
import { BatikDetailModal } from "@/components/BatikDetailModal";
import { KnowledgeBaseModule } from "@/components/KnowledgeBaseModule";
import { SparqlModule } from "@/components/SparqlModule";
import { SemanticGraphViewer } from "@/components/SemanticGraphViewer";
import { ArchipelagoMap } from "@/components/ArchipelagoMap";
import { MotifComparisonModal } from "@/components/MotifComparisonModal";
import {
  Search,
  Filter,
  RotateCcw,
  LayoutGrid,
  List,
  Sparkles,
  BookOpen,
  Terminal,
  Database,
  Network,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Tag,
  Award,
  Layers,
  ArrowRight,
  Scale,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  X,
  Compass,
} from "lucide-react";

const allBatiks: BatikItem[] = ontologyBundle.batiks as unknown as BatikItem[];

const HERO_FEATURED = [
  {
    id: "Batik_Parang_Rusak",
    name: "Parang Rusak",
    region: "Yogyakarta, DI Yogyakarta",
    category: "Awisan Dalem Keraton",
    quote:
      "Keteguhan moral, keberanian spiritual, dan pantang menyerah laksana ombak karang samudra selatan.",
    palette: "from-[#c88b52] to-[#7d382b]",
    pattern: "parang",
  },
  {
    id: "Batik_Megamendung",
    name: "Mega Mendung",
    region: "Cirebon, Jawa Barat",
    category: "Akulturasi Pesisiran",
    quote:
      "Ketenangan batin, kesabaran jiwa, dan gradasi tujuh lapis langit pembawa rahmat air hujan kesuburan.",
    palette: "from-[#4b7580] to-[#173e4b]",
    pattern: "mega",
  },
  {
    id: "Batik_Kawung",
    name: "Kawung",
    region: "Yogyakarta, DI Yogyakarta",
    category: "Kesucian & Pengendalian Diri",
    quote:
      "Simbol buah aren bersilang empat: kesucian hati, keadilan raja, dan pengendalian hawa nafsu batin.",
    palette: "from-[#bc9a62] to-[#694c2c]",
    pattern: "kawung",
  },
  {
    id: "Batik_Singa_Barong",
    name: "Singa Barong",
    region: "Cirebon, Jawa Barat",
    category: "Harmoni Empat Peradaban",
    quote:
      "Sinergi sakral empat peradaban: singa (Islam), gajah (Hindu), naga (Tiongkok), dan garuda (Nusantara).",
    palette: "from-[#c69b3c] to-[#774525]",
    pattern: "ulam",
  },
  {
    id: "Batik_Truntum",
    name: "Truntum",
    region: "Surakarta, Jawa Tengah",
    category: "Cinta Bersemi Abadi",
    quote:
      "Bintang bertaburan di malam gelap: simbol cinta tulus yang senantiasa bersemi kembali dalam pernikahan.",
    palette: "from-[#b85d47] to-[#4e2830]",
    pattern: "sekar",
  },
];

function getBatikCategory(b: BatikItem): "Keraton" | "Pesisir" | "Nusantara" {
  const pulau = b.wilayah?.pulau?.toLowerCase() || "";
  const kota = b.wilayah?.nama?.toLowerCase() || "";
  const aturan = b.aturanPemakaian?.toLowerCase() || "";
  const sejarah = b.sejarah?.toLowerCase() || "";

  if (pulau && pulau !== "jawa") {
    return "Nusantara";
  }
  if (
    aturan.includes("keraton") ||
    aturan.includes("raja") ||
    aturan.includes("awisan") ||
    sejarah.includes("keraton") ||
    kota.includes("yogyakarta") ||
    kota.includes("surakarta") ||
    kota.includes("solo")
  ) {
    return "Keraton";
  }
  return "Pesisir";
}

function getBatikPatternAndPalette(b: BatikItem): { pattern: string; palette: string } {
  const id = b.id.toLowerCase();
  const kat = b.motif?.kategori?.toLowerCase() || "";

  if (id.includes("parang") || id.includes("lereng") || id.includes("udan")) {
    return { pattern: "parang", palette: "from-[#c88b52] to-[#7d382b]" };
  }
  if (id.includes("mega") || id.includes("mendung") || id.includes("wadasan")) {
    return { pattern: "mega", palette: "from-[#4b7580] to-[#173e4b]" };
  }
  if (id.includes("kawung") || id.includes("ceplok") || id.includes("nitik")) {
    return { pattern: "kawung", palette: "from-[#bc9a62] to-[#694c2c]" };
  }
  if (
    id.includes("sekar") ||
    id.includes("truntum") ||
    id.includes("sido") ||
    id.includes("grompol") ||
    id.includes("tambal")
  ) {
    return { pattern: "sekar", palette: "from-[#b85d47] to-[#4e2830]" };
  }
  if (
    kat === "fauna" ||
    id.includes("singa") ||
    id.includes("merak") ||
    id.includes("cendrawasih") ||
    id.includes("gajah") ||
    id.includes("insang") ||
    id.includes("barong")
  ) {
    return { pattern: "ulam", palette: "from-[#c69b3c] to-[#774525]" };
  }
  if (
    kat === "flora" ||
    id.includes("tujuh") ||
    id.includes("buketan") ||
    id.includes("parijoto") ||
    id.includes("pring") ||
    id.includes("jeumpa")
  ) {
    return { pattern: "flora", palette: "from-[#527c71] to-[#20493f]" };
  }
  return { pattern: "sekar", palette: "from-[#a35f3d] to-[#472a1e]" };
}

const SearchIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const Arrow = ({ className = "size-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="m5 12h14M13 6l6 6-6 6" />
  </svg>
);

function BatikMark() {
  return (
    <div className="relative grid size-10 rotate-45 place-items-center rounded-[10px] border border-[#a6623d]">
      <div className="size-5 rounded-full border border-[#a6623d]">
        <div className="m-[5px] size-2 rounded-full bg-[#a6623d]" />
      </div>
    </div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeMotifKat, setActiveMotifKat] = useState("all");
  const [activeTeknik, setActiveTeknik] = useState("all");
  const [activeAcara, setActiveAcara] = useState("all");
  const [activePulau, setActivePulau] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBatik, setSelectedBatik] = useState<BatikItem | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareInitialBatik, setCompareInitialBatik] = useState<BatikItem | undefined>(undefined);

  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-advance hero carousel every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_FEATURED.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Close suggestions when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live autocomplete suggestions
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const list: { label: string; sub: string; type: string; term: string }[] = [];

    // Match batiks
    allBatiks.forEach((b) => {
      if (b.nama.toLowerCase().includes(q)) {
        list.push({
          label: b.nama,
          sub: `${b.wilayah.nama} (${b.jenisLabel})`,
          type: "Motif Batik",
          term: b.nama,
        });
      } else if (b.wilayah.nama.toLowerCase().includes(q)) {
        list.push({
          label: b.wilayah.nama,
          sub: `${b.wilayah.provinsi} (${b.wilayah.pulau})`,
          type: "Wilayah Asal",
          term: b.wilayah.nama,
        });
      }
    });

    // Match concepts
    if ("awan".includes(q) || q.includes("awan")) {
      list.push({
        label: "Konsep: Awan & Alam",
        sub: "Mega Mendung Cirebon",
        type: "Semantik",
        term: "awan",
      });
    }
    if ("nikah".includes(q) || q.includes("pernikahan") || q.includes("manten")) {
      list.push({
        label: "Konsep: Upacara Pernikahan",
        sub: "Truntum, Sido Asih, Sido Mukti",
        type: "Semantik",
        term: "pernikahan",
      });
    }
    if ("ombak".includes(q) || q.includes("laut")) {
      list.push({
        label: "Konsep: Deburan Ombak Karang",
        sub: "Parang Rusak",
        type: "Semantik",
        term: "ombak",
      });
    }

    return list.slice(0, 5);
  }, [query]);

  // Semantic search evaluation
  const searchResult = useMemo(() => {
    return searchSemanticBatik(searchTerm, {
      jenis: activeTeknik !== "all" ? activeTeknik : undefined,
      motif: activeMotifKat !== "all" ? activeMotifKat : undefined,
      acara: activeAcara !== "all" ? activeAcara : undefined,
      pulau: activePulau !== "all" ? activePulau : undefined,
    });
  }, [searchTerm, activeTeknik, activeMotifKat, activeAcara, activePulau]);

  // Filtered & sorted batik collection
  const visibleBatiks = useMemo(() => {
    let list = [...searchResult.results];

    // Filter 1: Main Category (Keraton / Pesisir / Nusantara)
    if (activeCategory !== "Semua") {
      list = list.filter((b) => getBatikCategory(b) === activeCategory);
    }

    // Sorting
    if (sortBy === "name-asc") {
      list.sort((a, b) => a.nama.localeCompare(b.nama));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => b.nama.localeCompare(a.nama));
    } else if (sortBy === "complexity") {
      const rank: Record<string, number> = { Sangat_Tinggi: 4, Tinggi: 3, Sedang: 2, Rendah: 1 };
      list.sort((a, b) => (rank[b.tingkatKerumitan] || 0) - (rank[a.tingkatKerumitan] || 0));
    }

    return list;
  }, [searchResult, activeCategory, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { Semua: allBatiks.length, Keraton: 0, Pesisir: 0, Nusantara: 0 };
    allBatiks.forEach((b) => {
      const cat = getBatikCategory(b);
      counts[cat]++;
    });
    return counts;
  }, []);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setShowSuggestions(false);
    setSearchTerm(query.trim());
    document.querySelector("#jelajahi")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSelectSuggestion(term: string) {
    setQuery(term);
    setSearchTerm(term);
    setShowSuggestions(false);
    document.querySelector("#jelajahi")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleQuickSearch(term: string) {
    setQuery(term);
    setSearchTerm(term);
    document.querySelector("#jelajahi")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleResetFilters() {
    setActiveCategory("Semua");
    setActiveMotifKat("all");
    setActiveTeknik("all");
    setActiveAcara("all");
    setActivePulau("all");
    setSortBy("relevance");
    setSearchTerm("");
    setQuery("");
  }

  function handleOpenComparison(batik?: BatikItem) {
    setCompareInitialBatik(batik);
    setCompareModalOpen(true);
  }

  const isFilterActive =
    activeCategory !== "Semua" ||
    activeMotifKat !== "all" ||
    activeTeknik !== "all" ||
    activeAcara !== "all" ||
    activePulau !== "all" ||
    searchTerm !== "";

  const activeHeroMotif = HERO_FEATURED[heroIndex];
  const activeHeroBatikObj = allBatiks.find((b) => b.id === activeHeroMotif.id);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4efe5] text-[#1f2a25]">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-24 max-w-[1240px] items-center justify-between px-6 lg:px-10">
          <a href="#" className="flex items-center gap-4" aria-label="Aksara Batik">
            <BatikMark />
            <div>
              <div className="font-display text-[25px] leading-none tracking-[-.02em] text-[#fffaf0]">
                Aksara Batik
              </div>
              <div className="mt-1 text-[8px] font-bold uppercase tracking-[.32em] text-[#d9c7a9]">
                Ontologi & Ensiklopedia Budaya
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-[13px] font-semibold text-white/80 lg:flex">
            <a className="transition hover:text-white" href="#jelajahi">
              Jelajahi Motif
            </a>
            <a className="transition hover:text-white" href="#peta-pulau">
              Peta Pulau
            </a>
            <a className="transition hover:text-white" href="#graf-ontologi">
              Graf Semantik
            </a>
            <a className="transition hover:text-white" href="#ontologi">
              Taksonomi
            </a>
            <a className="transition hover:text-white" href="#sparql">
              SPARQL
            </a>
            <a className="transition hover:text-white" href="#cerita">
              Cerita
            </a>

            {/* Quick Compare Button */}
            <button
              onClick={() => handleOpenComparison()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#dfb47d]/40 bg-[#dfb47d]/15 px-3 py-1.5 text-xs font-bold text-[#dfb47d] transition hover:bg-[#dfb47d] hover:text-[#17251f]"
            >
              <Scale className="size-3.5" />
              <span>Bandingkan</span>
            </button>

            {/* NetBeans Badge */}
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-[#dfb47d]">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NetBeans Active</span>
            </div>

            <button
              onClick={() =>
                document.querySelector("#pencarian")?.scrollIntoView({ behavior: "smooth" })
              }
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-white/30 transition hover:bg-white hover:text-[#283830]"
              aria-label="Cari"
            >
              <SearchIcon className="size-[18px]" />
            </button>
          </nav>

          <button
            className="grid size-11 place-items-center rounded-full border border-white/30 text-white lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Buka menu"
            aria-expanded={menuOpen}
          >
            <span className="space-y-1.5">
              <span className="block h-px w-5 bg-current" />
              <span className="block h-px w-5 bg-current" />
            </span>
          </button>
        </div>

        {menuOpen && (
          <nav className="mx-5 flex flex-col gap-1 rounded-2xl bg-[#f8f4eb] p-3 text-sm font-semibold shadow-2xl lg:hidden">
            {[
              ["Jelajahi Motif", "#jelajahi"],
              ["Peta Sebaran Pulau", "#peta-pulau"],
              ["Graf Semantik Interaktif", "#graf-ontologi"],
              ["Peta Taksonomi Ontologi", "#ontologi"],
              ["Konsol SPARQL Query", "#sparql"],
              ["Cerita Batik", "#cerita"],
              ["Tentang", "#tentang"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 hover:bg-[#eee5d7]"
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                handleOpenComparison();
              }}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#273b32] py-3 text-white font-bold"
            >
              <Scale className="size-4" /> Komparasi 2 Motif
            </button>
          </nav>
        )}
      </header>

      {/* Hero Section with Interactive Spotlight Carousel */}
      <section className="relative min-h-[820px] bg-[#24382f] lg:min-h-[860px]">
        <img
          src="https://images.unsplash.com/photo-1590251869641-dd94fb569954?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=86&w=1800"
          alt="Perajin sedang mencanting kain batik"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] opacity-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(19,37,30,.98)_0%,rgba(21,39,31,.88)_48%,rgba(21,35,28,.25)_78%,rgba(15,25,21,.4)_100%)]" />
        <div className="batik-grid absolute inset-0 opacity-[.06]" />

        <div className="relative mx-auto flex h-full min-h-[820px] max-w-[1240px] flex-col justify-center px-6 pb-16 pt-32 lg:min-h-[860px] lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            {/* Left Column: Title, Search & Concepts */}
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.3em] text-[#d5a574]">
                <span className="h-px w-9 bg-[#d5a574]" />
                Web Semantik • 48 Individu Batik OWL 2 DL
              </div>

              <h1 className="font-display text-[46px] leading-[.98] tracking-[-.045em] text-[#fffaf0] sm:text-[66px] lg:text-[78px]">
                Setiap gurat,
                <br />
                <em className="font-normal text-[#dfb47d]">menyimpan cerita.</em>
              </h1>

              <p className="mt-6 max-w-[540px] text-[15px] leading-7 text-[#e5dfd2]/85 sm:text-base">
                Menelusuri kekayaan 48 motif batik Indonesia, filosofi luhur, dan kearifan Nusantara
                melalui representasi ontologi pengetahuan Web Semantik yang saling terhubung.
              </p>

              {/* Semantic Search Box with Live Autocomplete */}
              <div ref={searchContainerRef} className="relative mt-8 max-w-[590px]">
                <form
                  id="pencarian"
                  onSubmit={handleSearch}
                  className="flex items-center rounded-full bg-[#fffaf0] p-1.5 pl-5 shadow-2xl shadow-black/35 border border-[#dfb47d]/40 focus-within:ring-2 focus-within:ring-[#dfb47d]"
                >
                  <SearchIcon className="size-5 shrink-0 text-[#8c897e]" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[#27342e] outline-none placeholder:text-[#96948c]"
                    placeholder="Cari motif, makna, daerah, acara, atau konsep (cth: awan, nikah, ombak)..."
                    aria-label="Cari motif batik atau konsep ontologi"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-full bg-[#a35f3d] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#87472d] shadow-md"
                  >
                    Temukan
                  </button>
                </form>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute inset-x-0 top-full mt-2 z-40 rounded-2xl bg-[#fffaf0] p-2 shadow-2xl border border-[#ded4c5] divide-y divide-[#eee5d7]">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(s.term)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#eee5d7] text-left transition cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-[#26362f]">{s.label}</div>
                          <div className="text-[10px] text-[#74766f]">{s.sub}</div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#a2613f] bg-[#e7ded1] px-2 py-0.5 rounded-full">
                          {s.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Popular Keywords */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-white/60">
                <span className="text-[#dfb47d] font-semibold">Konsep Populer:</span>
                {[
                  "Parang",
                  "Mega Mendung",
                  "Kawung",
                  "Truntum",
                  "Pernikahan",
                  "Pewarna Alami",
                  "Awisan Keraton",
                  "Awan",
                  "Tolak Bala",
                ].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleQuickSearch(term)}
                    className="cursor-pointer rounded-full bg-white/10 px-2.5 py-1 text-white/80 transition hover:bg-white/20 hover:text-white"
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Key Ontology Metrics Row */}
              <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-white/80">
                <div>
                  <span className="font-display text-2xl font-bold text-[#dfb47d]">48</span>
                  <span className="ml-1.5 text-xs text-white/60 uppercase tracking-wider">
                    Motif Batik
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div>
                  <span className="font-display text-2xl font-bold text-[#dfb47d]">29</span>
                  <span className="ml-1.5 text-xs text-white/60 uppercase tracking-wider">
                    Kelas OWL
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div>
                  <span className="font-display text-2xl font-bold text-[#dfb47d]">16</span>
                  <span className="ml-1.5 text-xs text-white/60 uppercase tracking-wider">
                    Relasi Objek
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div className="text-[11px] text-[#dfb47d] font-semibold flex items-center gap-1.5">
                  <Award className="size-4" /> Warisan Dunia UNESCO 2009
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Hero Spotlight Carousel */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 p-6 backdrop-blur-xl shadow-2xl text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#dfb47d] animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#dfb47d]">
                      Sorotan Motif Unggulan ({heroIndex + 1}/{HERO_FEATURED.length})
                    </span>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setHeroIndex(
                          (prev) => (prev - 1 + HERO_FEATURED.length) % HERO_FEATURED.length,
                        )
                      }
                      className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-white"
                      aria-label="Sebelumnya"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      onClick={() =>
                        setHeroIndex((prev) => (prev + 1) % HERO_FEATURED.length)
                      }
                      className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-white"
                      aria-label="Selanjutnya"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Motif Visual Display with Animated Transition */}
                <div className="mt-5 relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-black/20 flex items-center justify-center p-4 border border-white/10 group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${activeHeroMotif.palette} opacity-60`} />
                  <div
                    className={`motif motif-${activeHeroMotif.pattern} absolute inset-0 opacity-40 transition-all duration-700 group-hover:scale-110`}
                  />

                  <div className="relative z-10 size-full flex items-center justify-center">
                    <BatikImage
                      id={activeHeroMotif.id}
                      alt={activeHeroMotif.name}
                      className="max-h-full max-w-full object-contain drop-shadow-2xl transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute top-3 left-3 z-20">
                    <span className="rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#dfb47d]">
                      {activeHeroMotif.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 z-20">
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[9px] font-medium text-white">
                      📍 {activeHeroMotif.region}
                    </span>
                  </div>
                </div>

                {/* Philosophy and Action */}
                <div className="mt-5">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#fffaf0]">
                    Batik {activeHeroMotif.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed italic">
                    “{activeHeroMotif.quote}”
                  </p>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
                    {/* Dots indicator */}
                    <div className="flex items-center gap-1.5">
                      {HERO_FEATURED.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setHeroIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            idx === heroIndex ? "w-6 bg-[#dfb47d]" : "w-2 bg-white/30"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (activeHeroBatikObj) setSelectedBatik(activeHeroBatikObj);
                      }}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#dfb47d] px-5 py-2 text-xs font-bold text-[#17251f] transition hover:bg-[#c69b3c] shadow-lg"
                    >
                      <span>Eksplorasi Triples</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Peta Sebaran Pulau Nusantara (#peta-pulau) */}
      <section id="peta-pulau" className="mx-auto max-w-[1240px] px-6 pt-16 lg:px-10">
        <ArchipelagoMap
          activePulau={activePulau}
          onSelectPulau={(pulau) => {
            setActivePulau(pulau);
            document.querySelector("#jelajahi")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </section>

      {/* Section: Jelajahi Motif & Pencarian Semantik (#jelajahi) */}
      <section
        id="jelajahi"
        className="relative mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-24"
      >
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">Koleksi Terverifikasi</div>
            <h2 className="mt-3 font-display text-4xl tracking-[-.035em] text-[#24342d] sm:text-5xl">
              Jelajahi Ragam Motif
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d736e]">
              Setiap motif merekam doa, filosofi luhur, dan teknik khas daerah pembuatnya.
              Klik kartu untuk mengeksplorasi graf triples OWL, bahan kerajinan, dan sintaks Turtle RDF.
            </p>
          </div>

          {/* Main Category Filter Pills with Live Counts */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "Semua", count: categoryCounts.Semua },
              { key: "Keraton", count: categoryCounts.Keraton },
              { key: "Pesisir", count: categoryCounts.Pesisir },
              { key: "Nusantara", count: categoryCounts.Nusantara },
            ].map(({ key, count }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                  activeCategory === key
                    ? "bg-[#273b32] text-white shadow-md shadow-[#273b32]/20"
                    : "border border-[#d7cec0] bg-[#faf6ee] text-[#6b6e69] hover:border-[#9f603e] hover:text-[#9f603e]"
                }`}
              >
                <span>{key}</span>
                <span
                  className={`size-4 rounded-full text-[9px] grid place-items-center ${
                    activeCategory === key ? "bg-white/20 text-white" : "bg-[#ded4c5] text-[#4a3528]"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Semantic Reasoning & Typo banner */}
        {searchTerm && (
          <div className="mb-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dbcdbb] bg-[#efe6d7] px-5 py-3 text-sm">
              <div className="flex items-center gap-2">
                <Search className="size-4 text-[#9f603e]" />
                <span>
                  Hasil pencarian untuk <strong>“{searchTerm}”</strong> — Ditemukan{" "}
                  <strong>{visibleBatiks.length}</strong> motif
                </span>
              </div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setQuery("");
                }}
                className="cursor-pointer text-xs font-bold text-[#9f603e] hover:underline"
              >
                Hapus Pencarian
              </button>
            </div>

            {/* Semantic concept explanation */}
            {searchResult.semanticMatch && (
              <div className="rounded-2xl border border-[#dfb47d]/60 bg-[#fffaf0] p-4 text-xs shadow-sm">
                <div className="flex items-center gap-2 text-[#a35f3d] font-bold">
                  <Sparkles className="size-4" />
                  <span>Deteksi Penalaran Semantik: {searchResult.semanticMatch.canonicalLabel}</span>
                </div>
                <p className="mt-1 text-[#5c5f5a] leading-relaxed">
                  {searchResult.semanticMatch.reasoning}
                </p>
              </div>
            )}

            {/* Typo correction notice */}
            {searchResult.typoCorrection && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800">
                <span>
                  Mungkin maksud Anda:{" "}
                  <button
                    onClick={() => handleQuickSearch(searchResult.typoCorrection!.corrected)}
                    className="font-bold underline cursor-pointer text-[#a35f3d]"
                  >
                    {searchResult.typoCorrection.corrected}
                  </button>
                  ?
                </span>
              </div>
            )}
          </div>
        )}

        {/* Filter and Tool Bar */}
        <div className="mb-8 rounded-2xl border border-[#ded4c5] bg-[#f9f5ed] p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#d7cbb9] bg-white px-3.5 py-2 text-xs font-semibold text-[#4a3528] transition hover:bg-[#eee5d7]"
              >
                <Filter className="size-3.5 text-[#9f603e]" />
                <span>Filter Lanjutan</span>
                {showAdvancedFilters ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>

              {isFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#dbcdbb] px-3 py-2 text-xs font-semibold text-[#8a4e30] hover:bg-[#efe6d7]"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>

            {/* View Mode & Sorting */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#6d736e]">
                <span>Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-[#d7cbb9] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#27342e] outline-none"
                >
                  <option value="relevance">Relevansi Semantik</option>
                  <option value="name-asc">Nama (A - Z)</option>
                  <option value="name-desc">Nama (Z - A)</option>
                  <option value="complexity">Tingkat Kerumitan</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center rounded-lg border border-[#d7cbb9] bg-white p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded cursor-pointer ${
                    viewMode === "grid" ? "bg-[#273b32] text-white" : "text-[#6d736e]"
                  }`}
                  title="Tampilan Grid"
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded cursor-pointer ${
                    viewMode === "list" ? "bg-[#273b32] text-white" : "text-[#6d736e]"
                  }`}
                  title="Tampilan List"
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-[#ded4c5] grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs animate-fade-in">
              <div>
                <label className="block font-bold text-[#68432d] uppercase tracking-wider text-[10px] mb-1.5">
                  Kategori Ornamen
                </label>
                <select
                  value={activeMotifKat}
                  onChange={(e) => setActiveMotifKat(e.target.value)}
                  className="w-full rounded-xl border border-[#d7cbb9] bg-white p-2.5 outline-none font-medium text-[#27342e]"
                >
                  <option value="all">Semua Ornamen (Flora, Fauna, dll.)</option>
                  <option value="flora">Flora (Tumbuhan & Bunga)</option>
                  <option value="fauna">Fauna (Satwa & Mitologi)</option>
                  <option value="geometris">Geometris (Kawung, Parang, dll.)</option>
                  <option value="alam">Alam (Awan, Langit, Ombak)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#68432d] uppercase tracking-wider text-[10px] mb-1.5">
                  Teknik Pembuatan
                </label>
                <select
                  value={activeTeknik}
                  onChange={(e) => setActiveTeknik(e.target.value)}
                  className="w-full rounded-xl border border-[#d7cbb9] bg-white p-2.5 outline-none font-medium text-[#27342e]"
                >
                  <option value="all">Semua Teknik Pembuatan</option>
                  <option value="batik_tulis">Batik Tulis (Canting)</option>
                  <option value="batik_cap">Batik Cap</option>
                  <option value="batik_cetak">Batik Cetak / Sablon</option>
                  <option value="batik_kombinasi">Batik Kombinasi (Tulis-Cap)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#68432d] uppercase tracking-wider text-[10px] mb-1.5">
                  Acara & Ritual Adat
                </label>
                <select
                  value={activeAcara}
                  onChange={(e) => setActiveAcara(e.target.value)}
                  className="w-full rounded-xl border border-[#d7cbb9] bg-white p-2.5 outline-none font-medium text-[#27342e]"
                >
                  <option value="all">Semua Acara & Ritual</option>
                  <option value="pernikahan">Upacara Pernikahan Adat</option>
                  <option value="kelahiran">Kelahiran & Mitoni (7 Bulanan)</option>
                  <option value="kematian">Lelayu / Upacara Kematian</option>
                  <option value="formal">Busana Formal & Resmi</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#68432d] uppercase tracking-wider text-[10px] mb-1.5">
                  Kepulauan Nusantara
                </label>
                <select
                  value={activePulau}
                  onChange={(e) => setActivePulau(e.target.value)}
                  className="w-full rounded-xl border border-[#d7cbb9] bg-white p-2.5 outline-none font-medium text-[#27342e]"
                >
                  <option value="all">Semua Kepulauan</option>
                  <option value="Jawa">Pulau Jawa</option>
                  <option value="Sumatera">Pulau Sumatera</option>
                  <option value="Bali">Pulau Bali</option>
                  <option value="Kalimantan">Pulau Kalimantan</option>
                  <option value="Sulawesi">Pulau Sulawesi</option>
                  <option value="Papua">Pulau Papua</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Counter Info & Quick Compare banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#74766f]">
          <span>
            Menampilkan <strong>{visibleBatiks.length}</strong> dari{" "}
            <strong>{allBatiks.length}</strong> motif batik
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenComparison()}
              className="inline-flex cursor-pointer items-center gap-1.5 text-[#9f603e] font-bold hover:underline"
            >
              <Scale className="size-3.5" />
              <span>Buka Komparasi 2 Motif</span>
            </button>
            <span className="text-[#ded4c5]">•</span>
            <span className="text-[11px] text-[#9f603e] font-semibold">
              Klik kartu untuk rincian triples RDF
            </span>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleBatiks.map((motif, index) => {
              const category = getBatikCategory(motif);
              const { pattern, palette } = getBatikPatternAndPalette(motif);

              return (
                <article
                  key={motif.id}
                  onClick={() => setSelectedBatik(motif)}
                  className="group cursor-pointer overflow-hidden rounded-[22px] border border-[#ded4c5] bg-[#f9f5ed] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#473b2e]/15 flex flex-col justify-between"
                >
                  {/* Visual Header */}
                  <div className={`relative h-60 overflow-hidden bg-gradient-to-br ${palette}`}>
                    {/* SVG Image Rendering */}
                    <div className="absolute inset-0 flex items-center justify-center p-3">
                      <BatikImage
                        id={motif.id}
                        alt={motif.nama}
                        className="w-full h-full object-contain drop-shadow-md transition duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* CSS Motif Texture Overlay */}
                    <div
                      className={`motif motif-${pattern} absolute inset-0 opacity-20 transition duration-700 group-hover:scale-110 pointer-events-none`}
                    />

                    {/* Badges */}
                    <div className="absolute left-4 top-4 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[.18em] text-white backdrop-blur-sm">
                        0{index + 1} — {category}
                      </span>
                      <span className="rounded-full border border-white/20 bg-[#24382f]/85 px-2.5 py-1 text-[9px] font-semibold text-[#dfb47d] backdrop-blur-sm">
                        {motif.jenisLabel}
                      </span>
                    </div>

                    <div className="absolute right-4 top-4">
                      <span className="rounded-full bg-white/85 px-2.5 py-1 text-[9px] font-bold text-[#68432d] shadow-sm">
                        {motif.wilayah?.pulau}
                      </span>
                    </div>

                    {/* Quick Compare Overlay Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenComparison(motif);
                      }}
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-[#dfb47d] border border-white/20 flex items-center gap-1"
                      title="Bandingkan dengan motif lain"
                    >
                      <Scale className="size-3" /> Bandingkan
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a2613f]">
                        {motif.wilayah?.nama}, {motif.wilayah?.provinsi}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <h3 className="font-display text-[23px] font-bold leading-snug text-[#26362f] group-hover:text-[#a35f3d] transition-colors">
                          {motif.nama}
                        </h3>
                        <div className="grid size-9 shrink-0 place-items-center rounded-full border border-[#d7cbb9] text-[#8e563a] transition group-hover:bg-[#8e563a] group-hover:text-white">
                          <Arrow />
                        </div>
                      </div>

                      <p className="mt-2 text-xs leading-relaxed text-[#74766f] line-clamp-3">
                        {motif.maknaFilosofis || motif.deskripsi}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#ded4c5]/70 flex flex-wrap items-center gap-1.5 text-[10px] text-[#74766f]">
                      <span className="px-2 py-0.5 rounded bg-[#eee5d7] font-semibold text-[#4a3528]">
                        Motif {motif.motif?.kategori}
                      </span>
                      {motif.acara && motif.acara.length > 0 && (
                        <span className="px-2 py-0.5 rounded bg-[#e7ded1] text-[#6d503b]">
                          {motif.acara[0].nama}
                        </span>
                      )}
                      <span className="ml-auto text-[10px] font-mono text-[#a2613f]">
                        :{motif.id}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {visibleBatiks.map((motif, index) => {
              const category = getBatikCategory(motif);
              return (
                <article
                  key={motif.id}
                  onClick={() => setSelectedBatik(motif)}
                  className="group cursor-pointer rounded-2xl border border-[#ded4c5] bg-[#f9f5ed] p-4 transition duration-300 hover:shadow-lg hover:border-[#a35f3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-xl overflow-hidden bg-[#efe6d7] shrink-0 border border-[#d7cec0]">
                      <BatikImage
                        id={motif.id}
                        alt={motif.nama}
                        className="size-full object-contain p-1"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#a2613f]">
                        <span>{category}</span>
                        <span>•</span>
                        <span>
                          {motif.wilayah?.nama}, {motif.wilayah?.provinsi}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#26362f]">
                        {motif.nama}
                      </h3>
                      <p className="text-xs text-[#74766f] line-clamp-1 max-w-xl">
                        {motif.maknaFilosofis || motif.deskripsi}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenComparison(motif);
                      }}
                      className="px-2.5 py-1 rounded-full border border-[#d7cbb9] text-[10px] font-bold text-[#4a3528] hover:bg-white flex items-center gap-1"
                    >
                      <Scale className="size-3" /> Bandingkan
                    </button>
                    <span className="px-2.5 py-1 rounded-full bg-[#eee5d7] text-[11px] font-semibold text-[#4a3528]">
                      {motif.jenisLabel}
                    </span>
                    <div className="grid size-8 place-items-center rounded-full border border-[#d7cbb9] text-[#8e563a] transition group-hover:bg-[#8e563a] group-hover:text-white">
                      <Arrow />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {visibleBatiks.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-[#cbbda9] py-20 text-center bg-[#fbf9f4]">
            <p className="font-display text-2xl font-bold text-[#273b32]">Motif belum ditemukan</p>
            <p className="mt-2 text-sm text-[#74766f] max-w-md mx-auto">
              Tidak ada batik yang cocok dengan kata kunci atau kombinasi filter aktif saat ini.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#a35f3d] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#87472d]"
            >
              <RotateCcw className="size-3.5" />
              Reset Pencarian & Filter
            </button>
          </div>
        )}
      </section>

      {/* Section: Graf Pengetahuan Semantik Interaktif (#graf-ontologi) */}
      <section
        id="graf-ontologi"
        className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-24"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">Visualisasi Jaringan RDF</div>
            <h2 className="mt-3 font-display text-4xl tracking-[-.03em] text-[#24342d] sm:text-5xl">
              Graf Pengetahuan Semantik Interaktif
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6d736e]">
              Visualisasi node-link interaktif yang menghubungkan seluruh 48 individu batik, wilayah
              asal, teknik pembuatan, lilin malam, hingga acara adat. Seret node untuk melihat
              gaya fisik force-directed simulasinya.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#8a5232]">
            <Sparkles className="size-4" />
            <span>Simulasi Fisika 60 FPS • Drag, Zoom & Pan</span>
          </div>
        </div>

        {/* Interactive Graph Component */}
        <SemanticGraphViewer onSelectBatik={(b) => setSelectedBatik(b)} />
      </section>

      {/* Section: Peta Pengetahuan Ontologi (#ontologi) */}
      <section id="ontologi" className="bg-[#24382f] text-white px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          {/* Header Ontologi */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="eyebrow text-[#dca46d] before:bg-[#dca46d]">
                Representasi Pengetahuan Formal
              </div>
              <h2 className="mt-4 font-display text-4xl tracking-[-.03em] text-[#fffaf0] sm:text-5xl">
                Peta Pengetahuan Ontologi
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Ontologi Batik Nusantara dimodelkan menggunakan standar W3C OWL 2 DL. Merekam
                taksonomi kelas kain batik, relasi ornamen, bahan malam lilin, pewarnaan tradisional,
                serta konteks adat upacara.
              </p>
            </div>

            <div className="flex flex-col gap-1 text-right text-xs text-white/60">
              <span className="font-mono text-[#dfb47d]">
                URI: http://www.semanticweb.org/asus/ontologies/2026/8/untitled-ontology-3
              </span>
              <span>Standar W3C OWL 2 DL • Apache Jena In-Memory Engine</span>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5 border-y border-white/10 py-8">
            <div>
              <div className="font-display text-3xl sm:text-4xl text-[#dfb47d]">48</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
                Individu Batik
              </div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl text-[#dfb47d]">29</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
                Kelas Ontologi
              </div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl text-[#dfb47d]">16</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
                Object Properties
              </div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl text-[#dfb47d]">29</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
                Data Properties
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="font-display text-3xl sm:text-4xl text-[#dfb47d]">160+</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
                Total Entitas
              </div>
            </div>
          </div>

          {/* Interactive Knowledge Base Component */}
          <div className="mt-12 rounded-3xl bg-[#faf7f2] p-6 text-[#1f2a25] shadow-2xl">
            <KnowledgeBaseModule
              onSelectBatik={(b) => setSelectedBatik(b)}
              onGoToSearchWithQuery={(q) => handleQuickSearch(q)}
            />
          </div>
        </div>
      </section>

      {/* Section: SPARQL Query Console (#sparql) */}
      <section id="sparql" className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mb-10">
          <div className="eyebrow">Eksplorasi Semantik</div>
          <h2 className="mt-3 font-display text-4xl tracking-[-.03em] text-[#24342d] sm:text-5xl">
            Konsol SPARQL Query
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d736e]">
            Jalankan kueri SPARQL langsung terhadap data ontologi batik untuk meneliti hubungan
            semantik antar-entitas (misal: mencari batik pernikahan yang menggunakan pewarna alami).
          </p>
        </div>

        <div className="rounded-3xl border border-[#ded4c5] bg-[#f9f5ed] p-6 shadow-xl">
          <SparqlModule />
        </div>
      </section>

      {/* Section: Cerita Batik (#cerita) */}
      <section id="cerita" className="bg-[#20362d] px-6 py-20 text-white lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          <div className="relative">
            <div className="overflow-hidden rounded-t-[180px] rounded-b-[20px]">
              <img
                src="https://images.unsplash.com/photo-1604973104381-870c92f10343?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1000"
                alt="Detail tangan perajin batik menggunakan canting"
                className="h-[520px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-4 rounded-2xl bg-[#d9a264] px-6 py-5 text-[#24342d] shadow-xl sm:right-[-30px]">
              <div className="font-display text-3xl font-bold">2.400+</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[.2em]">
                Motif Terdokumentasi
              </div>
            </div>
          </div>

          <div>
            <div className="eyebrow text-[#dca46d] before:bg-[#dca46d]">Pengetahuan Terhubung</div>
            <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-.03em] sm:text-5xl">
              Bukan sekadar kain,
              <br />
              ini adalah <em className="font-normal text-[#dca46d]">identitas.</em>
            </h2>
            <p className="mt-7 text-[15px] leading-7 text-white/70">
              Aksara Batik merangkai hubungan antara motif, daerah asal, teknik, warna, dan makna
              filosofis ke dalam sebuah peta pengetahuan budaya yang mudah dijelajahi oleh sivitas
              akademika, peneliti, maupun masyarakat luas.
            </p>

            <div className="mt-9 grid grid-cols-3 gap-3 border-y border-white/10 py-7">
              {[
                ["34", "Provinsi"],
                ["120+", "Perajin"],
                ["6", "Teknik"],
              ].map(([number, label]) => (
                <div key={label}>
                  <div className="font-display text-3xl text-[#e7bd87]">{number}</div>
                  <div className="mt-1 text-[9px] uppercase tracking-[.16em] text-white/50">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#ontologi"
              className="mt-8 inline-flex items-center gap-3 text-xs font-bold text-[#e7bd87] hover:underline"
            >
              Lihat Peta Taksonomi Ontologi <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* Section: Tentang (#tentang) */}
      <section id="tentang" className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="rounded-[28px] bg-[#dba76e] px-7 py-12 text-center sm:px-16 lg:flex lg:items-center lg:justify-between lg:py-14 lg:text-left">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[.24em] text-[#68432d]">
              Sistem Informasi Semantik Batik
            </div>
            <h2 className="mt-3 font-display text-3xl tracking-[-.03em] text-[#24342d] sm:text-4xl">
              Kenali warisan, teruskan ceritanya.
            </h2>
            <p className="mt-2 text-xs text-[#52331f] max-w-lg">
              Dirancang untuk integrasi Apache NetBeans dan web client. Menyajikan ontologi RDF/OWL
              lengkap dengan inferensi semantik dan pencarian cerdas.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:mt-0">
            <button
              onClick={() =>
                document.querySelector("#jelajahi")?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-[#263a31] px-7 py-4 text-xs font-bold text-white transition hover:bg-[#17251f]"
            >
              Mulai Menjelajah <Arrow />
            </button>
            <button
              onClick={() =>
                document.querySelector("#sparql")?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#68432d] bg-transparent px-6 py-4 text-xs font-bold text-[#24342d] transition hover:bg-[#c9955c]"
            >
              <Terminal className="size-4" /> Buka SPARQL
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#d9d0c2] px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="scale-75">
              <BatikMark />
            </div>
            <div>
              <span className="font-display text-lg font-bold">Aksara Batik</span>
              <span className="ml-2 text-[10px] font-mono text-[#85877f]">
                v1.0 • Apache NetBeans Build
              </span>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-[.14em] text-[#85877f]">
            Merawat pengetahuan, menjaga warisan budaya Indonesia.
          </p>
          <p className="text-[10px] text-[#95968f]">© 2025-2026 Aksara Batik Ontologi</p>
        </div>
      </footer>

      {/* Semantic Detail Modal */}
      {selectedBatik && (
        <BatikDetailModal
          batik={selectedBatik}
          onClose={() => setSelectedBatik(null)}
          onSelectRelated={(relatedId) => {
            const found = allBatiks.find((b) => b.id === relatedId);
            if (found) setSelectedBatik(found);
          }}
        />
      )}

      {/* Interactive Motif Comparison Modal */}
      <MotifComparisonModal
        initialBatikA={compareInitialBatik}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onOpenDetail={(b) => setSelectedBatik(b)}
      />
    </main>
  );
}
