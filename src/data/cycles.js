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

// Clasificación detallada para cada día del ciclo
export function getDayClassification(cycleDay) {
  if (cycleDay < 1) {
    return { type: "pre", label: "Registro Previo", color: "slate" };
  }
  // Periodo menstrual
  if (cycleDay >= 1 && cycleDay <= 6) {
    return {
      type: "period",
      label: "Menstruación",
      badge: "🩸 Periodo",
      risk: "safe",
      isPeriod: true
    };
  }
  // Fase folicular temprana/segura
  if (cycleDay >= 7 && cycleDay <= 15) {
    return {
      type: "safe",
      label: "Folicular Segura",
      badge: "🌿 Seguro (~0%)",
      risk: "safe",
      isSafe: true
    };
  }
  // Transición / Precaución temprana
  if (cycleDay >= 16 && cycleDay <= 23) {
    return {
      type: "caution",
      label: "Precaución",
      badge: "🟡 Precaución",
      risk: "caution",
      isCaution: true
    };
  }
  // Ventana fértil inicial
  if (cycleDay >= 24 && cycleDay <= 37) {
    return {
      type: "fertile",
      label: "Ventana Fértil",
      badge: "🌱 Ventana Fértil",
      risk: "fertile",
      isFertile: true
    };
  }
  // DÍAS PICO DE OVULACIÓN (27 Oct a 1 Nov para ciclos 52-57 días)
  if (cycleDay >= 38 && cycleDay <= 43) {
    return {
      type: "ovulation",
      label: "Días de Ovulación Pico",
      badge: "✨ Ovulación Máxima",
      risk: "ovulation",
      isOvulation: true,
      isPeak: (cycleDay === 40 || cycleDay === 41)
    };
  }
  // Cierre de ventana fértil
  if (cycleDay === 44) {
    return {
      type: "fertile-end",
      label: "Cierre Fértil",
      badge: "⚠️ Cierre Fértil",
      risk: "caution",
      isFertile: true
    };
  }
  // Fase lútea post-ovulación
  if (cycleDay >= 45 && cycleDay <= 51) {
    return {
      type: "luteal",
      label: "Fase Lútea",
      badge: "🌙 Post-Ovulación",
      risk: "safe",
      isLuteal: true
    };
  }
  // Periodo inminente
  return {
    type: "expected-period",
    label: "Periodo Esperado",
    badge: "⏳ Periodo Esperado",
    risk: "period-expected",
    isPeriodExpected: true
  };
}

export function getPhaseInfo(cycleDay) {
  const dayClass = getDayClassification(cycleDay);

  if (dayClass.type === "ovulation") {
    return {
      phase: "Días de Ovulación Pico",
      tag: "OVULACIÓN MÁXIMA",
      risk: "ovulation",
      cardBg: "bg-gradient-to-br from-violet-600 via-rose-600 to-pink-500",
      accentColor: "#E11D48",
      title: "Día Clave de Ovulación",
      desc: "El óvulo se libera en este rango (~27 Oct - 1 Nov). Máxima fertilidad del ciclo.",
      verdict: "🚫 ALTA FERTILIDAD - EVITAR COITO INTERRUMPIDO",
      ovulationCountdown: "Estás en los días pico de ovulación",
      icon: "Sparkles"
    };
  }

  if (dayClass.type === "fertile") {
    const daysUntilOvulation = 38 - cycleDay;
    return {
      phase: "Ventana Fértil Activa",
      tag: "VENTANA FÉRTIL",
      risk: "fertile",
      cardBg: "bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700",
      accentColor: "#F43F5E",
      title: "Ventana Fértil Abierta",
      desc: "Los espermatozoides sobreviven 3-5 días y la ovulación pico se aproxima.",
      verdict: "🔴 Riesgo Alto - Usar Protección Obligatoria",
      ovulationCountdown: `Ovulación pico estimada en ~${daysUntilOvulation} días (27 Oct)`,
      icon: "Flame"
    };
  }

  if (dayClass.type === "safe") {
    return {
      phase: "Fase Folicular Segura",
      tag: "FASE SEGURA",
      risk: "safe",
      cardBg: "bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-700",
      accentColor: "#10B981",
      title: "Fase Muy Segura",
      desc: "Ovulación lejana. Riesgo de embarazo virtualmente 0%.",
      verdict: "🟢 Riesgo Prácticamente Nulo (~0%)",
      ovulationCountdown: "Ovulación lejana (~3 semanas)",
      icon: "ShieldCheck"
    };
  }

  if (dayClass.type === "caution") {
    return {
      phase: "Fase de Precaución",
      tag: "PRECAUCIÓN",
      risk: "caution",
      cardBg: "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600",
      accentColor: "#F59E0B",
      title: "Zona de Precaución",
      desc: "Si el ciclo decide adelantarse, la fertilidad puede activarse.",
      verdict: "🟡 Precaución Moderada",
      ovulationCountdown: "Ovulación estimada en ~15 días",
      icon: "AlertTriangle"
    };
  }

  if (dayClass.type === "luteal") {
    return {
      phase: "Fase Lútea (Post-Ovulación)",
      tag: "POST-OVULACIÓN",
      risk: "safe",
      cardBg: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
      accentColor: "#8B5CF6",
      title: "Fase Lútea Estable",
      desc: "La ovulación ya culminó. El cuerpo se prepara para el siguiente ciclo.",
      verdict: "🟢 Riesgo Muy Bajo (Óvulo ya no viable)",
      ovulationCountdown: "Ovulación finalizada",
      icon: "Clock"
    };
  }

  if (dayClass.type === "expected-period") {
    return {
      phase: "Periodo Esperado (Día 52-57)",
      tag: "PERIODO ESPERADO",
      risk: "period",
      cardBg: "bg-gradient-to-br from-rose-700 via-red-800 to-rose-950",
      accentColor: "#BE123C",
      title: "Llegada del Periodo",
      desc: "Esperando menstruación según tu patrón de 52-57 días (~10-15 Nov).",
      verdict: "🟣 Si supera el día 57 realizar test",
      ovulationCountdown: "Ciclo en etapa final",
      icon: "CalendarCheck"
    };
  }

  return {
    phase: "Menstruación",
    tag: "MENSTRUACIÓN",
    risk: "period",
    cardBg: "bg-gradient-to-br from-rose-500 to-pink-600",
    accentColor: "#F43F5E",
    title: "Menstruación Activa",
    desc: "Primeros días del ciclo.",
    verdict: "🟢 Riesgo Nulo",
    ovulationCountdown: "Ovulación lejana",
    icon: "ShieldCheck"
  };
}
