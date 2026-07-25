const path = require('path');
require('dotenv').config({ path: 'e:/NeuroUX/NeuroUX/server/.env' });
const mongoose = require(path.join('e:/NeuroUX/NeuroUX/server/node_modules/mongoose'));
const Interaction = require(path.join('e:/NeuroUX/NeuroUX/server/src/models/Interaction'));

mongoose.connect('mongodb://127.0.0.1:27017/NeuroUX')
  .then(async () => {
    console.log('=== LATEST INTERACTIONS IN MONGODB ===');
    const recent = await Interaction.find().sort({ timestamp: -1 }).limit(10);
    recent.forEach(i => {
      console.log(`ID: ${i._id} | Type: ${i.type} | Source: ${i.source} | Product: ${i.productId} | Time: ${i.timestamp}`);
    });
    process.exit(0);
  })
  .catch(e => { console.error(e); process.exit(1); });
