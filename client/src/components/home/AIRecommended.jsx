import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../product/ProductCard';
import { FiZap } from 'react-icons/fi';
import { getProducts } from '../../api/productApi';
import { getRecommendations } from '../../api/recommendationApi';

export default function AIRecommended() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIRecommendations = async () => {
      try {
        const catalogResponse = await getProducts({ limit: 1 });
        const catalog = catalogResponse.data.products || [];
        if (catalog.length > 0) {
          const anchorProduct = catalog[0];
          const recsResponse = await getRecommendations(anchorProduct._id);
          const recs = recsResponse.data || [];
          
          const mappedRecs = recs.map(p => ({
            ...p,
            id: p._id,
            categoryId: p.category.toLowerCase().replace(/\s+/g, '-'),
            rating: p.rating || 5.0,
            reviews: p.reviews || 1,
            author: p.author || { name: 'NeuroUX Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeuroUX' }
          }));
          
          setProducts(mappedRecs.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load AI recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAIRecommendations();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dark purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080712] via-[#0d0b1a] to-[#080712]" />
      <div className="absolute inset-0 dot-grid opacity-20" />
      
      {/* Big glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-700/12 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 pill pill-purple mb-5"
          >
            <FiZap size={12} />
            AI-Powered Picks
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white tracking-tight mb-4"
          >
            Curated <span className="text-gradient">just for you</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#8b7fb5] max-w-lg mx-auto"
          >
            Our AI engine learns your preferences and recommends assets that match your exact workflow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
