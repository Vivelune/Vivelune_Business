"use client";

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import ReactLenis, { useLenis } from '@studio-freight/react-lenis';
import * as THREE from 'three';

// --- Responsive 3D Component ---
function WeddingRings({ scrollProgress }: { scrollProgress: any }) {
  const ringGroup = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Mobile adjustment: Rings scale and position
  const isMobile = viewport.width < 6;
  const responsiveScale = isMobile ? 1.5 : 2.2;
  const verticalOffset = isMobile ? 0.5 : 0; // Moves rings up on mobile to avoid text overlap

  useFrame(() => {
    if (ringGroup.current) {
      ringGroup.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={ringGroup} scale={responsiveScale} position={[0, verticalOffset, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[-0.25, 0, 0]}>
          <torusGeometry args={[0.8, 0.04, 32, 100]} />
          <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} envMapIntensity={2} />
        </mesh>
        <mesh rotation={[Math.PI / 2.5, 0.5, 0]} position={[0.25, 0, 0.1]}>
          <torusGeometry args={[0.75, 0.04, 32, 100]} />
          <meshStandardMaterial color="#E5C782" metalness={1} roughness={0.05} envMapIntensity={2.5} />
        </mesh>
      </group>
    </Float>
  );
}

const DecorativeFrame = () => (
  <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#C5A059]/30 pointer-events-none z-[-1]" />
);

export default function UltimateWeddingExperience() {
  const [isRevealed, setIsRevealed] = useState(false);
  const container = useRef(null);
  const lenis = useLenis();

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  // 1. AUTO-OPEN ENVELOPE ON LOAD
  useEffect(() => {
    const timer = setTimeout(() => {
      handleOpen();
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  // 2. MOBILE-FIRST AUTO-SCROLL LOGIC
  useEffect(() => {
    if (isRevealed && lenis) {
      // Small delay after reveal to let the user see the first section
      const scrollTimer = setTimeout(() => {
        // lenis.scrollTo handles the physics smoothly on mobile
        lenis.scrollTo('bottom', {
          duration: 18, // Slightly slower for readability on small screens
          easing: (t) => t, // Linear for a constant cinematic crawl
          lock: false, // Allows user to interrupt if they want to stop and read
        });
      }, 3000); 

      return () => {
        clearTimeout(scrollTimer);
        lenis.stop(); // Clean up on unmount
      };
    }
  }, [isRevealed, lenis]);

  const handleOpen = () => {
    const tl = gsap.timeline();
    tl.to(".flap", { rotateX: 160, duration: 1.2, ease: "power4.inOut" })
      .to(".envelope-wrapper", { y: -100, scale: 0.8, opacity: 0, duration: 1.2, ease: "power4.in" }, "-=0.2")
      .add(() => setIsRevealed(true));
  };

  return (
    <ReactLenis root options={{ lerp: 0.07, smoothWheel: true }}>
      <main ref={container} className="bg-gradient-to-b from-[#F9F7F2] via-[#EBE8DF] to-[#1A1A1A] text-[#1A1A1A] font-serif overflow-hidden min-h-screen">
        
        <AnimatePresence>
          {!isRevealed && (
            <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#F9F7F2]" exit={{ opacity: 0, transition: { duration: 1.5 } }}>
              <div className="envelope-wrapper relative cursor-pointer" onClick={handleOpen}>
                <div className="w-[280px] h-[190px] md:w-[320px] md:h-[220px] bg-[#FFFFFF] rounded-sm shadow-2xl flex items-center justify-center border border-[#C5A059]/20">
                  <div className="flap absolute top-0 left-0 w-full h-1/2 bg-[#F4F1EA] origin-top border-b border-[#C5A059]/20 z-10 shadow-sm" />
                  <div className="p-4 md:p-6 border border-[#C5A059]/30 m-3 w-full h-[calc(100%-1.5rem)] flex flex-col items-center justify-center space-y-3">
                    <div className="w-10 h-10 border border-[#C5A059] rotate-45 flex items-center justify-center">
                      <span className="rotate-[-45deg] text-[#C5A059] text-[10px] font-bold">S&B</span>
                    </div>
                    <p className="text-[#C5A059] tracking-[0.4em] text-[8px] md:text-[9px] uppercase font-sans font-bold">Wedding Invitation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`transition-opacity duration-1000 ${isRevealed ? "opacity-100" : "opacity-0"}`}>
          <div className="fixed inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <Suspense fallback={null}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} intensity={2} color="#C5A059" />
                <WeddingRings scrollProgress={scrollYProgress} />
                <ContactShadows opacity={0.2} scale={10} blur={2} far={4.5} />
                <Sparkles count={60} scale={12} size={0.8} speed={0.3} color="#C5A059" />
              </Suspense>
            </Canvas>
          </div>

          <div className="relative z-10">
            {/* Section 1: Intro */}
            <section className="h-[100svh] flex items-center justify-center px-6">
              <motion.div 
                className="relative max-w-4xl w-full py-12 md:py-20 px-6 md:px-10 text-center bg-white/40 backdrop-blur-md border border-[#C5A059]/20 shadow-xl"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              >
                <DecorativeFrame />
                <h4 className="text-[#B38B3F] tracking-[0.1em] text-2xl md:text-6xl mb-6 md:mb-10 font-sans leading-relaxed">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</h4>
                <p className="text-[#1A1A1A] uppercase tracking-[0.2em] text-xs md:text-xl mb-4 md:mb-6 font-semibold">Mohammad Shafique & Habib Ahmad Bhatti</p>
                <h2 className="text-lg md:text-2xl font-light italic text-[#1A1A1A]/70">Invite you to the wedding of</h2>
              </motion.div>
            </section>

            {/* Section 2: Couple */}
            <section className="h-[100svh] flex items-center justify-center px-4">
              <motion.div 
                className="relative max-w-5xl w-full py-16 md:py-24 px-6 text-center bg-white/20 backdrop-blur-sm border border-[#C5A059]/10"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              >
                <DecorativeFrame />
                <h1 className="text-5xl md:text-[140px] leading-tight md:leading-none mb-4 tracking-tight font-bold text-[#1A1A1A]">
                  Amal <span className="text-[#C5A059] font-light italic text-2xl md:text-7xl block md:inline">&</span> Harris
                </h1>
                <p className="text-[#B38B3F] tracking-[0.5em] text-md md:text-2xl uppercase mt-4 font-black">April 10th, 2026</p>
              </motion.div>
            </section>

            {/* Section 3: Details */}
            <section className="min-h-screen py-20 flex items-center justify-center px-6">
              <motion.div 
                className="max-w-2xl w-full bg-[#1A1A1A] text-[#F9F7F2] border border-[#C5A059]/40 p-8 md:p-20 text-center space-y-10 relative shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              >
                <DecorativeFrame />
                <div className="space-y-4">
                  <h3 className="text-[#C5A059] uppercase tracking-[0.4em] text-[9px] font-sans font-black">The Celebration</h3>
                  <p className="text-3xl md:text-6xl font-light">Barat Ceremony</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-4">
                  <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#C5A059]/20 pb-8 md:pb-0">
                    <p className="text-[#C5A059] text-[9px] uppercase tracking-widest font-bold">When</p>
                    <p className="text-xl md:text-2xl">Friday, 7:00 PM</p>
                    <p className="text-[#F9F7F2]/60 text-xs italic font-sans">April 10th, 2026</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#C5A059] text-[9px] uppercase tracking-widest font-bold">Where</p>
                    <p className="text-xl md:text-2xl">Dehleez Marquee</p>
                    <p className="text-[#F9F7F2]/60 text-xs italic font-sans">H-13, Islamabad</p>
                  </div>
                </div>
                <motion.a 
                  whileTap={{ scale: 0.95 }}
                  href="https://goo.gl/maps/example" 
                  className="inline-block mt-4 bg-[#C5A059] text-[#1A1A1A] px-10 py-4 text-[9px] uppercase tracking-[0.3em] font-black"
                >
                  Explore Venue
                </motion.a>
              </motion.div>
            </section>

            {/* Section 4: RSVP */}
            <section className="h-[100svh] flex flex-col items-center justify-center text-center px-6">
              <motion.div 
                className="relative max-w-3xl w-full py-16 md:py-20 px-6 bg-[#1A1A1A]/90 backdrop-blur-xl border border-[#C5A059]/20 space-y-10 shadow-2xl"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              >
                <DecorativeFrame />
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-7xl font-light italic text-[#F9F7F2]">Will you join us?</h2>
                  <p className="text-[#C5A059] tracking-widest uppercase text-[10px] font-black font-sans">Please RSVP by March 25th</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                  <a href="tel:+923319862836" className="w-full md:min-w-[240px] px-8 py-5 bg-[#C5A059] text-[#1A1A1A] text-[10px] uppercase tracking-[0.3em] font-black shadow-xl">
                    Call to Confirm
                  </a>
                  <a href="https://wa.me/923319862836" className="w-full md:min-w-[240px] px-8 py-5 border border-[#F9F7F2]/30 text-[#F9F7F2] text-[10px] uppercase tracking-[0.3em] font-bold">
                    WhatsApp Message
                  </a>
                </div>
              </motion.div>
            </section>
          </div>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;600;900&display=swap');
          body { background-color: #F9F7F2; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; }
          .font-sans { font-family: 'Inter', sans-serif; }
          .font-serif { font-family: 'Playfair Display', serif; }
          .h-screen { height: 100svh; }
          
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #F9F7F2; }
          ::-webkit-scrollbar-thumb { background: #C5A059; border-radius: 10px; }
        `}</style>
      </main>
    </ReactLenis>
  );
}