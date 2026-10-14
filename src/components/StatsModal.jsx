import React from 'react';
import { X } from 'lucide-react';
import { HISTORICAL_CYCLES } from '../data/cycles';

export default function StatsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 max-h-[85vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Historial Detallado de Ciclos</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Mínimo</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">32d</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Promedio</span>
            <p className="text-xl font-black text-rose-500 mt-0.5">43d</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Máximo</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">57d</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {[...HISTORICAL_CYCLES].reverse().map(c => (
            <div key={c.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Ciclo #{c.id}</span>
                <span className="text-slate-400 ml-1.5 text-[11px]">{c.range}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                c.days >= 50 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {c.days} días
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
