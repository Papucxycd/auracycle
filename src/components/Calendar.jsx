import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { calculateCycleDay } from '../data/cycles';

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function Calendar({ logs, onSelectDay, todayStr = "2026-10-13" }) {
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
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{MONTH_NAMES[month]} {year}</h2>
          <p className="text-[11px] text-slate-400 font-medium">Toca cualquier día para ver o registrar</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button onClick={prevMonth} className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={goToToday} className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition">
            Hoy
          </button>
          <button onClick={nextMonth} className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="grid grid-cols-4 gap-1.5 pb-3 mb-3 border-b border-slate-100 text-[10px] font-medium text-slate-600">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Periodo
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Seguro
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Precaución
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Fértil / Riesgo
        </div>
      </div>

      {/* Cabecera días */}
      <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
        <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyCells.map((_, idx) => (
          <div key={`empty-${idx}`} className="h-14 sm:h-16 rounded-2xl bg-slate-50/50 opacity-40" />
        ))}

        {dayNumbers.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const cycleDay = calculateCycleDay(dateStr);
          const log = logs[dateStr];
          const isToday = (dateStr === todayStr);

          let bgStyle = "bg-white border-slate-100 text-slate-700 hover:border-rose-200";
          let badgeColor = "text-slate-400";

          if (log && log.flow && log.flow !== 'none') {
            bgStyle = "bg-rose-50 border-rose-200 text-rose-900";
            badgeColor = "text-rose-500 font-bold";
          } else if (cycleDay >= 1 && cycleDay <= 7) {
            bgStyle = "bg-emerald-50/70 border-emerald-100 text-emerald-950";
          } else if (cycleDay >= 8 && cycleDay <= 15) {
            bgStyle = "bg-emerald-50/40 border-emerald-100 text-slate-800";
          } else if (cycleDay >= 16 && cycleDay <= 23) {
            bgStyle = "bg-amber-50/70 border-amber-200 text-amber-950";
          } else if (cycleDay >= 24 && cycleDay <= 44) {
            bgStyle = "bg-rose-50/60 border-rose-200 text-rose-950";
          } else if (cycleDay >= 52) {
            bgStyle = "bg-purple-50 border-purple-200 text-purple-950";
          }

          if (isToday) {
            bgStyle += " ring-2 ring-slate-900 ring-offset-2";
          }

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDay(dateStr)}
              className={`h-14 sm:h-16 rounded-2xl border p-1.5 flex flex-col justify-between cursor-pointer transition select-none ${bgStyle}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold leading-none ${isToday ? 'bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center -ml-0.5 -mt-0.5' : ''}`}>
                  {day}
                </span>
                {cycleDay > 0 && (
                  <span className={`text-[9px] ${badgeColor}`}>d{cycleDay}</span>
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] justify-end">
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
