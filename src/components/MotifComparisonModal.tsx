import React, { useState } from 'react';
import ontologyBundle from '@/lib/ontologyData.json';
import { BatikItem } from '@/lib/semanticEngine';
import { BatikImage } from './BatikImage';
import { X, ArrowRight, Sparkles, Scale, Check, Layers } from 'lucide-react';

interface MotifComparisonModalProps {
  initialBatikA?: BatikItem;
  isOpen: boolean;
  onClose: () => void;
  onOpenDetail: (b: BatikItem) => void;
}

export function MotifComparisonModal({
  initialBatikA,
  isOpen,
  onClose,
  onOpenDetail,
}: MotifComparisonModalProps) {
  const allBatiks = ontologyBundle.batiks as unknown as BatikItem[];

  const [batikAId, setBatikAId] = useState<string>(
    initialBatikA?.id || allBatiks[0]?.id || 'Batik_Parang_Rusak'
  );
  const [batikBId, setBatikBId] = useState<string>(
    allBatiks.find((b) => b.id !== batikAId)?.id || 'Batik_Megamendung'
  );

  if (!isOpen) return null;

  const batikA = allBatiks.find((b) => b.id === batikAId) || allBatiks[0];
  const batikB = allBatiks.find((b) => b.id === batikBId) || allBatiks[1];

  const compareRows = [
    {
      label: 'Asal Daerah',
      valA: `${batikA.wilayah.nama}, ${batikA.wilayah.provinsi}`,
      valB: `${batikB.wilayah.nama}, ${batikB.wilayah.provinsi}`,
    },
    {
      label: 'Pulau / Wilayah',
      valA: batikA.wilayah.pulau,
      valB: batikB.wilayah.pulau,
    },
    {
      label: 'Jenis & Teknik',
      valA: `${batikA.jenisLabel} (${batikA.teknik.alat})`,
      valB: `${batikB.jenisLabel} (${batikB.teknik.alat})`,
    },
    {
      label: 'Kategori Ornamen',
      valA: `Motif ${batikA.motif.kategori} - "${batikA.motif.nama}"`,
      valB: `Motif ${batikB.motif.kategori} - "${batikB.motif.nama}"`,
    },
    {
      label: 'Bahan Kain',
      valA: batikA.bahanKain,
      valB: batikB.bahanKain,
    },
    {
      label: 'Lilin Malam',
      valA: batikA.malam && batikA.malam.length > 0 ? batikA.malam.map((m) => m.nama).join(', ') : 'Malam Tradisional',
      valB: batikB.malam && batikB.malam.length > 0 ? batikB.malam.map((m) => m.nama).join(', ') : 'Malam Tradisional',
    },
    {
      label: 'Pewarnaan',
      valA: batikA.pewarnaan && batikA.pewarnaan.length > 0 ? batikA.pewarnaan.map((p) => `${p.nama} (${p.tipe})`).join(', ') : 'Pewarna Batik',
      valB: batikB.pewarnaan && batikB.pewarnaan.length > 0 ? batikB.pewarnaan.map((p) => `${p.nama} (${p.tipe})`).join(', ') : 'Pewarna Batik',
    },
    {
      label: 'Konteks Acara / Ritual',
      valA: batikA.acara && batikA.acara.length > 0 ? batikA.acara.map((a) => a.nama).join(', ') : 'Busana Umum',
      valB: batikB.acara && batikB.acara.length > 0 ? batikB.acara.map((a) => a.nama).join(', ') : 'Busana Umum',
    },
    {
      label: 'Aturan Pemakaian',
      valA: batikA.aturanPemakaian,
      valB: batikB.aturanPemakaian,
    },
    {
      label: 'Tingkat Kerumitan',
      valA: batikA.tingkatKerumitan.replace('_', ' '),
      valB: batikB.tingkatKerumitan.replace('_', ' '),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div
        className="bg-[#faf6ee] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-[#ded4c5] my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#24382f] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#dfb47d]/20 border border-[#dfb47d]/40 grid place-items-center text-[#dfb47d]">
              <Scale className="size-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#dfb47d]">
                Analisis Semantik Komparatif
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold">
                Komparasi 2 Motif Batik
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Selectors Bar */}
        <div className="grid grid-cols-2 gap-4 p-4 sm:p-6 bg-[#efe5d5] border-b border-[#ded4c5]">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#68432d] mb-1">
              Batik Pilihan 1:
            </label>
            <select
              value={batikAId}
              onChange={(e) => setBatikAId(e.target.value)}
              className="w-full rounded-xl border border-[#d7cbb9] bg-white p-2.5 text-xs font-bold text-[#27342e] outline-none shadow-sm"
            >
              {allBatiks.map((b) => (
                <option key={b.id} value={b.id} disabled={b.id === batikBId}>
                  {b.nama} ({b.wilayah.nama})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#68432d] mb-1">
              Batik Pilihan 2:
            </label>
            <select
              value={batikBId}
              onChange={(e) => setBatikBId(e.target.value)}
              className="w-full rounded-xl border border-[#d7cbb9] bg-white p-2.5 text-xs font-bold text-[#27342e] outline-none shadow-sm"
            >
              {allBatiks.map((b) => (
                <option key={b.id} value={b.id} disabled={b.id === batikAId}>
                  {b.nama} ({b.wilayah.nama})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Cards Comparison */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Card A */}
            <div className="rounded-2xl border border-[#ded4c5] bg-white p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-44 sm:h-52 rounded-xl overflow-hidden bg-[#efe8dc] p-2 flex items-center justify-center border border-[#d7cbb9]">
                  <BatikImage id={batikA.id} alt={batikA.nama} className="size-full object-contain" />
                </div>
                <div className="mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a2613f]">
                    {batikA.wilayah.nama}
                  </span>
                  <h4 className="font-display text-xl font-bold text-[#26362f]">{batikA.nama}</h4>
                  <p className="mt-1 text-xs text-[#74766f] line-clamp-3">{batikA.maknaFilosofis}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenDetail(batikA);
                }}
                className="mt-4 w-full py-2 rounded-xl bg-[#273b32] hover:bg-[#1a2922] text-white text-xs font-bold transition"
              >
                Lihat Detail Lengkap Batik 1
              </button>
            </div>

            {/* Card B */}
            <div className="rounded-2xl border border-[#ded4c5] bg-white p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-44 sm:h-52 rounded-xl overflow-hidden bg-[#efe8dc] p-2 flex items-center justify-center border border-[#d7cbb9]">
                  <BatikImage id={batikB.id} alt={batikB.nama} className="size-full object-contain" />
                </div>
                <div className="mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a2613f]">
                    {batikB.wilayah.nama}
                  </span>
                  <h4 className="font-display text-xl font-bold text-[#26362f]">{batikB.nama}</h4>
                  <p className="mt-1 text-xs text-[#74766f] line-clamp-3">{batikB.maknaFilosofis}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenDetail(batikB);
                }}
                className="mt-4 w-full py-2 rounded-xl bg-[#273b32] hover:bg-[#1a2922] text-white text-xs font-bold transition"
              >
                Lihat Detail Lengkap Batik 2
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="rounded-2xl border border-[#ded4c5] bg-white overflow-hidden shadow-sm">
            <div className="p-3 bg-[#efe6d7] text-xs font-bold text-[#5c3e29] uppercase tracking-wider border-b border-[#ded4c5]">
              Matriks Perbandingan Entitas Ontologi
            </div>
            <div className="divide-y divide-[#eee5d7] text-xs">
              {compareRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[130px_1fr_1fr] sm:grid-cols-[180px_1fr_1fr] p-3 items-center hover:bg-[#faf6ee] transition">
                  <div className="font-bold text-[#68432d] pr-2">{row.label}</div>
                  <div className="text-[#26362f] pr-4 border-r border-[#eee5d7]">{row.valA}</div>
                  <div className="text-[#26362f] pl-4">{row.valB}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
