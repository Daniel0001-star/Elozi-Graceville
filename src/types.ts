/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  imageUrl: string;
  description: string;
  isRandomSeeded?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  purchasedItem: string;
  avatarUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const BUSINESS_CATEGORIES = {
  "Men's Apparel": "Sartorial suits, premium tees, and tailored activewear.",
  "Men's Accessories": "Luxury timepieces, leather belts, and refined cufflinks.",
  "Men's Footwear": "Handcrafted dress shoes, performance sneakers, and smart loafers.",
  "Women's Apparel": "Bespoke evening gowns, chic designer trousers, and seasonal pieces.",
  "Women's Accessories": "Fine jewelry, polarized sunglasses, and silk scarves.",
  "Women's Footwear": "Stiletto heels, leather boots, and elegant slip-on flats.",
  "Bags & Clutches": "Exclusive tote bags, evening clutches, and leather satchels.",
  "Kiddies & Teens Apparel": "Playful everyday sets, toddler shirts, and schoolwear.",
  "Kiddies & Teens Accessories": "Cute cartoon watches, backpacks, and safety gear.",
  "Kiddies & Teens Footwear": "Comfort trainers, light-up boys/girls shoes, and soft booties.",
  "Back to School": "Durable school bags, stationery boxes, and hydration flasks.",
  "Toys": "Cognitive wooden sets, remote cars, and board games.",
  "Home & Kitchen Appliances": "Dual smart air fryers, multi-zone ovens, and blender sets.",
  "Decor & Interior Design": "Ceramic centerpiece vases, luxury throws, and custom clocks.",
  "Daily Essentials": "Hygiene products, organic cleansing, and home supplies.",
  "Health & Wellness": "Vitamins, organic supplements, and posture adjusters.",
  "Beauty & Cosmetics": "Brightening serums, moisture-rich lipsticks, and eye palettes."
};

export type CategoryKey = keyof typeof BUSINESS_CATEGORIES;
