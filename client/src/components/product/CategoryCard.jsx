import { Link } from 'react-router-dom';
import { FiLayout, FiLayers, FiCreditCard, FiAlignLeft, FiMaximize } from 'react-icons/fi';
import { motion } from 'framer-motion';

const iconMap = {
  Templates: FiLayout,
  Cards: FiCreditCard,
  Navbars: FiAlignLeft,
  Forms: FiLayers,
  Modals: FiMaximize
};

export default function CategoryCard({ category }) {
  const Icon = iconMap[category.name] || FiLayers;
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link 
        to={`/marketplace?category=${category.id}`}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-primary-200 hover:shadow-md transition group h-full"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <h3 className="font-semibold text-slate-900">{category.name}</h3>
        <p className="text-sm text-slate-500 mt-1">{category.count} items</p>
      </Link>
    </motion.div>
  );
}
