import { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiGrid, FiInbox, FiFilter } from 'react-icons/fi';
import ProductCard from '../components/product/ProductCard';
import ProductFilterBar from '../components/product/ProductFilterBar';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import { getProducts } from '../api/productApi';
import { dummyCategories } from '../data/dummyData';

export default function SearchResultsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const initialCategory = queryParams.get('category') || 'all';
  const gridContainerRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Spotlight mouse tracker for marketplace grid
  const handleMouseMove = (e) => {
    if (!gridContainerRef.current) return;
    const rect = gridContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gridContainerRef.current.style.setProperty('--spotlight-x', `${x}px`);
    gridContainerRef.current.style.setProperty('--spotlight-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!gridContainerRef.current) return;
    gridContainerRef.current.style.setProperty('--spotlight-x', `-1000px`);
    gridContainerRef.current.style.setProperty('--spotlight-y', `-1000px`);
  };

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const response = await getProducts({ limit: 100 });
        const list = response.data.products || [];
        setProducts(list.map(p => ({ ...p, id: p._id })));
      } catch (err) {
        console.error("Failed to load catalog for search:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const categories = dummyCategories;

  const normalizeSlug = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      const matchTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchCat && !matchTags) return false;
    }

    if (selectedCategory !== 'all') {
      const pCatSlug = normalizeSlug(p.category);
      const selCatSlug = normalizeSlug(selectedCategory);
      if (pCatSlug !== selCatSlug) return false;
    }

    if (selectedFramework !== 'all') {
      if (p.framework && p.framework.toLowerCase() !== selectedFramework) return false;
    }

    if (priceRange === 'free') {
      if (p.price > 0) return false;
    } else if (priceRange === 'under15') {
      if (p.price >= 1500) return false;
    } else if (priceRange === 'over15') {
      if (p.price < 1500) return false;
    }

    return true;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFramework('all');
    setPriceRange('all');
  };

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative select-none">
      {/* Background ambient spotlight stage */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Search <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">Marketplace</span>
          </h1>
          <p className="text-sm text-[#8b7fb5]">
            Explore original UI/UX components, glassmorphism templates, and animated micro-interactions.
          </p>
        </div>

        {/* Filter Bar */}
        <ProductFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          selectedFramework={selectedFramework}
          onFrameworkChange={setSelectedFramework}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          onClearFilters={handleClearFilters}
          totalResults={filteredProducts.length}
        />

        {/* Grid Container with Hardware Accelerated Radial Spotlight */}
        <div
          ref={gridContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative min-h-[400px] transition-all duration-300 rounded-3xl p-2"
          style={{
            backgroundImage: `radial-gradient(600px circle at var(--spotlight-x, -1000px) var(--spotlight-y, -1000px), rgba(139, 92, 246, 0.15), transparent 70%)`
          }}
        >
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-stretch"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} source="search" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="py-20 text-center glass rounded-3xl border border-white/8 space-y-4 max-w-md mx-auto my-12">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mx-auto">
                <FiInbox size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">No matching components</h3>
              <p className="text-xs text-[#8b7fb5] max-w-xs mx-auto">
                We couldn't find any components matching your filter criteria. Try clearing filters or searching for another keyword.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
