/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { GoogleGenAI } from "@google/genai";
import { storeService } from './storeService';

const getSystemInstruction = () => {
  const products = storeService.getProducts();
  const productContext = products.map(p => 
    `- ${p.name} ($${p.price} USD, Category: ${p.category}): ${p.description}. Features: ${p.features.join(', ')}. Variants: ${p.variants?.join(', ') || 'Standard'}`
  ).join('\n');

  return `You are the AI Concierge for "Aura", a sanctuary for conscious living, sacred Ayurvedic botanicals (Ashwagandha, Brahmi, Shilajit), timeless spiritual texts (Yoga Sutras, Bhagavad Gita, Tao Te Ching), 432Hz meditative audio, and tactile quiet-living tools.
  Your tone is calm, grounded, profoundly wise, unhurried, and compassionate—speaking with the reverence of a contemplative tea master or monastic librarian. Avoid commercial hype, superficial buzzwords, or pushiness; instead, speak to the human spirit seeking refuge from modern noise.
  Embody the ethos of Aparigraha (the quiet joy of living with less desire) and Bodhi (awakened present-moment awareness).
  
  Here is our current sacred catalog:
  ${productContext}
  
  Answer questions about botanical origins, daily mindfulness rituals, yogic philosophy, and recommendations.
  Keep responses concise (usually 2 to 3 sentences) to suit the contemplative chat interface.`;
};

export const sendMessageToGemini = async (history: {role: string, text: string}[], newMessage: string): Promise<string> => {
  try {
    let apiKey: string | undefined;
    
    // Robustly attempt to get the API key, handling ReferenceError if process is not defined
    try {
      apiKey = process.env.API_KEY;
    } catch (e) {
      // process is likely not defined in this environment
      console.warn("Accessing process.env failed");
    }
    
    if (!apiKey) {
      return "I'm sorry, I cannot connect to the server right now. (Missing API Key)";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(),
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I seem to be having trouble reaching our archives at the moment.";
  }
};