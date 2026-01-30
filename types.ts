
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

export interface DailyStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export type View = 'dashboard' | 'camera' | 'history' | 'water';
