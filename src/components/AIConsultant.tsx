/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, HelpCircle, Loader2, Phone } from 'lucide-react';
import { ChatMessage, Product } from '../types';

interface AIConsultantProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onAddProductToCart: (product: Product) => void;
}

export default function AIConsultant({
  products,
  isOpen,
  onClose,
  onAddProductToCart
}: AIConsultantProps) {
  // --- SET ADMIN CONTACT HERE ---
  const ADMIN_PHONE = "+234 812 345 6789"; // Replace with her actual number

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I am your Elozi-Graceville AI Personal Stylist. 🌸\n\nI can help you find products, check prices, or match outfits. What are you looking for today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    
    const updatedMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // --- THE "STRICT" SYSTEM INSTRUCTION ---
      const systemInstruction = `
        You are the exclusive "Elozi-Graceville AI Stylist". 
        Rules:
        1. ONLY recommend products from this catalog: ${JSON.stringify(products.map(p => ({ name: p.name, price: p.price, cat: p.category })))}.
        2. If the user asks for something absurd, unrelated to luxury/home goods, or something we don't have, politely state that it's not in our current collection.
        3. ALWAYS end out-of-scope or "absurd" responses by saying: "For special requests or more info, please contact our administrator directly at ${ADMIN_PHONE}."
        4. Be professional, elegant, and helpful.
      `;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          systemInstruction,
          catalog: products
        }),
      });

      if (!response.ok) throw new Error('API Offline');

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', content: data.response }]);
    } catch (error) {
      // --- DYNAMIC OFFLINE FALLBACK ---
      setTimeout(() => {
        const query = userText.toLowerCase();
        
        const matched = products.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query)
        );

        let assistantReply = "";

        if (matched.length > 0) {
          assistantReply = `I found some items in our store that match your request:\n\n`;
          matched.slice(0, 3).forEach(m => {
            assistantReply += `🛍️ **${m.name}** - ₦${m.price.toLocaleString()}\n`;
          });
          assistantReply += "\nWould you like to add these to your cart?";
        } else {
          // Response for "Absurd" or No-Match queries
          assistantReply = `I couldn't find any items matching "${userText}" in our current Elozi-Graceville collection.\n\nFor custom sourcing, bulk orders, or more information, please contact our administrator directly at ${ADMIN_PHONE}.`;
        }

        setMessages((prev) => [...prev, { role: 'model', content: assistantReply }]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="bg-indigo-900 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">EG</div>
          <div>
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
              <span>EG AI Stylist</span>
              <Sparkles size={12} className="text-indigo-300 fill-indigo-300" />
            </h3>
            <span className="text-[9px] text-indigo-300 uppercase tracking-widest block font-mono">Verified Store Assistant</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"><X size={18} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-2.5 max-w-[90%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white ${m.role === 'user' ? 'bg-indigo-600' : 'bg-gray-800'}`}>
              {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              {m.content}
              {/* Optional: Add a call button if the message contains the phone number */}
              {m.content.includes(ADMIN_PHONE) && (
                <a 
                  href={`tel:${ADMIN_PHONE}`} 
                  className="mt-2 flex items-center gap-2 text-[10px] font-bold bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100 w-fit"
                >
                  <Phone size={10} /> Call Administrator
                </a>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 items-center text-gray-400 text-xs italic pl-10">
            <Loader2 size={14} className="animate-spin" />
            <span>Consulting inventory...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about our store..."
          className="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
        <button type="submit" className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}