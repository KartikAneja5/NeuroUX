import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiHeart, FiZap } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';

export default function ProductCard({ product, source = 'browse', onAddToCartClick }) {
  const navigate = useNavigate();
  const [inWishlist, setInWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const productId = product?._id || product?.id;

  const handleCardClick = useCallback((e) => {
    if (productId) {
      axiosInstance
        .post('/interactions', { productId, type: 'view', source })
        .catch(() => {});
      navigate(`/marketplace/${productId}`, { state: { source } });
    }
  }, [productId, source, navigate]);

  useEffect(() => {
    if (productId) {
      const list = JSON.parse(localStorage.getItem('neuroux_wishlist') || '[]');
      setInWishlist(list.includes(productId));
    }
  }, [productId]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId) return;

    const list = JSON.parse(localStorage.getItem('neuroux_wishlist') || '[]');
    let newList;
    if (list.includes(productId)) {
      newList = list.filter(id => id !== productId);
      setInWishlist(false);
    } else {
      newList = [...list, productId];
      setInWishlist(true);
    }
    localStorage.setItem('neuroux_wishlist', JSON.stringify(newList));
  };

  // Generate pure, live animated visual HTML inside hover iframe for 100% of catalog components
  const miniSrcDoc = useMemo(() => {
    const name = (product?.name || 'UI Component').toLowerCase();
    const cat = (product?.category || '').toLowerCase();
    const price = product?.price || 499;

    let visualElementHtml = '';

    if (cat.includes('basic ui') || name.includes('button') || name.includes('switch') || name.includes('badge')) {
      visualElementHtml = `
        <div class="flex flex-col items-center justify-center gap-3 w-full h-full p-4">
          <div class="px-5 py-2.5 bg-black border-2 border-cyan-400 text-cyan-400 font-mono font-bold tracking-widest uppercase text-xs rounded-xl shadow-[0_0_25px_rgba(34,211,238,0.7)] animate-pulse flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            ${product?.name?.toUpperCase().substring(0, 16) || 'CYBER_BTN'}
          </div>
          <span class="text-[10px] text-cyan-300 font-mono font-semibold">LIVE MICRO-INTERACTION</span>
        </div>
      `;
    } else if (cat.includes('navigation') || name.includes('navbar') || name.includes('menu') || name.includes('command') || name.includes('dock')) {
      visualElementHtml = `
        <div class="flex flex-col items-center justify-center w-full h-full p-3">
          <div class="w-full max-w-[240px] px-4 py-2.5 bg-slate-900/90 border border-violet-500/60 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.5)] flex items-center justify-between">
            <span class="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
            <span class="text-xs font-mono font-bold text-white uppercase tracking-wider">NAV DOCK</span>
            <span class="text-[9px] bg-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full font-mono font-bold">ACTIVE</span>
          </div>
        </div>
      `;
    } else if (cat.includes('feedback') || name.includes('toast') || name.includes('modal') || name.includes('alert')) {
      visualElementHtml = `
        <div class="flex flex-col items-center justify-center w-full h-full p-3">
          <div class="w-full max-w-[240px] p-3.5 bg-slate-900 border border-emerald-500/60 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-3">
            <div class="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0"></div>
            <div class="text-left font-mono">
              <div class="text-[10px] font-bold text-emerald-400 uppercase">SYSTEM FEEDBACK</div>
              <div class="text-[11px] text-white font-medium">${product?.name?.substring(0, 20)}</div>
            </div>
          </div>
        </div>
      `;
    } else if (cat.includes('form') || name.includes('input') || name.includes('form') || name.includes('payment') || name.includes('wizard')) {
      visualElementHtml = `
        <div class="flex flex-col items-center justify-center w-full h-full p-3">
          <div class="w-full max-w-[240px] p-3.5 bg-slate-900/90 border border-violet-500/60 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.4)] text-left font-mono">
            <div class="text-[9px] font-bold text-violet-400 uppercase mb-1.5 flex items-center justify-between">
              <span>FIELD FOCUS</span>
              <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
            </div>
            <div class="px-3 py-1.5 bg-slate-950 border border-violet-400/80 rounded-xl text-xs text-white">
              Glow focus active...
            </div>
          </div>
        </div>
      `;
    } else if (cat.includes('dashboard') || name.includes('analytics') || name.includes('stat') || name.includes('gauge') || name.includes('feed')) {
      visualElementHtml = `
        <div class="flex flex-col items-center justify-center w-full h-full p-3">
          <div class="w-full max-w-[240px] p-3.5 bg-gradient-to-br from-violet-950/90 to-slate-950 border border-cyan-500/50 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] font-mono">
            <div class="flex justify-between items-center text-[10px] text-cyan-300 font-bold mb-1">
              <span>EXECUTIVE STAT</span>
              <span class="text-emerald-400">+24.8%</span>
            </div>
            <div class="text-lg font-extrabold text-white">₹${(price * 14).toLocaleString()}</div>
            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div class="w-3/4 h-full bg-gradient-to-r from-cyan-400 to-violet-400 animate-pulse"></div>
            </div>
          </div>
        </div>
      `;
    } else if (cat.includes('e-commerce') || name.includes('pricing') || name.includes('cart') || name.includes('checkout')) {
      visualElementHtml = `
        <div class="flex flex-col items-center justify-center w-full h-full p-3">
          <div class="w-full max-w-[230px] p-3.5 bg-slate-900 border border-violet-500/70 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.5)] text-center font-mono">
            <span class="px-2 py-0.5 bg-violet-600 text-white rounded-full text-[9px] font-bold uppercase tracking-wider">PREMIUM ASSET</span>
            <div class="text-xl font-extrabold text-white my-1">₹${price}</div>
            <div class="w-full py-1.5 bg-violet-600/30 border border-violet-400 rounded-xl text-xs font-bold text-violet-200 animate-pulse">
              ADD TO CART
            </div>
          </div>
        </div>
      `;
    } else if (cat.includes('ai') || name.includes('ai') || name.includes('vector') || name.includes('token')) {
      visualElementHtml = `
        <div class="flex flex-col items-center justify-center w-full h-full p-3">
          <div class="w-full max-w-[240px] p-3.5 bg-slate-950 border border-fuchsia-500/60 rounded-2xl shadow-[0_0_25px_rgba(217,70,239,0.4)] font-mono text-left">
            <div class="text-[9px] font-bold text-fuchsia-400 uppercase mb-1 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping"></span>
              AI STREAM GENERATOR
            </div>
            <div class="text-[11px] text-slate-200 leading-tight">
              Generating response<span class="animate-pulse text-fuchsia-400">...</span>
            </div>
          </div>
        </div>
      `;
    } else if (cat.includes('mobile') || name.includes('mobile') || name.includes('touch') || name.includes('sheet')) {
      visualElementHtml = `
        <div class="flex flex-col items-center justify-center w-full h-full p-3">
          <div class="w-full max-w-[220px] p-3.5 bg-slate-900 border border-amber-500/60 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.4)] text-center font-mono">
            <div class="w-8 h-1 bg-amber-400/80 rounded-full mx-auto mb-2 animate-pulse"></div>
            <div class="text-xs font-bold text-white uppercase">MOBILE BOTTOM SHEET</div>
            <div class="text-[9px] text-amber-300 mt-1">SWIPE GESTURE ACTIVE</div>
          </div>
        </div>
      `;
    } else {
      visualElementHtml = `
        <div class="flex flex-col items-center justify-center w-full h-full p-3">
          <div class="w-full max-w-[240px] p-3.5 bg-gradient-to-br from-slate-900 to-violet-950/90 border border-violet-500/60 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.4)] text-center font-mono">
            <div class="w-7 h-7 mx-auto mb-1.5 rounded-xl bg-violet-600/30 border border-violet-400 flex items-center justify-center text-violet-300 font-bold text-xs animate-bounce">
              ⚡
            </div>
            <div class="text-xs font-bold text-white mb-0.5 truncate">${product?.name || 'Live Component'}</div>
            <div class="text-[9px] text-violet-300 font-semibold">LIVE HOVER EFFECT</div>
          </div>
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              background: #080712;
              color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              padding: 0;
              overflow: hidden;
              user-select: none;
            }
          </style>
        </head>
        <body>
          <div style="width: 100%; height: 100%;">
            ${visualElementHtml}
          </div>
        </body>
      </html>
    `;
  }, [product?.name, product?.category, product?.price]);

  return (
    <motion.div
      layoutId={`product-card-${productId}`}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className="group relative bg-gradient-to-br from-[#12102b] via-[#0d0b20] to-[#0a0917] border border-white/10 hover:border-violet-500/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Preview / Sandboxed Live Visual Viewport */}
      <div className="block relative aspect-[4/3] overflow-hidden bg-[#070611] select-none p-2">
        <div className="w-full h-full rounded-xl overflow-hidden relative bg-black/40">
          
          {/* Base Thumbnail Image */}
          <motion.img
            layoutId={`product-image-${productId}`}
            src={product.previewImageUrl || '/images/glow-glass-pricing.png'}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
            }`}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Live Hover Effect Viewport (Instant 100% Display on Hover for ALL 47 Components) */}
          <AnimatePresence>
            {isHovered && miniSrcDoc && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-20 bg-[#080712] flex items-center justify-center overflow-hidden"
              >
                <iframe
                  title={`live-hover-effect-${productId}`}
                  srcDoc={miniSrcDoc}
                  sandbox="allow-scripts"
                  className="w-full h-full border-0 pointer-events-none bg-[#080712]"
                />
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-violet-600/90 text-white font-mono text-[9px] font-bold tracking-wider uppercase z-30 flex items-center gap-1 pointer-events-none shadow-md">
                  <FiZap size={9} className="animate-pulse text-amber-300" /> Live Effect
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Pill Badge */}
          <div className="absolute top-2.5 left-2.5 z-30 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full bg-violet-950/80 text-violet-300 border border-violet-500/30 text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm">
              {product.category}
            </span>
          </div>

          {/* Wishlist Heart Icon Button */}
          <motion.button 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-200 z-30 flex items-center justify-center ${
              inWishlist ? 'text-pink-500 bg-pink-500/20 border-pink-500/40 opacity-100' : 'text-zinc-400 hover:text-pink-400 opacity-80 group-hover:opacity-100'
            }`}
            onClick={toggleWishlist}
            title="Save to Wishlist"
          >
            <FiHeart size={13} className={inWishlist ? 'fill-current' : ''} />
          </motion.button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start mb-2">
            <motion.h3 
              layoutId={`product-title-${productId}`}
              className="font-bold text-white text-sm line-clamp-1 group-hover:text-violet-300 transition-colors"
            >
              {product.name}
            </motion.h3>
            <span className="font-extrabold text-violet-400 text-sm ml-2 flex-shrink-0 font-mono">₹{product.price}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <img 
              src={product?.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeuroUX'} 
              alt={product?.author?.name || 'NeuroUX Team'} 
              className="w-4 h-4 rounded-full border border-white/10" 
            />
            <span className="text-xs text-zinc-400 font-light">{product?.author?.name || 'NeuroUX Team'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/6 mt-auto">
          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold font-mono">
            <FiStar size={12} className="fill-current text-amber-400" />
            <span className="text-white">
              {Number(product?.averageRating || product?.rating || 5.0).toFixed(1)}
            </span>
            <span className="text-zinc-500 font-normal">
              ({product?.numReviews ?? product?.reviews ?? 0})
            </span>
          </div>
          <span className="text-[10px] bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wider">
            {product?.framework || 'REACT'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
