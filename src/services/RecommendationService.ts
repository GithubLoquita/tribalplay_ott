import { GoogleGenAI, Type } from "@google/genai";
import { ContentService } from "./ContentService";
import { HistoryService } from "./HistoryService";
import type { Content } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const RecommendationService = {
  async getRecommendations(userId: string): Promise<Content[]> {
    try {
      // 1. Get user watch history
      const history = await HistoryService.getUserHistory(userId);
      if (history.length === 0) {
        // If no history, return trending or random content
        const allContent = await ContentService.getAllContent();
        return allContent.slice(0, 10);
      }

      // 2. Get all available content metadata
      const allContent = await ContentService.getAllContent();
      
      // 3. Prepare the prompt for Gemini
      const watchedContentIds = history.map(h => h.contentId);
      const watchedContent = allContent.filter(c => watchedContentIds.includes(c.id));
      
      const watchedTitles = watchedContent.map(c => `${c.title} (${c.genre.join(', ')})`).join(', ');
      const availableContentList = allContent
        .filter(c => !watchedContentIds.includes(c.id))
        .map(c => ({ id: c.id, title: c.title, genre: c.genre, description: c.description }));

      const prompt = `
        Based on the user's watch history: [${watchedTitles}], 
        recommend the top 5 most relevant content from the following available list:
        ${JSON.stringify(availableContentList)}
        
        Return only the IDs of the recommended content in a JSON array.
      `;

      // 4. Call Gemini API
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

      const recommendedIds: string[] = JSON.parse(response.text || '[]');
      
      // 5. Map IDs back to Content objects
      return allContent.filter(c => recommendedIds.includes(c.id));
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Fallback to trending content
      const allContent = await ContentService.getAllContent();
      return allContent.slice(0, 10);
    }
  }
};
