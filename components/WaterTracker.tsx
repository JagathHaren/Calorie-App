
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { UserPreferences } from '../types';

interface WaterTrackerProps {
  current: number;
  prefs: UserPreferences;
  onUpdate: (amount: number) => void;
}

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;
const RADIUS = (CIRCLE_SIZE - 40) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const WaterTracker: React.FC<WaterTrackerProps> = ({ current, prefs, onUpdate }) => {
  const goal = prefs.waterGoal || 2500;
  const isOz = prefs.liquidUnit === 'oz';
  
  const displayCurrent = isOz ? (current / 29.574).toFixed(1) : current;
  const displayGoal = isOz ? (goal / 29.574).toFixed(0) : goal;
  const unitLabel = isOz ? 'oz' : 'ml';
  const percentage = Math.min((current / goal) * 100, 100);
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * percentage / 100);

  const presets = isOz 
    ? [{ amount: 150, label: '5 oz', icon: '🥛' }, { amount: 250, label: '8 oz', icon: '🥛' }, { amount: 500, label: '17 oz', icon: '🍷' }]
    : [{ amount: 150, label: '150ml', icon: '🥛' }, { amount: 250, label: '250ml', icon: '🥛' }, { amount: 500, label: '500ml', icon: '🍷' }];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>HYDRATION MATRIX</Text>
        <Text style={styles.headerTitle}>BIO-LIQUID</Text>
        <Text style={styles.targetText}>TARGET: {displayGoal}{unitLabel}</Text>
      </View>

      <View style={styles.visualizerContainer}>
        {/* Decorative Glow */}
        <View style={[styles.glow, { opacity: 0.1 + (percentage / 200) }]} />
        
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
          <G rotation="-90" origin={`${CIRCLE_SIZE/2}, ${CIRCLE_SIZE/2}`}>
            {/* Background Circle */}
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              stroke="#fee2e2"
              strokeWidth="20"
              fill="transparent"
            />
            {/* Progress Circle */}
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              stroke="#DC2626"
              strokeWidth="20"
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>

        <View style={styles.innerVessel}>
          <View style={[styles.liquidFill, { height: `${percentage}%` }]} />
          <View style={styles.statsOverlay}>
            <Text style={styles.currentVal}>{displayCurrent}</Text>
            <Text style={styles.unitVal}>{unitLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.presetRow}>
          {presets.map((p, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => onUpdate(p.amount)} 
              style={styles.presetBtn}
            >
              <Text style={styles.presetIcon}>{p.icon}</Text>
              <Text style={styles.presetLabel}>+{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          onPress={() => onUpdate(-100)} 
          style={styles.correctionBtn}
        >
          <Text style={styles.correctionText}>VOLUME CORRECTION</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, alignItems: 'center', paddingBottom: 120 },
  header: { alignItems: 'center', marginVertical: 30 },
  headerSub: { color: '#dc2626', fontSize: 10, fontWeight: '900', letterSpacing: 4, fontStyle: 'italic' },
  headerTitle: { color: '#450a0a', fontSize: 44, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1 },
  targetText: { color: 'rgba(69,10,10,0.3)', fontSize: 10, fontWeight: '900', marginTop: 10, letterSpacing: 2 },
  visualizerContainer: { width: CIRCLE_SIZE, height: CIRCLE_SIZE, alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  glow: { position: 'absolute', width: CIRCLE_SIZE * 0.8, height: CIRCLE_SIZE * 0.8, backgroundColor: '#dc2626', borderRadius: CIRCLE_SIZE, opacity: 0.1 },
  innerVessel: { position: 'absolute', width: CIRCLE_SIZE - 60, height: CIRCLE_SIZE - 60, borderRadius: CIRCLE_SIZE, backgroundColor: '#fef2f2', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWeight: 8, borderColor: '#fff' },
  liquidFill: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(220, 38, 38, 0.4)' },
  statsOverlay: { alignItems: 'center' },
  currentVal: { fontSize: 72, fontWeight: '900', color: '#450a0a', fontStyle: 'italic', lineHeight: 72 },
  unitVal: { fontSize: 14, fontWeight: '900', color: '#dc2626', letterSpacing: 2 },
  controls: { width: '100%', gap: 20, marginTop: 40 },
  presetRow: { flexDirection: 'row', gap: 12 },
  presetBtn: { flex: 1, backgroundColor: '#fff', borderWeight: 4, borderColor: '#450a0a', borderRadius: 24, padding: 20, alignItems: 'center', shadowColor: '#991b1b', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  presetIcon: { fontSize: 24, marginBottom: 4 },
  presetLabel: { fontSize: 10, fontWeight: '900', color: '#450a0a' },
  correctionBtn: { width: '100%', backgroundColor: '#450a0a', padding: 24, borderRadius: 24, alignItems: 'center' },
  correctionText: { color: '#fff', fontWeight: '900', fontSize: 10, letterSpacing: 3 },
});

export default WaterTracker;
