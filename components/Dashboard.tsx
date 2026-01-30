
import React from 'react';
import { DailyStats, FoodLog } from '../types';

interface DashboardProps {
  stats: DailyStats;
  onAddClick: () => void;
  logs: FoodLog[];
}

const ProgressBar: React.FC<{ label: string, current: number, target: number, color: string }> = ({ label, current, target, color }) => {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900 font-semibold">{current}g / {target}g</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full ${color} transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ stats, onAddClick, logs }) => {
  const calorieTarget = 2000;
  const calPercentage = Math.min((stats.calories / calorieTarget) * 100, 100);

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Today</h1>
          <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* Main Calorie Card */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-indigo-100 text-sm font-medium">Calories Left</p>
            <h2 className="text-4xl font-bold mt-1">{(calorieTarget - stats.calories).toLocaleString()}</h2>
          </div>
          <div className="relative h-20 w-20 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="transparent" />
              <circle 
                cx="40" cy="40" r="34" stroke="white" strokeWidth="6" fill="transparent" 
                strokeDasharray={213.6} 
                strokeDashoffset={213.6 - (213.6 * calPercentage / 100)}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <span className="text-sm font-bold">{Math.round(calPercentage)}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-indigo-500/30">
          <div>
            <p className="text-indigo-200 text-xs">Consumed</p>
            <p className="font-bold text-lg">{stats.calories}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Burned</p>
            <p className="font-bold text-lg">342</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Target</p>
            <p className="font-bold text-lg">{calorieTarget}</p>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800">Macros</h3>
        <ProgressBar label="Protein" current={stats.protein} target={150} color="bg-emerald-500" />
        <ProgressBar label="Carbs" current={stats.carbs} target={220} color="bg-amber-500" />
        <ProgressBar label="Fats" current={stats.fat} target={65} color="bg-rose-500" />
      </div>

      {/* Water and Add Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 border border-blue-100">
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.5c-3.6 0-6.5-2.9-6.5-6.5 0-3.1 3.2-7.5 5.5-10.2.5-.6 1.5-.6 2 0 2.3 2.7 5.5 7.1 5.5 10.2 0 3.6-2.9 6.5-6.5 6.5z"/>
          </svg>
          <div>
            <p className="text-blue-900 font-bold text-lg">{stats.water}ml</p>
            <p className="text-blue-600 text-xs">Hydration</p>
          </div>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 text-white hover:bg-slate-800 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <div>
            <p className="font-bold text-lg">Log Food</p>
            <p className="text-slate-400 text-xs">AI Scan</p>
          </div>
        </button>
      </div>

      {/* Recent History */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Meals</h3>
          <button className="text-indigo-600 text-xs font-semibold">View All</button>
        </div>
        
        {logs.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">No meals logged today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center space-x-3 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
                  {log.imageUrl ? (
                    <img src={log.imageUrl} alt={log.data.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{log.data.name}</h4>
                  <p className="text-xs text-slate-500">{log.data.calories} kcal • {log.data.protein}g protein</p>
                </div>
                <div className="text-xs font-medium text-slate-400">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
