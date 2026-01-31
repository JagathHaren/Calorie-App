
import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types';

interface SettingsProps {
  prefs: UserPreferences;
  onPrefsChange: (prefs: UserPreferences) => void;
}

const Settings: React.FC<SettingsProps> = ({ prefs, onPrefsChange }) => {
  const handleReset = () => {
    Alert.alert(
      "FACTORY RESET",
      "This will erase all local journal entries. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Wipe Memory", 
          style: "destructive", 
          onPress: async () => {
            await AsyncStorage.clear();
            // In a real app we'd reload or reset state
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>SYSTEMS CONTROL</Text>
        <Text style={styles.headerTitle}>SETTINGS</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TARGET METRICS</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ENERGY OBJECTIVE (DAILY)</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                value={prefs.calorieGoal.toString()}
                onChangeText={(v) => onPrefsChange({ ...prefs, calorieGoal: parseInt(v) || 0 })}
                keyboardType="numeric"
              />
              <Text style={styles.inputSuffix}>KCAL</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>HYDRATION OBJECTIVE</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                value={prefs.waterGoal.toString()}
                onChangeText={(v) => onPrefsChange({ ...prefs, waterGoal: parseInt(v) || 0 })}
                keyboardType="numeric"
              />
              <Text style={styles.inputSuffix}>{prefs.liquidUnit.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.whiteCard}>
          <View style={styles.prefRow}>
            <View>
              <Text style={styles.prefMain}>MASS UNIT</Text>
              <Text style={styles.prefSub}>Food Weight</Text>
            </View>
            <View style={styles.unitToggle}>
              <TouchableOpacity 
                onPress={() => onPrefsChange({ ...prefs, weightUnit: 'g' })}
                style={[styles.unitBtn, prefs.weightUnit === 'g' && styles.unitBtnActive]}
              >
                <Text style={[styles.unitText, prefs.weightUnit === 'g' && styles.unitTextActive]}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => onPrefsChange({ ...prefs, weightUnit: 'oz' })}
                style={[styles.unitBtn, prefs.weightUnit === 'oz' && styles.unitBtnActive]}
              >
                <Text style={[styles.unitText, prefs.weightUnit === 'oz' && styles.unitTextActive]}>OZ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
        <Text style={styles.resetText}>WIPE LOCAL MEMORY</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>NUTRILENS ENGINE V2.5</Text>
        <Text style={styles.footerSub}>ADVANCED BIO-LOGIC MATRIX</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  header: { marginBottom: 32, marginTop: 20 },
  headerSub: { color: '#dc2626', fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  headerTitle: { color: '#450a0a', fontSize: 40, fontWeight: '900', fontStyle: 'italic' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: 'rgba(69,10,10,0.2)', letterSpacing: 4, marginBottom: 12, marginLeft: 8 },
  card: { backgroundColor: '#fef2f2', borderRadius: 32, padding: 24, gap: 24, borderWidth: 2, borderColor: 'rgba(220,38,38,0.05)' },
  inputGroup: { gap: 8 },
  label: { fontSize: 10, fontWeight: '900', color: 'rgba(69,10,10,0.5)', letterSpacing: 1 },
  inputWrapper: { position: 'relative' },
  input: { backgroundColor: '#fff', borderRadius: 20, padding: 20, fontSize: 24, fontWeight: '900', fontStyle: 'italic', color: '#450a0a', borderWidth: 4, borderColor: '#fee2e2' },
  inputSuffix: { position: 'absolute', right: 20, top: 24, color: '#dc2626', fontSize: 12, fontWeight: '900', opacity: 0.4 },
  whiteCard: { backgroundColor: '#fff', borderRadius: 32, padding: 24, borderWidth: 4, borderColor: '#fef2f2' },
  prefRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prefMain: { fontSize: 18, fontWeight: '900', color: '#450a0a', fontStyle: 'italic' },
  prefSub: { fontSize: 10, fontWeight: '900', color: 'rgba(220,38,38,0.4)', marginTop: 2 },
  unitToggle: { flexDirection: 'row', backgroundColor: '#fef2f2', padding: 4, borderRadius: 16 },
  unitBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  unitBtnActive: { backgroundColor: '#dc2626' },
  unitText: { fontSize: 12, fontWeight: '900', color: 'rgba(69,10,10,0.3)' },
  unitTextActive: { color: '#fff' },
  resetBtn: { backgroundColor: '#450a0a', borderRadius: 24, padding: 24, alignItems: 'center', marginTop: 10 },
  resetText: { color: '#f87171', fontWeight: '900', fontSize: 12, letterSpacing: 3 },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { color: 'rgba(220,38,38,0.3)', fontSize: 10, fontWeight: '900', letterSpacing: 4 },
  footerSub: { color: 'rgba(220,38,38,0.1)', fontSize: 8, fontWeight: '900', marginTop: 4 },
});

export default Settings;
