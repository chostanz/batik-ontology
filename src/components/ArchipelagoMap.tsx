import React from 'react';
import ontologyBundle from '@/lib/ontologyData.json';
import { BatikItem } from '@/lib/semanticEngine';
import { MapPin, Compass, Sparkles } from 'lucide-react';

interface ArchipelagoMapProps {
  activePulau: string;
  onSelectPulau: (pulau: string) => void;
}

const ISLANDS_DATA = [
  {
    id: 'Jawa',
    name: 'Pulau Jawa',
    tagline: 'Pusat Keraton & Pesisiran Pantura',
    description: 'Tradisi soga klasik keraton Mataram dan akulturasi pesisiran Tionghoa-Eropa.',
    accent: '#dfb47d',
    colorClasses: 'from-amber-900/40 via-[#273b32] to-[#1c2e26]',
  },
  {
    id: 'Sumatera',
    name: 'Pulau Sumatera',
    tagline: 'Jambi, Bengkulu, Aceh & Ranah Minang',
    description: 'Motif Angso Duo, Kaligrafi Besurek Arab Gundul, dan ornamen Bungong Jeumpa.',
    accent: '#34d399',
    colorClasses: 'from-emerald-950/50 via-[#20362d] to-[#1a2c24]',
  },
  {
    id: 'Bali',
    name: 'Kepulauan Bali',
    tagline: 'Dewata, Spiritualitas & Dewa Ruci',
    description: 'Kekayaan ornamen Barong Bali, Ulamsari Mas, dan keselarasan alam flora-fauna.',
    accent: '#fbbf24',
    colorClasses: 'from-yellow-950/40 via-[#253930] to-[#1a2b23]',
  },
  {
    id: 'Kalimantan',
    name: 'Pulau Kalimantan',
    tagline: 'Dayak & Pohon Kehidupan',
    description: 'Filosofi Batang Garing dan perisai tameng suku Dayak pedalaman hutan tropis.',
    accent: '#38bdf8',
    colorClasses: 'from-cyan-950/40 via-[#20352c] to-[#192b23]',
  },
  {
    id: 'Sulawesi',
    name: 'Pulau Sulawesi',
    tagline: 'Minahasa & Ukiran Toraja',
    description: 'Gurat batu megalitikum Pinawetengan dan simbol kemuliaan tanduk kerbau Pa\'ssura.',
    accent: '#c084fc',
    colorClasses: 'from-purple-950/40 via-[#23372e] to-[#182921]',
  },
  {
    id: 'Papua',
    name: 'Tanah Papua',
    tagline: 'Asmat, Burung Surga & Kamoro',
    description: 'Seni ukir kayu patung leluhur Asmat dan pesona sakral Cendrawasih Papua Selatan.',
    accent: '#f87171',
    colorClasses: 'from-red-950/40 via-[#253930] to-[#1a2b23]',
  },
];

export function ArchipelagoMap({ activePulau, onSelectPulau }: ArchipelagoMapProps) {
  const allBatiks = ontologyBundle.batiks as unknown as BatikItem[];

  // Compute counts per island
  const islandCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    allBatiks.forEach((b) => {
      const p = b.wilayah?.pulau || 'Lainnya';
      counts[p] = (counts[p] || 0) + 1;
    });
    return counts;
  }, [allBatiks]);

  return (
    <div className="rounded-3xl border border-[#ded4c5] bg-[#f9f5ed] p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="eyebrow">Sebaran Budaya Geografis</div>
          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#24342d]">
            Peta Ragam Batik Nusantara
          </h3>
          <p className="mt-1 text-xs text-[#74766f] max-w-xl">
            Pilih pulau untuk menelusuri karakteristik corak lokal, pengaruh bentang alam, dan kearifan masyarakat pembuatnya.
          </p>
        </div>

        <button
          onClick={() => onSelectPulau('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer border ${
            activePulau === 'all'
              ? 'bg-[#273b32] text-white border-transparent shadow'
              : 'border-[#d7cec0] bg-white text-[#6b6e69] hover:border-[#a35f3d]'
          }`}
        >
          Seluruh Nusantara ({allBatiks.length})
        </button>
      </div>

      {/* Island Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ISLANDS_DATA.map((island) => {
          const isSelected = activePulau.toLowerCase() === island.id.toLowerCase();
          const count = islandCounts[island.id] || 0;

          return (
            <div
              key={island.id}
              onClick={() => onSelectPulau(isSelected ? 'all' : island.id)}
              className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-[#a35f3d] bg-gradient-to-br from-[#263a31] to-[#17251f] text-white shadow-xl scale-[1.02]'
                  : 'border-[#ded4c5] bg-[#fffaf0] hover:border-[#dfb47d] hover:shadow-md text-[#27342e]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#a2613f]">
                    <MapPin className="size-3" style={{ color: island.accent }} />
                    <span className={isSelected ? 'text-[#dfb47d]' : ''}>{island.id}</span>
                  </div>
                  <h4 className="mt-1 font-display text-lg font-bold">
                    {island.name}
                  </h4>
                  <div className={`text-[11px] font-medium mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#74766f]'}`}>
                    {island.tagline}
                  </div>
                </div>

                <div
                  className={`size-10 rounded-xl grid place-items-center font-display text-lg font-bold shadow-sm shrink-0 ${
                    isSelected
                      ? 'bg-[#dfb47d] text-[#17251f]'
                      : 'bg-[#eee5d7] text-[#4a3528] group-hover:bg-[#dfb47d] group-hover:text-[#17251f] transition'
                  }`}
                >
                  {count}
                </div>
              </div>

              <p className={`mt-3 text-xs leading-relaxed line-clamp-2 ${isSelected ? 'text-white/70' : 'text-[#74766f]'}`}>
                {island.description}
              </p>

              <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-[11px] font-semibold">
                <span className={isSelected ? 'text-[#dfb47d]' : 'text-[#a2613f]'}>
                  {isSelected ? '✓ Sedang Ditampilkan' : 'Eksplorasi Pulau →'}
                </span>
                <span className="text-[10px] opacity-60">
                  {count} Motif Koleksi
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
