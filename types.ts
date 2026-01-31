
export interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitamins: string[];
  estimatedWeight: string; 
}

export interface FoodLog {
  id: string;
  timestamp: number;
  data: NutritionData;
  imageUrl?: string;
  type: 'photo' | 'manual' | 'barcode';
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  caloriesPerServing: number;
  imageUrl?: string;
}

export interface DailyStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface UserPreferences {
  weightUnit: 'g' | 'oz';
  liquidUnit: 'ml' | 'oz';
  calorieGoal: number;
  waterGoal: number;
}

export type View = 'dashboard' | 'camera' | 'history' | 'water' | 'search' | 'settings' | 'recipes';
