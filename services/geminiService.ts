
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this food image in detail. 
  1. Identify the food items present.
  2. Estimate the nutritional content (calories, protein in grams, carbs in grams, fat in grams).
  3. List key vitamins or minerals present.
  4. Estimate the total weight of the portion.
  If it's a barcode or nutrition label, extract the information directly.
  Return the result as a valid JSON object.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
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
          estimatedWeight: { type: Type.STRING, description: "Estimated weight (e.g., 250g)" }
        },
        required: ["name", "calories", "protein", "carbs", "fat", "vitamins", "estimatedWeight"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as NutritionData;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Could not analyze nutrition from image.");
  }
};
