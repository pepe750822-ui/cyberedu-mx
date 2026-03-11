import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'cyberagent_study_plans';

export interface PlanPaso {
  tipo: 'video' | 'quiz' | 'infografia' | 'simulador';
  id: string;
  titulo: string;
  completado: boolean;
}

export interface PlanEstudio {
  id: string;
  fecha: string;
  area: string;
  titulo: string;
  pasos: PlanPaso[];
  completado: boolean;
}

function loadPlans(): PlanEstudio[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePlans(plans: PlanEstudio[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function useStudyPlans() {
  const [plans, setPlans] = useState<PlanEstudio[]>(loadPlans);

  // Sync state to localStorage
  useEffect(() => {
    savePlans(plans);
  }, [plans]);

  const addPlan = useCallback((plan: Omit<PlanEstudio, 'id' | 'fecha' | 'completado'>): PlanEstudio => {
    const newPlan: PlanEstudio = {
      ...plan,
      id: `${Date.now()}-${plan.area.replace(/\s/g, '_')}`,
      fecha: new Date().toISOString(),
      completado: false,
    };
    setPlans(prev => [newPlan, ...prev]);
    return newPlan;
  }, []);

  const togglePaso = useCallback((planId: string, pasoId: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      const pasos = p.pasos.map(paso =>
        paso.id === pasoId ? { ...paso, completado: !paso.completado } : paso
      );
      const completado = pasos.every(paso => paso.completado);
      return { ...p, pasos, completado };
    }));
  }, []);

  const deletePlan = useCallback((planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
  }, []);

  const getActivePlans = useCallback(() => plans.filter(p => !p.completado), [plans]);
  const getCompletedPlans = useCallback(() => plans.filter(p => p.completado), [plans]);

  return { plans, addPlan, togglePaso, deletePlan, getActivePlans, getCompletedPlans };
}
