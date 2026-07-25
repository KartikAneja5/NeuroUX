const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Interaction = require('../models/Interaction');
const asyncHandler = require('../utils/asyncHandler');

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
  res.json(users);
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  // Total Revenue
  const revenueResult = await Order.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // Total Sales (Order count)
  const salesCount = await Order.countDocuments({ status: 'completed' });

  // Active Customers
  const activeCustomers = await User.countDocuments({ role: 'customer' });

  // Catalog Size
  const catalogSize = await Product.countDocuments({ isActive: true });

  // Recent Orders
  const recentOrders = await Order.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  // A/B Test Results — group completed orders by variant
  const abResults = await Order.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: { $ifNull: ['$abVariant', 'variant_A'] },
        conversions: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  const abTestResults = { variant_A: { conversions: 0, revenue: 0 }, variant_B: { conversions: 0, revenue: 0 } };
  abResults.forEach(r => {
    if (abTestResults[r._id]) {
      abTestResults[r._id] = { conversions: r.conversions, revenue: Math.round(r.revenue) };
    }
  });

  // 7-Day Weekly Revenue Trend
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const dailyOrders = await Order.aggregate([
    { $match: { status: 'completed', createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        dailyTotal: { $sum: '$totalAmount' }
      }
    }
  ]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyRevenueMap = {};
  dailyOrders.forEach(d => {
    const dayName = daysOfWeek[d._id - 1];
    if (dayName) weeklyRevenueMap[dayName] = Math.round(d.dailyTotal);
  });

  const weeklyRevenue = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    amount: weeklyRevenueMap[day] || 0
  }));

  // Category Share Breakdown
  const catSharesRaw = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const totalProds = catalogSize || 1;
  const categoryShares = catSharesRaw.map(c => ({
    category: c._id.charAt(0).toUpperCase() + c._id.slice(1),
    count: c.count,
    sharePct: Math.round((c.count / totalProds) * 100)
  }));

  res.json({
    revenue,
    salesCount,
    activeCustomers,
    catalogSize,
    recentOrders,
    abTestResults,
    weeklyRevenue,
    categoryShares
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// NEW: Diagnostic analytics endpoint — feeds all 5 new dashboard sections
// ─────────────────────────────────────────────────────────────────────────────
exports.getDiagnosticAnalytics = asyncHandler(async (req, res) => {
  const now = new Date();
  const weekStart = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const prevWeekStart = new Date(now - 14 * 24 * 60 * 60 * 1000);

  // ── 1. PERIOD-OVER-PERIOD DELTAS ──────────────────────────────────────────
  const [currentWeek, prevWeek] = await Promise.all([
    Order.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: weekStart } } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, sales: { $sum: 1 } } }
    ]),
    Order.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: prevWeekStart, $lt: weekStart } } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, sales: { $sum: 1 } } }
    ])
  ]);

  const cur = currentWeek[0] || { revenue: 0, sales: 0 };
  const prev = prevWeek[0] || { revenue: 0, sales: 0 };

  const calcDelta = (curVal, prevVal) => {
    if (prevVal === 0 || curVal === 0) return null; // insufficient data — hide delta
    return Math.round(((curVal - prevVal) / prevVal) * 100);
  };

  // Customer count delta (registered in each period)
  const [curCustomers, prevCustomers] = await Promise.all([
    User.countDocuments({ role: 'customer', createdAt: { $gte: weekStart } }),
    User.countDocuments({ role: 'customer', createdAt: { $gte: prevWeekStart, $lt: weekStart } })
  ]);

  const deltas = {
    revenue: calcDelta(cur.revenue, prev.revenue),
    sales: calcDelta(cur.sales, prev.sales),
    customers: calcDelta(curCustomers, prevCustomers)
  };

  // ── 2. CONVERSION FUNNEL (per category) ───────────────────────────────────
  // Aggregate interactions → join product category → group by category + type
  const funnelRaw = await Interaction.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: { category: '$product.category', type: '$type' },
        count: { $sum: 1 }
      }
    }
  ]);

  // Reshape into { category: { views, carts, purchases } }
  const funnelMap = {};
  funnelRaw.forEach(({ _id, count }) => {
    const cat = _id.category;
    if (!funnelMap[cat]) funnelMap[cat] = { category: cat, views: 0, carts: 0, purchases: 0 };
    if (_id.type === 'view') funnelMap[cat].views += count;
    else if (_id.type === 'cart') funnelMap[cat].carts += count;
    else if (_id.type === 'purchase') funnelMap[cat].purchases += count;
  });

  // Add drop-off percentages and sort by views descending
  const conversionFunnel = Object.values(funnelMap)
    .map(cat => ({
      ...cat,
      viewToCartDrop: cat.views > 0 ? Math.round((1 - cat.carts / cat.views) * 100) : null,
      cartToPurchaseDrop: cat.carts > 0 ? Math.round((1 - cat.purchases / cat.carts) * 100) : null
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8); // top 8 categories

  // ── 3. RECOMMENDATION EFFECTIVENESS ──────────────────────────────────────
  const [recInteractions, browseInteractions] = await Promise.all([
    Interaction.countDocuments({ source: 'recommendation' }),
    Interaction.countDocuments({ source: 'browse' })
  ]);

  const recPurchases = await Interaction.countDocuments({ source: 'recommendation', type: 'purchase' });
  const totalPurchases = await Interaction.countDocuments({ type: 'purchase' });
  const recCartAdds = await Interaction.countDocuments({ source: 'recommendation', type: 'cart' });
  const totalInteractions = recInteractions + browseInteractions;

  const recommendationEffectiveness = {
    totalRecommendationClicks: recInteractions,
    totalBrowseInteractions: browseInteractions,
    recCartAdds,
    recPurchases,
    totalPurchases,
    // CTR = recommendation views / total recommendation clicks
    recViews: await Interaction.countDocuments({ source: 'recommendation', type: 'view' }),
    purchaseAttributionPct: totalPurchases > 0
      ? Math.round((recPurchases / totalPurchases) * 100)
      : 0,
    // What % of all interactions came from recommendation carousel
    recSharePct: totalInteractions > 0
      ? Math.round((recInteractions / totalInteractions) * 100)
      : 0
  };

  // ── 4. CUSTOMER SEGMENTATION ──────────────────────────────────────────────
  // New = users with exactly 1 order, Returning = 2+
  const segmentPipeline = await Order.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: '$userId', orderCount: { $sum: 1 }, totalSpent: { $sum: '$totalAmount' } } }
  ]);

  let newCustomers = 0, returningCustomers = 0;
  let newRevenue = 0, returningRevenue = 0;
  segmentPipeline.forEach(u => {
    if (u.orderCount === 1) { newCustomers++; newRevenue += u.totalSpent; }
    else if (u.orderCount >= 2) { returningCustomers++; returningRevenue += u.totalSpent; }
  });

  // Avg order value by user's top interaction category
  // Aggregate: for each user, find their top category from interactions
  const userTopCategory = await Interaction.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: { userId: '$userId', category: '$product.category' },
        score: { $sum: '$weight' }
      }
    },
    { $sort: { score: -1 } },
    {
      $group: {
        _id: '$_id.userId',
        topCategory: { $first: '$_id.category' }
      }
    }
  ]);

  // Map userId → topCategory
  const userCatMap = {};
  userTopCategory.forEach(u => { if (u._id) userCatMap[u._id.toString()] = u.topCategory; });

  // Join with orders to get avg order value per category
  const categoryAOV = {};
  segmentPipeline.forEach(u => {
    const uid = u._id ? u._id.toString() : null;
    const cat = uid ? (userCatMap[uid] || 'Uncategorized') : 'Guest';
    if (!categoryAOV[cat]) categoryAOV[cat] = { category: cat, totalRevenue: 0, orderCount: 0, customerCount: 0 };
    categoryAOV[cat].totalRevenue += u.totalSpent;
    categoryAOV[cat].orderCount += u.orderCount;
    categoryAOV[cat].customerCount += 1;
  });

  const segmentByCategory = Object.values(categoryAOV)
    .map(c => ({
      ...c,
      avgOrderValue: c.orderCount > 0 ? Math.round(c.totalRevenue / c.orderCount) : 0
    }))
    .sort((a, b) => b.avgOrderValue - a.avgOrderValue);

  const customerSegmentation = {
    newCustomers,
    returningCustomers,
    avgOrderValueNew: newCustomers > 0 ? Math.round(newRevenue / newCustomers) : 0,
    avgOrderValueReturning: returningCustomers > 0 ? Math.round(returningRevenue / returningCustomers) : 0,
    segmentByCategory
  };

  res.json({
    deltas,
    conversionFunnel,
    recommendationEffectiveness,
    customerSegmentation
  });
});
