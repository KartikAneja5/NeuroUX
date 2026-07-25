import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiActivity, FiDollarSign, FiShoppingBag, FiUsers, FiPackage } from 'react-icons/fi';
import { getAdminAnalytics } from '../../api/adminApi';

export default function AdminAnalyticsPage() {
  const [revenue, setRevenue] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [categoryShares, setCategoryShares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAdminAnalytics();
        const data = response.data || {};
        setRevenue(data.revenue || 0);
        setSalesCount(data.salesCount || 0);
        setUserCount(data.activeCustomers || 0);
        setProductCount(data.catalogSize || 0);
        setWeeklyRevenue(data.weeklyRevenue || []);
        setCategoryShares(data.categoryShares || []);
      } catch (err) {
        console.error("Failed to load analytics details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `₹${revenue.toFixed(2)}`, change: 'Live DB', icon: <FiDollarSign size={18} /> },
    { label: 'Completed Orders', value: salesCount, change: 'Live DB', icon: <FiShoppingBag size={18} /> },
    { label: 'Registered Customers', value: userCount, change: 'Live DB', icon: <FiUsers size={18} /> },
    { label: 'Catalog Assets', value: productCount, change: 'Live DB', icon: <FiPackage size={18} /> },
  ];

  const colors = ['bg-violet-500', 'bg-cyan-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500'];

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative select-none">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        
        <div className="mb-8 border-b border-white/5 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Sales & Platform <span className="text-violet-400">Analytics</span>
          </h1>
          <p className="text-sm text-[#8b7fb5] mt-1 font-light">Inspect real-time platform revenue distributions and category analytics.</p>
        </div>

        {/* Highlight widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-white/5 bg-[#0c0b1e]/40 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider block mb-1">{s.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">{s.value}</span>
                  <span className="text-emerald-400 text-[10px] font-bold">{s.change}</span>
                </div>
              </div>
              <div className="p-3 bg-violet-600/10 text-violet-400 border border-violet-500/20 rounded-xl">
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Revenue Chart */}
          <div className="md:col-span-2 glass p-6 rounded-2xl border border-white/5 bg-[#0c0b1e]/40 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base mb-1">Revenue Trend (7 Days)</h3>
              <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold mb-4">● Live Database Order Sums</p>
            </div>
            
            {/* Inline SVG Chart */}
            <div className="h-48 w-full bg-black/40 border border-white/5 rounded-xl p-4 relative flex items-end">
              <svg className="absolute inset-0 w-full h-full p-6 text-violet-500" viewBox="0 0 100 50" preserveAspectRatio="none">
                <path
                  d="M0,45 Q15,40 30,30 T60,25 T90,15 T100,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0,45 Q15,40 30,30 T60,25 T90,15 T100,5 L100,50 L0,50 Z"
                  fill="url(#chart-glow)"
                  opacity="0.15"
                />
                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="flex justify-between w-full text-[9px] text-[#8b7fb5] font-mono z-10 pt-4">
                {(weeklyRevenue.length > 0 ? weeklyRevenue : [
                  { day: 'Mon', amount: 0 }, { day: 'Tue', amount: 0 }, { day: 'Wed', amount: 0 },
                  { day: 'Thu', amount: 0 }, { day: 'Fri', amount: 0 }, { day: 'Sat', amount: 0 }, { day: 'Sun', amount: 0 }
                ]).map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-violet-300 font-bold mb-0.5">₹{item.amount}</span>
                    <span className="text-zinc-500 uppercase">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category distribution */}
          <div className="glass p-6 rounded-2xl border border-white/5 bg-[#0c0b1e]/40 space-y-4">
            <h3 className="font-bold text-base mb-1">Catalog Shares</h3>
            
            <div className="space-y-3 text-xs">
              {categoryShares.length > 0 ? (
                categoryShares.map((c, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-zinc-300">
                      <span className="font-medium">{c.category} ({c.count})</span>
                      <span className="font-bold text-violet-400">{c.sharePct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[i % colors.length]}`}
                        style={{ width: `${c.sharePct}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-zinc-500 py-4 text-center">Loading catalog shares...</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
