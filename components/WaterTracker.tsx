
import React from 'react';
import { UserPreferences } from '../types';

interface WaterTrackerProps {
  current: number;
  prefs: UserPreferences;
  onUpdate: (amount: number) => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ current, prefs, onUpdate }) => {
  const goal = prefs.waterGoal || 2500;
  const isOz = prefs.liquidUnit === 'oz';
  
  const displayCurrent = isOz ? (current / 29.574).toFixed(1) : current;
  const displayGoal = isOz ? (goal / 29.574).toFixed(0) : goal;
  const unitLabel = isOz ? 'oz' : 'ml';
  const percentage = Math.min((current / goal) * 100, 100);

  const circumference = 2 * Math.PI * 132;
  const strokeDashoffset = circumference - (circumference * percentage / 100);

  const presets = isOz 
    ? [{ amount: 150, label: '5 oz', icon: '🥛' }, { amount: 250, label: '8 oz', icon: '🥛' }, { amount: 500, label: '17 oz', icon: '🍷' }]
    : [{ amount: 150, label: '150ml', icon: '🥛' }, { amount: 250, label: '250ml', icon: '🥛' }, { amount: 500, label: '500ml', icon: '🍷' }];

  return (
    <div className="p-5 flex flex-col items-center min-h-[80vh] space-y-10 bg-white">
      <div className="text-center w-full mt-4">
        <p className="text-red-600 font-black uppercase tracking-[0.5em] text-[10px] mb-1 italic">Hydration Matrix</p>
        <h1 className="text-5xl font-black text-red-950 italic tracking-tighter uppercase leading-none">Bio-Liquid</h1>
        <p className="text-xs text-red-900/30 font-black mt-4 tracking-[0.3em] uppercase italic">Target: {displayGoal}{unitLabel}</p>
      </div>

      <div className="relative h-80 w-80 flex items-center justify-center">
        {/* Dynamic Multi-Stage Red Glow */}
        <div 
          className="absolute inset-0 rounded-full transition-all duration-1000 blur-[60px] opacity-40 bg-red-600"
          style={{ 
            opacity: 0.1 + (percentage / 150),
            transform: `scale(${0.8 + (percentage / 300)})`,
            animation: percentage > 80 ? 'redPulse 1.5s ease-in-out infinite' : 'none'
          }}
        ></div>
        
        {/* Outer Background Track */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 288">
          <circle 
            cx="144" 
            cy="144" 
            r="132" 
            stroke="#fee2e2" 
            strokeWidth="20" 
            fill="transparent" 
          />
        </svg>

        {/* Primary Liquid Progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 288 288">
          <circle 
            cx="144" 
            cy="144" 
            r="132" 
            stroke="#DC2626" 
            strokeWidth="20" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
          <circle 
            cx="144" 
            cy="144" 
            r="132" 
            stroke="white" 
            strokeWidth="4" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out opacity-20"
          />
        </svg>

        {/* Deep Ruby Vessel */}
        <div className="h-[230px] w-[230px] rounded-full bg-red-50 overflow-hidden relative border-[10px] border-white shadow-2xl flex items-center justify-center">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-red-400 transition-all duration-1000 ease-in-out shadow-[inset_0_20px_40px_rgba(0,0,0,0.1)]"
              style={{ height: `${percentage}%`, opacity: 0.1 + (percentage / 200) }}
            >
              <div className="absolute inset-0 overflow-hidden">
                 {[...Array(8)].map((_, i) => (
                   <div 
                    key={i} 
                    className="absolute bg-white rounded-full opacity-40 animate-pulse"
                    style={{
                      left: `${15 + (i * 12)}%`,
                      bottom: `${Math.random() * 80}%`,
                      width: `${6 + Math.random() * 8}px`,
                      height: `${6 + Math.random() * 8}px`,
                      animationDuration: `${2 + Math.random() * 3}s`,
                    }}
                   ></div>
                 ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center animate-in zoom-in duration-700 relative z-10">
              <span className="text-8xl font-black text-red-950 italic tracking-tighter leading-none">{displayCurrent}</span>
              <p className="text-red-600 font-black text-xl uppercase tracking-[0.3em] mt-2 italic">{unitLabel}</p>
            </div>
        </div>
      </div>

      <div className="w-full space-y-6">
        <div className="flex justify-between gap-4">
          {presets.map((p, i) => (
            <button 
              key={i} 
              onClick={() => onUpdate(p.amount)} 
              className="flex-1 bg-white border-4 border-red-900 p-6 rounded-[2.5rem] flex flex-col items-center hover:bg-red-50 hover:border-red-600 transition-all active:scale-95 group shadow-[6px_6px_0px_0px_rgba(153,27,27,1)]"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{p.icon}</span>
              <span className="text-[10px] font-black text-red-950 uppercase tracking-widest group-hover:text-red-600">+{p.label}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={() => onUpdate(-100)} 
          className="w-full py-6 bg-red-950 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-red-900 transition-all shadow-2xl active:scale-[0.98]"
        >
          Volume Correction
        </button>
      </div>
      
      <style>{`
        @keyframes redPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.9); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default WaterTracker;
