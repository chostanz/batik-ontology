import { FormEvent, useMemo, useState } from "react";
import ontologyBundle from "@/lib/ontologyData.json";
import { searchSemanticBatik, BatikItem } from "@/lib/semanticEngine";
import { BatikImage } from "@/components/BatikImage";
import { BatikDetailModal } from "@/components/BatikDetailModal";
import { KnowledgeBaseModule } from "@/components/KnowledgeBaseModule";
import { SparqlModule } from "@/components/SparqlModule";
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
} from "lucide-react";

const allBatiks: BatikItem[] = ontologyBundle.batiks as unknown as BatikItem[];

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBatik, setSelectedBatik] = useState<BatikItem | null>(null);

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

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setSearchTerm(query.trim());
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

  const isFilterActive =
    activeCategory !== "Semua" ||
    activeMotifKat !== "all" ||
    activeTeknik !== "all" ||
    activeAcara !== "all" ||
    activePulau !== "all" ||
    searchTerm !== "";

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

          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-white/80 lg:flex">
            <a className="transition hover:text-white" href="#jelajahi">
              Jelajahi Motif
            </a>
            <a className="transition hover:text-white" href="#ontologi">
              Peta Ontologi
            </a>
            <a className="transition hover:text-white" href="#sparql">
              SPARQL Query
            </a>
            <a className="transition hover:text-white" href="#cerita">
              Cerita Batik
            </a>
            <a className="transition hover:text-white" href="#tentang">
              Tentang
            </a>

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-[#dfb47d]">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Apache NetBeans Ready</span>
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
              ["Peta Ontologi", "#ontologi"],
              ["SPARQL Query", "#sparql"],
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
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[760px] bg-[#24382f] lg:h-[94vh] lg:min-h-[720px]">
        <img
          src="https://images.unsplash.com/photo-1590251869641-dd94fb569954?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=86&w=1800"
          alt="Perajin sedang mencanting kain batik"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] opacity-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(19,37,30,.98)_0%,rgba(21,39,31,.86)_42%,rgba(21,35,28,.2)_75%,rgba(15,25,21,.35)_100%)]" />
        <div className="batik-grid absolute inset-0 opacity-[.06]" />

        <div className="relative mx-auto flex h-full min-h-[760px] max-w-[1240px] items-center px-6 pb-14 pt-32 lg:min-h-[720px] lg:px-10">
          <div className="max-w-[720px]">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.3em] text-[#d5a574]">
              <span className="h-px w-9 bg-[#d5a574]" />
              Ensiklopedia & Web Semantik Batik Indonesia
            </div>

            <h1 className="font-display text-[50px] leading-[.98] tracking-[-.045em] text-[#fffaf0] sm:text-[70px] lg:text-[84px]">
              Setiap gurat,
              <br />
              <em className="font-normal text-[#dfb47d]">menyimpan cerita.</em>
            </h1>

            <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-[#e5dfd2]/85 sm:text-base">
              Menelusuri kekayaan 48 motif batik, filosofi luhur, dan kearifan Nusantara melalui
              representasi pengetahuan ontologi Web Semantik yang saling terhubung.
            </p>

            {/* Semantic Search Box */}
            <form
              id="pencarian"
              onSubmit={handleSearch}
              className="mt-9 flex max-w-[620px] items-center rounded-full bg-[#fffaf0] p-1.5 pl-5 shadow-2xl shadow-black/25"
            >
              <SearchIcon className="size-5 shrink-0 text-[#8c897e]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[#27342e] outline-none placeholder:text-[#96948c]"
                placeholder="Cari motif, makna, daerah, acara, atau konsep (cth: awan, nikah, ombak)..."
                aria-label="Cari motif batik atau konsep ontologi"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-[#a35f3d] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#87472d]"
              >
                Temukan
              </button>
            </form>

            {/* Quick search tags */}
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

            {/* Stats row in hero */}
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-white/80">
              <div>
                <span className="font-display text-2xl font-bold text-[#dfb47d]">48</span>
                <span className="ml-1.5 text-xs text-white/60 uppercase tracking-wider">Motif Batik</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div>
                <span className="font-display text-2xl font-bold text-[#dfb47d]">29</span>
                <span className="ml-1.5 text-xs text-white/60 uppercase tracking-wider">Kelas Ontologi</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div>
                <span className="font-display text-2xl font-bold text-[#dfb47d]">16</span>
                <span className="ml-1.5 text-xs text-white/60 uppercase tracking-wider">Relasi Objek</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="text-[11px] text-[#dfb47d] font-semibold flex items-center gap-1.5">
                <Award className="size-4" /> UNESCO 2009
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-[9px] uppercase tracking-[.25em] text-white/60 lg:flex">
          <span className="h-px w-10 bg-white/30" />
          Web Semantik • Apache Jena • Protégé OWL
        </div>
      </section>

      {/* Section: Jelajahi Motif & Pencarian Semantik */}
      <section
        id="jelajahi"
        className="relative mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28"
      >
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">Temukan Warisan</div>
            <h2 className="mt-3 font-display text-4xl tracking-[-.035em] text-[#24342d] sm:text-5xl">
              Jelajahi Ragam Motif
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d736e]">
              Setiap motif merekam doa, filosofi sakral, dan teknik pembuatan khas daerah asalnya.
              Klik pada motif untuk melihat relasi triples RDF dan format ontologi.
            </p>
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {["Semua", "Keraton", "Pesisir", "Nusantara"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  activeCategory === category
                    ? "bg-[#273b32] text-white shadow-md shadow-[#273b32]/20"
                    : "border border-[#d7cec0] bg-[#faf6ee] text-[#6b6e69] hover:border-[#9f603e] hover:text-[#9f603e]"
                }`}
              >
                {category}
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
                  className={`p-1 rounded ${viewMode === "grid" ? "bg-[#273b32] text-white" : "text-[#6d736e]"}`}
                  title="Tampilan Grid"
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded ${viewMode === "list" ? "bg-[#273b32] text-white" : "text-[#6d736e]"}`}
                  title="Tampilan List"
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-[#ded4c5] grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              {/* Motif Category */}
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

              {/* Teknik */}
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

              {/* Acara Penggunaan */}
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

              {/* Pulau / Wilayah Asal */}
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

        {/* Counter Info */}
        <div className="mb-6 flex items-center justify-between text-xs text-[#74766f]">
          <span>
            Menampilkan <strong>{visibleBatiks.length}</strong> dari <strong>{allBatiks.length}</strong> motif batik
          </span>
          <span className="text-[11px] text-[#9f603e] font-semibold">
            Klik kartu untuk rincian triples RDF
          </span>
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
                  className="group cursor-pointer overflow-hidden rounded-[22px] border border-[#ded4c5] bg-[#f9f5ed] transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#473b2e]/10 flex flex-col justify-between"
                >
                  {/* Visual Header */}
                  <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${palette}`}>
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
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a2613f]">
                        {motif.wilayah?.nama}, {motif.wilayah?.provinsi}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <h3 className="font-display text-[23px] font-bold leading-snug text-[#26362f]">
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
                      <BatikImage id={motif.id} alt={motif.nama} className="size-full object-contain p-1" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#a2613f]">
                        <span>{category}</span>
                        <span>•</span>
                        <span>{motif.wilayah?.nama}, {motif.wilayah?.provinsi}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#26362f]">{motif.nama}</h3>
                      <p className="text-xs text-[#74766f] line-clamp-1 max-w-xl">{motif.maknaFilosofis || motif.deskripsi}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
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
    </main>
  );
}
