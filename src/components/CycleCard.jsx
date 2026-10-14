import React from 'react';
import { ShieldCheck, AlertTriangle, Flame, Clock, CalendarCheck, ShieldAlert } from 'lucide-react';
import { calculateCycleDay, getPhaseInfo } from '../data/cycles';

const ICONS = {
  ShieldCheck,
  AlertTriangle,
  Flame,
  Clock,
  CalendarCheck
};

export default function CycleCard({ todayStr = "2026-10-13" }) {
  const cycleDay = calculateCycleDay(todayStr);
  const phase = getPhaseInfo(cycleDay);
  const IconComponent = ICONS[phase.icon] || ShieldCheck;
  const progressPercent = Math.min(Math.round((cycleDay / 55) * 100), 100);

  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 text-white shadow-lg transition-all duration-300 ${phase.cardClass}`}>
      <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/15 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white/20 backdrop-blur-md">
              Día {cycleDay} del Ciclo
            </span>
            <span className="text-xs text-white/80">Hoy</span>
          </div>
          <h2 className="text-2xl font-black mt-1.5 tracking-tight">{phase.title}</h2>
          <p className="text-xs text-white/90 mt-1 max-w-[280px] leading-relaxed">
            {phase.desc}
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
          <IconComponent className="w-7 h-7" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 relative z-10">
        <div className="flex justify-between text-[11px] font-medium text-white/80 mb-1.5">
          <span>Inicio: 20 Sep</span>
          <span>Periodo estimado: ~10-15 Nov</span>
        </div>
        <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Pullout verdict */}
      <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-white/90" />
          <span className="font-medium text-white/90">Coito interrumpido hoy:</span>
        </div>
        <span className="font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-900 shadow-sm text-[11px]">
          {phase.verdict}
        </span>
      </div>
    </div>
  );
}
