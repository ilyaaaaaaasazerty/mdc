"use client";

import React, { useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
   const pathname = usePathname();
   const locale = pathname.split('/')[1] || 'fr';
   const isArabic = locale === 'ar';
   const rtlDir = isArabic ? -1 : 1;
   const mainRef = useRef<HTMLElement>(null);

   const fallbackCats = [
      { id: 1, title: isArabic ? "كراسي جلوس" : "Signature Chairs", desc: isArabic ? "قوام صلب وراحة استثنائية تدوم." : "Exceptional comfort designed for generations.", img: "/images/products/sofa.png" },
      { id: 2, title: isArabic ? "أرائك فاخرة" : "Luxury Sofas", desc: isArabic ? "الفخامة التي يتمركز حولها منزلك." : "The centerpiece of your modern living space.", img: "/images/products/sofa.png" },
      { id: 3, title: isArabic ? "طاولات طعام" : "Dining Tables", desc: isArabic ? "حيث تلتقي العائلة بتصميم لا يتقادم." : "Where timeless design meets durability.", img: "/images/products/table.png" },
      { id: 4, title: isArabic ? "أسرّة مريحة" : "Premium Beds", desc: isArabic ? "ملاذك الخاص، هندسة لراحة لا تضاهى." : "Your personal sanctuary, engineered for rest.", img: "/images/products/bed.png" }
   ];

   const [categories, setCategories] = useState<any[]>(fallbackCats);
   const [heroSettings, setHeroSettings] = useState<any>({
      titleEn: "CRAFTED", titleAr: "حضور", subEn: "PRESENCE", subAr: "مُتقن", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000"
   });

   useEffect(() => {
      async function fetchGlobalState() {
         try {
            const catSnap = await getDocs(collection(db, 'categories'));
            const catData = catSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.order - b.order);
            if (catData.length > 0) setCategories(catData);

            const heroSnap = await getDoc(doc(db, 'settings', 'hero'));
            if (heroSnap.exists()) {
               setHeroSettings(heroSnap.data());
            }
         } catch (error) {
            console.error("Firebase fetch bypassed safely for preview mode.");
         }
      }
      fetchGlobalState();
   }, [isArabic]);

   useGSAP(() => {
      ScrollTrigger.getAll().forEach(t => t.kill());

      // ==========================================
      // 1. THE FADE CURTAIN & HERO SEQUENCE
      // ==========================================
      const heroTl = gsap.timeline({
         scrollTrigger: {
            trigger: ".hero-pin-wrapper",
            start: "top top",
            end: "+=2000px",  // Complete scroll duration
            pin: true,
            scrub: true,
         }
      });

      // Phase 1: Curtains slowly slide apart slightly AND dramatically fade out to reveal the hero
      heroTl.to(".curtain-left", { xPercent: -30, duration: 1, ease: "power2.inOut" }, 0)
         .to(".curtain-right", { xPercent: 30, duration: 1, ease: "power2.inOut" }, 0)
         .to(".curtain-door", { opacity: 0, duration: 1.2, ease: "power2.out" }, 0)
         .to(".hero-inner", { scale: 1, filter: "blur(0px)", opacity: 1, duration: 1, ease: "power2.out" }, 0)
         .to(".scroll-indicator", { opacity: 0, duration: 0.2 }, 0)

         // Phase 2: Hold the beautifully revealed Image and Text
         .to(".hero-inner", { duration: 0.4 }, 0.4)

         // Phase 3: The hero fades out completely to enter the normal website
         .to(".hero-inner", { opacity: 0, scale: 1.05, duration: 0.4, ease: "none" }, 0.8);


      // ==========================================
      // 2. CATEGORY: ALTERNATING VERTICAL SEQUENCE
      // ==========================================
      gsap.utils.toArray('.cat-section').forEach((section: any, i) => {
         const isEven = i % 2 === 0;
         const imgBlock = section.querySelector('.cat-img-block');
         const textBlock = section.querySelector('.cat-text-block');

         if (imgBlock) {
            gsap.fromTo(imgBlock,
               { opacity: 0, x: isEven ? -200 * rtlDir : 200 * rtlDir },
               { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 75%" } }
            );
         }
         if (textBlock) {
            gsap.fromTo(textBlock,
               { opacity: 0, x: isEven ? 200 * rtlDir : -200 * rtlDir },
               { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 75%" } }
            );
         }
      });

      // --- BIG CATEGORY HEADER ---
      gsap.fromTo(".cat-title-text",
         { y: 150, opacity: 0 },
         { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: ".cat-header-trigger", start: "top 80%" } }
      );
      gsap.fromTo(".cat-title-text-front",
         { y: 150, opacity: 0, scale: 0.9 },
         { y: 0, opacity: 1, scale: 1, duration: 1.5, delay: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".cat-header-trigger", start: "top 80%" } }
      );

      // --- 3. SIGNATURE PRODUCT --- 
      gsap.fromTo(".s3-render",
         { rotationY: rtlDir * 15, scale: 0.95, opacity: 0 },
         { rotationY: 0, scale: 1, opacity: 1, scrollTrigger: { trigger: ".scene-3", start: "top 70%", end: "center center", scrub: 1 } }
      );
      gsap.fromTo(".s3-spec",
         { opacity: 0, x: rtlDir * 30 },
         { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: ".scene-3", start: "top 50%" } }
      );

      // --- 4. STORY (Dark to Light Transition) ---
      gsap.to(".scene-4", {
         backgroundColor: "#FFFFFF",
         color: "#0B0B0B",
         scrollTrigger: { trigger: ".scene-4", start: "top 60%", end: "top 20%", scrub: true }
      });
      gsap.fromTo(".s4-word",
         { opacity: 0.1, y: 10 }, { opacity: 1, y: 0, duration: 1, stagger: 0.05, ease: "power2.out", scrollTrigger: { trigger: ".scene-4", start: "top 40%" } }
      );

      // --- 5. CATALOGUE PREVIEW ---
      gsap.fromTo(".s5-item",
         { opacity: 0, scale: 0.9, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)", scrollTrigger: { trigger: ".scene-5", start: "top 60%" } }
      );

      // --- 6. MATERIAL STRIP ---
      gsap.fromTo(".s6-mat-img", { scale: 1.2 }, { scale: 1, duration: 1.5, ease: "power2.out", scrollTrigger: { trigger: ".scene-6", start: "top bottom", scrub: true } });
      gsap.fromTo(".s6-mat-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "expo.out", scrollTrigger: { trigger: ".scene-6", start: "top 50%" } });

      // --- 7. SOCIAL PROOF (Stats Counter) ---
      gsap.fromTo(".s7-stat",
         { innerText: 0 },
         {
            innerText: (i: number, target: HTMLElement) => target.dataset.target,
            duration: 2,
            snap: { innerText: 1 },
            ease: "power3.out",
            scrollTrigger: { trigger: ".scene-7", start: "top 70%" }
         }
      );
      gsap.fromTo(".s7-wrap", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: ".scene-7", start: "top 70%" } });

      // --- 8. FINAL CTA ---
      gsap.fromTo(".s8-cta", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".scene-8", start: "top 60%" } });

   }, { scope: mainRef, dependencies: [locale, categories, heroSettings] });

   const brandColors = { main: "#0B0B0B", accent: "#FF6A00", white: "#FFFFFF" };

   return (
      <main ref={mainRef} className="relative font-sans overflow-hidden" dir={isArabic ? 'rtl' : 'ltr'} style={{ backgroundColor: brandColors.main, color: brandColors.white }}>

         {/* ==================================================== */}
         {/* 1. THE FADE-REVEAL HERO SEQUENCE                     */}
         {/* ==================================================== */}
         <div className="hero-pin-wrapper relative w-full h-[100svh] overflow-hidden bg-black">

            {/* A. The Background Content (Reveals when Curtains dissolve) */}
            <div className="hero-inner absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none will-change-transform z-10 opacity-0 scale-95 blur-md">
               <div className="absolute inset-0 z-0 bg-cover bg-center opacity-60 mix-blend-luminosity" style={{ backgroundImage: `url('${heroSettings.image}')` }}></div>
               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center">
                  <h1 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none uppercase text-white drop-shadow-2xl" style={{ fontFamily: isArabic ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}>
                     {isArabic ? heroSettings.titleAr : heroSettings.titleEn}<br />
                     <span className="text-transparent stroke-text" style={{ WebkitTextStroke: "2px rgba(255,255,255,1)" }}>{isArabic ? heroSettings.subAr : heroSettings.subEn}</span>
                  </h1>
               </div>
            </div>

            {/* B. The Dark Curtains (Shadowed sliding doors on top z-50) */}
            <div className="curtain-door absolute inset-0 z-50 flex pointer-events-none will-change-[opacity]">

               {/* Left Curtain */}
               <div className="curtain-left relative w-1/2 h-full bg-[#0B0B0B] flex flex-col items-end justify-center overflow-hidden shadow-[20px_0_100px_rgba(0,0,0,1)] will-change-transform">
                  <span className="relative z-10 font-mono tracking-[0.5em] text-white/5 uppercase mr-8">Athath</span>
               </div>

               {/* Right Curtain */}
               <div className="curtain-right relative w-1/2 h-full bg-[#0B0B0B] flex flex-col items-start justify-center overflow-hidden shadow-[-20px_0_100px_rgba(0,0,0,1)] will-change-transform">
                  <span className="relative z-10 font-mono tracking-[0.5em] text-white/5 uppercase ml-8">Al Thiqa</span>
               </div>

               {/* Scroll Indicator */}
               <div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-80 pointer-events-none z-50">
                  <div className="w-[1px] h-12 bg-gradient-to-b from-[#FF6A00] to-transparent mt-3 animate-pulse"></div>
                  <div className="text-[10px] mt-4 uppercase tracking-[0.3em] font-bold text-[#FF6A00] animate-bounce">
                     {isArabic ? "مرر للأسفل" : "Scroll to Reveal"}
                  </div>
               </div>
            </div>

         </div>

         {/* ---------------------------------------------------- */}
         {/* 2. CATEGORIES: ALTERNATING VERTICAL SEQUENCE */}
         {/* ---------------------------------------------------- */}
         <section className="relative w-full bg-[#0B0B0B] pb-32 border-t border-white/5 pt-32">
            
            {/* Cinematic Category Intro Text */}
            <div className="cat-header-trigger relative w-full container mx-auto px-6 mb-32 flex justify-center overflow-hidden">
               <h2 className="cat-title-text text-[15vw] md:text-[12vw] font-black uppercase text-white/5 tracking-tighter leading-none will-change-transform opacity-0" style={{ fontFamily: isArabic ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}>
                  {isArabic ? "المجموعات" : "CATÉGORIES"}
               </h2>
               <div className="cat-title-text-front absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                   <h2 className="text-[15vw] md:text-[12vw] font-black uppercase text-transparent stroke-text tracking-tighter leading-none" style={{ WebkitTextStroke: "1px rgba(255,106,0,0.4)", fontFamily: isArabic ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}>
                      {isArabic ? "المجموعات" : "CATÉGORIES"}
                   </h2>
               </div>
            </div>

            {categories.map((cat, index) => {
               const isEven = index % 2 === 0;
               return (
                  <div key={cat.id} className="cat-section relative w-full min-h-[90svh] flex items-center overflow-hidden py-12">
                     <div className={`container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isEven ? "" : "lg:mt-0"}`}>

                        <div className={`cat-img-block relative w-full aspect-square md:aspect-video lg:aspect-square flex justify-center items-center ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                           <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6A00]/5 to-transparent rounded-[40px] blur-3xl z-0"></div>

                           {/* Dynamic Images */}
                           <div className="relative z-10 w-4/5 aspect-square drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] will-change-transform">
                              <Image src={cat.image?.includes('http') || cat.image?.includes('/uploads') ? cat.image : (cat.img || '/images/products/sofa.png')} alt={cat.title} fill className="object-contain" />
                           </div>

                           <div className="absolute top-10 right-10 text-[10rem] font-black text-white/[0.02] pointer-events-none">
                              0{index + 1}
                           </div>
                        </div>

                        <div className={`cat-text-block flex flex-col justify-center space-y-8 z-20 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                           <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight" style={{ fontFamily: isArabic ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}>
                              {(isArabic && cat.titleAr) ? cat.titleAr : cat.title}
                           </h2>
                           <p className="text-white/50 text-xl font-light leading-relaxed max-w-lg">
                              {(isArabic && cat.descriptionAr) ? cat.descriptionAr : (cat.description || cat.desc)}
                           </p>
                           <div className="pt-8">
                              <button className="group flex items-center gap-4 text-sm tracking-widest font-bold uppercase transition-all duration-300">
                                 <span className="group-hover:text-[#FF6A00] transition-colors">{isArabic ? "تصفح الفئة" : "View Range"}</span>
                                 <span className={`h-[1px] bg-white group-hover:bg-[#FF6A00] transition-all ${isEven ? (rtlDir === 1 ? "w-8 group-hover:w-16 ml-0" : "w-8 group-hover:w-16 mr-0") : "w-16 group-hover:w-8"}`}></span>
                              </button>
                           </div>
                        </div>

                     </div>
                  </div>
               )
            })}
         </section>

         {/* 3. SIGNATURE PRODUCT (Showpiece) */}
         <section className="scene-3 relative w-full min-h-[100svh] bg-[#0B0B0B] py-32 border-t border-white/5 flex items-center">
            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="relative perspective-[1500px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6A00]/5 to-transparent rounded-3xl blur-3xl"></div>
                  <Image src="/images/products/table.png" alt="Signature Details" width={800} height={600} className="s3-render relative w-full h-auto drop-shadow-2xl will-change-transform z-10" />
               </div>
               <div className="flex flex-col justify-center">
                  <h2 className="text-4xl md:text-6xl font-black mb-12 leading-tight uppercase" style={{ fontFamily: isArabic ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}>
                     {isArabic ? "هندسة الجودة" : "Engineered Quality"}
                  </h2>
                  <div className="space-y-12">
                     <div className="s3-spec relative">
                        <div className="absolute top-0 w-12 h-[2px] bg-[#FF6A00]"></div>
                        <h3 className="text-2xl font-bold mt-4 mb-2">{isArabic ? "خشب الجوز الصلب" : "Solid Oak Frame"}</h3>
                        <p className="text-white/50 text-lg">Foundation built to outlast trends.</p>
                     </div>
                     <div className="s3-spec relative">
                        <div className="absolute top-0 w-12 h-[2px] bg-[#FF6A00]"></div>
                        <h3 className="text-2xl font-bold mt-4 mb-2">{isArabic ? "جلد إيطالي" : "Italian Aniline Leather"}</h3>
                        <p className="text-white/50 text-lg">Porous, breathable, and gains patina over time.</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 4. STORY (Dark -> Light) */}
         <section className="scene-4 relative w-full min-h-[100svh] py-32 flex flex-col items-center justify-center transition-colors duration-0 border-t border-white/5">
            <div className="container mx-auto px-6 max-w-5xl text-center">
               <h2 className="text-4xl md:text-7xl font-bold leading-snug tracking-tighter" style={{ fontFamily: isArabic ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}>
                  {(isArabic ? "من المواد الخام إلى مساحات المعيشة المصقولة." : "From raw material to refined living.").split(" ").map((word, i) => (
                     <span key={i} className="s4-word inline-block mx-2">{word}</span>
                  ))}
               </h2>
               <div className="mx-auto mt-20 w-full max-w-3xl aspect-video bg-zinc-200 rounded-3xl overflow-hidden shadow-2xl relative">
                  <Image src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600" alt="Factory to Living" fill className="object-cover mix-blend-multiply opacity-80" />
               </div>
            </div>
         </section>

         {/* 5. CATALOGUE PREVIEW (Fast Grid) */}
         <section className="scene-5 relative w-full min-h-[100svh] bg-[#0B0B0B] py-32 text-white border-t border-white/5 z-20">
            <div className="container mx-auto px-6">
               <div className="flex justify-between items-end mb-16">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide">{isArabic ? "التشكيلة" : "The Collection"}</h2>
                  <button className="text-sm tracking-widest font-bold uppercase pb-1 border-b border-white hover:border-[#FF6A00] hover:text-[#FF6A00] transition-colors">{isArabic ? "عرض الكل" : "View All"}</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                     <div key={item} className="s5-item group relative aspect-[4/5] bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between p-6 cursor-pointer hover:border-[#FF6A00]/50 transition-colors duration-300">
                        <div className="relative w-full h-[60%] flex items-center justify-center">
                           <Image src="/images/products/sofa.png" alt="Prod" width={400} height={300} className="w-[80%] h-auto object-contain group-hover:scale-110 transition-transform duration-700 ease-out" />
                        </div>
                        <div className="flex justify-between items-end">
                           <div>
                              <h3 className="text-xl font-bold uppercase tracking-wider mb-1">Armchair 0{item}</h3>
                              <p className="text-white/40 text-sm">Walnut / Leather</p>
                           </div>
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 text-[#FF6A00] font-bold">
                              $1,200
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 6. MATERIAL STRIP */}
         <section className="scene-6 relative w-full h-[60vh] bg-[#0B0B0B] flex overflow-hidden border-t border-white/5">
            <a href={`/${locale}/shop?material=solid-oak`} className="w-1/3 relative overflow-hidden group cursor-pointer">
               <Image src="https://images.unsplash.com/photo-1598425237654-4c05bb1528be?q=80&w=800" fill alt="Wood" className="s6-mat-img object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
               <div className="s6-mat-text absolute bottom-10 left-10 text-2xl font-bold uppercase tracking-widest text-white z-10 group-hover:text-[#FF6A00] transition-colors bg-black/40 px-4 py-2 backdrop-blur-sm border border-white/10">Solid Oak</div>
            </a>
            <a href={`/${locale}/shop?material=travertine`} className="w-1/3 relative overflow-hidden group border-x border-black cursor-pointer">
               <Image src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=800" fill alt="Marble" className="s6-mat-img object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
               <div className="s6-mat-text absolute bottom-10 left-10 text-2xl font-bold uppercase tracking-widest text-white z-10 group-hover:text-[#FF6A00] transition-colors bg-black/40 px-4 py-2 backdrop-blur-sm border border-white/10">Travertine</div>
            </a>
            <a href={`/${locale}/shop?material=leather`} className="w-1/3 relative overflow-hidden group cursor-pointer">
               <Image src="https://images.unsplash.com/photo-1512411030026-b847321e25e9?q=80&w=800" fill alt="Leather" className="s6-mat-img object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
               <div className="s6-mat-text absolute bottom-10 left-10 text-2xl font-bold uppercase tracking-widest text-white z-10 group-hover:text-[#FF6A00] transition-colors bg-black/40 px-4 py-2 backdrop-blur-sm border border-white/10">Aniline Leather</div>
            </a>
         </section>

         {/* 7. SOCIAL PROOF / STATS */}
         <section className="scene-7 relative w-full min-h-[60vh] bg-[#0B0B0B] flex flex-col items-center justify-center text-center py-20 border-t border-white/5">
            <div className="s7-wrap container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 divide-y md:divide-y-0 md:divide-x divide-white/10 rtl:divide-x-reverse">
               <div className="flex flex-col items-center pt-8 md:pt-0">
                  <div className="text-6xl md:text-8xl font-black mb-4"><span className="s7-stat" data-target="4">0</span>M+</div>
                  <div className="text-white/40 tracking-widest uppercase font-bold text-sm">Customers Worldwide</div>
               </div>
               <div className="flex flex-col items-center pt-8 md:pt-0">
                  <div className="text-6xl md:text-8xl font-black mb-4"><span className="s7-stat" data-target="12">0</span></div>
                  <div className="text-white/40 tracking-widest uppercase font-bold text-sm">Global Showrooms</div>
               </div>
               <div className="flex flex-col items-center pt-8 md:pt-0">
                  <div className="text-6xl md:text-8xl font-black mb-4"><span className="s7-stat" data-target="15">0</span></div>
                  <div className="text-white/40 tracking-widest uppercase font-bold text-sm">Years of Excellence</div>
               </div>
            </div>
         </section>

         {/* 8. FINAL CTA */}
         <section className="scene-8 relative w-full min-h-[70vh] bg-[#0B0B0B] flex items-center justify-center border-t border-white/5">
            <div className="s8-cta flex flex-col items-center text-center">
               <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tight" style={{ fontFamily: isArabic ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}>
                  {isArabic ? "صمم مساحتك" : "Design Your Space"}
               </h2>
               <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#FF6A00] text-white font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,106,0,0.4)] hover:shadow-[0_0_40px_rgba(255,106,0,0.6)] hover:bg-[#e65f00] transition-all duration-300">
                     Shop Now
                  </button>
                  <button className="px-12 py-5 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:border-white transition-colors">
                     View Catalogue PDF
                  </button>
               </div>
            </div>
         </section>

      </main>
   );
}
