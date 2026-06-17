/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, RotateCcw } from 'lucide-react';
import { Testimonial } from '../types';

const FIRST_NAMES = [
  "Dr. Amara", "Tunde", "Sophia", "Emeka", "Chioma", "Adebayo", "Fatima", "Olumide", "Nneka", "Chinedu",
  "Amina", "Efe", "Bolaji", "Zainab", "Kelechi", "Yemi", "Funmi", "Damilola", "Ibrahim", "Tari",
  "Nonso", "Uche", "Abidemi", "Folake", "Oluwaseun", "Kemi", "Chidi", "Obinna", "Grace", "Victor"
];

const LAST_NAMES = [
  "Charles", "Bakare", "Adebayo", "Obi", "Alabi", "Okonkwo", "Suleiman", "Balogun", "Egwu", "Danjuma",
  "Adewale", "Nwachukwu", "Okoro", "Abiola", "Oyinlola", "Idris", "Bello", "Eze", "Eke", "Okafor",
  "Adeyemi", "Shonibare", "Oni", "Oyelowo", "Nwosu", "Adeleke", "Lawal", "Faro", "Davies", "Ajayi"
];

const CATEGORY_ITEMS: { [key: string]: string[] } = {
  "Men's Apparel": ["Cashmere Royal Indigo Suit", "Bespoke Smart Fit Blazer", "Pristine White Dress Shirt", "Premium Cotton Chino Pants"],
  "Men's Accessories": ["Signature Quartz Wristwatch", "Genuine Croc-styled Leather Belt", "Sterling Silver Cufflinks", "Classic Aviator Sunglasses"],
  "Men's Footwear": ["Hand-Stitched Executive Brogues", "Chelsea Suede Leather Boots", "Comfort Hybrid Active Runners", "Waterproof Walking Loafers"],
  "Women's Apparel": ["Elegance Velvet Evening Dress", "Tailored Silk Blazer", "Linen Summer Midi Sundress", "Embroidered Traditional Lace Set"],
  "Women's Accessories": ["14K Gold Plated Teardrop Earrings", "Pure Silk Floral Neck Scarf", "Polarized Retro Cat-Eye Sunglasses", "Adjustable Sterling Ring"],
  "Women's Footwear": ["Pointed Toe Stiletto Heels", "Comfort Ankle Strap Sandals", "Classic Leather Ballet Flats", "Plush Fleece Winter Slides"],
  "Bags & Clutches": ["Saffiano Leather Tote Bag", "Satin Gold Evening Clutch Set", "Chic Messenger Crossbody Bag", "Travel Duffel Gym Carrier"],
  "Kiddies & Teens Apparel": ["Aesthetic Ribbed Knit Toddler Set", "Teens Unisex Denim Cargo Jacket", "Kids Organic Velvet Onesie", "Bright Hooded Windbreaker"],
  "Kiddies & Teens Accessories": ["Shine-in-the-Dark Kids Silicone Watch", "Teens Pastel Hairclip Vault", "Adjustable Child Elbow Pads", "UV400 Safe Kids Sunnies"],
  "Kiddies & Teens Footwear": ["Elastic-Lace Lightweight Kid Sneakers", "Toddler Anti-Slip Cushion Boots", "Teens Leather School Loafers", "Chic Velcro Daily Sandalsets"],
  "Back to School": ["Ergonomic Multi-partition Backpack", "Premium Insulated Water Flask", "Waterproof Lunch Tote Bag", "Deluxe Stationery Organizer Set"],
  "Toys": ["Cognitive Wooden Building Blocks", "High-Speed App-Controlled Racer", "Interactive Educational Smart Tablet", "Luxury 3D Architectural Puzzle Set"],
  "Home & Kitchen Appliances": ["Double Basket Smart Electric Airfryer", "Professional Grade Smart Blender", "Compact Ceramic Espresso Station", "Retro Countertop Convection Oven"],
  "Decor & Interior Design": ["Minimalist Table Ceramic Lamp Set", "Abstract Watercolor Canvas Artwork", "Natural Premium Cotton Textured Throw", "Sleek Modern Metallic Wall Clock"],
  "Daily Essentials": ["Premium Hypoallergenic Liquid Cleanser", "Organic Eco-friendly Laundry Pods", "Ultra-Soft Multi-Ply Bamboo Tissues", "Aromatherapy Lavender Hand Wash Set"],
  "Health & Wellness": ["Daily Essential Immune Care Multivitamins", "Organic Cold-Pressed Flaxseed Oil", "Ergonomic Memory Foam Posture Corrector", "Calming Herbal Insomnia Tea Bundle"],
  "Beauty & Cosmetics": ["Glutathione & Vitamin C Skin Brightener Serum", "Luxurious Hydrating Velvet Lipstick", "Smudge-Proof Volumizing Mascara Set", "Hydrated Rose Water Refreshing Mist Spray"]
};

const REAL_FEEDBACK_COMMENTS = [
  "Absolutely pristine quality! The materials feel incredibly premium, and the items are perfectly presented. Highly recommend.",
  "Super fast delivery to Lekki Phase 1. The packaging was immaculate and feels like a luxurious boutique unboxing.",
  "I was highly skeptical about buying clothing and home accessories online in Lagos, but Elozi-Graceville exceeded all expectation. 5-star service!",
  "The attention to customer detail here is stunning. Secure real-time billing and instant dispatch, highly recommend them.",
  "Consistent premium grade on all my family's orders. This is easily our favorite multi-category shop in Lagos, hands down.",
  "Very helpful customer support! The service on the direct WhatsApp team was friendly, quick, and answered all queries.",
  "The fabric and build on their modern lifestyle selections are robust and premium. Will definitely be a regular here.",
  "Outstanding delivery speed and lovely neat packaging. Every single item received is exactly as described.",
  "Upgraded our interior decor and household upgrades with them. Gorgeous craftsmanship and exceptional convenient shopping.",
  "Beautiful design aesthetics paired with practical convenience. They really bridge everyday luxury and necessity.",
  "Our kids love their back-to-school items and creative toys. Very durable, functional, and safe materials.",
  "Smooth shopping experience. Accurate sizing, high quality, and delivery was incredibly professional.",
  "Extremely pleased with the high-end standard. The accessories and design pieces fit beautifully in our living room.",
  "Clean layouts and premium features. The AI consultant of the app also gave remarkably good product pairing tips!",
  "The items look even more elegant in person. Excellent boutique service, completely stress-free.",
  "Amazing transactions with verified automatic invoicing. Safe billing and swift doorstep delivery.",
  "Extremely professional retail team. Sizing fits nicely, and the order was neatly packaged in perfect condition.",
  "My absolute premier plug for luxury family shopping, daily essentials, and chic accessories in Lekki.",
  "A wonderfully peaceful, stress-free virtual shopping experience. Outstanding customer standby team.",
  "Elegant products, pristine shipping boxes, and exceptionally polite dispatch crew. Couldn't ask for a better shopping helper!"
];

const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80"
];

const generateRandomTestimonials = (count: number = 4): Testimonial[] => {
  const result: Testimonial[] = [];
  const categories = Object.keys(CATEGORY_ITEMS);
  const usedAvatars = new Set<string>();
  const usedNames = new Set<string>();
  const usedComments = new Set<string>();

  for (let i = 0; i < count; i++) {
    // Generate unique name
    let name = "";
    let systemLoops = 0;
    do {
      const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      name = `${fn} ${ln}`;
      systemLoops++;
    } while (usedNames.has(name) && systemLoops < 100);
    usedNames.add(name);

    // Get random category and item
    const category = categories[Math.floor(Math.random() * categories.length)];
    const items = CATEGORY_ITEMS[category];
    const item = items[Math.floor(Math.random() * items.length)];

    // Get unique avatar
    let avatarUrl = "";
    systemLoops = 0;
    do {
      avatarUrl = AVATAR_URLS[Math.floor(Math.random() * AVATAR_URLS.length)];
      systemLoops++;
    } while (usedAvatars.has(avatarUrl) && systemLoops < 100);
    usedAvatars.add(avatarUrl);

    // Get unique comments
    let text = "";
    systemLoops = 0;
    do {
      text = REAL_FEEDBACK_COMMENTS[Math.floor(Math.random() * REAL_FEEDBACK_COMMENTS.length)];
      systemLoops++;
    } while (usedComments.has(text) && systemLoops < 100);
    usedComments.add(text);

    result.push({
      id: `dyn-t-${i}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      text,
      rating: 5,
      purchasedItem: `${category} / ${item}`,
      avatarUrl
    });
  }
  return result;
};

export default function Testimonials() {
  const [customReviews, setCustomReviews] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('eg_custom_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [randomReviews, setRandomReviews] = useState<Testimonial[]>([]);

  // Form states and fields
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setRandomReviews(generateRandomTestimonials(4));
    
    // Periodically change one testimonial softly to demonstrate real-time dynamic behavior
    const interval = setInterval(() => {
      setRandomReviews(prev => {
        const next = [...prev];
        if (next.length > 0) {
          const indexToReplace = Math.floor(Math.random() * next.length);
          const fresh = generateRandomTestimonials(1)[0];
          next[indexToReplace] = fresh;
        }
        return next;
      });
    }, 15000); // changes one feedback softly every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRandomReviews(generateRandomTestimonials(4));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim() || !newItemName.trim()) {
      alert("⚠️ Please specify your name, rated purchase, and honest experience.");
      return;
    }

    const newReview: Testimonial = {
      id: `custom-r-${Date.now()}`,
      name: newName.trim(),
      text: newComment.trim(),
      rating: newRating,
      purchasedItem: newItemName.trim(),
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80"
    };

    const nextCustom = [newReview, ...customReviews];
    setCustomReviews(nextCustom);
    localStorage.setItem('eg_custom_reviews', JSON.stringify(nextCustom));

    // Reset inputs
    setNewName('');
    setNewItemName('');
    setNewComment('');
    setNewRating(5);
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 6000);
  };

  // Combine custom reviews at the top plus the shuffled pool
  const allTestimonials = [...customReviews, ...randomReviews].slice(0, 12);

  return (
    <section className="py-20 bg-[#FAF9F6] border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Editorial Polish */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-6 bg-indigo-900"></span>
            <span className="text-[10px] font-bold tracking-[0.25em] text-indigo-900 uppercase flex items-center gap-1">
              <span>Social Proof & Testimonials</span>
            </span>
            <span className="h-px w-6 bg-indigo-900"></span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-serif italic text-gray-950 tracking-tight leading-tight">
            Loved by families & <span className="font-sans not-italic font-black">professionals alike</span>.
          </h2>
          
          <p className="text-xs sm:text-sm text-black/60 max-w-md mx-auto mt-3 leading-relaxed font-sans">
            Discover why home shoppers make Elozi-Graceville their premier quality delivery partner.
          </p>

          <button
            onClick={handleRefresh}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 border border-black/10 rounded-sm hover:border-black text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A] bg-white transition duration-200 shadow-sm hover:shadow active:scale-95 outline-none"
            title="Scribble completely random live feedback reviews"
          >
            <RotateCcw size={11} className="text-indigo-900 animate-spin-slow" />
            <span>Generate Fresh Feedback</span>
          </button>
        </div>

        {/* Flat Minimalist Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {allTestimonials.map((t) => (
            <div 
              key={t.id}
              className="flex flex-col justify-between bg-white p-6 rounded-sm border border-black/10 hover:border-indigo-900/40 hover:shadow-lg transition-all duration-300 relative group min-h-[280px]"
            >
              <div className="absolute top-4 right-4 text-black/5 opacity-40 group-hover:opacity-100 transition-opacity">
                <MessageSquareQuote size={28} />
              </div>

              <div>
                {/* Rating stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={12} 
                      className="fill-amber-400 text-amber-400" 
                    />
                  ))}
                  {[...Array(5 - t.rating)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={12} 
                      className="text-gray-200" 
                    />
                  ))}
                </div>

                {/* Testimonial text: using font-serif elegant italic quotes */}
                <p className="text-black/80 text-xs sm:text-sm leading-relaxed italic mb-6 font-serif">
                  "{t.text}"
                </p>
              </div>

              {/* Customer details - flat line division */}
              <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                <img
                  src={t.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80"}
                  alt={t.name}
                  className="w-10 h-10 rounded-sm object-cover border border-black/10 grayscale group-hover:grayscale-0 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-serif italic text-xs text-gray-950 font-semibold leading-tight line-clamp-1">
                    {t.name}
                  </h4>
                  <span className="text-[9px] uppercase tracking-wider text-indigo-800 font-bold block mt-0.5">
                    ✓ Verified Purchase
                  </span>
                  <span className="text-[10px] text-black/40 block leading-tight font-sans line-clamp-1 mt-0.5">
                    {t.purchasedItem}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CUSTOMER FEEDBACK INTEGRATIVE FORM CARD */}
        <div className="max-w-2xl mx-auto bg-white border border-black/10 rounded-sm p-6 sm:p-8 shadow-sm">
          <div className="mb-6 text-center">
            <span className="text-[9px] font-bold tracking-[0.2em] text-indigo-900 uppercase">
              Customer Feedback Desk
            </span>
            <h3 className="text-xl font-serif italic text-gray-900 tracking-tight mt-1">
              Publish Your Experience
            </h3>
            <p className="text-xs text-black/50 mt-1.5 max-w-sm mx-auto">
              How did your last delivery look? Share suggestions or product reviews directly on our live shop board.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] block mb-1">
                  Your Signature Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Chief Mrs. Adebayo"
                  className="w-full text-xs p-3 bg-[#FAF9F6] border border-black/10 focus:border-indigo-900 outline-none transition-colors rounded-sm text-gray-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] block mb-1">
                  Item Purchased / Department *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Double Basket Airfryer"
                  className="w-full text-xs p-3 bg-[#FAF9F6] border border-black/10 focus:border-indigo-900 outline-none transition-colors rounded-sm text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] block mb-2">
                Overall Experience Rating *
              </label>
              <div className="flex gap-2 items-center bg-[#FAF9F6] border border-black/10 p-3 rounded-sm w-fit">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="hover:scale-110 active:scale-90 transition-all outline-none"
                    >
                      <Star
                        size={18}
                        className={`${
                          star <= newRating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[10px] uppercase font-bold text-indigo-900 ml-2">
                  {newRating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] block mb-1">
                Your Review Message *
              </label>
              <textarea
                required
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="The unboxing felt gorgeous, dispatch courier was extremely polite and billing was direct!"
                className="w-full text-xs p-3 bg-[#FAF9F6] border border-black/10 focus:border-indigo-900 outline-none transition-colors rounded-sm text-gray-800 resize-none leading-relaxed"
              ></textarea>
            </div>

            {submitSuccess && (
              <div className="p-3 bg-green-50 border border-green-100 text-green-800 text-xs font-bold rounded-sm text-center">
                🟢 Your verified experience review is now live! Thank you for rating us.
              </div>
            )}

            <button
              type="submit"
              className="w-full text-center text-xs py-3 bg-indigo-950 font-bold uppercase tracking-widest text-white hover:bg-indigo-900 transition-colors rounded-sm active:scale-95 outline-none"
            >
              Post Live Experience
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
