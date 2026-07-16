import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiCreditCard, FiCheck, FiDownload, FiLock } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext';

export default function ProductActions({ product, price, license = 'Personal License', onPurchaseSuccess }) {
  const [purchased, setPurchased] = useState(false);
  const { addToCart } = useContext(CartContext) || {};
  const navigate = useNavigate();

  const productId = product?.id;

  useEffect(() => {
    if (productId) {
      setPurchased(localStorage.getItem(`purchased_${productId}`) === 'true');
    }
  }, [productId]);

  const handleBuyNow = () => {
    if (addToCart && product) {
      addToCart(product);
      navigate('/customer/checkout');
    }
  };

  const handleAddToCart = () => {
    if (addToCart && product) {
      addToCart(product);
      alert(`🛒 "${product.name}" added to cart!`);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(`purchased_${productId}`);
    setPurchased(false);
    if (onPurchaseSuccess) onPurchaseSuccess();
  };

  return (
    <div className="glass-strong p-6 rounded-2xl border border-white/10 select-none bg-[#0c0b1e]/60 backdrop-blur-md">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-xs text-[#5a5275] font-medium mb-1 uppercase tracking-wider">{license}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">${price}</span>
            <span className="text-[#5a5275] line-through text-sm">${(price * 1.5).toFixed(0)}</span>
          </div>
        </div>
        <div className="pill pill-purple text-[10px]">33% off</div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {purchased ? (
          <>
            <div className="w-full py-3.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl flex items-center justify-center gap-2">
              <FiCheck size={16} /> Already Purchased
            </div>
            <button 
              onClick={handleReset}
              className="w-full py-2 bg-transparent border border-dashed border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs font-semibold rounded-xl transition"
            >
              Reset Purchase (for testing)
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-glow hover:shadow-glow-lg"
            >
              <FiCreditCard size={16} /> Buy Now
            </button>
            <button 
              onClick={handleAddToCart}
              className="w-full py-3.5 glass hover:bg-white/8 border border-white/10 text-[#c4b5fd] font-medium rounded-xl flex items-center justify-center gap-2 transition"
            >
              <FiShoppingCart size={16} /> Add to Cart
            </button>
          </>
        )}
      </div>

      <div className="pt-5 border-t border-white/8 space-y-2.5">
        {[
          { icon: <FiCheck size={12} />, color: 'bg-emerald-500/15 text-emerald-400', text: 'Lifetime access & free updates' },
          { icon: <FiCheck size={12} />, color: 'bg-emerald-500/15 text-emerald-400', text: 'Quality verified by NeuroUX' },
          { icon: <FiDownload size={12} />, color: 'bg-blue-500/15 text-blue-400', text: 'Instant download after purchase' },
          { icon: <FiLock size={12} />, color: 'bg-violet-500/15 text-violet-400', text: 'Source code protected & licensed' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-[#8b7fb5]">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
              {item.icon}
            </div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
