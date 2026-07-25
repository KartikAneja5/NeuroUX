import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiSparkles } from 'react-icons/fi';
import ProductCard from './ProductCard';

export default function RecommendationCarousel({ title = "Recommended For You", subtitle = "AI-powered recommendations based on your browsing activity", products = [] }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="py-12 select-none">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 px-1">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <FiSparkles size={14} className="animate-pulse" />
            Hybrid AI Recommender
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-[#8b7fb5] mt-1 font-light">{subtitle}</p>}
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-zinc-300 hover:text-white transition active:scale-95"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-zinc-300 hover:text-white transition active:scale-95"
            aria-label="Scroll right"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth py-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((p, idx) => (
          <motion.div
            key={p._id || p.id || idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="w-[280px] sm:w-[320px] shrink-0"
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
