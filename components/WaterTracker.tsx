
import React from 'react';

interface WaterTrackerProps {
  current: number;
  onUpdate: (amount: number) => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ current, onUpdate }) => {
  const goal = 2500;
  const percentage = Math.min((current / goal) * 100, 100);
  
  const presets = [
    { amount: 150, label: 'Small Glass', icon: '🥛' },
    { amount: 250, label: 'Regular Glass', icon: '🥛' },
    { amount: 500, label: 'Bottle', icon: '💧' }
  ];

  return (
    <div className="p-5 flex flex-col items-center justify-between min-h-[80vh]">
      <div className="text-center w-full mt-4">
        <h1 className="text-2xl font-bold text-slate-900">Hydration</h1>
        <p className="text-sm text-slate-500">Goal: {goal}ml per day</p>
      </div>

      <div className="relative h-64 w-64 flex items-center justify-center my-10">
        <div className="absolute inset-0 bg-blue-50 rounded-full border-4 border-white shadow-inner flex flex-col items-center justify-center overflow-hidden">
          {/* Animated Water Level */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-blue-500/30 transition-all duration-1000 ease-out"
            style={{ height: `${percentage}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-4 bg-blue-400/20 blur-sm"></div>
          </div>
          
          <div className="z-10 text-center">
            <span className="text-5xl font-black text-blue-600 leading-none">{current}</span>
            <p className="text-blue-400 font-bold text-lg mt-1">ml</p>
          </div>
        </div>
      </div>

      <div className="w-full space-y-6 pb-8">
        <div className="flex justify-between gap-3">
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => onUpdate(preset.amount)}
              className="flex-1 bg-white border border-slate-100 p-4 rounded-3xl shadow-sm hover:border-blue-200 transition-colors active:scale-95 duration-75 flex flex-col items-center"
            >
              <span className="text-2xl mb-1">{preset.icon}</span>
              <span className="text-xs font-bold text-slate-800">+{preset.amount}ml</span>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => onUpdate(-100)}
            className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-500 active:scale-95"
          >
            Undo -100ml
          </button>
          <button 
            onClick={() => onUpdate(200)}
            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Custom Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
