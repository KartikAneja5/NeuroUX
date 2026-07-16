import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronRight, FiStar, FiPackage, FiLayers, FiExternalLink } from 'react-icons/fi';
import ProductGallery from '../../components/product/ProductGallery';
import ProductActions from '../../components/product/ProductActions';
import ProductTabs from '../../components/product/ProductTabs';
import ProductCard from '../../components/product/ProductCard';
import { motion } from 'framer-motion';
import { getProductById } from '../../api/productApi';
import { getRecommendations } from '../../api/recommendationApi';
import useTrackInteraction from '../../hooks/useTrackInteraction';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseTrigger, setPurchaseTrigger] = useState(false);

  // Track product view interaction
  useTrackInteraction(product?._id || product?.id, 'view');

  const handlePurchaseSuccess = () => {
    setPurchaseTrigger(prev => !prev);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const response = await getProductById(id);
        const dbProduct = response.data;
        
        // Normalize product fields
        const mappedProduct = {
          ...dbProduct,
          id: dbProduct._id,
          categoryId: dbProduct.category.toLowerCase().replace(/\s+/g, '-'),
          rating: dbProduct.rating || 5.0,
          reviews: dbProduct.reviews || 1,
          author: dbProduct.author || { name: 'NeuroUX Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeuroUX' }
        };
        setProduct(mappedProduct);

        // Fetch AI recommendations
        const recsResponse = await getRecommendations(id);
        const mappedRecs = (recsResponse.data || []).map(p => ({
          ...p,
          id: p._id,
          categoryId: p.category.toLowerCase().replace(/\s+/g, '-'),
          rating: p.rating || 5.0,
          reviews: p.reviews || 1,
          author: p.author || { name: 'NeuroUX Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeuroUX' }
        }));
        setRelatedProducts(mappedRecs.slice(0, 4));
      } catch (err) {
        console.error("Failed to load product details or recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080712]">
        <div className="w-12 h-12 border-4 border-violet-950 border-t-violet-500 rounded-full animate-spin shadow-glow-sm"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#080712] pb-24 text-white relative">
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-violet-900/10 blur-[150px] pointer-events-none" />

      {/* Breadcrumbs */}
      <div className="bg-slate-900/30 border-b border-white/6 relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm font-medium text-[#8b7fb5] flex-wrap gap-1">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <FiChevronRight size={14} className="text-[#5a5275]" />
            <Link to="/marketplace" className="hover:text-white transition">Marketplace</Link>
            <FiChevronRight size={14} className="text-[#5a5275]" />
            <Link to={`/marketplace?category=${product.categoryId}`} className="hover:text-white transition">{product.category}</Link>
            <FiChevronRight size={14} className="text-[#5a5275]" />
            <span className="text-white truncate max-w-[200px] sm:max-w-none font-semibold">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        
        {/* Main Product Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column - Visuals */}
          <div className="w-full lg:w-[58%] lg:sticky lg:top-24">
            <ProductGallery productId={product.id} mainImage={product.previewImageUrl} title={product.name} />
          </div>

          {/* Right Column - Details & Actions */}
          <div className="w-full lg:w-[42%] flex flex-col gap-6">
            
            {/* Author + Category Badge */}
            <div className="flex items-center gap-3">
              <img 
                src={product.author.avatar} 
                alt={product.author.name}
                className="w-8 h-8 rounded-full ring-2 ring-violet-500/20 shadow-sm" 
              />
              <span className="text-sm font-medium text-zinc-300">{product.author.name}</span>
              <span className="text-zinc-600">·</span>
              <span className="pill pill-purple text-[10px]">{product.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-current' : 'opacity-20'} />
                ))}
              </div>
              <span className="font-semibold text-zinc-200">{product.rating}</span>
              <span className="text-[#5a5275] text-sm">({product.reviews} reviews)</span>
            </div>

            {/* Description */}
            <p className="text-[#8b7fb5] leading-relaxed font-light">{product.description}</p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass p-4 rounded-2xl border border-white/5">
                <FiLayers className="text-violet-400 mb-2" size={18} />
                <div className="text-[10px] text-[#5a5275] uppercase tracking-wider font-semibold mb-1">Framework</div>
                <div className="font-semibold text-white capitalize font-mono text-sm">{product.framework}</div>
              </div>
              <div className="glass p-4 rounded-2xl border border-white/5">
                <FiPackage className="text-violet-400 mb-2" size={18} />
                <div className="text-[10px] text-[#5a5275] uppercase tracking-wider font-semibold mb-1">Category</div>
                <div className="font-semibold text-white text-sm">{product.category}</div>
              </div>
            </div>

            {/* Live Preview link */}
            <a 
              href={product.livePreviewUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-sm text-violet-400 font-medium hover:text-violet-300 transition w-fit"
            >
              <FiExternalLink size={14} />
              View Live Preview
            </a>

            {/* Pricing & CTA */}
            <ProductActions 
              product={product}
              price={product.price} 
              onPurchaseSuccess={handlePurchaseSuccess} 
            />
            
          </div>
        </div>

        {/* Product Tabs */}
        <div className="w-full lg:w-[58%] mt-12">
          <ProductTabs key={purchaseTrigger} product={product} />
        </div>
      </div>

      {/* You Might Also Like */}
      <div className="bg-[#0b0a1a] border-t border-white/6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">You Might Also Like</h2>
              <p className="text-sm text-[#8b7fb5]">AI-curated recommendations based on this asset.</p>
            </div>
            <Link to="/marketplace" className="text-sm text-violet-400 font-medium hover:text-violet-300 transition hidden sm:block">
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((p, i) => (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
