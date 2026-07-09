import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { dummyCategories } from '../../data/dummyData';
import { FiLayout, FiGrid, FiNavigation, FiSliders, FiSquare, FiImage } from 'react-icons/fi';

const iconMap = {
  'templates': FiLayout,
  'cards': FiGrid,
  'navbars': FiNavigation,
  'forms': FiSliders,
  'modals': FiSquare,
  'icons': FiImage,
};

const colorMap = {
  'templates': 'from-violet-500/20 to-purple-600/10 border-violet-500/20 text-violet-400',
  'cards': 'from-cyan-500/20 to-blue-600/10 border-cyan-500/20 text-cyan-400',
  'navbars': 'from-pink-500/20 to-rose-600/10 border-pink-500/20 text-pink-400',
  'forms': 'from-amber-500/20 to-orange-600/10 border-amber-500/20 text-amber-400',
  'modals': 'from-emerald-500/20 to-teal-600/10 border-emerald-500/20 text-emerald-400',
  'icons': 'from-indigo-500/20 to-blue-600/10 border-indigo-500/20 text-indigo-400',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturedCategories() {
  return (
    <section className="py-24 bg-[#080712] relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/8 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-2">Browse</p>
            <h2 className="text-3xl font-bold text-white tracking-tight">Top Categories</h2>
          </div>
          <Link to="/marketplace" className="flex items-center gap-2 text-sm text-[#8b7fb5] hover:text-violet-400 transition group">
            View all
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {dummyCategories.map((cat) => {
            const Icon = iconMap[cat.id] || FiLayout;
            const colorClass = colorMap[cat.id] || colorMap['templates'];
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <Link
                  to={`/marketplace?category=${cat.id}`}
                  className={`group flex flex-col items-center p-5 rounded-2xl border bg-gradient-to-br ${colorClass} hover:scale-105 transition-all duration-300 hover:shadow-glow-sm text-center`}
                >
                  <Icon size={24} className="mb-3" />
                  <span className="text-sm font-semibold text-white mb-1">{cat.name}</span>
                  <span className="text-xs text-[#5a5275]">{cat.count} items</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
