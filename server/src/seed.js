const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function generateUniqueThumbnail(name, category, price, index) {
  const hues = [270, 210, 320, 180, 250, 190, 300, 230, 280, 160, 340, 200, 260, 220, 310];
  const hue = hues[index % hues.length];
  const hue2 = (hue + 45) % 360;

  const safeCategory = escapeXml(category);
  const safeName = escapeXml(name.substring(0, 18).toUpperCase());
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <defs>
      <linearGradient id="g${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${hue}, 75%, 10%)" />
        <stop offset="50%" stop-color="hsl(${hue2}, 65%, 16%)" />
        <stop offset="100%" stop-color="rgb(8, 7, 18)" />
      </linearGradient>
      <linearGradient id="b${index}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="hsl(${hue}, 90%, 65%)" />
        <stop offset="100%" stop-color="hsl(${hue2}, 90%, 65%)" />
      </linearGradient>
      <pattern id="p${index}" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.07)" />
      </pattern>
    </defs>
    <rect width="600" height="450" fill="url(#g${index})" />
    <rect width="600" height="450" fill="url(#p${index})" />
    
    <!-- UI Frame Mockup -->
    <rect x="60" y="50" width="480" height="320" rx="16" fill="rgba(12, 11, 30, 0.85)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    <circle cx="90" cy="80" r="5.5" fill="rgb(239, 68, 68)" />
    <circle cx="110" cy="80" r="5.5" fill="rgb(245, 158, 11)" />
    <circle cx="130" cy="80" r="5.5" fill="rgb(16, 185, 129)" />
    <text x="210" y="84" fill="rgba(255,255,255,0.5)" font-family="monospace" font-size="12">${safeCategory}</text>
    
    <!-- Component Graphic Element -->
    <rect x="90" y="120" width="420" height="6" rx="3" fill="url(#b${index})" opacity="0.9" />
    <rect x="90" y="145" width="280" height="16" rx="8" fill="rgba(255,255,255,0.9)" />
    <rect x="90" y="178" width="360" height="10" rx="5" fill="rgba(255,255,255,0.35)" />
    <rect x="90" y="200" width="310" height="10" rx="5" fill="rgba(255,255,255,0.25)" />
    
    <!-- Button Badge Graphic -->
    <rect x="90" y="240" width="180" height="46" rx="12" fill="url(#b${index})" />
    <text x="180" y="269" fill="rgb(255, 255, 255)" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">${safeName}</text>
    
    <text x="500" y="420" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="13" font-weight="bold" text-anchor="end">Rs. ${price}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const rawCatalog = [
  // 1. BASIC UI COMPONENTS (5)
  { name: 'Cyberpunk Neon Button', category: 'Basic UI Components', price: 499, tags: ['button', 'cyberpunk', 'neon'] },
  { name: 'Floating Glass Input', category: 'Basic UI Components', price: 399, tags: ['input', 'glassmorphism'] },
  { name: 'Glow Toggle Switch', category: 'Basic UI Components', price: 299, tags: ['switch', 'toggle', 'glow'] },
  { name: 'Micro Pulsing Badge', category: 'Basic UI Components', price: 199, tags: ['badge', 'pulse'] },
  { name: 'Ripple Impact Button', category: 'Basic UI Components', price: 349, tags: ['button', 'ripple'] },

  // 2. NAVIGATION COMPONENTS (4)
  { name: 'Floating Glass Navbar', category: 'Navigation Components', price: 899, tags: ['navbar', 'header'] },
  { name: 'Spotlight Command Palette', category: 'Navigation Components', price: 1199, tags: ['command', 'palette'] },
  { name: 'Radial Speed Dial Menu', category: 'Navigation Components', price: 699, tags: ['radial', 'menu'] },
  { name: 'Animated Breadcrumb Dock', category: 'Navigation Components', price: 449, tags: ['breadcrumb', 'dock'] },

  // 3. FEEDBACK COMPONENTS (3)
  { name: 'Glow Toast Notification', category: 'Feedback Components', price: 599, tags: ['toast', 'alert'] },
  { name: 'Hologram Modal Dialog', category: 'Feedback Components', price: 799, tags: ['modal', 'hologram'] },
  { name: 'Pulsing Alert Banner', category: 'Feedback Components', price: 349, tags: ['alert', 'banner'] },

  // 4. DATA DISPLAY COMPONENTS (4)
  { name: 'Spotlight Card', category: 'Data Display Components', price: 1299, tags: ['card', 'spotlight'] },
  { name: 'Neon Stat Widget', category: 'Data Display Components', price: 699, tags: ['stat', 'widget'] },
  { name: 'Interactive Matrix Table', category: 'Data Display Components', price: 1499, tags: ['table', 'matrix'] },
  { name: 'Animated Sparkline Badge', category: 'Data Display Components', price: 549, tags: ['sparkline', 'chart'] },

  // 5. FORM COMPONENTS (4)
  { name: 'Glass Auth Login Form', category: 'Form Components', price: 1499, tags: ['form', 'auth'] },
  { name: 'Multi-Step Wizard Progress Bar', category: 'Form Components', price: 999, tags: ['wizard', 'step'] },
  { name: 'Credit Card Payment Selector', category: 'Form Components', price: 1299, tags: ['payment', 'card'] },
  { name: 'Tag Input Chips Field', category: 'Form Components', price: 399, tags: ['tag', 'chips'] },

  // 6. DASHBOARD COMPONENTS (3)
  { name: 'Executive Analytics Panel', category: 'Dashboard Components', price: 1999, tags: ['dashboard', 'analytics'] },
  { name: 'Live Activity Timeline Feed', category: 'Dashboard Components', price: 1199, tags: ['feed', 'timeline'] },
  { name: 'Gauge Progress Radial Ring', category: 'Dashboard Components', price: 899, tags: ['radial', 'gauge'] },

  // 7. E-COMMERCE COMPONENTS (3)
  { name: 'Glow Glass Pricing Card', category: 'E-commerce Components', price: 999, tags: ['pricing', 'card'] },
  { name: 'Interactive Shopping Cart Drawer', category: 'E-commerce Components', price: 1299, tags: ['cart', 'drawer'] },
  { name: 'Checkout Summary Accordion', category: 'E-commerce Components', price: 899, tags: ['checkout', 'accordion'] },

  // 8. MOBILE APP COMPONENTS (3)
  { name: 'Mobile Bottom Sheet Drawer', category: 'Mobile App Components', price: 799, tags: ['mobile', 'drawer'] },
  { name: 'Touch Swipable Card Stack', category: 'Mobile App Components', price: 999, tags: ['swipe', 'stack'] },
  { name: 'Tab Bar Bottom Navigator', category: 'Mobile App Components', price: 599, tags: ['tab', 'bottom'] },

  // 9. AI PRODUCT COMPONENTS (3)
  { name: 'AI Chat Interface & Prompts', category: 'AI Product Components', price: 1899, tags: ['ai', 'chat'] },
  { name: 'Vector Embedding Similarity Graph', category: 'AI Product Components', price: 2499, tags: ['vector', 'graph'] },
  { name: 'AI Token Stream Typer', category: 'AI Product Components', price: 799, tags: ['stream', 'typer'] },

  // 10. SAAS COMPONENTS (3)
  { name: 'SaaS Team Roles & API Key Manager', category: 'SaaS Components', price: 1599, tags: ['saas', 'api'] },
  { name: 'Billing Usage Meter Bar', category: 'SaaS Components', price: 899, tags: ['meter', 'billing'] },
  { name: 'Organization Switcher Menu', category: 'SaaS Components', price: 699, tags: ['org', 'menu'] },

  // 11. LANDING PAGE SECTIONS (3)
  { name: 'Hero Section with Animated Canvas', category: 'Landing Page Sections', price: 1799, tags: ['hero', 'canvas'] },
  { name: 'Bento Grid Feature Matrix', category: 'Landing Page Sections', price: 1599, tags: ['bento', 'grid'] },
  { name: 'Interactive Pricing Toggle Table', category: 'Landing Page Sections', price: 1299, tags: ['pricing', 'table'] },

  // 12. DESIGN ASSETS & EFFECTS (3)
  { name: 'Liquid Ether Background Shader', category: 'Design Assets & Effects', price: 1499, tags: ['shader', 'ether'] },
  { name: 'Luminous Light Beams', category: 'Design Assets & Effects', price: 999, tags: ['beams', 'light'] },
  { name: 'Glassmorphism Blur Cards Pack', category: 'Design Assets & Effects', price: 1199, tags: ['glass', 'pack'] },

  // 13. TEMPLATES & DASHBOARDS (3)
  { name: 'FinTech CRM Dashboard Template', category: 'Templates & Dashboards', price: 2999, tags: ['fintech', 'crm'] },
  { name: 'Crypto Portfolio Tracker Template', category: 'Templates & Dashboards', price: 3499, tags: ['crypto', 'portfolio'] },
  { name: 'Developer Documentation Portal', category: 'Templates & Dashboards', price: 2499, tags: ['docs', 'portal'] },

  // 14. UX DELIVERABLES & SYSTEMS (3)
  { name: 'Enterprise Design System & Figma UI Kit', category: 'UX Deliverables & Systems', price: 4999, tags: ['design-system', 'figma'] },
  { name: 'Design System Token Specification', category: 'UX Deliverables & Systems', price: 1999, tags: ['tokens', 'spec'] },
  { name: 'Accessibility Auditing Matrix', category: 'UX Deliverables & Systems', price: 1499, tags: ['a11y', 'matrix'] }
];

async function seedProducts(force = false) {
  try {
    const existingCount = await Product.countDocuments();
    if (existingCount > 0 && !force) {
      console.log(`Database already seeded with ${existingCount} products.`);
      return;
    }

    console.log("Seeding catalog products...");
    await Product.deleteMany({});

    const seededProducts = rawCatalog.map((item, idx) => ({
      name: item.name,
      category: item.category,
      tags: item.tags,
      description: `${item.name} — Production-ready, fully animated component built for React & Tailwind CSS. Includes customizable props and responsive layout.`,
      price: item.price,
      previewImageUrl: generateUniqueThumbnail(item.name, item.category, item.price, idx),
      livePreviewUrl: '#',
      framework: 'react',
      rating: 4.8 + ((idx % 3) * 0.1),
      reviews: 12 + (idx * 5),
      author: {
        name: idx % 2 === 0 ? 'NeuroUX Team' : 'MotionLabs',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.name)}`
      },
      code: `export default function ${item.name.replace(/[^a-zA-Z]/g, '')}() {\n  return (\n    <div className="p-6 bg-slate-900 border border-white/10 rounded-2xl text-white font-sans text-center shadow-xl">\n      <h4 className="font-bold text-violet-400 text-sm mb-2">${item.name}</h4>\n      <p className="text-xs text-slate-300">Active component preview</p>\n    </div>\n  );\n}`
    }));

    await Product.insertMany(seededProducts);
    console.log(`Successfully seeded ${seededProducts.length} catalog products with valid XML-escaped Base64 thumbnails.`);

    const adminPassword = await bcrypt.hash('Password123!', 10);
    await User.findOneAndUpdate(
      { email: 'admin@neuroux.com' },
      { name: 'NeuroUX System Admin', email: 'admin@neuroux.com', password: adminPassword, role: 'admin', isVerified: true },
      { upsert: true, new: true }
    );

    const customerPassword = await bcrypt.hash('Password123!', 10);
    await User.findOneAndUpdate(
      { email: 'customer@neuroux.com' },
      { name: 'Demo Customer Account', email: 'customer@neuroux.com', password: customerPassword, role: 'customer', isVerified: true },
      { upsert: true, new: true }
    );

    console.log("Seeded demo Admin and Customer accounts.");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

if (require.main === module) {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/NeuroUX';
  mongoose.connect(mongoUri).then(() => {
    return seedProducts(true);
  }).then(() => {
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seedProducts;
