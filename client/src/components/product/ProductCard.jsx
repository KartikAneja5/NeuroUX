import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dummyProducts } from '../../data/dummyData';
import { FiStar, FiHeart, FiArrowRight } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const isProtectedPreview = true; // All previews are image-only (no live code)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative glass border-glow rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image Preview (protected - no live code exposed) */}
      <Link to={`/marketplace/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-dark-800">
        {isProtectedPreview && (
          <img
            src={product.previewImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 preview-protected select-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        )}
        
        {/* Category pill */}
        <div className="absolute top-3 left-3">
          <span className="pill pill-purple text-[10px]">{product.category}</span>
        </div>

        {/* Wishlist button */}
        <button 
          className="absolute top-3 right-3 p-2 glass rounded-full text-[#8b7fb5] hover:text-pink-400 opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/10"
          onClick={(e) => e.preventDefault()}
        >
          <FiHeart size={14} />
        </button>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/marketplace/${product.id}`}>
            <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-violet-300 transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="font-bold text-violet-400 text-sm ml-2 flex-shrink-0">${product.price.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <img src={product.author.avatar} alt={product.author.name} className="w-4 h-4 rounded-full" />
          <span className="text-xs text-[#8b7fb5]">{product.author.name}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/6">
          <div className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
            <FiStar size={11} className="fill-current" />
            <span className="text-white">{product.rating}</span>
            <span className="text-[#5a5275]">({product.reviews})</span>
          </div>
          <span className="text-[10px] bg-dark-700 border border-white/8 text-[#8b7fb5] px-2 py-0.5 rounded font-mono uppercase">
            {product.framework}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
