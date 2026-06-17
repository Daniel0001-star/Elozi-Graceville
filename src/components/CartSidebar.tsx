/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Copy, Check, Upload, ArrowLeft, Send, Landmark } from 'lucide-react';
import { CartItem } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface CartSidebarProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

const BANK_DETAILS = {
  bank: "Zenith Corporate Bank",
  accountName: "Elozi-Graceville Retail Ltd",
  accountNumber: "1234567890",
  routingCode: "Lekki-055"
};

const ADMIN_WHATSAPP_NUMBER = "2348012345678"; // International format without +

export default function CartSidebar({
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart
}: CartSidebarProps) {
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment'>('review');
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState<string | null>(null);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Upload receipt and message Admin on WhatsApp
  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      let publicUrl = '';

      if (isSupabaseConfigured && supabase) {
        // 1. Upload to Supabase 'receipts' bucket
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `receipt-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, file, { cacheControl: '3600', upsert: true });

        if (uploadError) throw uploadError;

        // 2. Obtain Public URL
        const { data } = supabase.storage.from('receipts').getPublicUrl(fileName);
        publicUrl = data?.publicUrl || '';
      } else {
        // Fallback simulated upload url for demo mode
        publicUrl = `https://storage.googleapis.com/elozi-graceville-sandbox-receipts/demo-receipt-${Date.now()}.png`;
        // artificial delay
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setUploadedReceiptUrl(publicUrl);

      // Trigger automatic receipt notifications
      alert("🟢 Proof of payment registered successfully! Let's send the confirmation template to our office via WhatsApp.");
      
      const orderSummary = cart.map(i => `• ${i.name} (QTY: ${i.quantity})`).join('\n');
      const whatsappText = `Hello Elozi-Graceville, I've successfully completed the transfer!\n\n💳 *Order Total:* ₦${totalAmount.toLocaleString()}\n\n📦 *Order Items:*\n${orderSummary}\n\n🧾 *Receipt Image link:* ${publicUrl}\n\nPlease verify my payment and begin processing! Thank you.`;
      
      const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, '_blank');

      // Clear layout
      onClearCart();
      onClose();
    } catch (error: any) {
      console.error("Receipt upload failure:", error);
      alert(`Could not upload receipt: ${error.message || 'Check Supabase bucket settings.'}`);
    } finally {
      setUploading(false);
    }
  };

  // Direct WhatsApp helper for purchasing single or specific items directly without uploading receipts first
  const handleDirectWhatsAppOrder = () => {
    const orderSummary = cart.map(i => `• ${i.name} (QTY: ${i.quantity})`).join('\n');
    const whatsappText = `Hello Elozi-Graceville, I would like to place a direct purchase order!\n\n💰 *Total Amount:* ₦${totalAmount.toLocaleString()}\n\n🏬 *Items requested:*\n${orderSummary}\n\nPlease send me billing instructions!`;
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in relative">
        
        {/* Head */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-indigo-900 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-lg font-extrabold tracking-tight">Your Retail Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors outline-none"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Steps */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {checkoutStep === 'review' ? (
            cart.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-gray-400">Selected Items ({cart.length})</span>
                  <button 
                    onClick={onClearCart}
                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
                  >
                    Clear Catalog Items
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex gap-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100/50 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 line-clamp-1 leading-snug">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">
                          {item.category}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-indigo-700 mt-1">
                          ₦{item.price.toLocaleString()}
                        </p>
                        
                        {/* Adjust choices / quantities */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                            className="h-6 w-6 rounded bg-white text-gray-600 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-xs outline-none"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-xs font-bold w-6 text-center text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="h-6 w-6 rounded bg-white text-gray-600 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-xs outline-none"
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-600 self-start p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <span className="text-6xl block mb-4">🛍️</span>
                <h3 className="font-bold text-lg text-gray-700">Your shopping cart is empty</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                  Browse our apparel, footprint, electronics & styling categories and find premium collections.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition"
                >
                  Continue Shopping
                </button>
              </div>
            )
          ) : (
            /* Payment & Receipt Upload section */
            <div className="space-y-6">
              <button 
                onClick={() => setCheckoutStep('review')}
                className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800"
              >
                <ArrowLeft size={16} />
                <span>Return to Cart Summary</span>
              </button>

              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-2 right-2 text-indigo-100 shrink-0">
                  <Landmark size={36} />
                </div>
                
                <h3 className="font-extrabold text-sm text-indigo-900 uppercase tracking-tight mb-3">
                  Company Bank Account Details
                </h3>

                <div className="space-y-2 text-xs sm:text-sm text-indigo-800">
                  <p><span className="text-indigo-400 font-bold block text-[10px] uppercase">Bank Group:</span> {BANK_DETAILS.bank}</p>
                  <p><span className="text-indigo-400 font-bold block text-[10px] uppercase">Account Holder:</span> {BANK_DETAILS.accountName}</p>
                  <p><span className="text-indigo-400 font-bold block text-[10px] uppercase">Transit Routing Code:</span> {BANK_DETAILS.routingCode}</p>
                </div>

                <div className="mt-4 bg-white p-3 rounded-lg border border-indigo-200/50 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">Account Number</span>
                    <span className="font-mono font-extrabold text-sm text-gray-900 tracking-wider">
                      {BANK_DETAILS.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyAccount}
                    className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors border outline-none ${
                      copied 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                    title="Copy Account Number"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Upload Receipts */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">
                  Payment Verification Verification Step
                </h4>
                <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl py-8 px-6 text-center transition bg-gray-50 hover:bg-indigo-50/10 cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-105 transition">
                      <Upload size={18} />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      {uploading ? 'Registering transfer receipt...' : 'Click to Upload Invoice / Receipt'}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Upload receipt to alert the corporate accounts department on WhatsApp immediately
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Purchase Link Alternative */}
              <div className="text-center pt-2">
                <span className="text-[11px] text-gray-400 font-bold uppercase block mb-2">Or Alternative Checkout:</span>
                <button
                  type="button"
                  onClick={handleDirectWhatsAppOrder}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <Send size={12} />
                  <span>Send direct purchase list to local salesman instead</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Footer actions for non-empty Cart */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/70">
            <div className="flex justify-between items-center mb-4 text-base">
              <span className="font-bold text-gray-500">Order Estimator:</span>
              <span className="font-black text-indigo-900 text-lg sm:text-xl">
                ₦{totalAmount.toLocaleString()}
              </span>
            </div>

            {checkoutStep === 'review' ? (
              <div className="space-y-2">
                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/10 active:scale-95 transition-all outline-none"
                >
                  Proceed to Bank Checkout
                </button>
                <button
                  onClick={handleDirectWhatsAppOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-xl active:scale-95 transition-all outline-none"
                >
                  ⚡ Direct WhatsApp Order Link (Instant Invoice)
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCheckoutStep('review')}
                className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-800 py-2.5"
              >
                Back to Cart
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
