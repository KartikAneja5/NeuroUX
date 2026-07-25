import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../product/ProductCard';
import { FiZap, FiStar } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';

export default function AIRecommended() {
  const [products, setProducts] = useState([]);
  const [layoutInfo, setLayoutInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdaptiveLayout = async () => {
      try {
        const sessionToken = localStorage.getItem('neuroux_session_token') || '';
        const response = await axiosInstance.get('/products/homepage-layout', {
          params: { session_token: sessionToken }
        });

        const data = response.data || {};
        setLayoutInfo(data);

        const featured = data.featuredProducts || [];
        const mappedProducts = featured.map(p => ({
          ...p,
          id: p._id,
          categoryId: (p.category || 'general').toLowerCase().replace(/\s+/g, '-'),
          rating: p.averageRating ?? p.rating ?? 5.0,
          reviews: p.numReviews ?? p.reviews ?? 0,
          author: { name: 'NeuroUX Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeuroUX' }
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to load adaptive homepage layout:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdaptiveLayout();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-24 bg-[#080712] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 pill pill-purple mb-5 shadow-glow-sm"
          >
            {layoutInfo?.isColdStart ? <FiZap size={13} /> : <FiStar size={13} className="text-amber-400 fill-amber-400" />}
            <span>{layoutInfo?.personalizedBadge || "★ Picked for Your Design Profile"}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white tracking-tight mb-4"
          >
            Featured: <span className="text-gradient">{layoutInfo?.featuredCategory || "UI Components"}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#8b7fb5] max-w-lg mx-auto"
          >
            Adaptive Layer-1 personalization algorithm reorders recommendations based on your real-time browsing behavior.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <ProductCard product={product} source="recommendation" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
