import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiZap } from 'react-icons/fi';
import ComponentPreviewSwitcher from '../gallery-previews/InteractiveComponents';

export default function ProductGallery({ productId, mainImage, title }) {
  const [mode, setMode] = useState('preview'); // 'preview' | 'image'
  const images = [
    mainImage,
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-5 select-none">
      
      {/* Toggle View Mode */}
      <div className="flex bg-[#0f0e21] p-1 rounded-xl border border-white/5 self-start">
        <button
          onClick={() => setMode('preview')}
          className={`flex items-center gap-2 px-4.5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
            mode === 'preview'
              ? 'bg-violet-600 text-white shadow-glow-sm'
              : 'text-[#8b7fb5] hover:text-white'
          }`}
        >
          <FiZap size={13} />
          Interactive Live Preview
        </button>
        <button
          onClick={() => setMode('image')}
          className={`flex items-center gap-2 px-4.5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
            mode === 'image'
              ? 'bg-violet-600 text-white shadow-glow-sm'
              : 'text-[#8b7fb5] hover:text-white'
          }`}
        >
          <FiImage size={13} />
          Cover Images
        </button>
      </div>

      {/* Main Canvas Viewport */}
      <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/8 relative flex flex-col justify-center p-4">
        
        {mode === 'preview' ? (
          <div className="relative w-full h-full flex items-center justify-center bg-zinc-950 rounded-xl overflow-hidden border border-white/5 p-6">
            <div className="absolute inset-0 dot-grid-fine opacity-10 pointer-events-none" />
            <div className="relative z-10 w-full flex justify-center">
              <ComponentPreviewSwitcher productId={productId} />
            </div>
            
            {/* Overlay indicators */}
            <div className="absolute top-3 left-3 bg-violet-600/15 border border-violet-500/30 px-2 py-0.5 rounded text-[9px] font-bold text-violet-300 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Interactive Demo
            </div>
            
            {/* Protect right click/inspect inside preview */}
            <div 
              className="absolute inset-0 bg-transparent" 
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          </div>
        ) : (
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                src={images[activeIndex]}
                alt={`${title} preview`}
                className="w-full h-full object-cover rounded-xl"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </AnimatePresence>
            <div className="absolute top-3 right-3 glass rounded-md px-2.5 py-1 text-[10px] font-semibold text-[#8b7fb5] uppercase tracking-wider border border-white/8">
              Preview Only
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails (Only visible when viewing cover images) */}
      {mode === 'image' && (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? 'border-violet-500 shadow-glow-sm'
                  : 'border-white/8 opacity-50 hover:opacity-80 hover:border-white/20'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
