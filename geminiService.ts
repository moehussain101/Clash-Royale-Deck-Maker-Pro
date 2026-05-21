import { GoogleGenAI, Type } from "@google/genai";
import { Card } from "../data/cards";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface DeckAnalysis {
  vulnerabilities: string[];
  recommendations: string[];
  winRateEstimate: number;
  explanation: string;
  stats: {
    attack: number;
    defense: number;
    synergy: number;
    versatility: number;
    f2pScore: number;
  };
  tips: {
    type: 'problem' | 'warning';
    message: string;
  }[];
}

export const analyzeDeck = async (selectedCards: Card[]): Promise<DeckAnalysis | null> => {
  if (selectedCards.length === 0) return null;

  const cardList = selectedCards.map(c => `${c.name} (${c.type}, ${c.elixir} Elixir)`).join(", ");
  
  const prompt = `Analyze the following Clash Royale deck: ${cardList}.
  Provide:
  1. Common vulnerabilities or weaknesses (e.g., weak against splash, lack of air defense).
  2. Recommendations for cards to swap to improve the deck.
  3. An estimated win rate percentage (0-100) based on meta synergy.
  4. A brief explanation of the deck's playstyle.
  5. Ratings from 0 to 10 for: Attack strength, Defensive capability, Overall Synergy, Versatility (how it handles different matchups), and F2P score.
  6. A list of "Deck Tips" reflecting specific issues or warnings. Label them as either "problem" (critical issues like no win condition, no air defense) or "warning" (minor issues like high average elixir, lack of a specific spell type).
  
  Return the result as a JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vulnerabilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of deck weaknesses"
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Suggested changes"
            },
            winRateEstimate: {
              type: Type.NUMBER,
              description: "Estimated win rate percentage"
            },
            explanation: {
              type: Type.STRING,
              description: "Playstyle explanation"
            },
            stats: {
              type: Type.OBJECT,
              properties: {
                attack: { type: Type.NUMBER },
                defense: { type: Type.NUMBER },
                synergy: { type: Type.NUMBER },
                versatility: { type: Type.NUMBER },
                f2pScore: { type: Type.NUMBER }
              },
              required: ["attack", "defense", "synergy", "versatility", "f2pScore"]
            },
            tips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["problem", "warning"] },
                  message: { type: Type.STRING }
                },
                required: ["type", "message"]
              }
            }
          },
          required: ["vulnerabilities", "recommendations", "winRateEstimate", "explanation", "stats", "tips"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as DeckAnalysis;
  } catch (error) {
    console.error("Error analyzing deck:", error);
    return null;
  }
};

export const getSimilarDecks = async (selectedCards: Card[]): Promise<string[] | null> => {
  if (selectedCards.length === 0) return null;

  const cardList = selectedCards.map(c => c.name).join(", ");
  const prompt = `Given these cards in a Clash Royale deck: ${cardList}, suggest 3 popular meta decks that are similar or use these cards. Return only the names of the archetypes or identifying card sets as an array of strings.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error fetching similar decks:", error);
    return [];
  }
};

export const generateDeckFromPrompt = async (promptText: string, availableCardNames: string[]): Promise<string[]> => {
  const prompt = `You are a Clash Royale deck-building expert. The user wants a deck based on the following preferences/playstyle:
"${promptText}"

Create an optimal, balanced 8-card Clash Royale deck that strictly fits this playstyle. 
- You MUST select exactly 8 cards from the provided list of available cards.
- Only output the exact names of the cards from the list, returned as an array of strictly 8 strings.
- Do NOT include any card that is not in the available card list.

Available cards:
${availableCardNames.join(", ")}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating deck from prompt:", error);
    return [];
  }
};
