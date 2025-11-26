import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const solveMathProblem = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are a helpful and precise math assistant. 
        When the user asks a math question or sends an expression:
        1. Solve it accurately.
        2. If the problem is a simple calculation (e.g., "2 + 2", "15% of 80"), provide JUST the result as a number or short string.
        3. If the problem is a word problem or requires steps (e.g., "volume of a sphere with radius 5", "solve for x in 2x + 5 = 15"), provide the final answer clearly at the top, followed by a concise step-by-step explanation.
        4. Use Markdown for formatting (bolding the final answer).
        5. Be friendly but efficient.`,
      },
    });
    
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to solve problem using Gemini.");
  }
};