import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiZap, FiGrid, FiSliders, FiFileText, FiShield } from 'react-icons/fi';
import { dummyProducts, dummyCategories } from '../../data/dummyData';
import ComponentPreviewSwitcher from '../../components/gallery-previews/InteractiveComponents';
import ProductActions from '../../components/product/ProductActions';
import ProductTabs from '../../components/product/ProductTabs';

export default function MarketplacePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedProduct, setSelectedProduct] = useState(dummyProducts[0]);
  const [purchaseTrigger, setPurchaseTrigger] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync with search param if it changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      const firstInCat = dummyProducts.find(p => p.categoryId === initialCategory);
      if (firstInCat) setSelectedProduct(firstInCat);
    }
  }, [initialCategory]);

  const handlePurchaseSuccess = () => {
    setPurchaseTrigger(prev => !prev);
  };

  // Group components by their category for the sidebar
  const groupedComponents = useMemo(() => {
    const groups = {};
    dummyCategories.forEach(cat => {
      groups[cat.id] = {
        name: cat.name,
        items: dummyProducts.filter(p => p.categoryId === cat.id)
      };
    });
    return groups;
  }, []);

  // Filter components in sidebar if search query is present
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupedComponents;
    
    const query = searchQuery.toLowerCase();
    const filtered = {};
    
    Object.keys(groupedComponents).forEach(catId => {
      const matchedItems = groupedComponents[catId].items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.tags.some(t => t.toLowerCase().includes(query))
      );
      if (matchedItems.length > 0) {
        filtered[catId] = {
          name: groupedComponents[catId].name,
          items: matchedItems
        };
      }
    });
    return filtered;
  }, [searchQuery, groupedComponents]);

  return (
    <div className="min-h-screen bg-[#080712] text-white flex flex-col pt-[60px] relative">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

      {/* Main Layout Container */}
      <div className="flex flex-1 relative z-10 w-full max-w-8xl mx-auto">
        
        {/* ================= LEFT SIDEBAR (Desktop) ================= */}
        <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0a0916] h-[calc(100vh-60px)] sticky top-[60px] overflow-y-auto px-4 py-6 select-none shrink-0">
          {/* Search bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components..."
              className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/8 rounded-lg text-xs placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
            />
          </div>

          {/* Sidebar Menu Groups */}
          <div className="space-y-6">
            {Object.keys(filteredGroups).map(catId => {
              const group = filteredGroups[catId];
              return (
                <div key={catId} className="space-y-1">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">{group.name}</h4>
                  <ul className="space-y-0.5">
                    {group.items.map(item => {
                      const isSelected = selectedProduct.id === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => setSelectedProduct(item)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                              isSelected 
                                ? 'bg-violet-600/15 border-l-2 border-violet-500 text-violet-300 font-semibold' 
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span>{item.name}</span>
                            {item.price === 0 ? (
                              <span className="text-[8px] px-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold uppercase">Free</span>
                            ) : (
                              <span className="text-[9px] text-zinc-600 font-semibold">${item.price}</span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            {Object.keys(filteredGroups).length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-xs font-mono">No matches found</div>
            )}
          </div>
        </aside>

        {/* ================= MOBILE COMPONENT SELECTOR ================= */}
        <div className="md:hidden w-full border-b border-white/5 bg-[#0a0916] p-4 sticky top-[60px] z-20 flex justify-between items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-900 border border-white/8 text-zinc-300"
          >
            <FiGrid size={14} />
            Browse Components ({selectedProduct.name})
            <FiChevronDown size={12} className={`transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          <span className="text-xs font-bold text-violet-400">${selectedProduct.price}</span>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[110px] bottom-0 bg-[#080712] z-30 overflow-y-auto px-4 py-6 border-b border-white/10 select-none">
            <div className="relative mb-6">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/8 rounded-lg text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
              />
            </div>
            
            <div className="space-y-6">
              {Object.keys(filteredGroups).map(catId => {
                const group = filteredGroups[catId];
                return (
                  <div key={catId} className="space-y-1">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">{group.name}</h4>
                    <ul className="space-y-0.5">
                      {group.items.map(item => {
                        const isSelected = selectedProduct.id === item.id;
                        return (
                          <li key={item.id}>
                            <button
                              onClick={() => { setSelectedProduct(item); setMobileMenuOpen(false); }}
                              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-violet-600/15 text-violet-300 font-semibold' 
                                  : 'text-zinc-400'
                              }`}
                            >
                              <span>{item.name}</span>
                              <span className="text-xs font-bold text-violet-400">${item.price}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= MAIN CONTENT VIEWPORT ================= */}
        <main className="flex-1 px-4 sm:px-8 py-8 md:py-12 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            
            {/* Header Details */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="pill pill-purple text-[9px]">{selectedProduct.category}</span>
                  <span className="text-zinc-500 font-mono text-xs">Framework: React</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {selectedProduct.name}
                </h1>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{selectedProduct.description}</p>
              </div>
              <div className="w-full md:w-auto shrink-0 md:self-end">
                <ProductActions 
                  productId={selectedProduct.id}
                  price={selectedProduct.price}
                  onPurchaseSuccess={handlePurchaseSuccess}
                />
              </div>
            </div>

            {/* Sandbox Container */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs text-violet-400 font-semibold uppercase tracking-wider">
                  <FiSliders size={13} />
                  Interactive Viewport
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">click and drag to test responsiveness</span>
              </div>
              
              <div className="aspect-[16/9] w-full bg-zinc-950 rounded-2xl border border-white/8 relative flex flex-col justify-center items-center overflow-hidden p-6 shadow-2xl">
                <div className="absolute inset-0 dot-grid-fine opacity-20 pointer-events-none" />
                
                {/* Live switch preview */}
                <div className="relative z-10 w-full flex justify-center">
                  <ComponentPreviewSwitcher productId={selectedProduct.id} />
                </div>
                
                {/* Status/Overlay tags */}
                <div className="absolute top-4 left-4 bg-violet-600/15 border border-violet-500/30 px-2 py-0.5 rounded text-[8px] font-bold text-violet-300 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  Live Sandbox
                </div>
                <div className="absolute top-4 right-4 text-[9px] text-zinc-600 font-mono">
                  100% Client-Side Render
                </div>

                {/* Inspect blocker layer */}
                <div 
                  className="absolute inset-0 bg-transparent" 
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </div>
            </div>

            {/* Product Tabs & Locked Code Block */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <FiFileText size={14} className="text-zinc-500" />
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Specifications & Assets</span>
              </div>
              <ProductTabs key={purchaseTrigger} product={selectedProduct} />
            </div>

            {/* Marketplace Quality Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="p-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-lg">
                  <FiZap size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Tailwind Ready</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Simply copy the code and drop it into your React project. Fits Tailwind config perfectly.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="p-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-lg">
                  <FiShield size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Safe & Clean Code</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">No tracking scripts or heavy modules. Hand-crafted using framer-motion and standard canvas APIs.</p>
                </div>
              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
