import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseAnalysisResult } from "../types";

// NOTE: In a production app, do not expose API keys on the client side.
// This is for demonstration purposes as a "Serverless" app.
// The user will need to provide their own key or a proxy should be used.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const analyzePlantImage = async (base64Image: string, language: string, symptoms?: string): Promise<DiseaseAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set REACT_APP_GEMINI_API_KEY or allow user input.");
  }

  // Remove data URL prefix if present
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

  const systemInstruction = `
    You are an expert agricultural plant pathologist and linguist. 
    Your task is to analyze plant images and provide diagnosis and advice.
    
    CRITICAL LANGUAGE REQUIREMENT: 
    The user has requested the response in ${language}.
    You MUST translate all descriptive fields (plant_name, disease_name, treatment_advice, prevention_tips, watering_advice) into ${language}.
    However, the 'status' field MUST remain in English (Healthy, Diseased, Uncertain) for programmatic use.
  `;

  const prompt = `
    Analyze this plant leaf image.
    ${symptoms ? `Additional user-reported symptoms: "${symptoms}".` : ''}
    
    Provide the output strictly in JSON format.
    
    Fields required:
    1. plant_name: The common name of the plant (in ${language}).
    2. status: One of "Healthy", "Diseased", "Uncertain".
    3. disease_name: The name of the disease (in ${language}), or "None" if healthy.
    4. confidence: A number between 0 and 100.
    5. treatment_advice: A practical guide to treating the disease (in ${language}).
    6. prevention_tips: A list of 2-3 tips to prevent recurrence (in ${language}).
    7. watering_advice: Specific watering instructions for this condition (in ${language}).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plant_name: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["Healthy", "Diseased", "Uncertain"] },
            disease_name: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            treatment_advice: { type: Type.STRING },
            prevention_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            watering_advice: { type: Type.STRING },
          },
          required: ["plant_name", "status", "treatment_advice", "confidence", "prevention_tips", "watering_advice"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as DiseaseAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};