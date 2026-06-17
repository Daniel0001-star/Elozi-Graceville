/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json());

// Initialize Gemini client lazily and safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes('MY_GEMINI_API_KEY') || key.trim() === '') {
      throw new Error('GEMINI_API_KEY is not configured or is set to default placeholder.');
    }
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// Ensure database/backend endpoints are listed first!
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    isGeminiConfigured: !!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY')
  });
});

/**
 * Endpoint for AI Smart Shopping Assistant Chat.
 * We pass the product catalog, user query or chat history,
 * and get a beautifully styled recommendation or answers from Gemini 3.5 Flash.
 */
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, catalog } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid message stream format requested.' });
    }

    const client = getGeminiClient();
    
    // Format catalog description so the AI can suggest actual items in stock!
    const catalogSnippet = catalog && Array.isArray(catalog) && catalog.length > 0
      ? `Inventory currently in stock:\n${catalog.map(p => `- ID: ${p.id}, "${p.name}" in category "${p.category}", Price: ${p.price.toLocaleString()} NGN. Description: ${p.description}`).join('\n')}`
      : 'No live products in the stock currently. Suggest apparel, accessories, footwear from Elozi-Graceville catalogs!';

    // Setup strong context system instruction
    const systemInstruction = `You are a charismatic, sophisticated, and helpful AI Shopping Consultant for "Elozi-Graceville" - a premium multi-category retail destination.
Elozi-Graceville bridges fashion-forward apparel, exquisite accessories, durable footwear, school specialties, elegant home appliances & decor, and self-care daily wellness.

Your goal is to guide customers, identify their styles, and suggest matching items from our live database snippet when available. If not, suggest items from recommended retail groups with friendly hospitality.
Always keep descriptions elegant and compact. Use direct, clear lists. 
Mention pricing in NGN (₦) if referring to actual items in stock.
Keep answers concise, modern, and engaging.

${catalogSnippet}`;

    // Get the latest history and query
    const userMessage = messages[messages.length - 1];

    // Generate output with gemini-3.5-flash as specified in gemini-api skill rules
    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userMessage.content,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    const aiResponseText = response.text || "I apologize, I am unable to process your request at the moment. How else can I assist you with Elozi-Graceville's beautiful collections?";

    return res.json({ response: aiResponseText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Server-side AI processing failure.',
      isFallbackMode: true 
    });
  }
});

// Setup Vite Dev server middleware or Production Static file serving
async function startAppServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Dev Engine] Vite dev middleware attached successfully.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Production Engine] Static files linked from dist path:', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[App Engine Server] Running at: http://localhost:${PORT}`);
  });
}

startAppServer().catch((error) => {
  console.error('[App Server Error] Initialization failed:', error);
});
