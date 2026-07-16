import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext) || { cart: { items: [] } };
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    
    if (promoCode.toUpperCase() === 'NEUROUX20') {
      setDiscount(subtotal * 0.2);
      setPromoSuccess('🎉 Promo code NEUROUX20 applied: 20% discount!');
    } else if (promoCode.trim() === '') {
      setPromoError('Please enter a promo code.');
    } else {
      setPromoError('Invalid promo code. Try "NEUROUX20".');
    }
  };

  const total = Math.max(0, subtotal - discount);

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative">
      {/* Background accents */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">
          Shopping <span className="text-violet-400">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart items list */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass p-12 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center bg-[#0c0b1e]/40 backdrop-blur-md"
                >
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 border border-violet-500/20 shadow-glow-sm">
                    <FiShoppingBag size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
                  <p className="text-[#8b7fb5] mb-6 max-w-sm font-light">
                    Explore our collection of hand-crafted text animations, canvas effects, and responsive components.
                  </p>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition shadow-glow"
                  >
                    Browse Marketplace <FiArrowRight size={16} />
                  </Link>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    layout
                    className="glass p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0c0b1e]/40 backdrop-blur-md"
                  >
                    {/* Product info */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.product.previewImageUrl}
                        alt={item.product.name}
                        className="w-16 h-12 object-cover rounded-lg border border-white/10"
                      />
                      <div>
                        <h4 className="font-bold text-white hover:text-violet-400 transition">
                          <Link to={`/marketplace/${item.product.id}`}>{item.product.name}</Link>
                        </h4>
                        <span className="text-xs text-[#8b7fb5] uppercase tracking-wider font-semibold">
                          {item.product.category}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Actions controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:text-white text-[#8b7fb5] transition rounded hover:bg-white/5"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:text-white text-[#8b7fb5] transition rounded hover:bg-white/5"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-white text-base">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Checkout pricing panel */}
          {items.length > 0 && (
            <div className="lg:col-span-4 space-y-6">
              {/* Order summary */}
              <div className="glass p-6 rounded-2xl border border-white/5 bg-[#0c0b1e]/60 backdrop-blur-md">
                <h3 className="font-bold text-lg text-white mb-4 border-b border-white/5 pb-3">Order Summary</h3>
                
                <div className="space-y-3 text-sm text-[#8b7fb5] mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>License type</span>
                    <span className="text-white">Developer</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-between items-baseline mb-6">
                  <span className="font-bold text-white">Total</span>
                  <span className="text-2xl font-extrabold text-violet-400">${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate('/customer/checkout')}
                  className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-glow hover:shadow-glow-lg border border-violet-400/20"
                >
                  Proceed to Checkout <FiArrowRight size={16} />
                </button>
              </div>

              {/* Promo code */}
              <div className="glass p-5 rounded-2xl border border-white/5 bg-[#0c0b1e]/40">
                <h4 className="font-bold text-sm text-white mb-3">Promo Code</h4>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter NEUROUX20"
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg border border-white/10 transition"
                  >
                    Apply
                  </button>
                </form>
                {promoError && <p className="text-xs text-rose-400 mt-2">{promoError}</p>}
                {promoSuccess && <p className="text-xs text-emerald-400 mt-2">{promoSuccess}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
