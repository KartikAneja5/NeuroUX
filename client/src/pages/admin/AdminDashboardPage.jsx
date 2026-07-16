import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDollarSign, FiUsers, FiPackage, FiActivity, FiArrowRight, FiFileText } from 'react-icons/fi';
import { getAdminAnalytics } from '../../api/adminApi';

export default function AdminDashboardPage() {
  const [revenue, setRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAdminAnalytics();
        const data = response.data || {};
        setRevenue(data.revenue || 0);
        setOrderCount(data.salesCount || 0);
        setUserCount(data.activeCustomers || 0);
        setProductCount(data.catalogSize || 0);
        setRecentOrders(data.recentOrders || []);
      } catch (err) {
        console.error("Failed to load admin analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `$${revenue.toFixed(2)}`, icon: <FiDollarSign size={20} />, color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' },
    { label: 'Total Sales', value: orderCount, icon: <FiFileText size={20} />, color: 'text-cyan-400 bg-cyan-500/5 border-cyan-500/10' },
    { label: 'Active Customers', value: userCount, icon: <FiUsers size={20} />, color: 'text-pink-400 bg-pink-500/5 border-pink-500/10' },
    { label: 'Component Catalog', value: productCount, icon: <FiPackage size={20} />, color: 'text-violet-400 bg-violet-500/5 border-violet-500/10' },
  ];

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
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Admin <span className="text-violet-400">Dashboard</span>
            </h1>
            <p className="text-sm text-[#8b7fb5] mt-1 font-light">Central management portal for the NeuroUX Component Marketplace.</p>
          </div>
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition"
          >
            Add New Component
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <div key={i} className={`glass p-6 rounded-2xl border flex items-center justify-between ${s.color}`}>
              <div>
                <span className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider block mb-1">{s.label}</span>
                <span className="text-3xl font-extrabold text-white">{s.value}</span>
              </div>
              <div className="p-3 bg-black/35 rounded-xl border border-white/5">
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h2 className="text-lg font-bold">Recent Checkout Orders</h2>
              <Link to="/admin/orders" className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition flex items-center gap-1">
                View all <FiArrowRight size={12} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="glass p-8 text-center text-[#8b7fb5] text-sm rounded-2xl border border-white/5 bg-[#0c0b1e]/40">
                No orders have been placed in this session yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="text-xs text-[#8b7fb5] uppercase bg-black/40 border border-white/5 rounded-t-xl">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o._id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="px-4 py-3 font-mono font-bold text-violet-400">#{o._id}</td>
                        <td className="px-4 py-3">{o.userId ? o.userId.name : 'Unknown User'}</td>
                        <td className="px-4 py-3 font-mono">${o.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Tasks */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold border-b border-white/5 pb-3 mb-4">Marketplace Management</h2>
            <div className="glass p-5 rounded-2xl border border-white/5 bg-[#0c0b1e]/60 space-y-3">
              {[
                { title: 'Products Catalog', path: '/admin/products', desc: 'Add, update, or soft-delete component listings.' },
                { title: 'Customer Accounts', path: '/admin/users', desc: 'View customer directories and roles.' },
                { title: 'Order Operations', path: '/admin/orders', desc: 'Inspect purchase transactions.' },
              ].map((task, i) => (
                <Link to={task.path} key={i} className="block group">
                  <div className="p-3 bg-black/30 border border-white/5 hover:border-violet-500/35 rounded-xl transition-all duration-200">
                    <h4 className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors flex items-center justify-between">
                      {task.title} <FiArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[10px] text-[#8b7fb5] mt-1 font-light leading-relaxed">{task.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
