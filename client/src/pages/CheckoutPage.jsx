import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiLock, FiCheckCircle, FiLoader, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { checkout } from '../api/orderApi';

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

    // Call checkout API
    checkout()
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
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative flex items-center justify-center">
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

                  {/* Payment Form */}
                  <form onSubmit={handleSubmitPayment} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength="19"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                        />
                        <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Expiration Date</label>
                        <input
                          type="text"
                          required
                          maxLength="5"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors text-center"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">CVV</label>
                        <input
                          type="password"
                          required
                          maxLength="3"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors text-center"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={paying}
                      className="w-full mt-6 py-4 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-glow hover:shadow-glow-lg border border-violet-400/20"
                    >
                      {paying ? (
                        <>
                          <FiLoader className="animate-spin" size={16} /> Verifying Card...
                        </>
                      ) : (
                        <>
                          Pay & Complete Purchase
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Order recap column */}
              <div className="md:col-span-5 glass p-6 rounded-3xl border border-white/5 bg-[#0c0b1e]/60 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg border-b border-white/5 pb-3 mb-4">Summary</h3>
                  <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.product.previewImageUrl}
                            alt={item.product.name}
                            className="w-10 h-8 object-cover rounded border border-white/5"
                          />
                          <div className="truncate max-w-[120px] sm:max-w-none">
                            <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">{item.product.framework}</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-white">${item.product.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 mt-6 space-y-3.5">
                  <div className="flex justify-between text-xs text-[#8b7fb5]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Bundle Promo (10% Off)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-white/5">
                    <span className="font-bold text-white text-sm">Total</span>
                    <span className="text-xl font-extrabold text-violet-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Success confirmation card */
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto glass p-8 sm:p-10 rounded-3xl border border-emerald-500/20 text-center bg-[#071912]/80 backdrop-blur-md shadow-[0_0_80px_rgba(16,185,129,0.1)]"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <FiCheckCircle size={32} className="animate-[pulse_2s_infinite]" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Order Confirmed!</h2>
              <p className="text-xs text-emerald-400 mb-6 font-semibold uppercase tracking-wider font-mono">Order ID: {orderId}</p>
              
              <p className="text-[#8b7fb5] text-sm leading-relaxed mb-8 font-light">
                Thank you! Your payment has cleared successfully. The component files and fully unlocked source code editors are now ready in your downloads panel.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/customer/orders')}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-400/20"
                >
                  View Order History <FiArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full py-3.5 bg-transparent border border-white/10 hover:bg-white/5 text-zinc-300 text-sm font-medium rounded-xl transition"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
