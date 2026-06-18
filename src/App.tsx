/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import AIConsultant from './components/AIConsultant';
import CartDrawer from './components/CartDrawer';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Product, CartItem, BUSINESS_CATEGORIES } from './types';
import { Sparkles, PackageSearch } from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<'shop' | 'admin'>('shop');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  // --- PERSISTENCE ALGORITHM: Instant Load & Sync ---
  useEffect(() => {
    const initApp = async () => {
      // 1. Load from Cache (Instant Speed)
      const cachedProducts = localStorage.getItem('eg_catalog_cache');
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
        setIsLoading(false);
      }

      // 2. Fetch Fresh from Supabase (Background Update)
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (data) {
            const formattedProducts = data.map((p: any) => ({
              ...p,
              imageUrl: p.image_url // Map DB snake_case to UI camelCase
            }));
            
            setProducts(formattedProducts);
            // Update cache for next visit
            localStorage.setItem('eg_catalog_cache', JSON.stringify(formattedProducts));
          }
        } catch (err) {
          console.error("Database fetch error:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // --- CART PERSISTENCE ---
  useEffect(() => {
    const savedCart = localStorage.getItem('eg_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('eg_cart', JSON.stringify(cart));
  }, [cart]);

  // --- HANDLERS ---
  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('eg_catalog_cache', JSON.stringify(updated));
  };

  const handleDeleteProduct = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert("Error deleting product");
        return;
      }
    }
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('eg_catalog_cache', JSON.stringify(updated));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // --- FILTER ALGORITHM ---
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar 
        currentView={currentView}
        setView={setCurrentView}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      <main>
        {currentView === 'shop' ? (
          <>
            {/* Editorial Hero Section */}
            <div className="relative bg-white border-b border-black/5 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 pt-16 pb-12 sm:px-6 lg:px-8 text-center">
                <span className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-indigo-600 mb-4 animate-fade-in">
                  Est. 2024 • Premium Logistics
                </span>
                <h1 className="text-4xl sm:text-6xl font-serif italic text-gray-950 tracking-tighter mb-6">
                  Elevate your lifestyle <br /> with Elozi-Graceville
                </h1>
                <p className="max-w-xl mx-auto text-sm text-black/50 leading-relaxed mb-8">
                  A curated collection of luxury apparel, high-performance appliances, 
                  and designer home accents delivered with absolute precision.
                </p>
                
                {/* Dynamic Category Filter */}
                <div className="flex flex-wrap justify-center gap-2">
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === 'All' ? 'bg-indigo-950 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    All Collections
                  </button>
                  {Object.keys(BUSINESS_CATEGORIES).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-indigo-950 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              {isLoading && products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <div className="w-8 h-8 border-4 border-indigo-900/20 border-t-indigo-900 rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Opening Vault...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32">
                  <PackageSearch className="mx-auto text-gray-200 mb-4" size={48} />
                  <h3 className="text-xl font-serif italic text-gray-900">No items found</h3>
                  <p className="text-sm text-gray-400 mt-1">Try selecting a different collection or check back later.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <AdminPanel 
            onAddProduct={handleAddProduct}
            products={products}
            onDeleteProduct={handleDeleteProduct}
            onResetToDefaults={() => {
              localStorage.removeItem('eg_catalog_cache');
              window.location.reload();
            }}
          />
        )}
      </main>

      {/* Floating Elements */}
      <AIConsultant 
        products={products} 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cart}
        setItems={setCart}
      />

      {/* Persistent AI Trigger Button (Mobile) */}
      {!isAIOpen && currentView === 'shop' && (
        <button
          onClick={() => setIsAIOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-indigo-950 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all md:hidden"
        >
          <Sparkles size={24} />
        </button>
      )}

      <footer className="bg-white border-t border-black/5 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">
            © 2024 Elozi-Graceville Group • Secure Payments • Global Logistics
          </p>
        </div>
      </footer>
    </div>
  );
}
