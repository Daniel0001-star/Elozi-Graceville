/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Send, Layers, HelpCircle, Check, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDirectWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const adminWhatsAppNumber = "2348012345678";
    const textMsg = `Hello Elozi-Graceville, I would like to purchase this item directly:\n\n🛒 *Product Code:* ${product.id}\n🌟 *Product Name:* ${product.name}\n💰 *Price:* ₦${product.price.toLocaleString()}\n📍 *Category:* ${product.category}\n\nPlease help check if this is currently in stock!`;
    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(textMsg)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div 
        onClick={() => setShowDetailDialog(true)}
        className="group relative flex flex-col bg-transparent cursor-pointer h-full border border-transparent hover:border-black/5 p-2 rounded-lg transition-all duration-300"
      >
        {/* Product Card Image Container */}
        <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden rounded-sm">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle details overlay with action buttons modeled after Editorial Spec */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-300">
            <button 
              type="button"
              onClick={handleAddToCartClick}
              className="w-36 py-2.5 bg-[#FAF9F6] text-black hover:bg-white text-[10px] font-bold uppercase tracking-widest transition-all duration-250 shadow-sm"
            >
              {added ? '✓ In Cart' : 'Add to Cart'}
            </button>
            <button 
              type="button"
              onClick={handleDirectWhatsAppClick}
              className="w-36 py-2.5 bg-green-600 text-white hover:bg-green-700 text-[10px] font-bold uppercase tracking-widest transition-all duration-250 shadow-sm"
            >
              WhatsApp
            </button>
          </div>

          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowDetailDialog(true); }}
            className="absolute bottom-2 right-2 bg-[#FAF9F6]/90 border border-black/10 text-black/70 p-1.5 rounded"
            title="Inspect Details"
          >
            <Info size={12} />
          </button>
        </div>

        {/* Product Details Section - Underneath Image */}
        <div className="mt-3 flex flex-col flex-1 pl-1">
          <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-black/40">
            {product.category}
          </p>
          
          <h4 className="font-serif text-sm sm:text-base text-gray-900 group-hover:text-indigo-950 transition-colors mt-0.5 font-semibold line-clamp-1">
            {product.name}
          </h4>
          
          <p className="text-xs text-[#1A1A1A]/60 mt-1 line-clamp-2 leading-relaxed flex-1">
            {product.description}
          </p>

          <p className="text-xs font-bold mt-1 text-indigo-700 font-mono">
            ₦{product.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Inspect Detail Modal dialog */}
      {showDetailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-[#FAF9F6] rounded-sm overflow-hidden max-w-lg w-full shadow-2xl relative border border-black/10 animate-scale-up">
            
            <button 
              onClick={() => setShowDetailDialog(false)}
              className="absolute top-4 right-4 z-10 bg-black/75 hover:bg-black p-2 text-white rounded-full transition outline-none"
              aria-label="Close details popup"
            >
              <X size={14} />
            </button>

            <div className="relative aspect-video w-full bg-[#EDEBE6] border-b border-black/10">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-wider text-black bg-white/95 rounded-sm px-3 py-1 shadow-sm border border-black/10">
                🏷️ {product.category}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-bold opacity-40 block">{product.category} Collection</span>
                <h3 className="text-2xl font-serif italic text-gray-950 tracking-tight">
                  {product.name}
                </h3>
  
                <p className="text-lg font-black font-mono text-indigo-700 mt-1">
                  ₦{product.price.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/40 block">Item Narrative Overview</span>
                <p className="text-xs sm:text-sm text-black/70 leading-relaxed bg-white p-4 rounded border border-black/10 font-sans">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDirectWhatsAppClick}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold tracking-widest text-[10px] uppercase py-3.5 px-4 rounded-sm transition-all shadow-sm outline-none"
                >
                  <Send size={12} />
                  <span>Send WhatsApp Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    handleAddToCartClick(e);
                    setShowDetailDialog(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-900 hover:bg-[#1A1A1A] text-white font-bold tracking-widest text-[10px] uppercase py-3.5 px-4 rounded-sm transition-all shadow-sm outline-none"
                >
                  <ShoppingCart size={12} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

// Minimal local X icon to replace the unused imports context
function X({ size }: { size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 18} 
      height={size || 18} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
