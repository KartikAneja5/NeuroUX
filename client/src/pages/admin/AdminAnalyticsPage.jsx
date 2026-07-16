import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiActivity, FiDollarSign, FiShoppingBag, FiUsers, FiPackage } from 'react-icons/fi';
import { getAdminAnalytics } from '../../api/adminApi';

export default function AdminAnalyticsPage() {
  const [revenue, setRevenue] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
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
      } catch (err) {
        console.error("Failed to load analytics details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `$${revenue.toFixed(2)}`, change: 'Live DB', icon: <FiDollarSign size={18} /> },
    { label: 'Completed Orders', value: salesCount, change: 'Live DB', icon: <FiShoppingBag size={18} /> },
    { label: 'Registered Customers', value: userCount, change: 'Live DB', icon: <FiUsers size={18} /> },
    { label: 'Catalog Assets', value: productCount, change: 'Live DB', icon: <FiPackage size={18} /> },
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
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        
        <div className="mb-8 border-b border-white/5 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Sales & Platform <span className="text-violet-400">Analytics</span>
          </h1>
          <p className="text-sm text-[#8b7fb5] mt-1 font-light">Inspect platform revenue distributions and category analytics.</p>
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
              <p className="text-[10px] text-[#8b7fb5] uppercase tracking-wider font-semibold mb-4">simulated weekly breakdown</p>
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
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="flex justify-between w-full text-[9px] text-[#8b7fb5] font-mono z-10 pt-4">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Category distribution */}
          <div className="glass p-6 rounded-2xl border border-white/5 bg-[#0c0b1e]/40 space-y-4">
            <h3 className="font-bold text-base mb-1">Category Shares</h3>
            
            <div className="space-y-3.5 text-xs">
              {[
                { category: 'Text Animations', share: '38%', width: 'w-[38%]', color: 'bg-violet-500' },
                { category: 'Animations', share: '24%', width: 'w-[24%]', color: 'bg-cyan-500' },
                { category: 'Components', share: '28%', width: 'w-[28%]', color: 'bg-pink-500' },
                { category: 'Backgrounds', share: '10%', width: 'w-[10%]', color: 'bg-emerald-500' },
              ].map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-zinc-300">
                    <span>{c.category}</span>
                    <span className="font-bold">{c.share}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.color} ${c.width}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
