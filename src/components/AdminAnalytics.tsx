import React, { useMemo } from 'react';
import { useChatAnalytics } from '@/hooks/useChatAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart, Clock, MessageSquare, Zap } from 'lucide-react';

export default function AdminAnalytics() {
  const { metrics, aggregateMetrics, exportToCSV } = useChatAnalytics();
  const stats = useMemo(() => aggregateMetrics(), [metrics, aggregateMetrics]);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart className="h-8 w-8 text-primary" />
          Analíticas de Chat IA
        </h1>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQueries}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Costo Estimado</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-emerald-500">
               ${stats.totalCost.toFixed(4)} USD
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Tiempo de Respuesta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              {(stats.avgResponseTime / 1000).toFixed(2)}s
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Temas Detectados</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              {Object.keys(stats.topicsFrequency).length}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Temas más populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.topicsFrequency)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([topic, count]) => (
                  <div key={topic} className="flex items-center">
                    <div className="w-32 truncate pr-2 text-sm font-medium">{topic}</div>
                    <div className="flex-1 bg-slate-100 rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full" 
                        style={{ width: `${Math.min(100, (count / stats.totalQueries) * 100)}%` }} 
                      />
                    </div>
                    <div className="w-12 text-right text-xs text-slate-500">{count}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {[...metrics].reverse().slice(0, 20).map(m => (
                <div key={m.id} className="text-sm border-b pb-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{new Date(m.timestamp).toLocaleString()}</span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" /> {(m.responseTime / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <div className="font-medium text-slate-700">"{m.question}"</div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{m.questionTopic}</span>
                    <span className="text-xs bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">
                      ${m.cost.toFixed(5)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
