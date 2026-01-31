
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View as ViewType, FoodLog, DailyStats, UserPreferences, DailySummary } from './types';
import Dashboard from './components/Dashboard';
import CameraScanner from './components/CameraScanner';
import History from './components/History';
import WaterTracker from './components/WaterTracker';
import BottomNav from './components/BottomNav';
import SearchFood from './components/SearchFood';
import Settings from './components/Settings';
import Recipes from './components/Recipes';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [monthlySummaries, setMonthlySummaries] = useState<Record<string, DailySummary>>({});
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const [prefs, setPrefs] = useState<UserPreferences>({
    weightUnit: 'g',
    liquidUnit: 'ml',
    calorieGoal: 2000,
    waterGoal: 2500
  });
  
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0
  });

  // Load Data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedLogs, savedWater, savedPrefs, savedSummaries, lastUpdate] = await Promise.all([
          AsyncStorage.getItem('nutrilens_logs'),
          AsyncStorage.getItem('nutrilens_water'),
          AsyncStorage.getItem('nutrilens_prefs'),
          AsyncStorage.getItem('nutrilens_summaries'),
          AsyncStorage.getItem('nutrilens_last_update')
        ]);

        const today = new Date().toDateString();

        if (savedPrefs) setPrefs(JSON.parse(savedPrefs));
        if (savedSummaries) setMonthlySummaries(JSON.parse(savedSummaries));

        if (lastUpdate !== today) {
          await AsyncStorage.setItem('nutrilens_last_update', today);
          await AsyncStorage.setItem('nutrilens_water', '0');
          setWaterIntake(0);
        } else if (savedWater) {
          setWaterIntake(parseInt(savedWater, 10));
        }

        if (savedLogs) {
          let parsedLogs: FoodLog[] = JSON.parse(savedLogs);
          const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          parsedLogs = parsedLogs.filter(log => log.timestamp >= sevenDaysAgo);
          setLogs(parsedLogs);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  // Sync Logic
  useEffect(() => {
    const syncData = async () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const todaysLogs = logs.filter(log => new Date(log.timestamp).toISOString().split('T')[0] === todayStr);
      
      const stats = todaysLogs.reduce((acc, log) => ({
        ...acc,
        calories: acc.calories + log.data.calories,
        protein: acc.protein + log.data.protein,
        carbs: acc.carbs + log.data.carbs,
        fat: acc.fat + log.data.fat,
      }), { calories: 0, protein: 0, carbs: 0, fat: 0, water: waterIntake });

      setDailyStats(stats);

      const updatedSummaries = {
        ...monthlySummaries,
        [todayStr]: {
          date: todayStr,
          calories: stats.calories,
          protein: stats.protein,
          carbs: stats.carbs,
          fat: stats.fat
        }
      };

      try {
        await Promise.all([
          AsyncStorage.setItem('nutrilens_logs', JSON.stringify(logs)),
          AsyncStorage.setItem('nutrilens_water', waterIntake.toString()),
          AsyncStorage.setItem('nutrilens_prefs', JSON.stringify(prefs)),
          AsyncStorage.setItem('nutrilens_summaries', JSON.stringify(updatedSummaries))
        ]);
      } catch (e) {
        console.error("Failed to sync data", e);
      }
    };
    syncData();
  }, [logs, waterIntake, prefs]);

  const addLog = useCallback((log: FoodLog) => {
    setLogs(prev => [log, ...prev]);
    setActiveView('dashboard');
  }, []);

  const deleteLog = useCallback((id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  }, []);

  const editLog = useCallback((id: string, updatedData: any) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, data: { ...log.data, ...updatedData } } : log));
  }, []);

  const updateWater = useCallback((amount: number) => {
    setWaterIntake(prev => Math.max(0, prev + amount));
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard stats={dailyStats} prefs={prefs} onAddClick={() => setActiveView('camera')} onSearchClick={() => setActiveView('search')} logs={logs.slice(0, 5)} />;
      case 'camera':
        return <CameraScanner onLogAdded={addLog} onBack={() => setActiveView('dashboard')} prefs={prefs} />;
      case 'search':
        return <SearchFood onLogAdded={addLog} onBack={() => setActiveView('dashboard')} />;
      case 'history':
        return <History logs={logs} summaries={monthlySummaries} onDelete={deleteLog} onEdit={editLog} prefs={prefs} />;
      case 'water':
        return <WaterTracker current={waterIntake} prefs={prefs} onUpdate={updateWater} />;
      case 'settings':
        return <Settings prefs={prefs} onPrefsChange={setPrefs} />;
      case 'recipes':
        return <Recipes />;
      default:
        return <Dashboard stats={dailyStats} prefs={prefs} onAddClick={() => setActiveView('camera')} onSearchClick={() => setActiveView('search')} logs={logs.slice(0, 5)} />;
    }
  };

  const isFullScreen = activeView === 'camera' || activeView === 'search';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {renderView()}
      </View>
      {!isFullScreen && (
        <BottomNav activeView={activeView} onViewChange={setActiveView} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default App;
