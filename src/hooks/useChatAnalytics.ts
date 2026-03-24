import { useState, useCallback } from 'react';

export interface ChatMetric {
  id: string;
  timestamp: string;
  question: string;
  questionTopic: string;
  responseTime: number; // ms
  tokensInput: number;
  tokensOutput: number;
  tokensCached: number;
  cost: number;
  hasChart: boolean;
  hasMermaid: boolean;
  feedback: 'up' | 'down' | null;
}

export interface AggregatedMetrics {
  totalQueries: number;
  totalCost: number;
  avgResponseTime: number;
  topicsFrequency: Record<string, number>;
  queriesByHour: Record<number, number>;
  queriesByDay: Record<string, number>;
}

const METRICS_KEY = 'cyberedu_chat_metrics';

export function useChatAnalytics() {
  const [metrics, setMetrics] = useState<ChatMetric[]>(() => {
    try {
      const stored = localStorage.getItem(METRICS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const aggregateMetrics = useCallback((): AggregatedMetrics => {
    const agg: AggregatedMetrics = {
      totalQueries: metrics.length,
      totalCost: 0,
      avgResponseTime: 0,
      topicsFrequency: {},
      queriesByHour: {},
      queriesByDay: {}
    };

    let totalWait = 0;

    metrics.forEach(m => {
      agg.totalCost += m.cost;
      totalWait += m.responseTime;

      // Temas
      const topic = m.questionTopic || 'general';
      agg.topicsFrequency[topic] = (agg.topicsFrequency[topic] || 0) + 1;

      // Horas (0-23)
      const date = new Date(m.timestamp);
      const hour = date.getHours();
      agg.queriesByHour[hour] = (agg.queriesByHour[hour] || 0) + 1;

      // Días (YYYY-MM-DD)
      const day = date.toISOString().split('T')[0];
      agg.queriesByDay[day] = (agg.queriesByDay[day] || 0) + 1;
    });

    if (metrics.length > 0) {
      agg.avgResponseTime = totalWait / metrics.length;
    }

    return agg;
  }, [metrics]);

  const addMetric = useCallback((metric: ChatMetric) => {
    setMetrics(prev => {
      const newMetrics = [...prev, metric];
      localStorage.setItem(METRICS_KEY, JSON.stringify(newMetrics));
      return newMetrics;
    });
  }, []);

  const updateFeedback = useCallback((id: string, feedback: 'up' | 'down') => {
    setMetrics(prev => {
      const newMetrics = prev.map(m => m.id === id ? { ...m, feedback } : m);
      localStorage.setItem(METRICS_KEY, JSON.stringify(newMetrics));
      return newMetrics;
    });
  }, []);

  const exportToCSV = useCallback(() => {
    if (metrics.length === 0) return;
    
    const headers = ['id', 'timestamp', 'question', 'questionTopic', 'responseTime', 'tokensInput', 'tokensOutput', 'tokensCached', 'cost', 'hasChart', 'hasMermaid', 'feedback'];
    const csvContent = [
      headers.join(','),
      ...metrics.map(m => [
        m.id,
        m.timestamp,
        `"${m.question.replace(/"/g, '""')}"`,
        `"${m.questionTopic}"`,
        m.responseTime,
        m.tokensInput,
        m.tokensOutput,
        m.tokensCached,
        m.cost.toFixed(6),
        m.hasChart,
        m.hasMermaid,
        m.feedback || 'none'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `chat_metrics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [metrics]);

  return {
    metrics,
    addMetric,
    updateFeedback,
    aggregateMetrics,
    exportToCSV
  };
}
