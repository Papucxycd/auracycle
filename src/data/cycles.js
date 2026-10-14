export const HISTORICAL_CYCLES = [
  { id: 1, range: "28 ago - 3 oct 2025", days: 37, type: "normal" },
  { id: 2, range: "4 oct - 29 nov 2025", days: 57, type: "pico" },
  { id: 3, range: "30 nov 2025 - 11 ene 2026", days: 43, type: "bajada" },
  { id: 4, range: "12 ene - 20 feb 2026", days: 40, type: "bajada" },
  { id: 5, range: "21 feb - 24 mar 2026", days: 32, type: "minimo" },
  { id: 6, range: "25 mar - 20 may 2026", days: 57, type: "pico" },
  { id: 7, range: "21 may - 23 jun 2026", days: 34, type: "bajada" },
  { id: 8, range: "24 jun - 4 ago 2026", days: 42, type: "subida" },
  { id: 9, range: "5 ago - 19 sep 2026", days: 47, type: "subida" }
];

export const CURRENT_CYCLE_START = "2026-09-20";

export const INITIAL_LOGS = {
  "2026-09-20": { flow: "medium", sex: "none", symptoms: ["symp-cramps"] },
  "2026-09-21": { flow: "medium", sex: "none", symptoms: [] },
  "2026-09-22": { flow: "medium", sex: "none", symptoms: [] },
  "2026-09-23": { flow: "spotting", sex: "none", symptoms: [] },
  "2026-09-24": { flow: "spotting", sex: "none", symptoms: [] },
  "2026-09-25": { flow: "spotting", sex: "none", symptoms: [] },
  "2026-09-26": { flow: "none", sex: "pullout", symptoms: [] }
};

export function calculateCycleDay(dateStr, startStr = CURRENT_CYCLE_START) {
  const start = new Date(startStr + 'T00:00:00');
  const target = new Date(dateStr + 'T00:00:00');
  const diffTime = target - start;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function getPhaseInfo(cycleDay) {
  if (cycleDay < 1) {
    return {
      phase: "Pre-ciclo",
      risk: "safe",
      cardClass: "bg-gradient-to-br from-slate-600 to-slate-800",
      title: "Registro Previo",
      desc: "Fecha anterior al ciclo actual.",
      verdict: "Sin datos",
      icon: "ShieldCheck"
    };
  }
  if (cycleDay >= 1 && cycleDay <= 7) {
    return {
      phase: "Menstruación / Folicular Temprana",
      risk: "safe",
      cardClass: "bg-gradient-to-br from-emerald-600 to-teal-700",
      title: "Fase Muy Segura",
      desc: "La ovulación está a semanas de distancia. Riesgo de embarazo virtualmente 0%.",
      verdict: "🟢 Riesgo Prácticamente Nulo (~0%)",
      icon: "ShieldCheck"
    };
  }
  if (cycleDay >= 8 && cycleDay <= 15) {
    return {
      phase: "Folicular Media",
      risk: "safe",
      cardClass: "bg-gradient-to-br from-emerald-600 to-teal-800",
      title: "Fase Folicular Segura",
      desc: "Aún lejos de la ovulación en ciclos largos oscilantes.",
      verdict: "🟢 Muy Bajo Riesgo",
      icon: "ShieldCheck"
    };
  }
  if (cycleDay >= 16 && cycleDay <= 23) {
    return {
      phase: "Zona de Transición / Precaución",
      risk: "caution",
      cardClass: "bg-gradient-to-br from-amber-600 to-orange-700",
      title: "Precaución Moderada",
      desc: "Si el ciclo decidiera acortarse inesperadamente, el riesgo comienza a subir.",
      verdict: "🟡 Precaución - Usar Protección",
      icon: "AlertTriangle"
    };
  }
  if (cycleDay >= 24 && cycleDay <= 44) {
    return {
      phase: "Ventana Fértil Crítica (Ciclos 42-57d)",
      risk: "fertile",
      cardClass: "bg-gradient-to-br from-rose-600 to-pink-800",
      title: "Ventana Fértil / Alto Riesgo",
      desc: "En este rango puede ocurrir la ovulación si el ciclo dura entre 42 y 57 días. Los espermatozoides sobreviven 3-5 días.",
      verdict: "🔴 Riesgo Elevado - Evitar Sin Protección",
      icon: "Flame"
    };
  }
  if (cycleDay >= 45 && cycleDay <= 51) {
    return {
      phase: "Fase Lútea Probable",
      risk: "caution",
      cardClass: "bg-gradient-to-br from-amber-600 to-yellow-700",
      title: "Fase Lútea Avanzada",
      desc: "La ovulación probablemente ya ocurrió. Esperando llegada de menstruación.",
      verdict: "🟡 Riesgo Bajo-Moderado (Post-ovulación)",
      icon: "Clock"
    };
  }
  return {
    phase: "Zona Esperada de Periodo (Día 52-57)",
    risk: "period-expected",
    cardClass: "bg-gradient-to-br from-purple-700 to-indigo-800",
    title: "Periodo Inminente",
    desc: "Tu patrón oscilante de 52-57 días culmina en estos días. Si supera el día 57, realizar prueba de embarazo.",
    verdict: "🟣 Realizar Test si hay retraso > 57d",
    icon: "CalendarCheck"
  };
}
