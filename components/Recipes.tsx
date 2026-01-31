
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { generateRecipes } from '../services/geminiService';
import { Recipe } from '../types';

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await generateRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Failed to load recipes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (selectedRecipe) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => setSelectedRecipe(null)} style={styles.backBtn}>
          <Text style={styles.backText}>← RETURN TO FEED</Text>
        </TouchableOpacity>
        <Text style={styles.articleTitle}>{selectedRecipe.title}</Text>
        <View style={styles.tagRow}>
          {selectedRecipe.tags.map(tag => (
            <View key={tag} style={styles.tag}><Text style={styles.tagText}>#{tag}</Text></View>
          ))}
          <View style={styles.calPill}><Text style={styles.calPillText}>{selectedRecipe.caloriesPerServing} KCAL</Text></View>
        </View>
        <Text style={styles.articleContent}>{selectedRecipe.content}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>KNOWLEDGE MATRIX</Text>
        <Text style={styles.headerTitle}>NUTRITION FEED</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text style={styles.loaderText}>CURATING ARTICLES...</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {recipes.map(recipe => (
            <TouchableOpacity 
              key={recipe.id} 
              onPress={() => setSelectedRecipe(recipe)}
              style={styles.recipeCard}
            >
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeSummary}>{recipe.summary}</Text>
              <View style={styles.recipeFooter}>
                <Text style={styles.readMore}>READ ARTICLE →</Text>
                <View style={styles.calTag}><Text style={styles.calTagText}>{recipe.caloriesPerServing} KCAL</Text></View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  header: { marginBottom: 32, marginTop: 20 },
  headerSub: { color: '#dc2626', fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  headerTitle: { color: '#450a0a', fontSize: 32, fontWeight: '900', fontStyle: 'italic' },
  loader: { padding: 100, alignItems: 'center', justifyContent: 'center' },
  loaderText: { marginTop: 20, fontSize: 10, fontWeight: '900', color: 'rgba(220,38,38,0.3)', letterSpacing: 2 },
  grid: { gap: 20 },
  recipeCard: { backgroundColor: '#fff', borderRadius: 32, padding: 24, borderWidth: 3, borderColor: '#fef2f2', shadowColor: '#dc2626', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20 },
  recipeTitle: { fontSize: 24, fontWeight: '900', fontStyle: 'italic', color: '#450a0a', marginBottom: 12 },
  recipeSummary: { fontSize: 14, color: '#991b1b', opacity: 0.6, marginBottom: 20, lineHeight: 20 },
  recipeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  readMore: { color: '#dc2626', fontWeight: '900', fontSize: 10, letterSpacing: 1 },
  calTag: { backgroundColor: '#fef2f2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  calTagText: { fontSize: 10, fontWeight: '900', color: '#450a0a' },
  backBtn: { marginBottom: 24, marginTop: 20 },
  backText: { color: '#dc2626', fontWeight: '900', fontSize: 10, letterSpacing: 2 },
  articleTitle: { fontSize: 40, fontWeight: '900', color: '#450a0a', fontStyle: 'italic', lineHeight: 44, marginBottom: 16 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  tag: { backgroundColor: '#450a0a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  calPill: { backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  calPillText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  articleContent: { fontSize: 16, color: '#450a0a', lineHeight: 26, fontWeight: '500' },
});

export default Recipes;
