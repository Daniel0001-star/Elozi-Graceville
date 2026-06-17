/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Upload, CircleCheck, AlertTriangle, RefreshCw, Plus, KeyRound, Database } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { BUSINESS_CATEGORIES, Product } from '../types';

interface AdminPanelProps {
  onAddProduct: (product: Product) => void;
  products: Product[];
  onDeleteProduct: (id: string) => void;
  onResetToDefaults: () => void;
}

export default function AdminPanel({
  onAddProduct,
  products,
  onDeleteProduct,
  onResetToDefaults
}: AdminPanelProps) {
  // --- AUTH LOGIC (No SessionStorage - Always asks for password) ---
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // --- FORM STATE (Matching your Database Properties) ---
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: "Men's Apparel" as keyof typeof BUSINESS_CATEGORIES,
    description: '',
    imageUrl: ''
  });

  const [uploading, setUploading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // --- FAST UPLOAD ALGORITHM (Image Compression) ---
  const compressImage = (file: File): Promise<Blob | File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1200; // Optimal for web performance

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(blob || file);
          }, 'image/jpeg', 0.8); // Compress to 80% quality JPEG
        };
      };
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'graceville123') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbError(null);
    const priceNum = parseFloat(form.price);

    if (!form.name || isNaN(priceNum) || priceNum <= 0) {
      alert("Please fill in a valid product name and price.");
      return;
    }

    setUploading(true);
    try {
      let finalImageUrl = form.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600';

      // 1. COMPRESS AND UPLOAD TO STORAGE
      if (selectedFile && isSupabaseConfigured && supabase) {
        const compressedBlob = await compressImage(selectedFile);
        const fileId = `${Date.now()}.jpg`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileId, compressedBlob, { contentType: 'image/jpeg' });

        if (uploadError) throw new Error(`Upload Error: ${uploadError.message}`);

        const { data } = supabase.storage.from('product-images').getPublicUrl(fileId);
        finalImageUrl = data?.publicUrl || finalImageUrl;
      }

      // 2. INSERT INTO DATABASE (Matching columns: name, price, category, image_url, description)
      if (isSupabaseConfigured && supabase) {
        const { data: insertedData, error: insertError } = await supabase
          .from('products')
          .insert([{
            name: form.name.trim(),
            price: priceNum,
            category: form.category,
            description: form.description.trim() || `${form.name} in ${form.category}`,
            image_url: finalImageUrl // Mapping to DB column name
          }])
          .select();

        if (insertError) throw new Error(`Database Error: ${insertError.message}`);
        
        if (insertedData) {
          // Send back to UI with camelCase property names
          onAddProduct({
            ...insertedData[0],
            imageUrl: insertedData[0].image_url
          });
        }
      } else {
        // Fallback for demo/local mode
        onAddProduct({
          id: Math.random().toString(36).substr(2, 9),
          name: form.name.trim(),
          price: priceNum,
          category: form.category,
          description: form.description.trim(),
          imageUrl: finalImageUrl
        });
      }

      // Reset UI
      setForm({ name: '', price: '', category: "Men's Apparel", description: '', imageUrl: '' });
      setSelectedFile(null);
      setFilePreview(null);
      alert("🟢 Success! Product added to live database.");
    } catch (err: any) {
      setDbError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-32">
        <div className="bg-white border border-black/10 rounded-sm p-8 shadow-sm flex flex-col items-center">
          <KeyRound size={22} className="text-indigo-900 mb-4" />
          <h2 className="text-2xl font-serif italic text-gray-950 mb-6">Authorized Access</h2>
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access Keyphrase..."
              className="w-full text-xs p-3 bg-[#FAF9F6] border border-black/10 text-center tracking-[0.3em] font-mono outline-none"
            />
            {loginError && <p className="text-[11px] text-red-600 font-bold text-center">Invalid Credentials</p>}
            <button type="submit" className="w-full py-3 bg-indigo-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-900 transition-all">
              Unlock Terminal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* DB Status Banner */}
      <div className={`p-4 rounded-2xl border mb-8 flex justify-between items-center ${isSupabaseConfigured ? 'bg-green-50 border-green-100 text-green-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
        <div className="flex items-center gap-3">
          {isSupabaseConfigured ? <CircleCheck size={20} className="text-green-600" /> : <AlertTriangle size={20} className="text-amber-600 animate-pulse" />}
          <div className="text-xs">
            <p className="font-black uppercase">{isSupabaseConfigured ? 'Supabase Database Active' : 'Local Sandbox Mode'}</p>
            <p className="opacity-70">{isSupabaseConfigured ? 'Items are saving to your live table.' : 'Connect Supabase to save permanently.'}</p>
          </div>
        </div>
        <button onClick={handleLock} className="text-[10px] font-black text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">LOCK BACKOFFICE</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Creation Column */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-black tracking-tight text-gray-900 uppercase">Add Product</h2>
            <p className="text-[10px] text-gray-400">Items sync instantly with the product table.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">Item Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="e.g. Vintage Suit"
                className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none bg-gray-50/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">Price (₦) *</label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none bg-gray-50/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value as any})}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none bg-gray-50/50"
                >
                  {Object.keys(BUSINESS_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">Description / Notes</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Details for the AI Stylist..."
                className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none bg-gray-50/50 resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">Fast Media Upload</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-400 transition bg-gray-50/30 cursor-pointer relative">
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload size={20} className="mx-auto mb-2 text-indigo-600" />
                <p className="text-xs font-bold text-gray-700">{selectedFile ? selectedFile.name : 'Choose high-quality photo'}</p>
                <p className="text-[9px] text-gray-400 mt-1 uppercase">Auto-compression enabled</p>
              </div>
            </div>

            {filePreview && (
              <img src={filePreview} alt="Preview" className="h-24 w-24 object-cover rounded-xl border border-gray-200" />
            )}

            {dbError && <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{dbError}</p>}

            <button
              type="submit"
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 transition-all shadow-lg"
            >
              {uploading ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
              <span>{uploading ? 'Processing & Uploading...' : 'Publish to Database'}</span>
            </button>
          </form>
        </div>

        {/* Existing Items Column */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-black tracking-tight text-gray-900 uppercase mb-4 flex items-center gap-2">
              <Database size={18} className="text-indigo-600" />
              Live Inventory ({products.length})
            </h2>
            <div className="overflow-y-auto max-h-[600px] divide-y divide-gray-50 pr-2">
              {products.map(p => (
                <div key={p.id} className="flex gap-4 py-4 items-center group">
                  <img src={p.imageUrl} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 tracking-wider font-mono">{p.category}</span>
                    <h4 className="font-extrabold text-sm text-gray-800 truncate mt-1">{p.name}</h4>
                    <p className="text-[10px] text-gray-400 truncate">{p.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-sm text-gray-900">₦{p.price.toLocaleString()}</p>
                    <button onClick={() => onDeleteProduct(p.id)} className="text-[10px] text-red-500 font-bold hover:underline mt-1">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}