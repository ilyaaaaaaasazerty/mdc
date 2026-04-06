"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';

interface Category {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  order: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [order, setOrder] = useState('1');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const qs = await getDocs(collection(db, 'categories'));
      const data = qs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)).sort((a,b) => a.order - b.order);
      setCategories(data);
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
         console.error("Upload failed", err);
       }
    }

    try {
      await addDoc(collection(db, 'categories'), {
        title,
        titleAr,
        description,
        descriptionAr,
        order: Number(order),
        image: uploadedImageUrl,
      });
      
      setTitle(''); setTitleAr(''); setDescription(''); setDescriptionAr(''); setOrder('1');
      setImageFile(null); setImagePreview(null);
      setIsAdding(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to save Category.");
    } finally {
      setUploading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if(confirm("Delete this category? It will remove it from the homepage vertical scroll.")) {
       await deleteDoc(doc(db, 'categories', id));
       fetchCategories();
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
         <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Category Matrix</h1>
            <p className="text-neutral-500 text-sm">Control the 4-part alternating vertical scroll sequence on the homepage.</p>
         </div>
         <button onClick={() => setIsAdding(!isAdding)} className={`px-6 py-3 font-bold uppercase tracking-widest text-xs transition-colors rounded-lg border duration-300 ${isAdding ? 'bg-transparent border-neutral-700 text-white hover:border-neutral-500 hover:text-red-400' : 'bg-[#FF6A00] text-black border-[#FF6A00] hover:bg-white hover:border-white shadow-[0_0_20px_rgba(255,106,0,0.2)]'}`}>
            {isAdding ? 'Close Panel' : '+ Mount New Sequence Panel'}
         </button>
      </div>

      <div className="flex flex-col gap-8 relative">
         {/* FORM DRAWER */}
         {isAdding && (
         <div className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl p-8 mb-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-10 duration-500 z-10 relative">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF6A00] mb-8">Scroll Sequence Configuration Panel</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Title (EN)</label>
                      <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none transition-colors" required />
                   </div>
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Title (AR - Arabic)</label>
                      <input type="text" value={titleAr} onChange={e => setTitleAr(e.target.value)} dir="rtl" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none transition-colors" required />
                   </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Description (EN)</label>
                      <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-white text-sm focus:border-[#FF6A00] outline-none min-h-[120px] transition-colors" required></textarea>
                   </div>
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Description (AR - Arabic)</label>
                      <textarea value={descriptionAr} onChange={e => setDescriptionAr(e.target.value)} dir="rtl" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-white text-sm focus:border-[#FF6A00] outline-none min-h-[120px] transition-colors" required></textarea>
                   </div>
               </div>

               <div>
                  <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Sequence Order (1-4)</label>
                  <input type="number" value={order} onChange={e => setOrder(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none w-1/4" min="1" max="10" required />
               </div>

               <div className="pt-4 border-t border-white/5">
                  <label className="block text-xs uppercase font-bold text-neutral-400 mb-3">Panel Showcase Image</label>
                  <input type="file" id="catImg" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <label htmlFor="catImg" className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${imagePreview ? 'border-[#FF6A00] bg-black/20' : 'border-neutral-800 hover:border-neutral-600 bg-neutral-900'}`}>
                     {imagePreview ? (
                        <div className="relative w-full h-full p-4"><Image src={imagePreview} alt="Preview" fill className="object-contain" /></div>
                     ) : (
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Click to Upload Scene Image</div>
                     )}
                  </label>
               </div>

               <div className="flex justify-end pt-4">
                   <button type="submit" disabled={uploading} className="px-10 bg-[#FF6A00] text-black font-black uppercase tracking-widest text-sm py-4 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                      {uploading ? 'Processing...' : 'Mount Category Scene'}
                   </button>
               </div>
            </form>
         </div>
         )}

         {/* FULL WIDTH LISTING */}
         <div className="w-full">
             <div className="space-y-4">
                 {loading ? (
                    <div className="text-white">Loading database...</div>
                 ) : categories.length === 0 ? (
                    <div className="text-neutral-500 text-sm">No categories configured. The homepage scroll sequence will be empty.</div>
                 ) : (
                    categories.map(c => (
                       <div key={c.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col md:flex-row items-stretch h-auto md:h-32 group hover:border-[#FF6A00]/50 transition-colors">
                           <div className="w-full md:w-40 bg-[#050505] relative flex-shrink-0 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800 aspect-video md:aspect-auto">
                               <Image src={c.image || '/images/products/sofa.png'} alt={c.title} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                               <div className="absolute top-2 left-2 w-6 h-6 bg-[#FF6A00] text-black flex items-center justify-center font-bold text-xs rounded-full shadow-[0_0_10px_rgba(255,106,0,0.5)]">
                                  {c.order}
                               </div>
                           </div>
                           <div className="p-6 flex-1 flex flex-col justify-center">
                               <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                  <div className="flex-1">
                                     <h3 className="font-bold text-white uppercase tracking-wider mb-2">{c.title}</h3>
                                     <p className="text-xs text-neutral-500 line-clamp-2 md:line-clamp-1">{c.description}</p>
                                  </div>
                                  <div className="flex-1 md:text-right border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-4">
                                     <h3 className="font-bold text-white uppercase mb-2" dir="rtl">{c.titleAr}</h3>
                                     <p className="text-xs text-neutral-500 line-clamp-2 md:line-clamp-1" dir="rtl">{c.descriptionAr}</p>
                                  </div>
                               </div>
                           </div>
                           <div className="w-full md:w-20 border-t md:border-t-0 md:border-l border-neutral-800 flex items-center justify-center p-4 hover:bg-red-500/10 transition-colors cursor-pointer group" onClick={() => deleteCategory(c.id)}>
                               <span className="text-[10px] text-neutral-400 font-bold uppercase md:rotate-90 md:origin-center tracking-widest whitespace-nowrap group-hover:text-red-500 transition-colors">Delete Pattern</span>
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
