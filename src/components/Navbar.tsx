/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, ShieldCheck, Sparkles, Store, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: 'shop' | 'admin';
  setView: (view: 'shop' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAI: () => void;
}

export default function Navbar({
  currentView,
  setView,
  cartCount,
  onOpenCart,
  onOpenAI
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Helper to handle navigation and close menu on mobile
  const navigate = (view: 'shop' | 'admin') => {
    setView(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-black/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo / Brand Name */}
          <div 
            onClick={() => navigate('shop')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="font-serif italic font-extrabold text-xl sm:text-2xl tracking-tighter text-indigo-900 group-hover:text-indigo-700 transition-colors">
                Elozi
              </span>
              <span className="font-sans font-black text-xl sm:text-2xl tracking-tighter text-gray-900">
                Graceville
              </span>
            </div>
          </div>

          {/* Desktop Nav Controls (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/50 active:scale-95 transition-all"
            >
              <Sparkles size={14} className="text-indigo-600 animate-pulse" />
              <span>AI Stylist</span>
            </button>

            <button
              onClick={() => navigate('shop')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === 'shop' 
                  ? 'text-indigo-900 border-b-2 border-indigo-900' 
                  : 'text-black/50 hover:text-black'
              }`}
            >
              <Store size={14} />
              <span>Shop</span>
            </button>

            <button
              onClick={() => navigate('admin')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all active:scale-95 border ${
                currentView === 'admin'
                  ? 'bg-indigo-950 border-indigo-950 text-white shadow-md'
                  : 'bg-white border-black/10 text-black/70 hover:bg-gray-50'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Backoffice</span>
            </button>
          </div>

          {/* Right-Side Utility (Cart & Mobile Toggle) */}
          <div className="flex items-center gap-2">
            {/* Shopping Cart Button (Always Visible) */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full hover:bg-black/5 text-gray-800 hover:text-indigo-800 active:scale-90 transition-all outline-none"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle (Visible only on Mobile) */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-black/5 text-gray-900 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Animated) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-black/5 absolute w-full left-0 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="px-4 py-6 flex flex-col gap-4">
            
            {/* Mobile AI Stylist */}
            <button
              onClick={() => { onOpenAI(); setIsMenuOpen(false); }}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-indigo-700 bg-indigo-50 font-bold text-sm border border-indigo-100"
            >
              <Sparkles size={18} className="animate-pulse" />
              EG AI Personal Stylist
            </button>

            {/* Mobile Shop Link */}
            <button
              onClick={() => navigate('shop')}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-sm transition-colors ${
                currentView === 'shop' ? 'bg-indigo-900 text-white' : 'bg-gray-50 text-gray-600'
              }`}
            >
              <Store size={18} />
              Store Catalog
            </button>

            {/* Mobile Backoffice Link */}
            <button
              onClick={() => navigate('admin')}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-sm transition-colors ${
                currentView === 'admin' ? 'bg-indigo-900 text-white' : 'bg-gray-50 text-gray-600'
              }`}
            >
              <ShieldCheck size={18} />
              Admin Backoffice
            </button>

            <div className="pt-4 border-t border-gray-100 text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                Premium Multi-Category Store
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}