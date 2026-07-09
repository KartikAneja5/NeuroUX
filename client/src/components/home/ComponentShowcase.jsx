import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  'Hero', 'Features', 'Navigation', 'CTA', 'Stats', '404', 'Showcase', 'Social Proof'
];

export default function ComponentShowcase() {
  const [activeCategory, setActiveCategory] = useState('Hero');

  return (
    <section className="py-24 bg-[#0a0913] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      
      {/* Soft central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-900/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
            Start with premium assets
          </h2>
          <p className="text-lg text-[#8b7fb5]">
            Thousands of templates and UI kits. Responsive, animated, ready to ship.
          </p>
        </motion.div>

        {/* Categories Marquee / List */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-white/10 text-white border-white/20 shadow-glow-sm' 
                  : 'bg-transparent text-[#5a5275] hover:text-[#8b7fb5] border-transparent hover:bg-white/5'
              } border`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Showcase Canvas */}
        <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-2xl glass-strong border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              {/* Dummy UI Block Representation based on category */}
              <div className="w-full h-full border border-white/5 bg-[#080712]/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Abstract geometric shapes to represent a UI component */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl" />
                
                <div className="text-center z-10">
                  <div className="w-12 h-12 mx-auto bg-white/10 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-violet-400 font-mono text-xl">{'</>'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{activeCategory} Templates</h3>
                  <p className="text-sm text-[#5a5275] font-mono">Top rated in {activeCategory}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <button className="px-6 py-3 bg-white text-black font-semibold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-glow-sm">
              Browse {activeCategory} Category
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
