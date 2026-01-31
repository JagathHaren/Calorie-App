
import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange }) => {
  const items = [
    { id: 'dashboard' as View, label: 'Core', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { id: 'recipes' as View, label: 'Feed', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
    { id: 'camera' as View, label: 'Lens', isCenter: true, icon: <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: 'history' as View, label: 'Logs', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
    { id: 'water' as View, label: 'Aqua', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> }
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-red-50 flex items-center justify-between px-6 pb-10 pt-5 z-20 shadow-[0_-10px_30px_rgba(220,38,38,0.05)]">
      {items.map((item, i) => (
        item.isCenter ? (
          <button 
            key={i} 
            onClick={() => onViewChange(item.id)} 
            className="absolute -top-8 left-1/2 -translate-x-1/2 h-20 w-20 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-600/40 active:scale-90 transition-all border-4 border-white rotate-45 group"
          >
            <div className="-rotate-45 group-hover:scale-110 transition-transform">{item.icon}</div>
          </button>
        ) : (
          <button 
            key={i} 
            onClick={() => onViewChange(item.id)} 
            className={`flex flex-col items-center space-y-2 transition-all group ${activeView === item.id ? 'text-red-600' : 'text-red-900/30 hover:text-red-600'}`}
          >
            <div className={`transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic leading-none">{item.label}</span>
          </button>
        )
      ))}
    </nav>
  );
};

export default BottomNav;
