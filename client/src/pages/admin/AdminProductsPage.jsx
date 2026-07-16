import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheckCircle } from 'react-icons/fi';
import { getProducts, createProduct, deleteProduct } from '../../api/productApi';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Text Animations');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchProductsList = async () => {
    try {
      const response = await getProducts({ limit: 100 });
      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Failed to load products list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !description) {
      alert('Please fill in all product fields.');
      return;
    }

    try {
      await createProduct({
        name,
        category,
        price: parseFloat(price) || 9.99,
        description,
        livePreviewUrl: '#',
        previewImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
        codeFileUrl: 'https://github.com/KartikAneja5/NeuroUX',
        code,
        framework: 'react',
        tags: 'custom,component'
      });

      setSuccess(true);
      fetchProductsList();

      setTimeout(() => {
        setSuccess(false);
        setShowAddModal(false);
        setName('');
        setPrice('');
        setDescription('');
        setCode('');
      }, 1500);
    } catch (err) {
      console.error("Failed to create product:", err);
      alert(err.response?.data?.message || "Failed to add product. Please verify admin privileges.");
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!confirm('Are you sure you want to delete this product listing?')) return;
    
    try {
      await deleteProduct(prodId);
      setProducts(products.filter(p => p._id !== prodId));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product.");
    }
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
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Component <span className="text-violet-400">Catalog</span>
            </h1>
            <p className="text-sm text-[#8b7fb5] mt-1 font-light">Add, edit, or delete component listings in the marketplace.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-glow border border-violet-500/20"
          >
            <FiPlus size={14} /> Add New Component
          </button>
        </div>

        {/* Catalog Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300 bg-[#0c0b1e]/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
            <thead className="text-xs text-[#8b7fb5] uppercase bg-black/40 border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Component</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Framework</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={p.previewImageUrl || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'}
                      alt={p.name}
                      className="w-10 h-8 object-cover rounded border border-white/10"
                    />
                    <span className="font-bold text-white">{p.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[#c4b5fd] text-xs font-medium">{p.category}</td>
                  <td className="px-6 py-4 font-mono font-semibold">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4 font-mono text-xs uppercase">{p.framework}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Delete Product"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
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
              className="w-full max-w-2xl bg-[#0c0b1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/40">
                <span className="font-bold text-sm">Add New Marketplace Listing</span>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition"
                >
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="flex-1 overflow-auto p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Component Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Glassmorphic Accordion"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 text-white"
                    >
                      <option>Text Animations</option>
                      <option>Animations</option>
                      <option>Components</option>
                      <option>Backgrounds</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Price ($)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="19.99"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Framework</label>
                    <input
                      type="text"
                      readOnly
                      value="React"
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter short description detailing component features."
                    rows="3"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Source Code (JSX)</label>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste JSX code here..."
                    rows="6"
                    className="w-full bg-[#060510] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-violet-500/50 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition shadow-glow border border-violet-500/20"
                >
                  Create Listing
                </button>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold bg-emerald-500/5 border border-emerald-500/20 py-2 rounded-lg"
                  >
                    <FiCheckCircle size={14} /> Component added successfully to the catalog!
                  </motion.div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
