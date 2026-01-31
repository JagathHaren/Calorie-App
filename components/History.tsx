
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { FoodLog, UserPreferences, DailySummary } from '../types';
import { formatWeight } from '../utils/converters';

interface HistoryProps {
  logs: FoodLog[];
  summaries: Record<string, DailySummary>;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: any) => void;
  prefs: UserPreferences;
}

const History: React.FC<HistoryProps> = ({ logs, summaries, onDelete, onEdit, prefs }) => {
  const [showSummary, setShowSummary] = useState(false);

  const groupedLogs = logs.reduce((groups: { [key: string]: FoodLog[] }, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(log);
    return groups;
  }, {});

  const logDates = Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const summaryDates = Object.keys(summaries).sort((a, b) => b.localeCompare(a));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>ARCHIVE SYSTEM</Text>
          <Text style={styles.headerTitle}>ACTIVITY</Text>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            onPress={() => setShowSummary(false)}
            style={[styles.toggleBtn, !showSummary && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, !showSummary && styles.toggleTextActive]}>7 DAYS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowSummary(true)}
            style={[styles.toggleBtn, showSummary && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, showSummary && styles.toggleTextActive]}>30 DAYS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {showSummary ? (
          <View style={styles.summaryView}>
            <View style={styles.performanceCard}>
              <Text style={styles.perfTitle}>30-DAY EFFICIENCY SCAN</Text>
              <View style={styles.grid}>
                {[...Array(30)].map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (29 - i));
                  const dStr = d.toISOString().split('T')[0];
                  const hasData = summaries[dStr];
                  return (
                    <View 
                      key={i} 
                      style={[
                        styles.gridCell, 
                        hasData ? styles.gridCellActive : styles.gridCellEmpty,
                        hasData && hasData.calories > prefs.calorieGoal && styles.gridCellOver
                      ]} 
                    />
                  );
                })}
              </View>
              <View style={styles.gridLegend}>
                <Text style={styles.legendText}>T-30 DAYS</Text>
                <Text style={styles.legendText}>ACTIVE</Text>
              </View>
            </View>

            {summaryDates.map(dateStr => {
              const s = summaries[dateStr];
              return (
                <View key={dateStr} style={styles.summaryItem}>
                  <View>
                    <Text style={styles.itemDate}>{dateStr}</Text>
                    <Text style={styles.itemCals}>{s.calories.toLocaleString()} <Text style={styles.itemUnit}>KCAL</Text></Text>
                  </View>
                  <View style={styles.macroPills}>
                    <View style={styles.pill}><Text style={styles.pillVal}>{s.protein}g</Text><Text style={styles.pillLab}>P</Text></View>
                    <View style={styles.pill}><Text style={styles.pillVal}>{s.carbs}g</Text><Text style={styles.pillLab}>C</Text></View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.detailsView}>
            {logDates.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>NO SESSIONS RECORDED</Text>
              </View>
            ) : (
              logDates.map(date => (
                <View key={date} style={styles.dateGroup}>
                  <Text style={styles.dateTitle}>{date}</Text>
                  {groupedLogs[date].map(log => (
                    <View key={log.id} style={styles.logCard}>
                      <View style={styles.logImage}>
                        {log.imageUrl ? <Image source={{ uri: log.imageUrl }} style={styles.fullImg} /> : <Text>🍴</Text>}
                      </View>
                      <View style={styles.logMeta}>
                        <View style={styles.logHeader}>
                          <Text style={styles.logName}>{log.data.name}</Text>
                          <TouchableOpacity onPress={() => onDelete(log.id)}>
                            <Text style={styles.deleteBtn}>✕</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.logFooter}>
                          <Text style={styles.logCals}>{log.data.calories} KCAL</Text>
                          <Text style={styles.logWeight}>{formatWeight(log.data.estimatedWeight, prefs.weightUnit)}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerSub: { color: '#dc2626', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  headerTitle: { color: '#450a0a', fontSize: 32, fontWeight: '900', fontStyle: 'italic' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#fef2f2', padding: 4, borderRadius: 12 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#dc2626' },
  toggleText: { fontSize: 10, fontWeight: '900', color: '#991b1b' },
  toggleTextActive: { color: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  summaryView: { gap: 16 },
  performanceCard: { backgroundColor: '#450a0a', borderRadius: 24, padding: 24, borderBottomWidth: 4, borderBottomColor: '#dc2626' },
  perfTitle: { color: '#f87171', fontSize: 9, fontWeight: '900', letterSpacing: 2, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  gridCell: { width: 14, height: 14, borderRadius: 3, borderWidth: 1 },
  gridCellEmpty: { backgroundColor: 'rgba(220,38,38,0.1)', borderColor: 'rgba(220,38,38,0.2)' },
  gridCellActive: { backgroundColor: '#fff', borderColor: '#fff' },
  gridCellOver: { backgroundColor: '#dc2626', borderColor: '#f87171' },
  gridLegend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  legendText: { color: 'rgba(248,113,113,0.4)', fontSize: 8, fontWeight: '900' },
  summaryItem: { backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 2, borderColor: '#fef2f2', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemDate: { color: 'rgba(69,10,10,0.3)', fontSize: 10, fontWeight: '900' },
  itemCals: { fontSize: 20, fontWeight: '900', fontStyle: 'italic', color: '#450a0a' },
  itemUnit: { fontSize: 10, color: '#dc2626', fontStyle: 'normal' },
  macroPills: { flexDirection: 'row', gap: 8 },
  pill: { backgroundColor: '#fef2f2', padding: 8, borderRadius: 12, alignItems: 'center', minWidth: 40 },
  pillVal: { fontSize: 10, fontWeight: '900', color: '#450a0a' },
  pillLab: { fontSize: 8, fontWeight: '900', color: '#dc2626' },
  detailsView: { gap: 24 },
  dateTitle: { fontSize: 10, fontWeight: '900', color: 'rgba(69,10,10,0.2)', letterSpacing: 3, marginLeft: 8 },
  logCard: { backgroundColor: '#fff', padding: 16, borderRadius: 24, borderWidth: 2, borderColor: '#fef2f2', flexDirection: 'row', gap: 16 },
  logImage: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center' },
  fullImg: { width: '100%', height: '100%', borderRadius: 16 },
  logMeta: { flex: 1, justifyContent: 'center' },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  logName: { fontSize: 16, fontWeight: '900', fontStyle: 'italic', color: '#450a0a' },
  deleteBtn: { color: 'rgba(69,10,10,0.2)', fontWeight: '900' },
  logFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  logCals: { color: '#dc2626', fontWeight: '900', fontSize: 12, fontStyle: 'italic' },
  logWeight: { color: 'rgba(69,10,10,0.4)', fontSize: 10, fontWeight: '900' },
  emptyContainer: { padding: 80, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#fee2e2', borderRadius: 32 },
  emptyText: { color: 'rgba(220,38,38,0.2)', fontSize: 10, fontWeight: '900' },
});

export default History;
