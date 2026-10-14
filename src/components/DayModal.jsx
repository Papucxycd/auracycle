import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { calculateCycleDay, getDayClassification } from '../data/cycles';

const SYMPTOMS_LIST = [
  { id: 'symp-cramps', label: 'Cólicos' },
  { id: 'symp-acne', label: 'Acné' },
  { id: 'symp-mood', label: 'Humor SPM' },
  { id: 'symp-breasts', label: 'Senos sensibles' },
  { id: 'symp-mucus', label: 'Flujo fértil' },
  { id: 'symp-headache', label: 'Dolor cabeza' },
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
  const dayInfo = getDayClassification(cycleDay);

  const toggleSymptom = (id) => {
    setSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(dateStr, { flow, sex, test, symptoms, notes });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-[36px] sm:rounded-[32px] p-6 max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl animate-in slide-in-from-bottom duration-250">
        
        {/* iOS Drag Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto -mt-1 mb-2" />

        {/* Header Estilo iOS */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest">
                Registro del Día
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Día {cycleDay}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{dateStr}</h3>
            {dayInfo.isOvulation && (
              <span className="text-[11px] font-extrabold text-violet-600 flex items-center gap-1 mt-0.5">
                ✨ Día de Ovulación Pico
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sangrado / Periodo */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Flujo Menstrual
          </label>
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
                className={`py-2.5 text-xs font-bold rounded-2xl border transition active:scale-95 ${
                  flow === f.id
                    ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-sm ring-1 ring-rose-500'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Relaciones Sexuales */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Actividad Íntima
          </label>
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
                className={`py-3 px-3 text-xs font-bold rounded-2xl border text-left transition active:scale-95 ${
                  sex === s.id
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Síntomas SPM */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Síntomas & Cuerpo
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SYMPTOMS_LIST.map(symp => {
              const checked = symptoms.includes(symp.id);
              return (
                <button
                  key={symp.id}
                  type="button"
                  onClick={() => toggleSymptom(symp.id)}
                  className={`p-2.5 rounded-2xl border text-xs font-bold transition flex items-center justify-between active:scale-95 ${
                    checked
                      ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-sm'
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{symp.label}</span>
                  {checked && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Test de Embarazo */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Prueba de Embarazo
          </label>
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
                className={`py-2.5 text-xs font-bold rounded-2xl border transition active:scale-95 ${
                  test === t.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600 shadow-sm'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notas adicionales */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
            Notas
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anotaciones, síntomas adicionales, etc."
            className="w-full text-xs p-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
          />
        </div>

        {/* Botones de acción estilo iOS */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-rose-200 transition"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => onDelete(dateStr)}
            className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition active:scale-95"
          >
            Borrar
          </button>
        </div>

      </div>
    </div>
  );
}
