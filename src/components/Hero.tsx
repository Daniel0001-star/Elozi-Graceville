/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, MoveRight } from 'lucide-react';
import { Product } from '../types';

export default function Hero({ 
  onExploreClick, 
  products = [] 
}: { 
  onExploreClick: () => void; 
  products?: Product[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamic slides from database products
  const slides = products && products.length > 0 
    ? products.slice(0, 8).map(p => ({
        image: p.imageUrl,
        title: p.name,
        tag: p.category,
        description: p.description
      }))
    : [
        {
          image: "https://images.unsplash.com/photo-1560243563-062bff001d68?q=80&w=1200&auto=format&fit=crop",
          title: "Main Luxury Galleria",
          tag: "Awaiting Database Uploads",
          description: "Connect your custom database and upload actual retail products via Admin panel."
        }
      ];

  // Safeguard index on array length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  // Autoplay slider rotation
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div className="relative overflow-hidden bg-[#FAF9F6] text-[#1A1A1A] border-b border-black/10 py-12 md:py-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Bio Column: Editorial Left Block */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="h-px w-8 bg-indigo-600"></span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-600 flex items-center gap-1.5">
                <Sparkles size={11} className="text-indigo-600 animate-pulse" />
                <span>Now AI-Infused shopping Mall</span>
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic leading-none text-gray-900 tracking-tight">
              Bringing <span className="font-sans not-italic font-black bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">quality, style</span>, and convenience to your doorstep.
            </h1>

            {/* Elozi-Graceville Bio */}
            <p className="text-sm sm:text-base text-black/70 leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans">
              <strong className="text-[#1A1A1A] font-semibold">Elozi-Graceville</strong> is a premium multi-category retail destination. We bridge the gap between luxury and daily necessity through curated departments, premium design philosophy, and tailored AI-driven styling intelligence.
            </p>

            <p className="hidden sm:block text-xs sm:text-sm text-black/50 leading-relaxed max-w-lg mx-auto lg:mx-0 italic font-serif">
              Founded on the principles of absolute reliability and artistic excellence, we strive to simplify your experience and deliver stellar products tailored to your home, children, and lifestyle.
            </p>

            {/* Action Buttons styled like Editorial elements */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-900 hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-md active:scale-95 transition-all outline-none"
              >
                <span>Shop the Collection</span>
                <MoveRight size={14} />
              </button>
              
              <a
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto text-center font-bold text-xs uppercase tracking-widest px-6 py-3.5 border border-black/10 rounded-full text-black hover:bg-black hover:text-white transition-all active:scale-95 duration-300"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Slider Column with premium Editorial framing */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group w-full max-w-[360px] aspect-[4/5] bg-[#EDEBE6] rounded-2xl flex items-center justify-center p-8 border border-black/5">
              
              {/* Slider Image Shell */}
              <div 
                className="w-full h-full rounded-xl overflow-hidden bg-white shadow-2xl transition-all duration-700 ease-out transform group-hover:rotate-6 border-[6px] border-white relative"
              >
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Subtle dark caption overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FAF9F6]/80">
                    {currentSlide.tag}
                  </span>
                  <h3 className="font-serif italic text-lg text-white leading-tight mt-1 line-clamp-1">
                    {currentSlide.title}
                  </h3>
                  {currentSlide.description && (
                    <p className="text-[10px] text-white/50 line-clamp-2 mt-0.5 max-w-[260px]">
                      {currentSlide.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Slider Controls */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm hover:bg-indigo-900 hover:text-white transition-all z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm hover:bg-indigo-900 hover:text-white transition-all z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Pagination indicators */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === currentIndex ? 'w-5 bg-indigo-900' : 'w-1.5 bg-black/20'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
