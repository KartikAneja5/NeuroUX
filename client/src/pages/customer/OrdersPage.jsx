import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiInbox, FiClock } from 'react-icons/fi';
import { getMyOrders } from '../../api/orderApi';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        setOrders(response.data || []);
      } catch (err) {
        console.error("Failed to load customer orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">
          Order <span className="text-violet-400">History</span>
        </h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-12 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center bg-[#0c0b1e]/40 backdrop-blur-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 border border-violet-500/20 shadow-glow-sm">
              <FiInbox size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
            <p className="text-[#8b7fb5] mb-6 max-w-sm font-light">
              You haven't placed any purchases yet. Your invoices will appear here once you checkout.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass p-6 rounded-2xl border border-white/5 bg-[#0c0b1e]/40 backdrop-blur-md"
              >
                {/* Header: ID, Date, Status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5 mb-4">
                  <div>
                    <h3 className="font-mono text-sm font-bold text-violet-400">Order ID: #{order._id}</h3>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1 font-light">
                      <FiClock size={12} /> Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase">
                    <FiCheckCircle size={13} /> {order.status}
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="text-zinc-300 font-medium">
                        {item.name}
                      </div>
                      <div className="text-white font-mono text-xs">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Total Invoiced</span>
                  <span className="text-lg font-extrabold text-white">${order.totalAmount.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
