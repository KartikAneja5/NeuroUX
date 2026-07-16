import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFolder, FiGrid, FiList } from 'react-icons/fi';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 'text-animations', name: 'Text Animations', count: 8, desc: 'Animations split by letters, words, scramblers, and reveals.' },
    { id: 'animations', name: 'Animations', count: 6, desc: 'Border triggers, particle networks, orbits, and click effects.' },
    { id: 'components', name: 'Components', count: 8, desc: 'Accordions, bento grids, MacOS docks, and reflective cards.' },
    { id: 'backgrounds', name: 'Backgrounds', count: 4, desc: 'Dynamic live canvas animations, waves, grids, and matrices.' }
  ]);

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        <div className="mb-8 border-b border-white/5 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Component <span className="text-violet-400">Categories</span>
          </h1>
          <p className="text-sm text-[#8b7fb5] mt-1 font-light">Classify UI assets and manage category metadata listings.</p>
        </div>

        {/* Categories list grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-6 rounded-2xl border border-white/5 bg-[#0c0b1e]/40 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-violet-600/10 text-violet-400 border border-violet-500/20 rounded-lg">
                    <FiFolder size={16} />
                  </div>
                  <h3 className="font-bold text-white text-base">{cat.name}</h3>
                </div>
                <p className="text-xs text-[#8b7fb5] font-light leading-relaxed mb-4">{cat.desc}</p>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-white/5 text-xs text-zinc-500">
                <span>Total Listings</span>
                <span className="font-bold text-violet-400 font-mono">{cat.count} components</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
