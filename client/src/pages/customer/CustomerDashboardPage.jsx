import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiShoppingBag, FiHeart, FiUser, FiSettings, FiArrowRight } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import ProductCard from '../../components/product/ProductCard';
import { getMyOrders } from '../../api/orderApi';
import { getProducts } from '../../api/productApi';
import { getRecommendations } from '../../api/recommendationApi';

export default function CustomerDashboardPage() {
  const { user } = useContext(AuthContext) || { user: { name: 'Customer' } };
  
  // Dashboard counts
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ordersResponse = await getMyOrders();
        const orders = ordersResponse.data || [];
        setOrderCount(orders.length);

        const purchasedIds = [];
        orders.forEach(order => {
          order.items.forEach(item => {
            purchasedIds.push(item.productId);
          });
        });
        const uniqueIds = [...new Set(purchasedIds)];
        setPurchaseCount(uniqueIds.length);

        const wishlist = JSON.parse(localStorage.getItem('neuroux_wishlist') || '[]');
        setWishlistCount(wishlist.length);

        let anchorProductId = uniqueIds.length > 0 ? uniqueIds[0] : '';
        if (!anchorProductId) {
          const catalogResponse = await getProducts({ limit: 1 });
          const catalog = catalogResponse.data.products || [];
          if (catalog.length > 0) {
            anchorProductId = catalog[0]._id;
          }
        }

        if (anchorProductId) {
          const recsResponse = await getRecommendations(anchorProductId);
          const dbRecs = recsResponse.data || [];
          const mappedRecs = dbRecs.map(p => ({
            ...p,
            id: p._id,
            categoryId: p.category.toLowerCase().replace(/\s+/g, '-'),
            rating: p.rating || 5.0,
            reviews: p.reviews || 1,
            author: p.author || { name: 'NeuroUX Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeuroUX' }
          }));
          setRecommendations(mappedRecs.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Purchased Assets', count: purchaseCount, icon: <FiDownload size={20} />, color: 'text-violet-400 border-violet-500/20 bg-violet-500/5', path: '/customer/downloads' },
    { label: 'Total Orders', count: orderCount, icon: <FiShoppingBag size={20} />, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5', path: '/customer/orders' },
    { label: 'Wishlist Bookmarks', count: wishlistCount, icon: <FiHeart size={20} />, color: 'text-pink-400 border-pink-500/20 bg-pink-500/5', path: '/customer/wishlist' },
  ];

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
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-violet-900/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Welcome Banner */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#0c0b1e]/30 backdrop-blur-md mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome Back, <span className="text-violet-400">{user?.name || 'Developer'}</span>
            </h1>
            <p className="text-sm text-[#8b7fb5] mt-1 font-light">Manage your purchased UI components and profile workspace details.</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/customer/profile"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
            >
              <FiUser size={13} /> Edit Profile
            </Link>
            <Link
              to="/customer/settings"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
            >
              <FiSettings size={13} /> Settings
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {stats.map((s, i) => (
            <Link to={s.path} key={i}>
              <motion.div
                whileHover={{ y: -3 }}
                className={`glass p-6 rounded-2xl border flex items-center justify-between transition-colors cursor-pointer ${s.color}`}
              >
                <div>
                  <span className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider block mb-1">{s.label}</span>
                  <span className="text-3xl font-extrabold text-white">{s.count}</span>
                </div>
                <div className="p-3 bg-black/35 rounded-xl border border-white/5">
                  {s.icon}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Suggested For You */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-white/5 pb-3">
            <div>
              <h2 className="text-xl font-bold text-white">Recommended for You</h2>
              <p className="text-xs text-[#8b7fb5] mt-0.5 font-light">Custom recommendations based on similarity and category interests.</p>
            </div>
            <Link
              to="/customer/recommended"
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition flex items-center gap-1"
            >
              Explore all <FiArrowRight size={12} />
            </Link>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm glass rounded-2xl border border-white/5">
              Explore the marketplace catalog to trigger recommendations.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
