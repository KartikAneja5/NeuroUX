import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../../components/product/ProductCard';
import { getProducts } from '../../api/productApi';

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlist = JSON.parse(localStorage.getItem('neuroux_wishlist') || '[]');
        if (wishlist.length > 0) {
          const response = await getProducts({ limit: 100 });
          const dbProducts = response.data.products || [];
          const matched = dbProducts
            .filter(p => wishlist.includes(p._id))
            .map(p => ({
              ...p,
              id: p._id,
              categoryId: p.category.toLowerCase().replace(/\s+/g, '-'),
              rating: p.rating || 5.0,
              reviews: p.reviews || 1,
              author: p.author || { name: 'NeuroUX Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeuroUX' }
            }));
          setWishlistProducts(matched);
        } else {
          setWishlistProducts([]);
        }
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080712]">
        <div className="w-12 h-12 border-4 border-violet-950 border-t-violet-500 rounded-full animate-spin shadow-glow-sm"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative">
      {/* Background accents */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              My <span className="text-violet-400">Wishlist</span>
            </h1>
            <p className="text-sm text-[#8b7fb5] mt-1 font-light">Your bookmarked and saved components.</p>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-12 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center bg-[#0c0b1e]/40 backdrop-blur-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.1)]">
              <FiHeart size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
            <p className="text-[#8b7fb5] mb-6 max-w-sm font-light">
              Tap the heart icon on any component in the marketplace to save it here for later.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition shadow-glow"
            >
              Browse Marketplace <FiArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlistProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
