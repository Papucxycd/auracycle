import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { calculateCycleDay } from '../data/cycles';

const SYMPTOMS_LIST = [
  { id: 'symp-cramps', label: 'Cólicos' },
  { id: 'symp-acne', label: 'Acné' },
  { id: 'symp-mood', label: 'Humor SPM' },
  { id: 'symp-breasts', label: 'Senos sensibles' },
  { id: 'symp-mucus', label: 'Flujo fértil' },
  { id: 'symp-headache', label: 'Dolor de cabeza' },
];

export default function DayModal({ dateStr, log, isOpen, onClose, onSave, onDelete }) {
  const [flow, setFlow] = useState('none');
  const [sex, setSex] = useState('none');
  const [test, setTest] = useState('none');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (log) {
      setFlow(log.flow || 'none');
      setSex(log.sex || 'none');
      setTest(log.test || 'none');
      setSymptoms(log.symptoms || []);
      setNotes(log.notes || '');
    } else {
      setFlow('none');
      setSex('none');
      setTest('none');
      setSymptoms([]);
      setNotes('');
    }
  }, [log, dateStr]);

  if (!isOpen || !dateStr) return null;

  const cycleDay = calculateCycleDay(dateStr);

  const toggleSymptom = (id) => {
    setSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(dateStr, { flow, sex, test, symptoms, notes });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Registro Diario</span>
            <h3 className="text-lg font-bold text-slate-900">{dateStr} (Día {cycleDay})</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flujo / Periodo */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sangrado / Menstruación</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'none', label: 'Ninguno' },
              { id: 'spotting', label: 'Manchado' },
              { id: 'medium', label: 'Medio' },
              { id: 'heavy', label: 'Abundante' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFlow(f.id)}
                className={`py-2 text-xs font-semibold rounded-xl border transition ${
                  flow === f.id
                    ? 'border-2 border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Relaciones Sexuales */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Relaciones Sexuales</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: '❌ Ninguna' },
              { id: 'protected', label: '🛡️ Con condón' },
              { id: 'pullout', label: '⚠️ Coito interrumpido' },
              { id: 'unprotected', label: '🔴 Sin protección' },
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSex(s.id)}
                className={`py-2.5 px-3 text-xs font-medium rounded-xl border text-left transition ${
                  sex === s.id
                    ? 'border-2 border-slate-900 bg-slate-900 text-white font-bold shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Síntomas SPM */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Síntomas / SPM</label>
          <div className="grid grid-cols-3 gap-2">
            {SYMPTOMS_LIST.map(symp => (
              <label
                key={symp.id}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={symptoms.includes(symp.id)}
                  onChange={() => toggleSymptom(symp.id)}
                  className="rounded text-rose-500 focus:ring-rose-400"
                />
                <span>{symp.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Test de embarazo */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Prueba de Embarazo</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'none', label: 'No realizada' },
              { id: 'negative', label: 'Negativa (-)' },
              { id: 'positive', label: 'Positiva (+)' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTest(t.id)}
                className={`py-2 text-xs font-medium rounded-xl border transition ${
                  test === t.id
                    ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-700 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Notas adicionales</label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observaciones, horas, etc."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-200 transition"
          >
            Guardar Registro
          </button>
          <button
            type="button"
            onClick={() => onDelete(dateStr)}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition"
          >
            Borrar
          </button>
        </div>

      </div>
    </div>
  );
}
