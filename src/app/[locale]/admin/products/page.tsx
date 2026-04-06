"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  materials: string[];
  measures: string;
  image: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [materials, setMaterials] = useState('');
  const [measures, setMeasures] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const qs = await getDocs(collection(db, 'products'));
      const data = qs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Title is required");

    setUploading(true);
    let uploadedImageUrl = "/images/products/sofa.png";

    if (imageFile) {
       const formData = new FormData();
       formData.append('file', imageFile);
       try {
         const res = await fetch('/api/upload', { method: 'POST', body: formData });
         const json = await res.json();
         if(json.url) uploadedImageUrl = json.url;
       } catch (err) {
         console.error("Local upload failed", err);
       }
    }

    try {
      const matArray = materials.split(',').map(m => m.trim()).filter(m => m !== '');
      await addDoc(collection(db, 'products'), {
        title,
        description,
        price,
        materials: matArray,
        measures,
        image: uploadedImageUrl,
        createdAt: new Date().toISOString()
      });
      
      setTitle(''); setDescription(''); setPrice(''); setMaterials(''); setMeasures('');
      setImageFile(null); setImagePreview(null);
      setIsAdding(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product Data.");
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if(confirm("Delete this product?")) {
       await deleteDoc(doc(db, 'products', id));
       fetchProducts();
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
         <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Product Database</h1>
            <p className="text-neutral-500 text-sm">Create and modify catalog items with dimensional meta-data.</p>
         </div>
         <button onClick={() => setIsAdding(!isAdding)} className={`px-6 py-3 font-bold uppercase tracking-widest text-xs transition-all duration-300 rounded-lg border ${isAdding ? 'bg-transparent border-neutral-700 text-white hover:border-neutral-500 hover:text-red-400' : 'bg-[#FF6A00] text-black border-[#FF6A00] hover:bg-white hover:border-white shadow-[0_0_20px_rgba(255,106,0,0.2)]'}`}>
            {isAdding ? 'Close Panel' : '+ Mount New Product'}
         </button>
      </div>

      <div className="flex flex-col gap-8 relative">
         
         {/* FORM DRAWER */}
         {isAdding && (
         <div className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-8 mb-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-10 duration-500 z-10 relative">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF6A00] mb-8">Product Configuration Panel</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Title</label>
                      <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none transition-colors" placeholder="e.g. Signature Oak Desk" required />
                   </div>
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Price (Optional)</label>
                      <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none" placeholder="e.g. 1,200.00" />
                   </div>
               </div>
               
               <div>
                  <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-white text-sm focus:border-[#FF6A00] outline-none min-h-[120px] transition-colors" placeholder="Product story..."></textarea>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Measurements</label>
                      <input type="text" value={measures} onChange={e => setMeasures(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none" placeholder="L200 x W90 x H75 cm" />
                   </div>
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Materials (Comma Separated)</label>
                      <input type="text" value={materials} onChange={e => setMaterials(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none" placeholder="Solid Oak, Leather, Marble" />
                      <p className="text-[10px] text-neutral-500 mt-2">Tags map to dynamic storefront material filters.</p>
                   </div>
               </div>

               {/* Image Upload Box */}
               <div className="pt-4 border-t border-white/5">
                  <label className="block text-xs uppercase font-bold text-neutral-400 mb-3">Display Image</label>
                  <input type="file" id="prodImg" accept="image/*" onChange={handleImageChange} className="hidden" />
                  
                  <label htmlFor="prodImg" className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${imagePreview ? 'border-[#FF6A00] bg-black/20' : 'border-neutral-800 hover:border-neutral-600 bg-neutral-900'}`}>
                     {imagePreview ? (
                        <div className="relative w-full h-full p-4">
                            <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                        </div>
                     ) : (
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                           Click to Upload Primary Image
                        </div>
                     )}
                  </label>
               </div>

               <div className="flex justify-end pt-4">
                   <button type="submit" disabled={uploading} className="px-10 bg-[#FF6A00] text-black font-black uppercase tracking-widest text-sm py-4 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                      {uploading ? 'Processing & Saving...' : 'Deploy Product'}
                   </button>
               </div>
            </form>
         </div>
         )}

         {/* FULL WIDTH LISTING */}
         <div className="w-full">
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {loading ? (
                    <div className="text-white">Loading database...</div>
                 ) : products.length === 0 ? (
                    <div className="text-neutral-500 text-sm">No products found. Start cataloging.</div>
                 ) : (
                    products.map(p => (
                       <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group hover:border-[#FF6A00]/50 transition-colors">
                           <div className="relative w-full aspect-[4/3] bg-[#050505] p-6 flex items-center justify-center">
                               <Image src={p.image || '/images/products/sofa.png'} alt={p.title} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                           </div>
                           <div className="p-6">
                               <h3 className="font-bold text-white text-lg truncate mb-2">{p.title}</h3>
                               <div className="flex justify-between items-end mt-4 mb-4">
                                   <span className="text-[#FF6A00] font-bold">{p.price ? `$${p.price}` : '---'}</span>
                               </div>
                               <div className="flex flex-wrap gap-2 mb-4">
                                   {p.materials && p.materials.map(m => (
                                      <span key={m} className="text-[9px] uppercase font-bold text-neutral-300 border border-neutral-700 px-2 py-1 rounded-sm">{m}</span>
                                   ))}
                               </div>
                               {p.measures && <p className="text-[10px] text-neutral-500 font-mono py-2 border-t border-neutral-800">{p.measures}</p>}
                               <div className="flex justify-end mt-4 border-t border-neutral-800 pt-4">
                                   <button onClick={() => deleteProduct(p.id)} className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold hover:text-red-400">Remove</button>
                               </div>
                           </div>
                       </div>
                    ))
                 )}
             </div>
         </div>
      </div>
    </div>
  );
}
