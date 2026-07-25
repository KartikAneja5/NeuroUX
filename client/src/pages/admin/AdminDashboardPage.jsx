import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiDollarSign, FiFileText, FiUsers, FiPackage, FiArrowRight,
  FiTrendingUp, FiTrendingDown, FiActivity, FiCpu, FiAlertTriangle,
  FiCheckCircle, FiInfo, FiZap, FiTarget, FiPieChart
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { getAdminAnalytics, getAdminOrders } from '../../api/adminApi';
import axiosInstance from '../../api/axiosInstance';
import { AdminDashboardSkeleton } from '../../components/common/SkeletonLoader';

// ─── Custom Tooltip for funnel chart ─────────────────────────────────────────
const FunnelTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 rounded-xl border border-white/10 bg-[#0c0b1e]/90 text-xs">
      <p className="font-bold text-white mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

// ─── Delta indicator (only shown when data exists) ───────────────────────────
const DeltaBadge = ({ delta }) => {
  if (delta === null || delta === undefined) return null;
  const positive = delta >= 0;
  return (
    <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
      positive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
    }`}>
      {positive ? <FiTrendingUp size={9} /> : <FiTrendingDown size={9} />}
      {positive ? '+' : ''}{delta}% WoW
    </span>
  );
};

export default function AdminDashboardPage() {
  // ── Existing stats ──────────────────────────────────────────────────────────
  const [revenue, setRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [siteInsights, setSiteInsights] = useState([]);
  const [abTestResults, setAbTestResults] = useState({
    variant_A: { conversions: 0, revenue: 0 },
    variant_B: { conversions: 0, revenue: 0 }
  });

  // ── New diagnostic state ────────────────────────────────────────────────────
  const [deltas, setDeltas] = useState({ revenue: null, sales: null, customers: null });
  const [conversionFunnel, setConversionFunnel] = useState([]);
  const [recEffectiveness, setRecEffectiveness] = useState(null);
  const [customerSegmentation, setCustomerSegmentation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diagLoading, setDiagLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [analyticsRes, ordersRes, insightsRes] = await Promise.all([
          getAdminAnalytics(),
          getAdminOrders(),
          axiosInstance.get('/products/site-insights')
        ]);

        const aData = analyticsRes.data || {};
        setRevenue(aData.revenue || 0);
        setOrderCount(aData.salesCount || 0);
        setUserCount(aData.activeCustomers || 0);
        setProductCount(aData.catalogSize || 0);
        if (aData.abTestResults) setAbTestResults(aData.abTestResults);

        setRecentOrders((ordersRes.data || []).slice(0, 5));
        setSiteInsights((insightsRes.data?.insights) || []);
      } catch (err) {
        console.error('Admin analytics fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();

    // Diagnostic analytics (separate call — doesn't block existing dashboard)
    axiosInstance.get('/admin/analytics/diagnostic')
      .then(res => {
        const d = res.data || {};
        setDeltas(d.deltas || {});
        setConversionFunnel(d.conversionFunnel || []);
        setRecEffectiveness(d.recommendationEffectiveness || null);
        setCustomerSegmentation(d.customerSegmentation || null);
      })
      .catch(err => console.error('Diagnostic analytics fetch failed:', err))
      .finally(() => setDiagLoading(false));
  }, []);

  // ── Chart data ──────────────────────────────────────────────────────────────
  const funnelChartData = conversionFunnel.map(c => ({
    name: c.category.replace(' Components', '').replace(' Controls', ''),
    Views: c.views,
    Carts: c.carts,
    Purchases: c.purchases,
    viewDrop: c.viewToCartDrop,
    cartDrop: c.cartToPurchaseDrop
  }));

  const segCatData = (customerSegmentation?.segmentByCategory || []).map(s => ({
    name: s.category.replace(' Components', '').replace(' Controls', ''),
    'Avg Order Value': s.avgOrderValue,
    Customers: s.customerCount
  }));

  const FUNNEL_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa'];
  const SEG_COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    {
      label: 'Total Revenue', value: `₹${revenue}`, delta: deltas.revenue,
      icon: <FiDollarSign size={20} />, color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10'
    },
    {
      label: 'Total Sales', value: orderCount, delta: deltas.sales,
      icon: <FiFileText size={20} />, color: 'text-cyan-400 bg-cyan-500/5 border-cyan-500/10'
    },
    {
      label: 'Active Customers', value: userCount, delta: deltas.customers,
      icon: <FiUsers size={20} />, color: 'text-pink-400 bg-pink-500/5 border-pink-500/10'
    },
    {
      label: 'Component Catalog', value: productCount, delta: null,
      icon: <FiPackage size={20} />, color: 'text-violet-400 bg-violet-500/5 border-violet-500/10'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080712] pt-28">
        <AdminDashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative select-none">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Admin <span className="text-violet-400">Dashboard</span>
            </h1>
            <p className="text-sm text-[#8b7fb5] mt-1 font-light">Diagnostic analytics · NeuroUX Component Marketplace</p>
          </div>
          <Link to="/admin/products" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition shadow-glow-sm">
            Add New Component
          </Link>
        </div>

        {/* ─── Stats Grid with WoW Deltas ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className={`glass p-6 rounded-2xl border flex flex-col gap-3 ${s.color}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">{s.label}</span>
                <div className="p-2.5 bg-black/35 rounded-xl border border-white/5">{s.icon}</div>
              </div>
              <div className="flex items-end justify-between gap-2">
                <span className="text-3xl font-extrabold text-white">{s.value}</span>
                {!diagLoading && <DeltaBadge delta={s.delta} />}
              </div>
            </div>
          ))}
        </div>

        {/* ─── 1. Conversion Funnel ─────────────────────────────────────────── */}
        <div className="glass p-6 rounded-3xl border border-white/8 bg-[#0c0b1e]/60 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FiTarget className="text-violet-400" size={18} />
            <h2 className="text-base font-bold text-white">Conversion Funnel — Views → Carts → Purchases</h2>
            {diagLoading && <span className="text-[10px] text-zinc-500 font-mono ml-2 animate-pulse">Loading…</span>}
          </div>
          {!diagLoading && conversionFunnel.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">No interaction data yet. Run <code className="font-mono text-violet-400">simulate_interactions</code> to seed data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={funnelChartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="name" tick={{ fill: '#8b7fb5', fontSize: 10 }} />
                <YAxis tick={{ fill: '#8b7fb5', fontSize: 10 }} />
                <Tooltip content={<FunnelTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#8b7fb5', paddingTop: '12px' }} />
                <Bar dataKey="Views" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Carts" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Purchases" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          )}
          {/* Drop-off table */}
          {!diagLoading && conversionFunnel.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-[10px] text-[#8b7fb5] uppercase tracking-wider border-b border-white/5">
                    <th className="pb-2 pr-4">Category</th>
                    <th className="pb-2 pr-4 text-right">Views</th>
                    <th className="pb-2 pr-4 text-right">Carts</th>
                    <th className="pb-2 pr-4 text-right">Purchases</th>
                    <th className="pb-2 pr-4 text-right text-amber-400">View→Cart Drop</th>
                    <th className="pb-2 text-right text-rose-400">Cart→Purchase Drop</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionFunnel.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition">
                      <td className="py-2 pr-4 text-white font-medium">{row.category}</td>
                      <td className="py-2 pr-4 text-right font-mono text-violet-300">{row.views}</td>
                      <td className="py-2 pr-4 text-right font-mono text-cyan-300">{row.carts}</td>
                      <td className="py-2 pr-4 text-right font-mono text-emerald-300">{row.purchases}</td>
                      <td className="py-2 pr-4 text-right">
                        {row.viewToCartDrop !== null ? (
                          <span className={`font-mono font-bold ${row.viewToCartDrop > 80 ? 'text-rose-400' : row.viewToCartDrop > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {row.viewToCartDrop}%
                          </span>
                        ) : <span className="text-zinc-600">—</span>}
                      </td>
                      <td className="py-2 text-right">
                        {row.cartToPurchaseDrop !== null ? (
                          <span className={`font-mono font-bold ${row.cartToPurchaseDrop > 80 ? 'text-rose-400' : row.cartToPurchaseDrop > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {row.cartToPurchaseDrop}%
                          </span>
                        ) : <span className="text-zinc-600">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ─── 2. Recommendation Effectiveness ─────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <FiZap className="text-amber-400" size={18} /> Recommendation Engine Effectiveness
          </h2>
          {diagLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0,1,2,3].map(i => <div key={i} className="glass p-5 rounded-2xl border border-white/8 animate-pulse h-24" />)}
            </div>
          ) : recEffectiveness ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Rec. Carousel Clicks',
                  value: recEffectiveness.totalRecommendationClicks,
                  sub: `${recEffectiveness.recSharePct}% of all interactions`,
                  color: 'text-amber-400'
                },
                {
                  label: 'Rec. Cart-Adds',
                  value: recEffectiveness.recCartAdds,
                  sub: 'originated from carousel',
                  color: 'text-violet-400'
                },
                {
                  label: 'Rec. Purchases',
                  value: recEffectiveness.recPurchases,
                  sub: `of ${recEffectiveness.totalPurchases} total`,
                  color: 'text-emerald-400'
                },
                {
                  label: 'Purchase Attribution',
                  value: `${recEffectiveness.purchaseAttributionPct}%`,
                  sub: 'of purchases via recommendations',
                  color: 'text-pink-400'
                }
              ].map((card, i) => (
                <div key={i} className="glass p-5 rounded-2xl border border-white/8 bg-[#0c0b1e]/70">
                  <p className={`text-2xl font-extrabold ${card.color}`}>{card.value}</p>
                  <p className="text-xs font-semibold text-white mt-1">{card.label}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{card.sub}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No recommendation tracking data yet — visit the homepage to generate interaction events.</p>
          )}
          <p className="text-[10px] text-zinc-600 mt-2 font-mono">Tracked via <code>source</code> field on interaction events (browse vs recommendation)</p>
        </div>

        {/* ─── 3. Customer Segmentation ────────────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <FiPieChart className="text-pink-400" size={18} /> Customer Segmentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New vs Returning */}
            <div className="glass p-6 rounded-2xl border border-white/8 bg-[#0c0b1e]/70">
              <h3 className="text-sm font-bold text-white mb-4">New vs Returning Customers</h3>
              {diagLoading ? <div className="animate-pulse h-20 bg-white/5 rounded-xl" /> : customerSegmentation ? (
                <div className="space-y-3">
                  {[
                    { label: 'New Customers (1 order)', count: customerSegmentation.newCustomers, aov: customerSegmentation.avgOrderValueNew, color: 'bg-violet-500', textColor: 'text-violet-400' },
                    { label: 'Returning Customers (2+ orders)', count: customerSegmentation.returningCustomers, aov: customerSegmentation.avgOrderValueReturning, color: 'bg-cyan-500', textColor: 'text-cyan-400' }
                  ].map((seg, i) => {
                    const total = customerSegmentation.newCustomers + customerSegmentation.returningCustomers;
                    const pct = total > 0 ? Math.round((seg.count / total) * 100) : 0;
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-[#8b7fb5]">{seg.label}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${seg.textColor}`}>{seg.count}</span>
                            {seg.aov > 0 && <span className="text-[10px] text-zinc-500 font-mono">AOV ₹{seg.aov}</span>}
                          </div>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <div className={`${seg.color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-zinc-600 font-mono">{pct}%</span>
                      </div>
                    );
                  })}
                  {customerSegmentation.newCustomers + customerSegmentation.returningCustomers === 0 && (
                    <p className="text-xs text-zinc-500 text-center py-4">No completed orders yet</p>
                  )}
                </div>
              ) : null}
            </div>

            {/* Avg Order Value by Affinity Category */}
            <div className="glass p-6 rounded-2xl border border-white/8 bg-[#0c0b1e]/70">
              <h3 className="text-sm font-bold text-white mb-4">Avg Order Value by Top Affinity Category</h3>
              {diagLoading ? <div className="animate-pulse h-20 bg-white/5 rounded-xl" /> : (
                segCatData.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-4">No order data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={segCatData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis type="number" tick={{ fill: '#8b7fb5', fontSize: 9 }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: '#8b7fb5', fontSize: 9 }} width={80} />
                      <Tooltip content={<FunnelTooltip />} />
                      <Bar dataKey="Avg Order Value" radius={[0, 4, 4, 0]} maxBarSize={18}>
                        {segCatData.map((_, i) => <Cell key={i} fill={SEG_COLORS[i % SEG_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )
              )}
            </div>
          </div>
        </div>

        {/* ─── A/B Test Results ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <FiActivity className="text-violet-400" size={18} /> A/B Test Harness — Live Conversion Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['variant_A', 'Variant A — Standard Homepage', 'cyan'], ['variant_B', 'Variant B — Adaptive AI Homepage', 'violet']].map(([key, label, color]) => {
              const d = abTestResults[key] || { conversions: 0, revenue: 0 };
              return (
                <div key={key} className={`glass p-5 rounded-2xl border border-${color}-500/20 bg-[#0c0b1e]/70`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold text-${color}-400 uppercase tracking-wider`}>{label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>{key}</span>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-2xl font-extrabold text-white">{d.conversions}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Conversions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-white">₹{d.revenue}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Revenue</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 font-mono">50/50 random split via localStorage · tagged on order creation · no significance test</p>
        </div>

        {/* ─── Layer-2 Business Intelligence (with reasoning) ───────────────── */}
        {siteInsights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <FiCpu className="text-cyan-400" size={18} /> Layer-2 Self-Learning Business Intelligence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {siteInsights.map((item, idx) => (
                <div key={idx} className="glass p-5 rounded-2xl border border-white/8 bg-[#0c0b1e]/70 flex items-start gap-4">
                  <div className={`p-3 rounded-xl border flex-shrink-0 ${
                    item.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    item.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                  }`}>
                    {item.type === 'warning' ? <FiAlertTriangle size={20} /> :
                     item.type === 'success' ? <FiCheckCircle size={20} /> : <FiInfo size={20} />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-violet-300 border border-white/8 flex-shrink-0">{item.metric}</span>
                    </div>
                    <p className="text-xs text-[#8b7fb5] mt-1 font-light leading-relaxed">{item.description}</p>
                    {/* ─── Insight Reasoning (Feature 5) ──────────────────── */}
                    {item.reasoning && (
                      <p className="text-[10px] text-amber-400/80 mt-2 font-mono border-t border-white/5 pt-2 leading-relaxed">
                        ⚑ {item.reasoning}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 mt-2 font-mono">Re-run <code>generate_site_insights</code> management command to refresh · reasoning powered by category-level heuristics</p>
          </div>
        )}

        {/* ─── Revenue Chart + Recent Orders + Quick Tasks ──────────────────── */}
        <div className="glass p-6 rounded-3xl border border-white/8 bg-[#0c0b1e]/60 backdrop-blur-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FiTrendingUp className="text-emerald-400" size={18} /> Revenue Growth & Conversion Trends
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Monthly invoice volume & recommendation interactions</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <FiActivity size={13} className="animate-pulse" /> +28.4% YoY Growth
            </div>
          </div>
          <div className="h-44 flex items-end justify-between gap-4 pt-6 px-2 border-b border-white/5 pb-2">
            {[
              { month: 'Jan', val: 3200, height: '35%' },
              { month: 'Feb', val: 4500, height: '48%' },
              { month: 'Mar', val: 6800, height: '65%' },
              { month: 'Apr', val: 8200, height: '78%' },
              { month: 'May', val: 10400, height: '90%' },
              { month: 'Jun', val: 12900, height: '100%' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] text-violet-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">₹{bar.val}</div>
                <div
                  className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-violet-900 via-violet-600 to-fuchsia-400 group-hover:from-violet-600 group-hover:to-fuchsia-300 transition-all duration-300 shadow-glow-sm"
                  style={{ height: bar.height }}
                />
                <span className="text-xs text-zinc-500 font-mono mt-1">{bar.month}</span>
              </div>
            ))}
          </div>
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
                        <td className="px-4 py-3 font-mono font-bold text-violet-400">#{o._id?.slice(-8)}</td>
                        <td className="px-4 py-3">{o.userId ? o.userId.name : 'Unknown User'}</td>
                        <td className="px-4 py-3 font-mono">₹{o.totalAmount}</td>
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
