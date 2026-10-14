import React from 'react';
import { Activity } from 'lucide-react';
import { HISTORICAL_CYCLES, calculateCycleDay } from '../data/cycles';

export default function WaveChart({ todayStr = "2026-10-13" }) {
  const currentDay = calculateCycleDay(todayStr);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Tu Patrón de Ondas</h3>
            <p className="text-[11px] text-slate-400">Ciclos históricos y predicción</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          Onda 32-57 días
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-2 pt-1">
        <div className="flex items-end gap-2.5 h-36 min-w-[340px] px-1">
          {HISTORICAL_CYCLES.map((c) => {
            const heightPercent = Math.round((c.days / 60) * 100);
            const isPeak = c.days >= 50;
            return (
              <div key={c.id} className="flex-1 flex flex-col items-center gap-1 min-w-[28px]">
                <span className={`text-[10px] font-bold ${isPeak ? 'text-rose-600' : 'text-slate-500'}`}>
                  {c.days}d
                </span>
                <div
                  className={`w-full ${isPeak ? 'bg-rose-500' : 'bg-slate-300'} rounded-t-lg transition-all hover:opacity-80`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[9px] font-medium text-slate-400">#{c.id}</span>
              </div>
            );
          })}

          {/* Current cycle bar */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-[32px]">
            <span className="text-[10px] font-black text-indigo-600">{currentDay}d*</span>
            <div
              className="w-full bg-indigo-500 rounded-t-lg relative overflow-hidden"
              style={{ height: `${Math.round((currentDay / 60) * 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
            <span className="text-[9px] font-bold text-indigo-600">Act</span>
          </div>
        </div>
      </div>

      <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100/80 text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-800">Predicción de tu ciclo actual:</strong> Tras el ciclo anterior de 47 días y tu patrón oscilante cada 4 meses, este ciclo se proyecta entre{' '}
        <span className="font-bold text-rose-600">52 a 57 días</span> (Periodo previsto entre el 10 y el 15 de Noviembre).
      </div>
    </div>
  );
}
