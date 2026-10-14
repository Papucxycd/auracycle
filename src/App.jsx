import React, { useState, useEffect } from 'react';
import { Flower2, Calendar as CalendarIcon, Activity, History, Download, Plus, Sparkles } from 'lucide-react';
import { INITIAL_LOGS, calculateCycleDay } from './data/cycles';
import CycleCard from './components/CycleCard';
import Calendar from './components/Calendar';
import WaveChart from './components/WaveChart';
import DayModal from './components/DayModal';
import StatsModal from './components/StatsModal';

export default function App() {
  const todayStr = "2026-10-14";
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'calendar', 'wave'

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
    downloadAnchor.setAttribute("download", `auracycle_backup_${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const cycleDay = calculateCycleDay(todayStr);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-28">
      {/* iOS Top Bar con Glassmorphism */}
      <header className="bg-white/85 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30 shadow-[0_1px_12px_rgba(0,0,0,0.02)]">
        <div className="max-w-md mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Flower2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">AuraCycle</h1>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Patrón 32-57 días</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsStatsModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition active:scale-95"
              title="Historial de Ciclos"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportBackup}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition active:scale-95"
              title="Descargar Respaldo"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-md mx-auto px-4.5 pt-4 space-y-4">
        
        {/* Vista: Hoy */}
        {activeTab === 'today' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <CycleCard todayStr={todayStr} />

            {/* Botón flotante estilo iOS para registro rápido */}
            <div
              onClick={() => handleSelectDay(todayStr)}
              className="bg-white rounded-[24px] p-4 border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer active:scale-[0.98] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900">Registrar Día de Hoy</h3>
                  <p className="text-[11px] text-slate-400">Día {cycleDay} • Síntomas, flujo o relaciones</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
                Añadir +
              </span>
            </div>

            {/* Vista previa del Calendario */}
            <Calendar
              logs={logs}
              onSelectDay={handleSelectDay}
              todayStr={todayStr}
            />
          </div>
        )}

        {/* Vista: Calendario Completo */}
        {activeTab === 'calendar' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <Calendar
              logs={logs}
              onSelectDay={handleSelectDay}
              todayStr={todayStr}
            />

            {/* Tarjeta explicativa de ovulación */}
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-[28px] p-5 text-white shadow-lg shadow-violet-200">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-5 h-5 text-white" />
                <h4 className="text-sm font-extrabold">Ventana de Ovulación Pico</h4>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-normal">
                En tu calendario están marcados con bordes punteados los días del <strong className="font-black text-white">27 de Octubre al 1 de Noviembre</strong>. Este es el periodo donde ocurre la liberación del óvulo para ciclos largos de 52-57 días.
              </p>
            </div>
          </div>
        )}

        {/* Vista: Patrón y Gráficas */}
        {activeTab === 'wave' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <WaveChart todayStr={todayStr} />
          </div>
        )}
      </main>

      {/* iOS Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-100/80 z-40 pb-[env(safe-area-inset-bottom,8px)] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto px-6 py-2 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center gap-1 py-1 transition-all active:scale-90 ${
              activeTab === 'today' ? 'text-rose-600 font-extrabold' : 'text-slate-400 font-medium'
            }`}
          >
            <Flower2 className={`w-5 h-5 ${activeTab === 'today' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px]">Hoy</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 py-1 transition-all active:scale-90 ${
              activeTab === 'calendar' ? 'text-rose-600 font-extrabold' : 'text-slate-400 font-medium'
            }`}
          >
            <CalendarIcon className={`w-5 h-5 ${activeTab === 'calendar' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px]">Calendario</span>
          </button>

          <button
            onClick={() => setActiveTab('wave')}
            className={`flex flex-col items-center gap-1 py-1 transition-all active:scale-90 ${
              activeTab === 'wave' ? 'text-rose-600 font-extrabold' : 'text-slate-400 font-medium'
            }`}
          >
            <Activity className={`w-5 h-5 ${activeTab === 'wave' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px]">Patrón Ondas</span>
          </button>
        </div>
      </nav>

      {/* Modales */}
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
