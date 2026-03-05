"use client";

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PresentationControls, Float, Sparkles, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import ReactLenis, { useLenis } from '@studio-freight/react-lenis'; // Added useLenis
import * as THREE from 'three';

// --- 3D Jewelry Component ---
function WeddingRings({ scrollProgress }: { scrollProgress: any }) {
  const ringGroup = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (ringGroup.current) {
      ringGroup.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={ringGroup} scale={2.2}>
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
  <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#C5A059]/20 pointer-events-none z-[-1]" />
);

export default function UltimateWeddingExperience() {
  const [isRevealed, setIsRevealed] = useState(false);
  const container = useRef(null);
  const lenis = useLenis(); // Access Lenis instance

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  // --- AUTO SCROLL LOGIC ---
  useEffect(() => {
    if (isRevealed && lenis) {
      // Small timeout to allow the "Entrance" transition to feel natural
      const timer = setTimeout(() => {
        lenis.scrollTo('bottom', {
          duration: 12, // Long duration for a "cinematic" slow crawl
          easing: (t) => t, // Linear easing for constant speed, or use your own
          immediate: false,
        });
      }, 2000); // Starts 2 seconds after the envelope opens

      return () => clearTimeout(timer);
    }
  }, [isRevealed, lenis]);

  const handleOpen = () => {
    const tl = gsap.timeline();
    tl.to(".flap", { rotateX: 160, duration: 1.2, ease: "power4.inOut" })
      .to(".envelope-wrapper", { y: -100, scale: 0.8, opacity: 0, duration: 1, ease: "power4.in" }, "-=0.2")
      .add(() => setIsRevealed(true));
  };

  return (
    <ReactLenis root options={{ lerp: 0.05 }}> {/* Slightly slower lerp for smoother auto-scroll */}
      <main ref={container} className="bg-[#030305] text-[#F9F7F2] font-serif overflow-hidden">
        
        <AnimatePresence>
          {!isRevealed && (
            <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050507]" exit={{ opacity: 0, transition: { duration: 1.5 } }}>
              <div className="envelope-wrapper relative cursor-pointer group" onClick={handleOpen}>
                <div className="w-[320px] h-[220px] bg-[#F4F1EA] rounded-sm shadow-2xl flex items-center justify-center border border-[#C5A059]/10">
                  <div className="flap absolute top-0 left-0 w-full h-1/2 bg-[#EBE8DF] origin-top border-b border-[#C5A059]/20 z-10 shadow-sm" />
                  <div className="p-6 border border-[#C5A059]/30 m-3 w-full h-[calc(100%-1.5rem)] flex flex-col items-center justify-center space-y-3">
                    <div className="w-10 h-10 border border-[#C5A059] rotate-45 flex items-center justify-center">
                      <span className="rotate-[-45deg] text-[#C5A059] text-[10px] font-bold tracking-tighter">S&B</span>
                    </div>
                    <p className="text-[#C5A059] tracking-[0.4em] text-[9px] uppercase font-sans font-medium">Open Invitation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`transition-opacity duration-1000 ${isRevealed ? "opacity-100" : "opacity-0"}`}>
          <div className="fixed inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
              <Suspense fallback={null}>
                <Environment preset="city" />
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} intensity={1.5} color="#C5A059" />
                <WeddingRings scrollProgress={scrollYProgress} />
                <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
                <Sparkles count={150} scale={12} size={0.6} speed={0.2} color="#C5A059" />
              </Suspense>
            </Canvas>
          </div>

          <div className="relative z-10">
            {/* Section 1: Introduction */}
            <section className="h-screen flex items-center justify-center px-6">
              <motion.div 
                className="relative max-w-4xl w-full py-20 px-10 text-center bg-[#030305]/40 backdrop-blur-sm border border-[#C5A059]/10"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              >
                <DecorativeFrame />
                <h4 className="text-[#D4AF37] tracking-[0.2em] text-3xl md:text-6xl mb-10 font-sans leading-relaxed">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</h4>
                <p className="text-[#F9F7F2] uppercase tracking-[0.3em] text-lg md:text-xl mb-6 font-medium">Mohammad Shafique & Habib Ahmad Bhatti</p>
                <h2 className="text-xl md:text-2xl font-light italic opacity-80">Invite you to the wedding of</h2>
              </motion.div>
            </section>

            {/* Section 2: The Couple */}
            <section className="h-screen flex items-center justify-center px-6">
              <motion.div 
                className="relative max-w-5xl w-full py-24 px-10 text-center bg-[#030305]/40 backdrop-blur-sm border border-[#C5A059]/10"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              >
                <DecorativeFrame />
                <h1 className="text-7xl md:text-[140px] leading-none mb-6 tracking-tight font-bold drop-shadow-2xl">
                  Amal <span className="text-[#C5A059] font-light italic text-4xl md:text-7xl block md:inline">&</span> Harris
                </h1>
                <p className="text-[#C5A059] tracking-[0.5em] text-sm uppercase mt-6 font-bold">April 10th, 2026</p>
              </motion.div>
            </section>

            {/* Section 3: Details Card */}
            <section className="min-h-screen py-32 flex items-center justify-center px-6">
              <motion.div 
                className="max-w-2xl w-full bg-[#050507]/90 backdrop-blur-xl border border-[#C5A059]/30 p-12 md:p-20 text-center space-y-12 relative shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              >
                <DecorativeFrame />
                <div className="space-y-4">
                  <h3 className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] font-sans font-bold">The Celebration</h3>
                  <p className="text-4xl md:text-6xl font-light">Barat Ceremony</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                  <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#C5A059]/20 pb-8 md:pb-0">
                    <p className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold">When</p>
                    <p className="text-2xl">Friday, 7:00 PM</p>
                    <p className="text-[#F9F7F2]/40 text-sm italic font-sans">April 10th, 2026</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold">Where</p>
                    <p className="text-2xl">Dehleez Marquee</p>
                    <p className="text-[#F9F7F2]/40 text-sm italic font-sans">H-13, Islamabad</p>
                  </div>
                </div>
                <motion.a 
                  whileHover={{ backgroundColor: '#F9F7F2', color: '#050507' }}
                  href="https://goo.gl/maps/example" 
                  className="inline-block mt-8 border border-[#C5A059] text-[#C5A059] px-12 py-4 text-[10px] uppercase tracking-[0.3em] font-black transition-all"
                >
                  Explore Venue
                </motion.a>
              </motion.div>
            </section>

            {/* Section 4: RSVP / Contact */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-6">
              <motion.div 
                className="relative max-w-3xl w-full py-20 px-10 bg-[#030305]/60 backdrop-blur-md border border-[#C5A059]/10 space-y-12"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              >
                <DecorativeFrame />
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-7xl font-light italic">Will you join us?</h2>
                  <p className="text-[#C5A059] tracking-widest uppercase text-xs font-bold font-sans">Please RSVP by March 25th</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <a 
                    href="tel:+923319862836" 
                    className="min-w-[260px] px-10 py-5 bg-[#C5A059] text-[#050507] text-[11px] uppercase tracking-[0.3em] font-black hover:scale-105 transition-all shadow-xl"
                  >
                    Call to Confirm
                  </a>
                  
                  <a 
                    href="https://wa.me/923319862836" 
                    className="min-w-[260px] px-10 py-5 border border-[#F9F7F2]/30 text-[#F9F7F2] text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-[#F9F7F2]/10 transition-all"
                  >
                    WhatsApp Message
                  </a>
                </div>
              </motion.div>
            </section>
          </div>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;600;900&display=swap');
          body { background-color: #030305; -webkit-font-smoothing: antialiased; }
          .font-sans { font-family: 'Inter', sans-serif; }
          .font-serif { font-family: 'Playfair Display', serif; }
        `}</style>
      </main>
    </ReactLenis>
  );
}