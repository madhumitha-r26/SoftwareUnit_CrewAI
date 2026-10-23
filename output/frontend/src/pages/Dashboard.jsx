import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const [stats, setStats] = useState({ 'To-Do': 0, 'In Progress': 0, 'Review': 0, 'Done': 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Stats fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'To-Do', value: stats['To-Do'], icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100' },
    { label: 'In Progress', value: stats['In Progress'], icon: Activity, color: 'text-primary', bg: 'bg-blue-100' },
    { label: 'Review', value: stats['Review'], icon: AlertCircle, color: 'text-warning', bg: 'bg-amber-100' },
    { label: 'Done', value: stats['Done'], icon: CheckCircle, color: 'text-success', bg: 'bg-emerald-100' },
  ];

  if (loading) return <div className="flex items-center justify-center h-full">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
        <p className="text-slate-500">System-wide task density and throughput</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-lg border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <span className="text-xs font-medium text-slate-400 uppercase">{card.label}</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-lg border border-border shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Task Distribution Heatmap</h2>
        <div className="flex items-end justify-around h-64 gap-4">
          {statCards.map(card => {
            const height = (card.value / (Object.values(stats).reduce((a,b) => a+b, 0) || 1)) * 100;
            return (
              <div key={card.label} className="flex flex-col items-center gap-4 w-full max-w-[80px]">
                <div 
                  className={`w-full rounded-t-md transition-all duration-500 ${card.bg} ${card.color}`} 
                  style={{ height: `${height}%`, minHeight: '4px' }}
                ></div>
                <span className="text-xs font-medium text-slate-600">{card.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
