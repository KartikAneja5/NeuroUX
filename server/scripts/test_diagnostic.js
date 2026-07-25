require('dotenv').config({ path: 'e:/NeuroUX/NeuroUX/server/.env' });
const path = require('path');
const mongoose = require(path.join('e:/NeuroUX/NeuroUX/server/node_modules/mongoose'));
const Interaction = require(path.join('e:/NeuroUX/NeuroUX/server/src/models/Interaction'));
const Product = require(path.join('e:/NeuroUX/NeuroUX/server/src/models/Product'));
const Order = require(path.join('e:/NeuroUX/NeuroUX/server/src/models/Order'));
const User = require(path.join('e:/NeuroUX/NeuroUX/server/src/models/User'));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    const funnelRaw = await Interaction.aggregate([
      { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $group: { _id: { category: '$product.category', type: '$type' }, count: { $sum: 1 } } }
    ]);
    const funnelMap = {};
    funnelRaw.forEach(({ _id, count }) => {
      const cat = _id.category;
      if (!funnelMap[cat]) funnelMap[cat] = { category: cat, views: 0, carts: 0, purchases: 0 };
      if (_id.type === 'view') funnelMap[cat].views += count;
      else if (_id.type === 'cart') funnelMap[cat].carts += count;
      else if (_id.type === 'purchase') funnelMap[cat].purchases += count;
    });
    console.log('CONVERSION FUNNEL: ' + JSON.stringify(Object.values(funnelMap)));

    const sources = await Interaction.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]);
    console.log('SOURCES: ' + JSON.stringify(sources));

    const now = new Date();
    const weekStart = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const prevWeekStart = new Date(now - 14 * 24 * 60 * 60 * 1000);
    const [cur, prev] = await Promise.all([
      Order.aggregate([{ $match: { status: 'completed', createdAt: { $gte: weekStart } } }, { $group: { _id: null, revenue: { $sum: '$totalAmount' }, sales: { $sum: 1 } } }]),
      Order.aggregate([{ $match: { status: 'completed', createdAt: { $gte: prevWeekStart, $lt: weekStart } } }, { $group: { _id: null, revenue: { $sum: '$totalAmount' }, sales: { $sum: 1 } } }])
    ]);
    console.log('CURRENT_WEEK: ' + JSON.stringify(cur[0] || null));
    console.log('PREV_WEEK: ' + JSON.stringify(prev[0] || null));

    const seg = await Order.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: '$userId', orderCount: { $sum: 1 }, totalSpent: { $sum: '$totalAmount' } } }]);
    let newC = 0, retC = 0;
    seg.forEach(u => { if (u.orderCount === 1) newC++; else retC++; });
    console.log('SEGMENTATION: new=' + newC + ' returning=' + retC);

    const [recT, browseT, recP, totP] = await Promise.all([
      Interaction.countDocuments({ source: 'recommendation' }),
      Interaction.countDocuments({ source: 'browse' }),
      Interaction.countDocuments({ source: 'recommendation', type: 'purchase' }),
      Interaction.countDocuments({ type: 'purchase' })
    ]);
    console.log('REC_EFFECTIVENESS: recTotal=' + recT + ' browseTotal=' + browseT + ' recPurchases=' + recP + ' totalPurchases=' + totP);

    process.exit(0);
  })
  .catch(e => { console.error('DB_ERROR: ' + e.message); process.exit(1); });
