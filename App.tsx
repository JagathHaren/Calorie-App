
import React, { useState, useEffect, useCallback } from 'react';
import { View, FoodLog, DailyStats } from './types';
import Dashboard from './components/Dashboard';
import CameraScanner from './components/CameraScanner';
import History from './components/History';
import WaterTracker from './components/WaterTracker';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0
  });

  // Load from LocalStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('nutrilens_logs');
    const savedWater = localStorage.getItem('nutrilens_water');
    const lastUpdate = localStorage.getItem('nutrilens_last_update');
    
    const today = new Date().toDateString();
    
    if (lastUpdate !== today) {
      // It's a new day, keep history but reset daily counters for current stats
      // In a real app we'd keep logs but calculate dailyStats based on filter
      localStorage.setItem('nutrilens_last_update', today);
      localStorage.setItem('nutrilens_water', '0');
    } else {
      if (savedLogs) setLogs(JSON.parse(savedLogs));
      if (savedWater) setWaterIntake(parseInt(savedWater, 10));
    }
  }, []);

  // Calculate Daily Stats whenever logs or water change
  useEffect(() => {
    const today = new Date().toDateString();
    const todaysLogs = logs.filter(log => new Date(log.timestamp).toDateString() === today);
    
    const stats = todaysLogs.reduce((acc, log) => ({
      calories: acc.calories + log.data.calories,
      protein: acc.protein + log.data.protein,
      carbs: acc.carbs + log.data.carbs,
      fat: acc.fat + log.data.fat,
      water: waterIntake
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, water: waterIntake });

    setDailyStats(stats);
    
    localStorage.setItem('nutrilens_logs', JSON.stringify(logs));
    localStorage.setItem('nutrilens_water', waterIntake.toString());
  }, [logs, waterIntake]);

  const addLog = useCallback((log: FoodLog) => {
    setLogs(prev => [log, ...prev]);
    setActiveView('dashboard');
  }, []);

  const updateWater = useCallback((amount: number) => {
    setWaterIntake(prev => Math.max(0, prev + amount));
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard stats={dailyStats} onAddClick={() => setActiveView('camera')} logs={logs.slice(0, 5)} />;
      case 'camera':
        return <CameraScanner onLogAdded={addLog} onBack={() => setActiveView('dashboard')} />;
      case 'history':
        return <History logs={logs} />;
      case 'water':
        return <WaterTracker current={waterIntake} onUpdate={updateWater} />;
      default:
        return <Dashboard stats={dailyStats} onAddClick={() => setActiveView('camera')} logs={logs.slice(0, 5)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white overflow-hidden shadow-2xl relative">
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {renderView()}
      </main>
      
      {activeView !== 'camera' && (
        <BottomNav activeView={activeView} onViewChange={setActiveView} />
      )}
    </div>
  );
};

export default App;
