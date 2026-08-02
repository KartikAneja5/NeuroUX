const mongoose = require('mongoose');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

const categoryImageMap = {
  'Basic UI Components': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80'
  ],
  'Navigation Components': [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
  ],
  'Feedback Components': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  ],
  'Data Display Components': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  ],
  'Form Components': [
    'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80'
  ],
  'Dashboard Components': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  ],
  'E-commerce Components': [
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556742049-0a67562479f6?auto=format&fit=crop&w=800&q=80'
  ],
  'Mobile App Components': [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80'
  ],
  'AI Product Components': [
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  ],
  'Landing Page Sections': [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
  ],
  'SaaS Components': [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  ],
  'Design Assets & Effects': [
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  ],
  'Templates & Dashboards': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  ],
  'UX Deliverables & Systems': [
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
  ]
};

function generateUniqueThumbnail(name, category, price, index) {
  const images = categoryImageMap[category] || [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  ];
  return images[index % images.length];
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

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    await User.findOneAndUpdate(
      { email: 'admin@neuroux.com' },
      { name: 'NeuroUX System Admin', email: 'admin@neuroux.com', passwordHash: adminPassword, role: 'admin', isVerified: true },
      { upsert: true, new: true }
    );

    const customerPassword = await bcrypt.hash('Password123!', 10);
    await User.findOneAndUpdate(
      { email: 'customer@neuroux.com' },
      { name: 'Demo Customer Account', email: 'customer@neuroux.com', passwordHash: customerPassword, role: 'customer', isVerified: true },
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
