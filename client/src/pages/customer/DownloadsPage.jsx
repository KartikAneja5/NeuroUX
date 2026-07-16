import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiCode, FiArrowRight, FiX, FiCheckCircle } from 'react-icons/fi';
import { getMyOrders } from '../../api/orderApi';
import { getProducts } from '../../api/productApi';

export default function DownloadsPage() {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [selectedCodeProduct, setSelectedCodeProduct] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      try {
        const response = await getMyOrders();
        const orders = response.data || [];
        
        // Collect all unique product IDs from orders
        const purchasedIds = [];
        orders.forEach(order => {
          order.items.forEach(item => {
            purchasedIds.push(item.productId);
          });
        });
        const uniqueIds = [...new Set(purchasedIds)];
        
        if (uniqueIds.length > 0) {
          const catalogResponse = await getProducts({ limit: 100 });
          const dbProducts = catalogResponse.data.products || [];
          
          const matched = dbProducts
            .filter(p => uniqueIds.includes(p._id))
            .map(p => ({
              ...p,
              id: p._id,
              categoryId: p.category.toLowerCase().replace(/\s+/g, '-'),
              rating: p.rating || 5.0,
              reviews: p.reviews || 1,
              author: p.author || { name: 'NeuroUX Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeuroUX' }
            }));
          setPurchasedProducts(matched);
        } else {
          setPurchasedProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch downloads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchasedProducts();
  }, []);

  const handleDownloadZip = (product) => {
    // Navigate user to codeFileUrl download path
    if (product.codeFileUrl) {
      window.open(product.codeFileUrl, '_blank');
    } else {
      const element = document.createElement('a');
      const file = new Blob([product.code || '// Source Code is ready for download.'], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `${product.name.replace(/\s+/g, '')}-component.jsx`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleCopyCode = () => {
    if (!selectedCodeProduct) return;
    navigator.clipboard.writeText(selectedCodeProduct.code || '// Source code available via download link.');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-violet-900/5 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              My <span className="text-violet-400">Downloads</span>
            </h1>
            <p className="text-sm text-[#8b7fb5] mt-1 font-light">Access and download your purchased UI/UX components.</p>
          </div>
          <Link
            to="/marketplace"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg border border-white/10 transition"
          >
            Explore More Components
          </Link>
        </div>

        {purchasedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-12 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center bg-[#0c0b1e]/40 backdrop-blur-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 border border-violet-500/20 shadow-glow-sm">
              <FiDownload size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No downloads available</h3>
            <p className="text-[#8b7fb5] mb-6 max-w-sm font-light">
              You haven't purchased any premium components yet. Head to our marketplace to get started.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition shadow-glow"
            >
              Browse Marketplace <FiArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl border border-white/5 bg-[#0c0b1e]/40 backdrop-blur-md overflow-hidden flex flex-col justify-between"
              >
                {/* Preview Image */}
                <div className="relative h-40 overflow-hidden group">
                  <img
                    src={product.previewImageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080712] via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 pill pill-purple text-[9px]">
                    {product.category}
                  </span>
                </div>

                {/* Info & CTA Actions */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">{product.name}</h3>
                    <p className="text-xs text-[#8b7fb5] line-clamp-2 font-light">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadZip(product)}
                      className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition border border-violet-500/20"
                    >
                      <FiDownload size={13} /> Download ZIP
                    </button>
                    <button
                      onClick={() => setSelectedCodeProduct(product)}
                      className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold rounded-lg border border-white/10 transition"
                      title="View Source Code"
                    >
                      <FiCode size={13} /> Code
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Code Editor Modal Overlay */}
      <AnimatePresence>
        {selectedCodeProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-3xl bg-[#0c0b1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/40">
                <div className="flex items-center gap-2">
                  <FiCode size={16} className="text-violet-400" />
                  <span className="font-semibold text-sm">{selectedCodeProduct.name} Source Code</span>
                </div>
                <button
                  onClick={() => setSelectedCodeProduct(null)}
                  className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Source code block */}
              <div className="flex-1 overflow-auto p-6 font-mono text-xs text-zinc-300 leading-relaxed bg-[#060510]">
                <pre>{selectedCodeProduct.code || `// Source code is ready for download.\n// Please check the zip download option.`}</pre>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/5 bg-black/40">
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                >
                  {copied ? (
                    <>
                      <FiCheckCircle size={13} /> Copied!
                    </>
                  ) : (
                    <>
                      Copy to Clipboard
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedCodeProduct(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold rounded-lg border border-white/10 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
