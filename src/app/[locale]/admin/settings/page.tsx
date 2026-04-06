"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';

interface HeroSettings {
  titleEn: string;
  titleAr: string;
  subEn: string;
  subAr: string;
  image: string;
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [titleEn, setTitleEn] = useState('CRAFTED');
  const [titleAr, setTitleAr] = useState('حضور');
  const [subEn, setSubEn] = useState('PRESENCE');
  const [subAr, setSubAr] = useState('مُتقن');
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'hero'));
      if (docSnap.exists()) {
        const data = docSnap.data() as HeroSettings;
        setTitleEn(data.titleEn || '');
        setTitleAr(data.titleAr || '');
        setSubEn(data.subEn || '');
        setSubAr(data.subAr || '');
        if(data.image) setCurrentImage(data.image);
      }
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let uploadedImageUrl = currentImage; 

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
      await setDoc(doc(db, 'settings', 'hero'), {
        titleEn,
        titleAr,
        subEn,
        subAr,
        image: uploadedImageUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setCurrentImage(uploadedImageUrl);
      setImageFile(null); setImagePreview(null);
      alert("Hero configurations synced to global state.");
    } catch (err) {
      console.error(err);
      alert("Failed to save Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Global Settings</h1>
            <p className="text-neutral-500 text-sm">Control the cinematic Hero entry sequence mapping.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
         {/* LEFT: Configuration */}
         <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF6A00] mb-8">Hero Architecture</h2>
            <form onSubmit={handleSave} className="space-y-6">
               
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-1">Primary Title (EN)</label>
                      <input type="text" value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none" required />
                   </div>
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-1">Sub-Title (EN)</label>
                      <input type="text" value={subEn} onChange={e => setSubEn(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none" required />
                   </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-1">Primary Title (AR - Arabic)</label>
                      <input type="text" value={titleAr} onChange={e => setTitleAr(e.target.value)} dir="rtl" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none" required />
                   </div>
                   <div>
                      <label className="block text-xs uppercase font-bold text-neutral-400 mb-1">Sub-Title (AR - Arabic)</label>
                      <input type="text" value={subAr} onChange={e => setSubAr(e.target.value)} dir="rtl" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white text-sm focus:border-[#FF6A00] outline-none" required />
                   </div>
               </div>

               <div className="pt-4">
                  <label className="block text-xs uppercase font-bold text-neutral-400 mb-2">Background Environment</label>
                  <p className="text-[10px] text-neutral-500 mb-4">This image is mapped contextually underneath the fading curtain mechanism.</p>
                  <input type="file" id="heroImg" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <label htmlFor="heroImg" className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${imagePreview ? 'border-[#FF6A00] bg-black/20' : 'border-neutral-800 hover:border-neutral-600 bg-neutral-950'}`}>
                     {imagePreview ? (
                        <div className="relative w-full h-full p-2"><Image src={imagePreview} alt="Preview" fill className="object-cover rounded-lg" /></div>
                     ) : (
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest text-center">
                           Change Cinematic Background<br/>
                           <span className="text-[10px] lowercase text-neutral-600 mt-2 block">(Currently active image loaded below)</span>
                        </div>
                     )}
                  </label>
               </div>

               <button type="submit" disabled={saving || loading} className="w-full mt-6 bg-[#FF6A00] text-black font-black uppercase tracking-widest text-sm py-4 rounded-xl hover:bg-[#e65f00] transition-colors disabled:opacity-50">
                  {saving ? 'Synchronizing...' : 'Save Global State'}
               </button>
            </form>
         </div>

         {/* RIGHT: Live Preview Context */}
         <div className="bg-black relative rounded-xl border border-neutral-800 overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
             <div className="absolute top-4 left-4 z-20 bg-black/50 px-3 py-1 rounded text-[10px] uppercase tracking-widest font-bold text-[#FF6A00] border border-white/10 backdrop-blur-md">
                Active Hero Preview
             </div>
             
             {/* Dynamic Hero Layout Replica */}
             <div className="absolute inset-0 z-0 bg-cover bg-center opacity-60 mix-blend-luminosity will-change-transform" style={{ backgroundImage: `url('${imagePreview || currentImage}')` }}></div>
             
             <div className="relative z-10 w-full max-w-sm flex justify-center perspective-[1000px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-2/3 bg-[#FF6A00] blur-[150px] rounded-full opacity-20 z-0 pointer-events-none"></div>
                <Image src="/images/products/sofa.png" alt="Sofa" width={600} height={300} priority className="w-[90%] h-auto drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative z-10" />
             </div>

             <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center mix-blend-difference opacity-100">
                <h1 className="text-[10vw] md:text-[6vw] font-black tracking-tighter leading-none uppercase text-transparent mt-10" style={{ fontFamily: "var(--font-montserrat)", WebkitTextStroke: "2px rgba(255,255,255,1)"}}>
                   {titleEn}<br />
                   <span className="text-white" style={{ WebkitTextStroke: "0px" }}>{subEn}</span>
                </h1>
             </div>
         </div>
      </div>
    </div>
  );
}
