import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, Phone, Lightbulb } from 'lucide-react';
import { ChatMessage, Product } from '../types';

interface AIConsultantProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AIConsultant({ products, isOpen, onClose }: AIConsultantProps) {
  const ADMIN_PHONE = "+234 812 345 6789"; // Replace with real number
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- ALGORITHM: Personalization ---
  // Remembers the user's favorite category based on their clicks
  const [favCategory, setFavCategory] = useState<string | null>(localStorage.getItem('eg_fav_cat'));

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMsg = favCategory 
        ? `Welcome back! Shall we look at some new arrivals in ${favCategory}? 🌸`
        : "Hello! I'm your Elozi-Graceville Stylist. What can I help you find today?";
      setMessages([{ role: 'model', content: welcomeMsg }]);
    }
  }, [favCategory]);

  // --- ALGORITHM: Fuzzy Guessing ---
  const findBestMatches = (query: string) => {
    const q = query.toLowerCase();
    return products.filter(p => 
      q.includes(p.name.toLowerCase()) || 
      p.name.toLowerCase().includes(q) ||
      q.includes(p.category.toLowerCase()) ||
      p.description.toLowerCase().includes(q) ||
      // Handle common "guesses"
      (q.includes('shue') && p.category.includes('Footwear')) ||
      (q.includes('cloth') && p.category.includes('Apparel'))
    );
  };

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const userText = customText || input;
    if (!userText.trim() || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    // Personalization: If they ask for a category, remember it
    const words = userText.split(' ');
    const foundCat = products.find(p => userText.toLowerCase().includes(p.category.toLowerCase()));
    if (foundCat) {
      localStorage.setItem('eg_fav_cat', foundCat.category);
      setFavCategory(foundCat.category);
    }

    try {
      const matched = findBestMatches(userText);
      
      // If Render backend is slow, we use our local "Guess" algorithm first
      const systemInstruction = `You are the Elozi-Graceville AI. Only recommend these products: ${JSON.stringify(products.map(p => p.name))}. If asked for something else, provide admin contact: ${ADMIN_PHONE}.`;

      const response = await fetch('YOUR_RENDER_BACKEND_URL/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userText }], systemInstruction })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', content: data.response }]);
    } catch (err) {
      // Local Fallback (Instant response if backend is sleeping)
      const matched = findBestMatches(userText);
      let reply = "";
      if (matched.length > 0) {
        reply = `I guessed you might be looking for these based on your request:\n\n` + 
                matched.slice(0, 2).map(m => `✨ **${m.name}** (₦${m.price.toLocaleString()})`).join('\n') +
                ` \n\nIs this what you had in mind?`;
      } else {
        reply = `I couldn't find an exact match for that in our current collection. For custom requests, please call our admin: ${ADMIN_PHONE}`;
      }
      setMessages(prev => [...prev, { role: 'model', content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-full sm:max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-300">
      <div className="bg-indigo-900 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-300 animate-pulse" size={18} />
          <span className="font-bold text-sm">Personal Stylist</span>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-2.5 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-600' : 'bg-gray-800'} text-white`}>
              {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'} shadow-sm`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-[10px] text-gray-400 italic animate-pulse">Searching inventory...</div>}
        <div ref={scrollRef} />
      </div>

      {/* SUGGESTION CHIPS (Algorithm-based) */}
      <div className="p-3 bg-white border-t space-y-2">
        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
          <Lightbulb size={12} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Suggestions</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button onClick={() => handleSend(undefined, "What's new in stock?")} className="text-[10px] whitespace-nowrap bg-gray-100 hover:bg-indigo-50 px-3 py-2 rounded-full font-bold">🔥 New Arrivals</button>
          {favCategory && (
             <button onClick={() => handleSend(undefined, `Show me ${favCategory}`)} className="text-[10px] whitespace-nowrap bg-indigo-50 text-indigo-700 px-3 py-2 rounded-full font-bold border border-indigo-100">✨ More {favCategory}</button>
          )}
          <button onClick={() => handleSend(undefined, "Surprise me with an outfit")} className="text-[10px] whitespace-nowrap bg-gray-100 px-3 py-2 rounded-full font-bold">🎲 Surprise Me</button>
        </div>
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a guess (e.g. 'shue')..."
          className="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700"><Send size={18} /></button>
      </form>
    </div>
  );
}
