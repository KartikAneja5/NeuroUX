import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import { getProducts } from '../../api/productApi';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await getProducts({ limit: 4 });
        const dbProducts = response.data.products || [];
        const mappedProducts = dbProducts.map(p => ({
          ...p,
          id: p._id,
          categoryId: p.category.toLowerCase().replace(/\s+/g, '-'),
          rating: p.rating || 5.0,
          reviews: p.reviews || 1,
          author: p.author || { name: 'NeuroUX Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeuroUX' }
        }));
        setProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to load trending products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-24 bg-[#080712] relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-cyan-500/6 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Hot Right Now</p>
            <h2 className="text-3xl font-bold text-white tracking-tight">Trending Assets</h2>
          </div>
          <Link to="/marketplace" className="flex items-center gap-2 text-sm text-[#8b7fb5] hover:text-cyan-400 transition group">
            View all
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
