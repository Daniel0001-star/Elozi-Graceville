/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import AdminPanel from './components/AdminPanel';
import AIConsultant from './components/AIConsultant';
import { Product, CartItem, BUSINESS_CATEGORIES } from './types';
import { heapSort, searchAndSortProducts } from './utils/heapSort';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Sparkles, ArrowUpDown, Filter, Search, RotateCcw } from 'lucide-react';

// Unified Pre-seeded defaults for seamless demo fallback
const PRE_SEEDED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Men's Cashmere Royal Indigo Suit",
    price: 45000,
    category: "Men's Apparel",
    description: "Curated formal comfort, deep blue backvent, tailored bespoke premium cashmere.",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-2",
    name: "Women's Elegance Velvet Evening Dress",
    price: 38000,
    category: "Women's Apparel",
    description: "Breathable rich twilight velvet fitted for premium luxury events.",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-3",
    name: "Minimalist Signature Quartz Wristwatch",
    price: 15200,
    category: "Men's Accessories",
    description: "Stainless steel back cover and strap, water resistant quartz styling.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-4",
    name: "Women's Leather Tote Holiday Handbag",
    price: 22000,
    category: "Bags & Clutches",
    description: "Exquisite bags and clutches design, golden brass buckles with multi-pocket linings.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-5",
    name: "Red Sport Performance Strider Shoes",
    price: 18500,
    category: "Men's Footwear",
    description: "Air bubble heels shock absorbing walk runners with vulcanized sole grids.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-6",
    name: "Hand-Stitched Executive Leather Brogues",
    price: 28000,
    category: "Men's Footwear",
    description: "Men's formal leather dress shoes, memory foam insole technology.",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-7",
    name: "Kids Back To School Organizer Backpack Set",
    price: 12500,
    category: "Back to School",
    description: "Ergonomic multi-compartment bookbags, includes insulated snackbox flask.",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-8",
    name: "Luminous Peptide Skin Elixir Serum",
    price: 19500,
    category: "Beauty & Cosmetics",
    description: "Infused with rich peptide and rose water antioxidants for a long-lasting radiant glow.",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-9",
    name: "Double Basket Smart Electric Airfryer & Oven",
    price: 32500,
    category: "Home & Kitchen Appliances",
    description: "Dual cooking zone sensors, low fat automatic digital touch menu cooksets.",
    imageUrl: "https://images.unsplash.com/photo-1585533816051-6fb9b553c83b?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-10",
    name: "Minimalist Marble Ceramic Table Vase",
    price: 9500,
    category: "Decor & Interior Design",
    description: "Elegant modern interior design flower stand center piece accessories.",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-11",
    name: "Daily Essential Immune Care Multivitamins",
    price: 11000,
    category: "Health & Wellness",
    description: "Organic dietary capsules infused with essential wellness minerals and daily nutrients.",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600",
    isRandomSeeded: true
  },
  {
    id: "prod-12",
    name: "Kiddies Multi-Segment Building Block Toys",
    price: 6800,
    category: "Toys",
    description: "Safe non-toxic blocks for cognitive development and creative kid playing hours.",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=600",
    isRandomSeeded: true
  }
];

export default function App() {
  const [currentView, setView] = useState<'shop' | 'admin'>('shop');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Shopping Navigation & Search
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortKey, setSortKey] = useState<'price' | 'name'>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Side drawer toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIConsultantOpen, setIsAIConsultantOpen] = useState(false);

  // Random 9 state (refreshed when Category clicks 'All')
  const [randomNineProducts, setRandomNineProducts] = useState<Product[]>([]);

  // Synchronise state with DB (Supabase or Local Storage)
  useEffect(() => {
    loadProducts();
    // Load local cart
    const savedCart = localStorage.getItem('eg_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const loadProducts = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          // Map snake_case image_url to camelCase imageUrl
          const mapped: Product[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            price: d.price,
            category: d.category,
            imageUrl: d.image_url || d.imageUrl,
            description: d.description
          }));
          setProducts(mapped);
          setRandom9(mapped);
        } else {
          // If Supabase table is online but empty, do NOT seed mock data when connected to database
          setProducts([]);
          setRandom9([]);
        }
      } else {
        // Fallback Local Storage mechanism
        const saved = localStorage.getItem('eg_products');
        if (saved) {
          const parsed = JSON.parse(saved);
          setProducts(parsed);
          setRandom9(parsed);
        } else {
          setProducts(PRE_SEEDED_PRODUCTS);
          setRandom9(PRE_SEEDED_PRODUCTS);
          localStorage.setItem('eg_products', JSON.stringify(PRE_SEEDED_PRODUCTS));
        }
      }
    } catch (e) {
      console.warn("DB syncing error:", e);
      if (isSupabaseConfigured) {
        // Do not fallback to mock products if database is configured
        setProducts([]);
        setRandom9([]);
      } else {
        setProducts(PRE_SEEDED_PRODUCTS);
        setRandom9(PRE_SEEDED_PRODUCTS);
      }
    }
  };

  // Select random 9 elements
  const setRandom9 = (allProds: Product[]) => {
    if (allProds.length <= 9) {
      setRandomNineProducts(allProds);
    } else {
      const shuffled = [...allProds].sort(() => 0.5 - Math.random());
      setRandomNineProducts(shuffled.slice(0, 9));
    }
  };

  // Mutate product items
  const handleAddProduct = async (newProd: Omit<Product, 'id'> & { id?: string }) => {
    const generatedId = newProd.id || `prod-${Date.now()}`;
    const productItem: Product = {
      id: generatedId,
      ...newProd
    };

    if (isSupabaseConfigured && supabase) {
      try {
        // Match snake_case columns
        const { error } = await supabase.from('products').insert([
          {
            id: generatedId,
            name: productItem.name,
            price: productItem.price,
            category: productItem.category,
            image_url: productItem.imageUrl,
            description: productItem.description
          }
        ]);
        if (error) throw error;
        // Reload in background
        loadProducts();
      } catch (err) {
        console.error("Supabase insert crash, adding locally for instant display:", err);
      }
    }

    // Always update app memory state
    const nextProducts = [productItem, ...products];
    setProducts(nextProducts);
    localStorage.setItem('eg_products', JSON.stringify(nextProducts));
    
    // Update Random items as well
    if (activeCategory === 'All') {
      setRandom9(nextProducts);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        loadProducts();
      } catch (err) {
        console.error("Supabase deleting error:", err);
      }
    }

    const nextProducts = products.filter(p => p.id !== id);
    setProducts(nextProducts);
    localStorage.setItem('eg_products', JSON.stringify(nextProducts));
    
    if (activeCategory === 'All') {
      setRandom9(nextProducts);
    }
  };

  const handleResetToDefaults = () => {
    if (isSupabaseConfigured) {
      alert("⚠️ Resetting mock default items is not allowed when custom live database is connected. Emptying your custom database is safer to keep your records pure.");
      return;
    }
    setProducts(PRE_SEEDED_PRODUCTS);
    setRandom9(PRE_SEEDED_PRODUCTS);
    localStorage.setItem('eg_products', JSON.stringify(PRE_SEEDED_PRODUCTS));
    alert("🟢 Sandbox inventory reset to the 12 premium departments.");
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    const nextCart = [...cart];
    const existing = nextCart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      nextCart.push({ ...product, quantity: 1 });
    }
    setCart(nextCart);
    localStorage.setItem('eg_cart', JSON.stringify(nextCart));
  };

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const nextCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQty } : item
    );
    setCart(nextCart);
    localStorage.setItem('eg_cart', JSON.stringify(nextCart));
  };

  const handleRemoveItem = (productId: string) => {
    const nextCart = cart.filter(item => item.id !== productId);
    setCart(nextCart);
    localStorage.setItem('eg_cart', JSON.stringify(nextCart));
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('eg_cart');
  };

  // Compute final product search query list using custom Heapsort
  const processedProducts = useMemo(() => {
    if (activeCategory === 'All') {
      // In 'All' view, we show exactly the randomized 9 selection, sorted by the active sort selection
      return heapSort(randomNineProducts, sortKey, sortDirection);
    } else {
      // Specific category: filter to category first
      const matchesCategory = products.filter(p => p.category === activeCategory);
      // Run the custom search index with heapSort
      return searchAndSortProducts(matchesCategory, searchQuery, sortKey, sortDirection);
    }
  }, [products, activeCategory, searchQuery, sortKey, sortDirection, randomNineProducts]);

  const cartTotalQty = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* NAVBAR */}
      <Navbar 
        currentView={currentView}
        setView={(v) => { 
          setView(v); 
          // Refers random 9 when returning to the shop catalogs
          if (v === 'shop') setRandom9(products); 
        }}
        cartCount={cartTotalQty}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAI={() => setIsAIConsultantOpen(true)}
      />

      <main className="flex-1">
        {currentView === 'shop' ? (
          <>
            {/* HERO SECTION */}
            <Hero 
              products={products}
              onExploreClick={() => {
                const el = document.getElementById('shop-marketplace');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
            />

            {/* SHOPPING SECTION */}
            <section id="shop-marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Horizontal / Sidebar categories selectors */}
                <div className="w-full lg:w-64 shrink-0 space-y-4">
                  <div className="bg-white border border-black/10 rounded-sm p-5 text-gray-950">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-indigo-900 block mb-1">
                      Mall Directory
                    </span>
                    <h3 className="font-serif italic font-bold text-lg text-gray-900">
                      Explore Departments
                    </h3>
                    <p className="text-xs text-black/60 mt-1 leading-relaxed">
                      Consistent categorization makes premium shopping convenient.
                    </p>
                  </div>

                  <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 gap-1.5 scrollbar-none whitespace-nowrap">
                    {/* All category choice */}
                    <button
                      onClick={() => {
                        setActiveCategory('All');
                        setRandom9(products);
                      }}
                      className={`text-left text-xs uppercase tracking-wider font-bold px-4 py-3 rounded-sm transition duration-200 shrink-0 select-none ${
                        activeCategory === 'All'
                          ? 'bg-indigo-950 text-white shadow-sm'
                          : 'bg-white border border-black/10 text-black/70 hover:bg-[#FAF9F6]'
                      }`}
                    >
                      🌟 Random Catalog Choices
                    </button>

                    {/* Organized divisions */}
                    {Object.keys(BUSINESS_CATEGORIES).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-left text-xs uppercase tracking-wider font-bold px-4 py-3 rounded-sm transition duration-200 shrink-0 select-none ${
                          activeCategory === cat
                            ? 'bg-indigo-950 text-white shadow-sm'
                            : 'bg-white border border-black/10 text-black/70 hover:bg-[#FAF9F6]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search & Products column */}
                <div className="flex-1 w-full space-y-6">
                  
                  {/* Sorting filters & Search input row */}
                  <div className="bg-white border border-black/10 rounded-sm p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    
                    {/* Search box (Required for heap sort on searching) */}
                    <div className="relative w-full md:w-80">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search within ${activeCategory}...`}
                        className="w-full text-xs pl-10 pr-4 py-2 bg-[#FAF9F6] hover:bg-neutral-100/50 focus:bg-white rounded-sm border border-black/10 focus:border-indigo-900 outline-none transition-all"
                        disabled={activeCategory === 'All'}
                      />
                    </div>

                    {/* Sorting selectors (Satisfies search and heap sort requirement) */}
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto self-stretch md:self-auto scrollbar-none whitespace-nowrap">
                      
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                        <ArrowUpDown size={12} className="text-gray-400" />
                        <span>Sort Heap:</span>
                      </div>

                      <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value as 'price' | 'name')}
                        className="text-[11px] uppercase tracking-wider p-2 bg-[#FAF9F6] border border-black/10 rounded-sm font-bold text-gray-800 outline-none"
                      >
                        <option value="price">Price (Cost)</option>
                        <option value="name">Alphabetical</option>
                      </select>

                      <select
                        value={sortDirection}
                        onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                        className="text-[11px] uppercase tracking-wider p-2 bg-[#FAF9F6] border border-black/10 rounded-sm font-bold text-gray-800 outline-none"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>

                      {activeCategory === 'All' && (
                        <button
                          onClick={() => setRandom9(products)}
                          className="p-2 bg-[#FAF9F6] border border-black/10 hover:border-black text-indigo-900 rounded-sm flex items-center justify-center active:scale-90 transition-all outline-none"
                          title="Reshuffle any random 9 items"
                        >
                          <RotateCcw size={13} />
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Division Summary Header block */}
                  <div className="p-5 bg-white border border-black/10 rounded-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-serif italic text-gray-900 tracking-tight font-semibold">
                        {activeCategory === 'All' ? '🌟 Featured Catalog Choices (Random 9)' : `Department: ${activeCategory}`}
                      </h2>
                      <p className="text-xs text-black/50 mt-0.5">
                        {activeCategory === 'All' 
                          ? 'Displaying any 9 random products. Tap the reload button next to Heap filters to shuffle!' 
                          : BUSINESS_CATEGORIES[activeCategory as keyof typeof BUSINESS_CATEGORIES]
                        }
                      </p>
                    </div>

                    <div className="shrink-0 text-[10px] uppercase tracking-wider font-bold text-indigo-950 font-mono bg-indigo-50/50 py-1.5 px-3 rounded-sm border border-black/5 h-fit self-start sm:self-auto">
                      Heap sort view: {processedProducts.length} items
                    </div>
                  </div>

                  {/* Grid product container */}
                  {processedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {processedProducts.map((p) => (
                        <div key={p.id}>
                          <ProductCard 
                            product={p}
                            onAddToCart={handleAddToCart}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-16 text-center border border-dashed border-gray-200">
                      <span className="text-4xl block mb-2">🔍</span>
                      <h4 className="font-extrabold text-base text-gray-700">No matching goods found</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                        We could not find items matching "{searchQuery}" under the category "{activeCategory}". Reset filter tags or add catalog files in backoffice.
                      </p>
                    </div>
                  )}

                </div>

              </div>

            </section>

            {/* TESTIMONIALS */}
            <Testimonials />
          </>
        ) : (
          /* ADMIN SIDE PANEL */
          <AdminPanel 
            onAddProduct={handleAddProduct}
            products={products}
            onDeleteProduct={handleDeleteProduct}
            onResetToDefaults={handleResetToDefaults}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* DRAWER SLIDEOUTS */}
      {isCartOpen && (
        <CartSidebar 
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />
      )}

      {/* AI Smart Consultant Slide */}
      <AIConsultant 
        products={products}
        isOpen={isAIConsultantOpen}
        onClose={() => setIsAIConsultantOpen(false)}
        onAddProductToCart={(p) => {
          handleAddToCart(p);
          setIsAIConsultantOpen(false);
          setIsCartOpen(true);
        }}
      />

    </div>
  );
}
