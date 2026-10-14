import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { calculateCycleDay, getDayClassification } from '../data/cycles';

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function Calendar({ logs, onSelectDay, todayStr = "2026-10-14" }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Oct 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date(2026, 9, 1));

  const emptyCells = Array.from({ length: firstDayIndex });
  const dayNumbers = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-[32px] p-5.5 border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
      {/* Selector de Mes Estilo iOS */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest">Calendario de Ciclos</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{MONTH_NAMES[month]} {year}</h2>
        </div>
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl backdrop-blur-sm">
          <button
            onClick={prevMonth}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToToday}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white rounded-xl transition active:scale-95"
          >
            Hoy
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leyenda Rápida Estilo Flo / iOS */}
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100/60 overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" /> Periodo
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> Seguro
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm" /> Fértil
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-violet-700 font-extrabold">
          <span className="w-3 h-3 rounded-full border-2 border-dashed border-violet-600 flex items-center justify-center text-[7px]">✨</span>
          Ovulación Pico
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 text-center text-[11px] font-extrabold text-slate-400">
        <span>DOM</span><span>LUN</span><span>MAR</span><span>MIÉ</span><span>JUE</span><span>VIE</span><span>SÁB</span>
      </div>

      {/* Cuadrícula de Días */}
      <div className="grid grid-cols-7 gap-1.5">
        {emptyCells.map((_, idx) => (
          <div key={`empty-${idx}`} className="h-14 sm:h-16 rounded-[18px] bg-slate-50/40 opacity-30" />
        ))}

        {dayNumbers.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const cycleDay = calculateCycleDay(dateStr);
          const dayInfo = getDayClassification(cycleDay);
          const log = logs[dateStr];
          const isToday = (dateStr === todayStr);

          // Estilos visuales según fase y tipo
          let cellStyle = "bg-white border-slate-100/80 text-slate-800 hover:border-slate-300";
          let badgeText = "";
          let badgeColor = "text-slate-400";
          let isOvulationRing = false;

          if (log && log.flow && log.flow !== 'none') {
            cellStyle = "bg-rose-50/90 border-rose-200 text-rose-950 font-semibold";
            badgeText = `d${cycleDay}`;
            badgeColor = "text-rose-500 font-bold";
          } else if (dayInfo.isOvulation) {
            // DÍAS PICO DE OVULACIÓN - Destacado especial estilo Flo con borde violeta punteado
            cellStyle = "bg-violet-50/90 border-2 border-dashed border-violet-400 text-violet-950 shadow-sm";
            badgeText = "✨ Ovul";
            badgeColor = "text-violet-600 font-black";
            isOvulationRing = true;
          } else if (dayInfo.isFertile) {
            cellStyle = "bg-rose-50/60 border-rose-200/80 text-rose-950";
            badgeText = `d${cycleDay}`;
            badgeColor = "text-rose-400 font-semibold";
          } else if (dayInfo.isSafe) {
            cellStyle = "bg-emerald-50/50 border-emerald-100 text-emerald-950";
            badgeText = `d${cycleDay}`;
            badgeColor = "text-emerald-500";
          } else if (dayInfo.isCaution) {
            cellStyle = "bg-amber-50/60 border-amber-200/80 text-amber-950";
            badgeText = `d${cycleDay}`;
            badgeColor = "text-amber-500";
          } else if (dayInfo.isPeriodExpected) {
            cellStyle = "bg-purple-50 border-purple-200 text-purple-950";
            badgeText = `d${cycleDay}`;
            badgeColor = "text-purple-500";
          } else if (cycleDay > 0) {
            badgeText = `d${cycleDay}`;
          }

          if (isToday) {
            cellStyle += " ring-2 ring-slate-900 ring-offset-2";
          }

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDay(dateStr)}
              className={`h-14 sm:h-16 rounded-[18px] border p-1.5 flex flex-col justify-between cursor-pointer transition-all active:scale-95 select-none ${cellStyle}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold leading-none ${
                  isToday 
                    ? 'bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center -ml-0.5 -mt-0.5 shadow-sm' 
                    : ''
                }`}>
                  {day}
                </span>
                {badgeText && (
                  <span className={`text-[8px] tracking-tight leading-none ${badgeColor}`}>
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Indicadores inferiores (Iconos de ovulación, relaciones, síntomas) */}
              <div className="flex items-center gap-0.5 text-[9px] justify-end">
                {isOvulationRing && !log?.sex && (
                  <Sparkles className="w-3 h-3 text-violet-500 animate-bounce" />
                )}
                {log && (
                  <>
                    {log.sex === 'pullout' && <span title="Coito interrumpido">⚠️</span>}
                    {log.sex === 'protected' && <span title="Con condón">🛡️</span>}
                    {log.sex === 'unprotected' && <span title="Sin protección">🔴</span>}
                    {log.flow && log.flow !== 'none' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                    {log.symptoms && log.symptoms.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
