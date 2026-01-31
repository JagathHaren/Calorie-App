
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { analyzeFoodText } from '../services/geminiService';
import { NutritionData, FoodLog } from '../types';

interface SearchFoodProps {
  onLogAdded: (log: FoodLog) => void;
  onBack: () => void;
}

const SearchFood: React.FC<SearchFoodProps> = ({ onLogAdded, onBack }) => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeFoodText(query);
      setAnalysisResult(result);
    } catch (err: any) {
      setError("Analysis incomplete. Provide precise portions.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addTag = (text: string) => {
    setQuery(prev => prev ? `${prev}, ${text}` : text);
  };

  const confirmLog = () => {
    if (analysisResult) {
      onLogAdded({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        data: analysisResult,
        type: 'manual'
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>COMMAND CONSOLE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {!analysisResult ? (
          <View style={styles.inputView}>
            <View style={styles.tagRow}>
              {['Lean Protein', 'Fast Carbs', 'Cheat Day', 'Fiber Boost'].map(tag => (
                <TouchableOpacity key={tag} onPress={() => addTag(tag)} style={styles.tagBtn}>
                  <Text style={styles.tagText}>+ {tag.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.consoleContainer}>
              <View style={styles.consoleHeader}>
                <Text style={styles.consoleLabel}>NEURAL PROMPT</Text>
                <View style={styles.indicator} />
              </View>
              <TextInput
                multiline
                value={query}
                onChangeText={setQuery}
                placeholder="e.g. 150g Ribeye steak, grilled mushrooms, half avocado"
                placeholderTextColor="rgba(220, 38, 38, 0.2)"
                style={styles.consoleInput}
              />
              <Text style={styles.consoleFooter}>READY FOR INPUT...</Text>
            </View>

            <TouchableOpacity 
              onPress={handleSearch}
              disabled={!query.trim() || isAnalyzing}
              style={[styles.executeBtn, (!query.trim() || isAnalyzing) && styles.executeBtnDisabled]}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.executeText}>EXECUTE SCAN</Text>
              )}
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        ) : (
          <View style={styles.resultView}>
            <View style={styles.resultCard}>
              <Text style={styles.resultName}>{analysisResult.name}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.weightBadge}><Text style={styles.weightText}>{analysisResult.estimatedWeight}</Text></View>
                <Text style={styles.profileText}>COMPUTED PROFILE</Text>
              </View>

              <View style={styles.energyDisplay}>
                <Text style={styles.calBig}>{analysisResult.calories}</Text>
                <Text style={styles.calLabel}>TOTAL ENERGY OUTPUT</Text>
              </View>

              <View style={styles.macroGrid}>
                <View style={styles.macroBox}>
                  <Text style={styles.macroVal}>{analysisResult.protein}g</Text>
                  <Text style={styles.macroLab}>PROTEIN</Text>
                </View>
                <View style={styles.macroBox}>
                  <Text style={styles.macroVal}>{analysisResult.carbs}g</Text>
                  <Text style={styles.macroLab}>CARBS</Text>
                </View>
                <View style={styles.macroBox}>
                  <Text style={styles.macroVal}>{analysisResult.fat}g</Text>
                  <Text style={styles.macroLab}>LIPIDS</Text>
                </View>
              </View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity onPress={() => setAnalysisResult(null)} style={styles.discardBtn}>
                <Text style={styles.discardText}>DISCARD</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmLog} style={styles.applyBtn}>
                <Text style={styles.applyText}>APPLY TO LOG</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#450a0a' },
  backBtn: { backgroundColor: '#dc2626', padding: 8, borderRadius: 12 },
  backIcon: { color: '#fff', fontSize: 20, fontWeight: '900' },
  headerTitle: { color: '#450a0a', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 60 },
  inputView: { gap: 24 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderWidth: 2, borderColor: '#fee2e2', borderRadius: 12 },
  tagText: { color: '#dc2626', fontSize: 9, fontWeight: '900' },
  consoleContainer: { backgroundColor: '#450a0a', borderRadius: 32, padding: 24, minHeight: 300, borderWidth: 4, borderColor: '#7f1d1d' },
  consoleHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  consoleLabel: { color: '#ef4444', fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  indicator: { width: 8, height: 8, backgroundColor: '#dc2626', borderRadius: 4 },
  consoleInput: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic', flex: 1, textAlignVertical: 'top' },
  consoleFooter: { color: '#7f1d1d', fontSize: 9, fontWeight: '900', marginTop: 10 },
  executeBtn: { backgroundColor: '#dc2626', padding: 24, borderRadius: 24, alignItems: 'center', shadowColor: '#450a0a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0 },
  executeBtnDisabled: { opacity: 0.5 },
  executeText: { color: '#fff', fontWeight: '900', letterSpacing: 2 },
  errorText: { color: '#dc2626', textAlign: 'center', fontWeight: '900', fontSize: 10 },
  resultView: { gap: 20 },
  resultCard: { backgroundColor: '#fff', borderRadius: 32, padding: 32, borderWidth: 4, borderColor: '#450a0a' },
  resultName: { fontSize: 32, fontWeight: '900', fontStyle: 'italic', color: '#450a0a' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  weightBadge: { backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  weightText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  profileText: { color: '#dc2626', fontSize: 10, fontWeight: '900', opacity: 0.4 },
  energyDisplay: { backgroundColor: '#450a0a', padding: 32, borderRadius: 24, alignItems: 'center', marginVertical: 24 },
  calBig: { fontSize: 64, fontWeight: '900', color: '#fff', fontStyle: 'italic' },
  calLabel: { color: '#ef4444', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  macroGrid: { flexDirection: 'row', gap: 12 },
  macroBox: { flex: 1, backgroundColor: '#fef2f2', padding: 16, borderRadius: 16, alignItems: 'center' },
  macroVal: { fontSize: 18, fontWeight: '900', fontStyle: 'italic', color: '#450a0a' },
  macroLab: { fontSize: 8, fontWeight: '900', color: 'rgba(69,10,10,0.4)', marginTop: 4 },
  btnRow: { flexDirection: 'row', gap: 12 },
  discardBtn: { flex: 1, padding: 20, borderWidth: 4, borderColor: '#450a0a', borderRadius: 24, alignItems: 'center' },
  discardText: { color: '#450a0a', fontWeight: '900' },
  applyBtn: { flex: 2, padding: 20, backgroundColor: '#dc2626', borderRadius: 24, alignItems: 'center' },
  applyText: { color: '#fff', fontWeight: '900' },
});

export default SearchFood;
