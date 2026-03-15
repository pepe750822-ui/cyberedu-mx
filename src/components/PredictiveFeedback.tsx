
import React from 'react';
import { useAnalisisRendimiento } from '@/hooks/useAnalisisRendimiento';
import { AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const PredictiveFeedback: React.FC = () => {
    const { getRecomendacionesDiarias, getAlertasRiesgo } = useAnalisisRendimiento();
    const recommendations = getRecomendacionesDiarias();
    const alerts = getAlertasRiesgo();
    const navigate = useNavigate();

    if (recommendations.length === 0 && alerts.length === 0) return null;

    return (
        <div className="space-y-6">
            {alerts.length > 0 && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem] p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-rose-500/20 rounded-2xl">
                            <AlertCircle className="h-6 w-6 text-rose-500" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-rose-500 uppercase tracking-tighter">Atención Prioritaria</h3>
                            <p className="text-[10px] font-bold text-rose-500/70 uppercase tracking-[0.2em]">Riesgo Detectado por AI</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {alerts.map((alert, i) => (
                            <div key={i} className="bg-slate-900/50 backdrop-blur-sm p-5 rounded-3xl border border-rose-500/10 flex flex-col md:flex-row items-center gap-6 group hover:border-rose-500/30 transition-all">
                                <div className="flex-1 w-full">
                                    <p className="text-sm md:text-base font-bold text-slate-200 leading-relaxed mb-4">{alert.message}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${alert.score}%` }} />
                                        </div>
                                        <span className="text-xs font-black text-rose-500 w-12 text-right">{Math.round(alert.score)}%</span>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => navigate(`/area/${alert.areaId}`)}
                                    className="w-full md:w-auto bg-rose-500 hover:bg-rose-400 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-2xl transition-all hover:scale-105 active:scale-95"
                                >
                                    Reforzar Ahora
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recommendations.length > 0 && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[2.5rem] p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-500/20 rounded-2xl">
                            <Lightbulb className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-indigo-400 uppercase tracking-tighter">Tu Plan de Hoy</h3>
                            <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-[0.2em]">Sugerencias Personalizadas</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.map((rec, i) => (
                            <div key={i} className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-3xl border border-indigo-500/10 hover:border-indigo-500/40 transition-all group flex flex-col justify-between h-full">
                                <div className="mb-6">
                                    <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-4">
                                        {rec.type === 'video' ? 'Repaso Recomendado' : 'Prueba de Nivel'}
                                    </div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2 leading-tight group-hover:text-indigo-400 transition-colors">{rec.title}</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{rec.reason}</p>
                                </div>
                                <Button 
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
                                    onClick={() => {
                                        if (rec.type === 'video') navigate(`/area/${rec.id.split('-')[0] === 'hv' ? 'habilidades' : 'matematicas'}`); 
                                        else navigate('/#areas');
                                    }}
                                >
                                    Comenzar <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
