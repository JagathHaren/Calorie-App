
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { DailyStats, FoodLog, UserPreferences } from '../types';

interface DashboardProps {
  stats: DailyStats;
  prefs: UserPreferences;
  onAddClick: () => void;
  onSearchClick: () => void;
  logs: FoodLog[];
}

const ProgressBar: React.FC<{ label: string, current: number, target: number, color: string }> = ({ label, current, target, color }) => {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroTextRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{current}g / {target}g</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ stats, prefs, onAddClick, onSearchClick, logs }) => {
  const calorieTarget = prefs.calorieGoal || 2000;
  const calPercentage = Math.min((stats.calories / calorieTarget) * 100, 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Search Bar */}
      <TouchableOpacity onPress={onSearchClick} style={styles.searchBar}>
        <Text style={styles.searchText}>REQUEST AI ANALYSIS...</Text>
      </TouchableOpacity>

      {/* Energy Balance */}
      <View style={styles.energyCard}>
        <View style={styles.energyHeader}>
          <View>
            <Text style={styles.energySub}>FUEL RESERVE</Text>
            <View style={styles.remainingRow}>
              <Text style={styles.remainingText}>{Math.max(0, calorieTarget - stats.calories).toLocaleString()}</Text>
              <Text style={styles.unitText}>KCAL</Text>
            </View>
          </View>
          <View style={styles.statusBox}>
            <View style={styles.pulse} />
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.statRow}>
            <View>
              <Text style={styles.statLabel}>LOGGED</Text>
              <Text style={styles.statValue}>{stats.calories.toLocaleString()}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statLabel}>CAP</Text>
              <Text style={styles.statValue}>{calorieTarget.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.mainBarTrack}>
            <View style={[styles.mainBarFill, { width: `${calPercentage}%` }]} />
          </View>
        </View>
      </View>

      {/* Macros */}
      <View style={styles.whiteCard}>
        <Text style={styles.cardHeader}>BIO-STATS PROFILE</Text>
        <ProgressBar label="Protein" current={stats.protein} target={150} color="#DC2626" />
        <ProgressBar label="Carbs" current={stats.carbs} target={220} color="#f87171" />
        <ProgressBar label="Lipids" current={stats.fat} target={65} color="#991b1b" />
      </View>

      <View style={styles.actionRow}>
        <View style={styles.waterBox}>
           <Text style={styles.waterVal}>{stats.water}ml</Text>
           <Text style={styles.waterLabel}>WATER INTAKE</Text>
        </View>
        <TouchableOpacity onPress={onAddClick} style={styles.scanBtn}>
          <Text style={styles.scanText}>VISUAL SCAN</Text>
          <Text style={styles.scanSub}>NEURAL IMAGING</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.historySection}>
        <Text style={styles.cardHeader}>DAILY FEED</Text>
        {logs.length === 0 ? (
          <View style={styles.emptyLogs}>
            <Text style={styles.emptyText}>Awaiting first log...</Text>
          </View>
        ) : (
          logs.map(log => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logImagePlaceholder}>
                {log.imageUrl ? <Image source={{ uri: log.imageUrl }} style={styles.fullImage} /> : <Text style={{ color: '#fee2e2' }}>🍴</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.logTitle}>{log.data.name}</Text>
                <Text style={styles.logCal}>{log.data.calories} kcal</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.logMacro}>+{log.data.protein}g</Text>
                <Text style={styles.macroSub}>PROTEIN</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  searchBar: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  searchText: { color: '#450a0a', fontWeight: '900', fontSize: 12, letterSpacing: 1.5 },
  energyCard: {
    backgroundColor: '#450a0a',
    borderRadius: 32,
    padding: 32,
    marginBottom: 24,
  },
  energySub: { color: '#ef4444', fontSize: 10, fontWeight: '900', fontStyle: 'italic', letterSpacing: 2 },
  remainingRow: { flexDirection: 'row', alignItems: 'baseline' },
  remainingText: { color: '#fff', fontSize: 60, fontWeight: '900', fontStyle: 'italic' },
  unitText: { color: '#f87171', fontWeight: '900', fontSize: 14, marginLeft: 8 },
  statusBox: { width: 40, height: 40, backgroundColor: 'rgba(220,38,38,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pulse: { width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: 4 },
  progressSection: { marginTop: 32 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { color: '#f87171', fontSize: 9, fontWeight: '900' },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '900', fontStyle: 'italic' },
  mainBarTrack: { height: 16, backgroundColor: '#7f1d1d', borderRadius: 8, padding: 2 },
  mainBarFill: { height: '100%', backgroundColor: '#ef4444', borderRadius: 6 },
  whiteCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, borderWidth: 2, borderColor: '#fef2f2', marginBottom: 24 },
  cardHeader: { fontSize: 10, fontWeight: '900', color: 'rgba(69,10,10,0.3)', fontStyle: 'italic', marginBottom: 20 },
  macroRow: { marginBottom: 16 },
  macroTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  macroLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(69,10,10,0.4)' },
  macroValue: { fontSize: 10, fontWeight: '900', color: '#450a0a' },
  barTrack: { height: 8, backgroundColor: '#fef2f2', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  waterBox: { flex: 1, backgroundColor: 'rgba(254,242,242,0.3)', borderRadius: 24, borderLeftWidth: 8, borderLeftColor: '#DC2626', padding: 20, justifyContent: 'center' },
  waterVal: { fontSize: 24, fontWeight: '900', fontStyle: 'italic', color: '#450a0a' },
  waterLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(220,38,38,0.5)' },
  scanBtn: { flex: 1, backgroundColor: '#DC2626', borderRadius: 24, padding: 20, alignItems: 'center', justifyContent: 'center' },
  scanText: { color: '#fff', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
  scanSub: { color: '#fecaca', fontSize: 10, fontWeight: '900', opacity: 0.6 },
  historySection: { gap: 12 },
  emptyLogs: { padding: 40, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#fee2e2', borderRadius: 24 },
  emptyText: { color: 'rgba(69,10,10,0.3)', fontWeight: '900', fontStyle: 'italic' },
  logItem: { backgroundColor: '#fff', padding: 16, borderRadius: 20, borderWidth: 2, borderColor: '#fef2f2', flexDirection: 'row', alignItems: 'center', gap: 16 },
  logImagePlaceholder: { width: 48, height: 48, backgroundColor: '#fef2f2', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  fullImage: { width: '100%', height: '100%', borderRadius: 12 },
  logTitle: { fontSize: 14, fontWeight: '900', color: '#450a0a' },
  logCal: { fontSize: 10, fontWeight: '900', fontStyle: 'italic', color: '#DC2626' },
  logMacro: { fontSize: 14, fontWeight: '900', fontStyle: 'italic', color: '#DC2626' },
  macroSub: { fontSize: 8, fontWeight: '900', color: 'rgba(69,10,10,0.4)' },
});

export default Dashboard;
