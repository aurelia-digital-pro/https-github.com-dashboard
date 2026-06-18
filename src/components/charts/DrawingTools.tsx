'use client';

import React, { useState } from 'react';
import { useChartStore } from '../../stores/chartStore';
import { PenTool, Trash2, Camera, Compass, LineChart, Brush, Sparkles } from 'lucide-react';

export default function DrawingTools() {
  const { drawings, addDrawing, clearDrawings } = useChartStore();
  const [activeTool, setActiveTool] = useState<string>('CURSOR');

  const tools = [
    { id: 'CURSOR', label: 'Crosshairs', icon: Compass },
    { id: 'TRENDLINE', label: 'Trend Line', icon: LineChart },
    { id: 'FIBONACCI', label: 'Fib Retrace', icon: Brush },
    { id: 'TEXT', label: 'Marker Text', icon: PenTool },
  ];

  const handleToolSelect = (id: string) => {
    setActiveTool(id);
    if (id !== 'CURSOR') {
      addDrawing({ tool: id });
    }
  };

  const handleCapture = () => {
    // Simulated sleek confirmation download trigger
    alert('📸 Canvas snapshot saved successfully. File exported to Aurelia reports.');
  };

  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 select-none">
      {/* Tool items list */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleToolSelect(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isActive
                  ? 'bg-cyan-500 text-black border-cyan-500 font-bold'
                  : 'bg-[#070b11] border-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Exporter / Clear triggers */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCapture}
          className="p-2.5 rounded-lg bg-[#070b11] border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
          title="Snapshot chart"
        >
          <Camera className="w-4 h-4" />
        </button>
        <button
          onClick={clearDrawings}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/20 text-rose-400 border border-rose-900/40 hover:bg-rose-900/30 transition-all font-mono text-xs font-semibold"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear ({drawings.length})</span>
        </button>
      </div>
    </div>
  );
}
