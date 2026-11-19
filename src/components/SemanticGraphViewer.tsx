import React, { useRef, useEffect, useState, useMemo } from 'react';
import ontologyBundle from '@/lib/ontologyData.json';
import { BatikItem } from '@/lib/semanticEngine';
import { 
  Network, ZoomIn, ZoomOut, RotateCcw, Search, 
  Maximize2, Eye, Sparkles, Filter, Info, ChevronRight, X
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'batik' | 'wilayah' | 'motif' | 'teknik' | 'acara' | 'pewarna';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  data?: any;
}

interface GraphLink {
  source: string;
  target: string;
  predicate: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; radius: number }> = {
  batik: { label: 'Batik', color: '#DFB47D', radius: 15 },
  wilayah: { label: 'Wilayah / Daerah', color: '#10B981', radius: 12 },
  motif: { label: 'Ornamen Motif', color: '#38BDF8', radius: 13 },
  teknik: { label: 'Teknik Canting/Cap', color: '#C084FC', radius: 11 },
  acara: { label: 'Acara & Ritual', color: '#FB7185', radius: 11 },
  pewarna: { label: 'Pewarnaan', color: '#F59E0B', radius: 11 },
};

interface SemanticGraphViewerProps {
  onSelectBatik?: (batik: BatikItem) => void;
}

export function SemanticGraphViewer({ onSelectBatik }: SemanticGraphViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeTypes, setActiveTypes] = useState<Record<string, boolean>>({
    batik: true,
    wilayah: true,
    motif: true,
    teknik: true,
    acara: true,
    pewarna: true,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // Transform / Zoom State
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDraggingCanvas = useRef(false);
  const draggedNode = useRef<GraphNode | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const allBatiks = ontologyBundle.batiks as unknown as BatikItem[];

  // Build Graph Data from Ontology Triples
  const { initialNodes, links } = useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    const linkList: GraphLink[] = [];

    // Helper to add node
    const addNode = (id: string, label: string, type: GraphNode['type'], data?: any) => {
      if (!nodeMap.has(id)) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 450;
        nodeMap.set(id, {
          id,
          label,
          type,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          radius: TYPE_CONFIG[type].radius,
          color: TYPE_CONFIG[type].color,
          data,
        });
      }
      return nodeMap.get(id)!;
    };

    allBatiks.forEach((b) => {
      // 1. Batik Node
      addNode(b.id, b.nama, 'batik', b);

      // 2. Wilayah
      if (b.wilayah?.nama) {
        const wId = `Wilayah_${b.wilayah.nama.replace(/\s+/g, '_')}`;
        addNode(wId, b.wilayah.nama, 'wilayah', b.wilayah);
        linkList.push({ source: b.id, target: wId, predicate: ':berasalDari' });
      }

      // 3. Motif
      if (b.motif?.kategori) {
        const mId = `Motif_${b.motif.kategori}`;
        addNode(mId, `Motif ${b.motif.kategori}`, 'motif', b.motif);
        linkList.push({ source: b.id, target: mId, predicate: ':memilikiMotif' });
      }

      // 4. Teknik
      if (b.teknik?.nama) {
        const tId = `Teknik_${b.teknik.nama.replace(/\s+/g, '_')}`;
        addNode(tId, b.teknik.nama, 'teknik', b.teknik);
        linkList.push({ source: b.id, target: tId, predicate: ':dibuatDenganTeknik' });
      }

      // 5. Acara
      if (b.acara && b.acara.length > 0) {
        b.acara.slice(0, 2).forEach((a) => {
          const aId = `Acara_${a.id}`;
          addNode(aId, a.nama, 'acara', a);
          linkList.push({ source: b.id, target: aId, predicate: ':memilikiKegunaan' });
        });
      }

      // 6. Pewarnaan
      if (b.pewarnaan && b.pewarnaan.length > 0) {
        const p = b.pewarnaan[0];
        const pId = `Pewarna_${p.tipe}`;
        addNode(pId, `Pewarna ${p.tipe}`, 'pewarna', p);
        linkList.push({ source: b.id, target: pId, predicate: ':menggunakanPewarnaan' });
      }
    });

    return {
      initialNodes: Array.from(nodeMap.values()),
      links: linkList,
    };
  }, [allBatiks]);

  const nodesRef = useRef<GraphNode[]>(initialNodes);

  // Filtered Nodes & Links based on active categories and search
  const visibleNodes = useMemo(() => {
    return nodesRef.current.filter((n) => {
      if (!activeTypes[n.type]) return false;
      if (searchTerm.trim()) {
        return n.label.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });
  }, [activeTypes, searchTerm]);

  const visibleLinks = useMemo(() => {
    const visibleIdSet = new Set(visibleNodes.map((n) => n.id));
    return links.filter((l) => visibleIdSet.has(l.source) && visibleIdSet.has(l.target));
  }, [links, visibleNodes]);

  // Connected nodes map for highlighting
  const connectedMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    visibleLinks.forEach((l) => {
      if (!map.has(l.source)) map.set(l.source, new Set());
      if (!map.has(l.target)) map.set(l.target, new Set());
      map.get(l.source)!.add(l.target);
      map.get(l.target)!.add(l.source);
    });
    return map;
  }, [visibleLinks]);

  // Force-directed Physics Simulation Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Physics step
    const stepPhysics = () => {
      const activeList = visibleNodes;
      const nodeIndexMap = new Map<string, GraphNode>();
      activeList.forEach((n) => nodeIndexMap.set(n.id, n));

      // 1. Repulsion between nodes
      for (let i = 0; i < activeList.length; i++) {
        const n1 = activeList[i];
        for (let j = i + 1; j < activeList.length; j++) {
          const n2 = activeList[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy || 1;
          if (distSq < 90000) {
            const dist = Math.sqrt(distSq);
            const force = (2800 / distSq);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx -= fx;
            n1.vy -= fy;
            n2.vx += fx;
            n2.vy += fy;
          }
        }
      }

      // 2. Attraction along links
      visibleLinks.forEach((l) => {
        const s = nodeIndexMap.get(l.source);
        const t = nodeIndexMap.get(l.target);
        if (s && t) {
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 90;
          const force = (dist - targetDist) * 0.025;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          s.vx += fx;
          s.vy += fy;
          t.vx -= fx;
          t.vy -= fy;
        }
      });

      // 3. Center gravity force & damping
      activeList.forEach((n) => {
        if (draggedNode.current?.id === n.id) return; // Keep dragged node in place
        n.vx -= n.x * 0.008;
        n.vy -= n.y * 0.008;

        n.vx *= 0.88; // damping
        n.vy *= 0.88;

        n.x += n.vx;
        n.y += n.vy;
      });
    };

    // Render loop
    const render = () => {
      stepPhysics();

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      // Apply Pan & Zoom
      ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
      ctx.scale(zoom, zoom);

      const activeHighlightedId = hoveredNode?.id || selectedNode?.id;
      const neighbors = activeHighlightedId ? connectedMap.get(activeHighlightedId) : null;

      const nodeIndexMap = new Map<string, GraphNode>();
      visibleNodes.forEach((n) => nodeIndexMap.set(n.id, n));

      // Draw Links
      visibleLinks.forEach((link) => {
        const s = nodeIndexMap.get(link.source);
        const t = nodeIndexMap.get(link.target);
        if (!s || !t) return;

        const isHighlighted =
          activeHighlightedId &&
          (link.source === activeHighlightedId || link.target === activeHighlightedId);
        const isDimmed = activeHighlightedId && !isHighlighted;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#DFB47D';
          ctx.lineWidth = 2.5;
          ctx.globalAlpha = 0.95;
        } else if (isDimmed) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.2;
        } else {
          ctx.strokeStyle = 'rgba(223, 180, 125, 0.28)';
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.6;
        }
        ctx.stroke();

        // Draw predicate text on highlighted links
        if (isHighlighted) {
          const midX = (s.x + t.x) / 2;
          const midY = (s.y + t.y) / 2;
          ctx.fillStyle = '#E8C56A';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(link.predicate, midX, midY - 3);
        }
      });

      // Draw Nodes
      visibleNodes.forEach((node) => {
        const isSelf = activeHighlightedId === node.id;
        const isNeighbor = neighbors ? neighbors.has(node.id) : false;
        const isDimmed = activeHighlightedId && !isSelf && !isNeighbor;

        ctx.save();
        ctx.translate(node.x, node.y);

        // Glow ring for self or neighbor
        if (isSelf) {
          ctx.beginPath();
          ctx.arc(0, 0, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(223, 180, 125, 0.35)';
          ctx.fill();
        }

        // Node Circle
        ctx.beginPath();
        ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed ? 'rgba(80, 80, 80, 0.4)' : node.color;
        ctx.fill();

        ctx.strokeStyle = isSelf ? '#FFFFFF' : 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = isSelf ? 2.5 : 1.2;
        ctx.stroke();

        // Node Label
        if (zoom >= 0.7 || isSelf || isNeighbor) {
          ctx.fillStyle = isDimmed ? 'rgba(255, 255, 255, 0.25)' : '#FFFFFF';
          ctx.font = `${isSelf ? 'bold 11px' : '9.5px'} "DM Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 4;
          ctx.fillText(node.label, 0, node.radius + 12);
        }

        ctx.restore();
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [visibleNodes, visibleLinks, zoom, offset, hoveredNode, selectedNode, connectedMap]);

  // Screen Coordinates to Graph World Coordinates
  const getGraphCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldX = (screenX - (canvas.width / 2 + offset.x)) / zoom;
    const worldY = (screenY - (canvas.height / 2 + offset.y)) / zoom;
    return { x: worldX, y: worldY };
  };

  // Find node under cursor
  const findNodeAt = (worldX: number, worldY: number): GraphNode | null => {
    for (let i = visibleNodes.length - 1; i >= 0; i--) {
      const node = visibleNodes[i];
      const dx = worldX - node.x;
      const dy = worldY - node.y;
      if (dx * dx + dy * dy <= (node.radius + 6) * (node.radius + 6)) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getGraphCoords(e);
    const node = findNodeAt(x, y);

    if (node) {
      draggedNode.current = node;
      setSelectedNode(node);
    } else {
      isDraggingCanvas.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedNode.current) {
      const { x, y } = getGraphCoords(e);
      draggedNode.current.x = x;
      draggedNode.current.y = y;
      draggedNode.current.vx = 0;
      draggedNode.current.vy = 0;
      return;
    }

    if (isDraggingCanvas.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    const { x, y } = getGraphCoords(e);
    const node = findNodeAt(x, y);
    setHoveredNode(node);
  };

  const handleMouseUp = () => {
    draggedNode.current = null;
    isDraggingCanvas.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.35), 3.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setSelectedNode(null);
    setSearchTerm('');
  };

  const toggleType = (t: string) => {
    setActiveTypes((prev) => ({ ...prev, [t]: !prev[t] }));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[640px] rounded-2xl bg-[#0f1d18] border border-[#a6623d]/40 overflow-hidden shadow-2xl flex flex-col"
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Search Node input */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#1b2b24]/90 backdrop-blur-md border border-white/15 rounded-xl px-3 py-1.5 shadow-lg">
          <Search className="w-3.5 h-3.5 text-[#dfb47d]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari entitas di graf..."
            className="bg-transparent text-xs text-white placeholder:text-white/40 outline-none w-36 sm:w-48"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-white/60 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#1b2b24]/90 backdrop-blur-md border border-white/15 rounded-xl p-1 shadow-lg">
          <button
            onClick={() => setZoom((z) => Math.min(z * 1.2, 3.5))}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Perbesar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z * 0.8, 0.35))}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Perkecil"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Reset Tampilan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Category Filter Legend */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto bg-[#1b2b24]/90 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 py-2 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#dfb47d] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Entitas:
          </span>
          {Object.entries(TYPE_CONFIG).map(([typeKey, cfg]) => {
            const isActive = activeTypes[typeKey];
            return (
              <button
                key={typeKey}
                onClick={() => toggleType(typeKey)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition cursor-pointer border ${
                  isActive
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-white/10 text-white/40 bg-white/5 opacity-60'
                }`}
                style={{ backgroundColor: isActive ? `${cfg.color}35` : undefined }}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: cfg.color }}
                />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[10px] text-white/50 bg-[#1b2b24]/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 pointer-events-auto hidden md:block">
          💡 Geser node dengan mouse • Scroll untuk Zoom • Drag background untuk pan
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Node Inspector Drawer on Click */}
      {selectedNode && (
        <div className="absolute top-16 right-4 z-30 max-w-sm w-full bg-[#1b2b24]/95 backdrop-blur-xl border border-[#dfb47d]/40 rounded-2xl p-4 text-white shadow-2xl animate-fade-in">
          <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span
                className="size-3 rounded-full shrink-0"
                style={{ backgroundColor: selectedNode.color }}
              />
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#dfb47d]">
                  {TYPE_CONFIG[selectedNode.type]?.label}
                </span>
                <h4 className="font-display text-lg font-bold leading-tight">
                  {selectedNode.label}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 text-xs text-white/80 space-y-2">
            <div className="font-mono text-[10px] text-white/50">
              URI: :{selectedNode.id}
            </div>

            {selectedNode.type === 'batik' && selectedNode.data && (
              <>
                <p className="text-[11px] text-white/70 line-clamp-3 leading-relaxed">
                  {selectedNode.data.maknaFilosofis || selectedNode.data.deskripsi}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-[#dfb47d]">
                    📍 {selectedNode.data.wilayah?.nama}
                  </span>
                  <button
                    onClick={() => {
                      if (onSelectBatik) onSelectBatik(selectedNode.data);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#a35f3d] hover:bg-[#87472d] text-white font-bold text-[10px] transition cursor-pointer shadow"
                  >
                    Buka Detail Triples <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}

            {selectedNode.type !== 'batik' && (
              <p className="text-[11px] text-white/60">
                Terhubung dengan {connectedMap.get(selectedNode.id)?.size || 0} entitas dalam ontologi.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
