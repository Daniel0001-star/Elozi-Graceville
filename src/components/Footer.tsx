/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Phone, MapPin, Sparkles, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-zinc-400 pt-16 pb-8 border-t border-black/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* About Column */}
          <div className="md:col-span-1 flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif italic font-extrabold text-xl tracking-tight text-white">
                Elozi
              </span>
              <span className="font-sans font-black text-xl tracking-tight text-white">
                Graceville
              </span>
            </div>
            
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 antialiased font-sans">
              Elozi-Graceville is a premium multi-category retail destination dedicated to bringing quality, style, and essential convenience to your doorstep. From fashion-forward apparel for the whole family to curated home decor and lifestyle essentials, we bridge the gap between luxury and daily necessity.
            </p>
            
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em] font-mono">
              <Sparkles size={11} className="text-indigo-400 animate-pulse" />
              <span>AI-driven smart retail partner</span>
            </div>
          </div>

          {/* Quick links & category Column */}
          <div>
            <h3 className="text-white text-xs uppercase tracking-[0.2em] mb-4 border-l border-zinc-700 pl-3 font-semibold">
              Business Categories
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-400 font-sans">
              <li>
                <span className="text-zinc-200 font-medium">Apparel:</span> Men's, Women's, Kiddies & Teens Apparel
              </li>
              <li>
                <span className="text-zinc-200 font-medium">Accessories:</span> Men's, Women's, Kiddies & Teens Accessories
              </li>
              <li>
                <span className="text-zinc-200 font-medium">Footwear:</span> Men's, Women's, Kiddies & Teens Footwear
              </li>
              <li>
                <span className="text-zinc-200 font-medium">Specialty:</span> Bags & Clutches, Back to School, Toys
              </li>
              <li>
                <span className="text-zinc-200 font-medium">Home & Lifestyle:</span> Appliances, Decor & Interiors
              </li>
              <li>
                <span className="text-zinc-200 font-medium">Essentials & Wellness:</span> Beauty & Cosmetics, Daily Essentials
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h3 className="text-white text-xs uppercase tracking-[0.2em] mb-4 border-l border-zinc-700 pl-3 font-semibold">
              Corporate Office & Help
            </h3>
            <ul className="space-y-4 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#FAF9F6]/60 shrink-0 mt-0.5" />
                <span>Graceville Court, Lekki Phase 1, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#FAF9F6]/60 shrink-0" />
                <a href="tel:+2348012345678" className="hover:text-white transition-colors">
                  +234 (0) 801 234 5678
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#FAF9F6]/60 shrink-0" />
                <a href="mailto:support@elozi-graceville.com" className="hover:text-white transition-colors">
                  support@elozi-graceville.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-[#FAF9F6]/50 text-[10px] uppercase font-bold tracking-wider bg-zinc-800/50 px-3 py-2 rounded-sm border border-zinc-800 w-fit">
                <CreditCard size={12} className="mr-1 shrink-0 text-zinc-500" />
                <span>Bank Transfer & WhatsApp Payment Verified</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator Line */}
        <div className="border-t border-zinc-800/80 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-zinc-500 font-sans">
            <span>Partner in living well. </span>
            <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors duration-200">Terms of Service</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors duration-200">Privacy Policy</span>
          </div>

          {/* Copyright Section (Required) */}
          <div className="text-zinc-500 tracking-tight text-right font-sans">
             &copy; {new Date().getFullYear()} <span className="text-zinc-300 font-bold">Elozi-Graceville Retail Mall</span>. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
