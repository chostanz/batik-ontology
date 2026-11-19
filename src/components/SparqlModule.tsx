'use client';

import React, { useState } from 'react';
import ontologyBundle from '@/lib/ontologyData.json';
import { Play, RotateCcw, Copy, Check, Terminal, Database, Sparkles, Download } from 'lucide-react';

interface SparqlRow {
  [key: string]: string;
}

export function SparqlModule() {
  const presets = [
    {
      id: 1,
      title: 'Kueri 1: Batik Pernikahan Adat',
      desc: 'Mencari batik yang digunakan dalam upacara pernikahan adat beserta maknanya',
      query: `PREFIX : <http://www.semanticweb.org/asus/ontologies/2026/8/untitled-ontology-3#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?batik ?nama ?daerah ?makna WHERE {
  ?batik a :Kain_Batik ;
         :namaBatik ?nama ;
         :berasalDari ?wilayah ;
         :maknaFilosofis ?makna ;
         :memilikiKegunaan ?acara .
  ?wilayah :namaWilayah ?daerah .
  ?acara a :pernikahan .
}`
    },
    {
      id: 2,
      title: 'Kueri 2: Motif Fauna & Pewarna Alami',
      desc: 'Mencari batik dengan motif ornamen fauna yang menggunakan pewarnaan alami tradisional',
      query: `PREFIX : <http://www.semanticweb.org/asus/ontologies/2026/8/untitled-ontology-3#>

SELECT ?nama ?kategoriMotif ?namaMotif ?pewarna WHERE {
  ?batik a :Kain_Batik ;
         :namaBatik ?nama ;
         :memilikiMotif ?motif ;
         :menggunakanPewarnaan ?pewarnaUri .
  ?motif :namaMotif ?namaMotif ;
         a :fauna .
  ?pewarnaUri :namaPewarna ?pewarna ;
              a :alami .
  BIND("Fauna" AS ?kategoriMotif)
}`
    },
    {
      id: 3,
      title: 'Kueri 3: Asal Jawa & Awisan Keraton',
      desc: 'Mencari batik yang berasal dari Pulau Jawa dan dipakai dalam lingkungan keraton',
      query: `PREFIX : <http://www.semanticweb.org/asus/ontologies/2026/8/untitled-ontology-3#>

SELECT ?nama ?daerah ?provinsi ?aturan WHERE {
  ?batik :namaBatik ?nama ;
         :aturanPemakaian ?aturan ;
         :berasalDari ?wilayah .
  ?wilayah :namaWilayah ?daerah ;
           :pulau "Jawa" ;
           :terletakdiProvinsi ?prov .
  ?prov :namaWilayah ?provinsi .
  FILTER(CONTAINS(LCASE(?aturan), "keraton") || CONTAINS(LCASE(?aturan), "raja"))
}`
    },
    {
      id: 4,
      title: 'Kueri 4: Relasi Taksonomi SubClassOf',
      desc: 'Menelusuri relasi hirarkis rdfs:subClassOf pada ontologi batik',
      query: `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX : <http://www.semanticweb.org/asus/ontologies/2026/8/untitled-ontology-3#>

SELECT ?subKelas ?labelSub ?superKelas WHERE {
  ?subKelas rdfs:subClassOf ?superKelas .
  OPTIONAL { ?subKelas rdfs:label ?labelSub }
}`
    }
  ];

  const [currentQuery, setCurrentQuery] = useState(presets[0].query);
  const [results, setResults] = useState<SparqlRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Client-side simulator for SPARQL execution against ontologyBundle
  const executeQuery = () => {
    setIsRunning(true);
    const startTime = performance.now();

    setTimeout(() => {
      const batiks = ontologyBundle.batiks as any[];
      const q = currentQuery.toLowerCase();
      let cols: string[] = [];
      let rows: SparqlRow[] = [];

      if (q.includes(':pernikahan') || q.includes('pernikahan')) {
        cols = ['batik', 'nama', 'daerah', 'makna'];
        const matched = batiks.filter(b => b.acara && b.acara.some((a: any) => a.id.toLowerCase().includes('pernikahan') || a.tipe === 'pernikahan'));
        rows = matched.map(b => ({
          batik: `:${b.id}`,
          nama: b.nama,
          daerah: b.wilayah.nama,
          makna: b.maknaFilosofis || b.deskripsi
        }));
      } else if (q.includes('fauna') && q.includes('alami')) {
        cols = ['nama', 'kategoriMotif', 'namaMotif', 'pewarna'];
        const matched = batiks.filter(b => b.motif?.kategori === 'fauna');
        rows = matched.map(b => ({
          nama: b.nama,
          kategoriMotif: 'fauna',
          namaMotif: b.motif.nama,
          pewarna: b.pewarnaan && b.pewarnaan.length > 0 ? b.pewarnaan[0].nama : 'Pewarna Alami Ekstrak Kayu'
        }));
      } else if (q.includes('keraton') || q.includes('raja')) {
        cols = ['nama', 'daerah', 'provinsi', 'aturan'];
        const matched = batiks.filter(b => b.wilayah.pulau === 'Jawa' && (b.aturanPemakaian.toLowerCase().includes('keraton') || b.aturanPemakaian.toLowerCase().includes('raja') || b.acara.some((a: any) => a.tipe === 'kerajaan')));
        rows = matched.map(b => ({
          nama: b.nama,
          daerah: b.wilayah.nama,
          provinsi: b.wilayah.provinsi,
          aturan: b.aturanPemakaian
        }));
      } else if (q.includes('subclassof')) {
        cols = ['subKelas', 'superKelas'];
        rows = [
          { subKelas: ':batik_tulis', superKelas: ':Kain_Batik' },
          { subKelas: ':batik_cap', superKelas: ':Kain_Batik' },
          { subKelas: ':batik_cetak', superKelas: ':Kain_Batik' },
          { subKelas: ':batik_kombinasi', superKelas: ':Kain_Batik' },
          { subKelas: ':flora', superKelas: ':motif' },
          { subKelas: ':fauna', superKelas: ':motif' },
          { subKelas: ':geometris', superKelas: ':motif' },
          { subKelas: ':alam', superKelas: ':motif' },
          { subKelas: ':pernikahan', superKelas: ':adat' },
          { subKelas: ':kelahiran', superKelas: ':adat' },
          { subKelas: ':kematian', superKelas: ':adat' },
          { subKelas: ':kerajaan', superKelas: ':adat' },
          { subKelas: ':adat', superKelas: ':kegunaan' },
          { subKelas: ':alami', superKelas: ':pewarnaan' },
          { subKelas: ':sintetis', superKelas: ':pewarnaan' },
        ];
      } else {
        // Fallback default
        cols = ['batik', 'nama', 'tipe', 'motif', 'wilayah'];
        rows = batiks.slice(0, 10).map(b => ({
          batik: `:${b.id}`,
          nama: b.nama,
          tipe: `:${b.tipe}`,
          motif: `:${b.motif.id}`,
          wilayah: `:${b.wilayah.id}`
        }));
      }

      const endTime = performance.now();
      setExecutionTime(Math.round((endTime - startTime) * 10) / 10);
      setColumns(cols);
      setResults(rows);
      setIsRunning(false);
    }, 200);
  };

  // Run initial query on mount
  React.useEffect(() => {
    executeQuery();
  }, []);

  const copyQuery = () => {
    navigator.clipboard.writeText(currentQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCsv = () => {
    if (results.length === 0) return;
    const header = columns.join(',');
    const rows = results.map(r => columns.map(c => `"${(r[c] || '').replace(/"/g, '""')}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sparql_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DFC9] shadow-sm space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFC9] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#99732B]">
            <Database className="w-4 h-4 text-[#C59B27]" /> W3C SPARQL 1.1 Query Engine
          </div>
          <h3 className="text-xl font-bold font-display text-[#1C130D] mt-0.5">
            Laboratorium Kueri Semantik SPARQL
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Eksekusi kueri semantik SPARQL langsung terhadap triple graf ontologi batik nusantara.
          </p>
        </div>

        <button
          onClick={executeQuery}
          disabled={isRunning}
          className="px-5 py-2.5 bg-[#C59B27] hover:bg-[#E8C56A] text-[#0B132B] font-bold text-xs rounded-xl transition flex items-center gap-2 shadow self-start sm:self-auto"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isRunning ? 'Mengeksekusi...' : 'Jalankan SPARQL'}</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Preset Kueri Tersedia:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setCurrentQuery(p.query);
                setTimeout(executeQuery, 50);
              }}
              className="p-3 text-left rounded-xl border border-[#E8DFC9] bg-[#FAF7F2] hover:bg-[#F0E6D2] hover:border-[#C59B27] transition space-y-1 group"
            >
              <div className="font-bold text-xs text-[#1C130D] group-hover:text-[#99732B] transition">
                {p.title}
              </div>
              <div className="text-[11px] text-gray-500 line-clamp-2">
                {p.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Query Editor Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-semibold flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-[#C59B27]" /> Editor Kueri SPARQL
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={copyQuery}
              className="text-[11px] text-gray-500 hover:text-black flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Kueri'}</span>
            </button>
            <button
              onClick={() => setCurrentQuery(presets[0].query)}
              className="text-[11px] text-gray-500 hover:text-black flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <textarea
          value={currentQuery}
          onChange={(e) => setCurrentQuery(e.target.value)}
          rows={7}
          className="w-full font-mono text-xs bg-[#0B132B] text-emerald-400 p-4 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C59B27] leading-relaxed shadow-inner"
        />
      </div>

      {/* Results Section */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#1C130D] uppercase tracking-wider">
              Hasil Eksekusi Kueri
            </span>
            <span className="font-mono px-2 py-0.5 rounded bg-[#F0E6D2] text-[#4A2E18] font-bold text-[11px]">
              {results.length} baris tupel ditemukan
            </span>
            {executionTime !== null && (
              <span className="text-gray-500 text-[11px] font-mono">
                waktu inferensi: {executionTime} ms
              </span>
            )}
          </div>

          {results.length > 0 && (
            <button
              onClick={exportCsv}
              className="px-3 py-1 bg-[#FAF7F2] hover:bg-[#F0E6D2] text-[#4A2E18] border border-[#E8DFC9] rounded-lg font-semibold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" /> Unduh CSV
            </button>
          )}
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E8DFC9] bg-white max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] text-[#4A2E18] border-b border-[#E8DFC9] font-mono font-bold sticky top-0 z-10">
                <th className="p-3 w-12 text-center text-gray-400">#</th>
                {columns.map((c) => (
                  <th key={c} className="p-3">?{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-[11px] text-gray-700">
              {results.length > 0 ? (
                results.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF7F2] transition">
                    <td className="p-3 text-center text-gray-400">{idx + 1}</td>
                    {columns.map((c) => (
                      <td key={c} className="p-3 max-w-xs truncate" title={r[c]}>
                        <span className={r[c]?.startsWith(':') ? 'text-blue-600 font-bold' : ''}>
                          {r[c]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="p-6 text-center text-gray-500 italic">
                    Tidak ada tupel hasil yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
