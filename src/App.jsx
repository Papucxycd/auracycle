import React, { useState, useEffect } from 'react';
import { Flower2, BarChart3, Download, PlusCircle } from 'lucide-react';
import { INITIAL_LOGS } from './data/cycles';
import CycleCard from './components/CycleCard';
import Calendar from './components/Calendar';
import WaveChart from './components/WaveChart';
import DayModal from './components/DayModal';
import StatsModal from './components/StatsModal';

export default function App() {
  const todayStr = "2026-10-13"; // Fecha de contexto / hoy

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('auracycle_pwa_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_LOGS;
  });

  const [selectedDay, setSelectedDay] = useState(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('auracycle_pwa_logs', JSON.stringify(logs));
  }, [logs]);

  const handleSelectDay = (dateStr) => {
    setSelectedDay(dateStr);
    setIsDayModalOpen(true);
  };

  const handleSaveDayLog = (dateStr, data) => {
    setLogs(prev => ({ ...prev, [dateStr]: data }));
    setIsDayModalOpen(false);
  };

  const handleDeleteDayLog = (dateStr) => {
    setLogs(prev => {
      const copy = { ...prev };
      delete copy[dateStr];
      return copy;
    });
    setIsDayModalOpen(false);
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `auracycle_pwa_backup_${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm/50">
        <div className="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">AuraCycle PWA</h1>
              <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">Patrón Oscilante (32-57d)</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsStatsModalOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Estadísticas"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={handleExportBackup}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Exportar Copia de Seguridad"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        {/* Cycle Card / Traffic Light */}
        <CycleCard todayStr={todayStr} />

        {/* Quick Log Action */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">¿Registrar algo hoy?</h3>
              <p className="text-xs text-slate-500">Día 24 del ciclo (13 de Octubre)</p>
            </div>
          </div>
          <button
            onClick={() => handleSelectDay(todayStr)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95"
          >
            Añadir Registro
          </button>
        </div>

        {/* Calendar */}
        <Calendar
          logs={logs}
          onSelectDay={handleSelectDay}
          todayStr={todayStr}
        />

        {/* Wave Pattern Chart */}
        <WaveChart todayStr={todayStr} />
      </main>

      {/* Modals */}
      <DayModal
        dateStr={selectedDay}
        log={selectedDay ? logs[selectedDay] : null}
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        onSave={handleSaveDayLog}
        onDelete={handleDeleteDayLog}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
      />
    </div>
  );
}
