import React from 'react';
import { ShieldCheck, AlertTriangle, Flame, Clock, CalendarCheck, Sparkles, HeartHandshake } from 'lucide-react';
import { calculateCycleDay, getPhaseInfo } from '../data/cycles';

const ICONS = {
  ShieldCheck,
  AlertTriangle,
  Flame,
  Clock,
  CalendarCheck,
  Sparkles
};

export default function CycleCard({ todayStr = "2026-10-14" }) {
  const cycleDay = calculateCycleDay(todayStr);
  const phase = getPhaseInfo(cycleDay);
  const IconComponent = ICONS[phase.icon] || ShieldCheck;
  const progressPercent = Math.min(Math.round((cycleDay / 55) * 100), 100);

  return (
    <div className="space-y-3.5">
      {/* Tarjeta Principal de Estado - Estilo iOS Glassmorphism */}
      <div className={`relative overflow-hidden rounded-[32px] p-6 text-white shadow-[0_12px_36px_rgba(244,63,94,0.18)] ${phase.cardBg} transition-all duration-300`}>
        {/* Orbes decorativos de luz iOS */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-black/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header Superior de la Tarjeta */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-white/20 backdrop-blur-md border border-white/20 shadow-sm">
              {phase.tag}
            </span>
            <span className="text-xs font-semibold text-white/80 bg-black/15 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              Día {cycleDay} del Ciclo
            </span>
          </div>

          {/* Gran Título y Fase */}
          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">{phase.title}</h2>
              <p className="text-xs text-white/90 mt-1.5 max-w-[270px] leading-relaxed font-normal">
                {phase.desc}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shadow-inner shrink-0">
              <IconComponent className="w-7 h-7" />
            </div>
          </div>

          {/* Barra de progreso de ciclo estilo iOS */}
          <div className="mt-5">
            <div className="flex justify-between text-[11px] font-semibold text-white/80 mb-2">
              <span>Inicio: 20 Sep</span>
              <span>Esperado: ~10-15 Nov</span>
            </div>
            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/15">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta Específica de Días de Ovulación - Estilo Apple Health */}
      <div className="bg-white rounded-[26px] p-4.5 border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white flex items-center justify-center shadow-md shadow-violet-200 shrink-0">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Ovulación Pico Estimada</span>
            <span className="text-[11px] font-bold text-slate-400">Días 38-43</span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">27 Octubre – 1 Noviembre</h4>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
            {cycleDay < 38 
              ? `Faltan ~${38 - cycleDay} días para el momento de máxima fertilidad`
              : cycleDay <= 43 
              ? `⚡ ¡Atención! Estás transitando los días pico de ovulación` 
              : `La ovulación ya culminó`}
          </p>
        </div>
      </div>

      {/* Veredicto de Coito Interrumpido hoy */}
      <div className="bg-white rounded-[24px] p-4 border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coito interrumpido hoy</span>
            <p className="text-xs font-bold text-slate-800">Evaluación de Riesgo</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-white shadow-sm">
          {phase.verdict}
        </span>
      </div>
    </div>
  );
}
