
import React from 'react';
import { FoodLog } from '../types';

interface HistoryProps {
  logs: FoodLog[];
}

const History: React.FC<HistoryProps> = ({ logs }) => {
  // Group logs by date
  const groupedLogs = logs.reduce((groups: { [key: string]: FoodLog[] }, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(log);
    return groups;
  }, {});

  const dates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="p-5 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Food History</h1>
        <p className="text-sm text-slate-500">Track your nutrition journey</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">No meal history yet</p>
        </div>
      ) : (
        dates.map(date => (
          <div key={date} className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{date}</h2>
            <div className="space-y-3">
              {groupedLogs[date].map(log => (
                <div key={log.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
                    {log.imageUrl ? (
                      <img src={log.imageUrl} alt={log.data.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 capitalize leading-tight">{log.data.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{log.data.estimatedWeight}</p>
                    <div className="flex gap-4 mt-3">
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">{log.data.calories}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">kcal</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">{log.data.protein}g</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Prot</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">{log.data.carbs}g</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Carb</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">{log.data.fat}g</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Fat</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
