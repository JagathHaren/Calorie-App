
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData, Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const nutritionSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the food item or main dish" },
    calories: { type: Type.NUMBER, description: "Total calories" },
    protein: { type: Type.NUMBER, description: "Protein in grams" },
    carbs: { type: Type.NUMBER, description: "Carbohydrates in grams" },
    fat: { type: Type.NUMBER, description: "Total fat in grams" },
    vitamins: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of prominent vitamins/minerals"
    },
    estimatedWeight: { type: Type.STRING, description: "Estimated weight in a simple format like '250g'. Always use 'g' as the base unit." }
  },
  required: ["name", "calories", "protein", "carbs", "fat", "vitamins", "estimatedWeight"]
};

export const analyzeFoodImage = async (base64Image: string, userContext?: string): Promise<NutritionData> => {
  const model = "gemini-3-flash-preview";
  const contextPrompt = userContext ? `The user provided extra context: "${userContext}". Use this to improve accuracy.` : "";
  const prompt = `Analyze this food image in detail. 1. Identify food items. 2. Estimate nutritional content. 3. List vitamins. 4. Estimate weight (return ONLY a format like '250g'). ${contextPrompt} Return JSON.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: nutritionSchema
    }
  });

  return JSON.parse(response.text || '{}') as NutritionData;
};

export const analyzeFoodText = async (query: string): Promise<NutritionData> => {
  const model = "gemini-3-flash-preview";
  const prompt = `Act as a nutrition expert. Analyze the following meal description: "${query}". 
  Provide precise nutritional estimates for the entire description combined.
  Return weight ONLY in 'Xg' format.
  Return the result as a valid JSON object.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: nutritionSchema
    }
  });

  return JSON.parse(response.text || '{}') as NutritionData;
};

export const generateRecipes = async (): Promise<Recipe[]> => {
  const model = "gemini-3-flash-preview";
  const prompt = "Generate 3 healthy and creative recipe blog posts. Each should have a title, summary, full content (markdown), tags, and calories per serving. Return as a JSON array.";

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            content: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            caloriesPerServing: { type: Type.NUMBER }
          },
          required: ["id", "title", "summary", "content", "tags", "caloriesPerServing"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};
