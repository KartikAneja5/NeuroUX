import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiLock, FiCheckCircle, FiLoader, FiShoppingBag, FiArrowRight, FiStar, FiGift } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { checkout } from '../api/orderApi';
import { getOrAssignABVariant } from '../utils/abTesting';

export default function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext) || { cart: { items: [] } };
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // UI state
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Apply a default 10% promo for first checkout
  const discount = subtotal * 0.1;
  const total = Math.max(0, subtotal - discount);

  // Redirect if not logged in or if cart is empty and not in success state
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to complete your purchase.');
      navigate('/login');
      return;
    }
    if (items.length === 0 && !success) {
      navigate('/marketplace');
    }
  }, [items, success, navigate]);

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!name || !email || !cardNumber || !expiry || !cvv) {
      alert('Please fill in all payment details.');
      return;
    }

    setPaying(true);

    // Call checkout API with A/B variant assignment
    checkout({ abVariant: getOrAssignABVariant() })
      .then((response) => {
        const order = response.data;
        setOrderId(order._id);

        // 1. Mark each product as purchased in localStorage to unlock preview code editor
        items.forEach(item => {
          localStorage.setItem(`purchased_${item.product._id || item.product.id}`, 'true');
        });

        // 2. Update UI state and clear cart
        setPaying(false);
        setSuccess(true);
        if (clearCart) clearCart();
      })
      .catch((err) => {
        console.error("Checkout failed:", err);
        alert(err.response?.data?.message || 'Checkout failed. Please try again.');
        setPaying(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative flex items-center justify-center select-none overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-900/5 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch"
            >
              {/* Payment details form column */}
              <div className="md:col-span-7 glass p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#0c0b1e]/40 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Secure Checkout</h2>
                  <p className="text-xs text-[#8b7fb5] mb-6 flex items-center gap-1.5 font-light">
                    <FiLock className="text-emerald-400" /> Fully SSL encrypted payment gateway
                  </p>

                  <form onSubmit={handleSubmitPayment} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8b7fb5] uppercase tracking-wider mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Vance"
                        className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#8b7fb5] uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@neuroux.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#8b7fb5] uppercase tracking-wider mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 •••• •••• 4242"
                          className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition font-mono"
                          required
                        />
                        <FiCreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#8b7fb5] uppercase tracking-wider mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#8b7fb5] uppercase tracking-wider mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition font-mono"
                          required
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={paying}
                      className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition shadow-glow hover:shadow-glow-lg border border-violet-400 mt-6 flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer"
                    >
                      {paying ? (
                        <>
                          <FiLoader className="animate-spin" size={18} /> Processing Payment...
                        </>
                      ) : (
                        <>
                          Complete Purchase (₹{total}) <FiArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="md:col-span-5 glass p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#0c0b1e]/60 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FiShoppingBag className="text-violet-400" /> Order Summary ({items.length})
                  </h3>

                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.product._id || item.product.id} className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                        <div className="truncate max-w-[180px]">
                          <p className="font-semibold text-white truncate">{item.product.name}</p>
                          <p className="text-[10px] text-zinc-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-mono font-bold text-violet-300">₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/8 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>10% First Order Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-white/5">
                    <span className="font-bold text-white text-sm">Total</span>
                    <span className="text-xl font-extrabold text-violet-400">₹{total}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Celebration Success Moment with Floating Confetti Burst */
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative max-w-md mx-auto glass p-8 sm:p-10 rounded-3xl border border-emerald-500/30 text-center bg-[#071912]/90 backdrop-blur-xl shadow-[0_0_100px_rgba(16,185,129,0.2)] select-none overflow-hidden"
            >
              {/* Confetti Particle Burst */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: Math.random() * 0.8 + 0.4
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 360,
                      y: (Math.random() - 0.7) * 320,
                      opacity: [1, 1, 0],
                      rotate: Math.random() * 720
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 1.5,
                      ease: "easeOut"
                    }}
                    className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full ${
                      i % 3 === 0 ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]' :
                      i % 3 === 1 ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' :
                      'bg-violet-400 shadow-[0_0_10px_#8b5cf6]'
                    }`}
                  />
                ))}
              </div>

              {/* Glowing Badge Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-6 border border-emerald-400/40 shadow-[0_0_30px_rgba(16,185,129,0.4)] relative z-10"
              >
                <FiCheckCircle size={40} className="text-emerald-400" />
              </motion.div>

              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center justify-center gap-2 relative z-10">
                <FiStar className="text-amber-400 fill-current" size={22} /> Order Confirmed!
              </h2>
              <p className="text-xs text-emerald-400 mb-6 font-semibold uppercase tracking-wider font-mono relative z-10">
                Order ID: {orderId}
              </p>
              
              <p className="text-[#8b7fb5] text-sm leading-relaxed mb-8 font-light relative z-10">
                Thank you! Your payment has cleared successfully. The component files and fully unlocked source code editors are now ready in your account.
              </p>

              <div className="space-y-3 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/customer/orders')}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-[0_0_25px_rgba(16,185,129,0.3)] border border-emerald-400/30 text-sm cursor-pointer"
                >
                  View Order History <FiArrowRight size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/marketplace')}
                  className="w-full py-3.5 bg-transparent border border-white/10 hover:bg-white/5 text-zinc-300 text-sm font-medium rounded-xl transition cursor-pointer"
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
