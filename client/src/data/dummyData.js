export const dummyCategories = [
  { id: 'basic-ui-components', name: 'Basic UI Components', count: 14 },
  { id: 'navigation-components', name: 'Navigation Components', count: 10 },
  { id: 'feedback-components', name: 'Feedback Components', count: 9 },
  { id: 'data-display-components', name: 'Data Display Components', count: 10 },
  { id: 'form-components', name: 'Form Components', count: 9 },
  { id: 'dashboard-components', name: 'Dashboard Components', count: 9 },
  { id: 'e-commerce-components', name: 'E-commerce Components', count: 9 },
  { id: 'mobile-app-components', name: 'Mobile App Components', count: 8 },
  { id: 'ai-product-components', name: 'AI Product Components', count: 9 },
  { id: 'saas-components', name: 'SaaS Components', count: 8 },
  { id: 'landing-page-sections', name: 'Landing Page Sections', count: 8 },
  { id: 'design-assets-&-effects', name: 'Design Assets & Effects', count: 8 },
  { id: 'templates-&-dashboards', name: 'Templates & Dashboards', count: 9 },
  { id: 'ux-deliverables-&-systems', name: 'UX Deliverables & Systems', count: 10 }
];

export const dummyProducts = [
  // 1. BASIC UI COMPONENTS
  {
    id: 'cyberpunk-neon-button',
    name: 'Cyberpunk Neon Button',
    category: 'Basic UI Components',
    categoryId: 'basic-ui-components',
    tags: ['button', 'cyberpunk', 'neon', 'hover', 'glitch'],
    description: 'Futuristic neon glowing button with glitch effect on hover, clip-path corners, and pulse animation.',
    price: 499,
    previewImageUrl: '/images/magnet.png',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.9,
    reviews: 142,
    author: { name: 'MotionLabs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MotionLabs' },
    code: `export default function CyberButton({ label = "EXECUTE" }) {
  return (
    <button className="relative px-8 py-3.5 bg-black border-2 border-cyan-400 text-cyan-400 font-mono font-bold tracking-widest uppercase text-sm hover:bg-cyan-400 hover:text-black transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95">
      <span className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 inline-block" />
      <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 inline-block" />
      {label}
    </button>
  );
}`
  },
  {
    id: 'floating-glass-input',
    name: 'Floating Glass Input',
    category: 'Basic UI Components',
    categoryId: 'basic-ui-components',
    tags: ['input', 'glassmorphism', 'floating-label', 'form'],
    description: 'Translucent glass input field with animated floating label and glowing violet focus ring.',
    price: 399,
    previewImageUrl: '/images/glow-glass-pricing.png',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.8,
    reviews: 89,
    author: { name: 'UI UX Labs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UIUXLabs' },
    code: `import { useState } from 'react';

export default function GlassInput({ label = "Email Address" }) {
  const [val, setVal] = useState('');
  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="peer w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 backdrop-blur-md transition-all"
        placeholder={label}
      />
      <label className="absolute left-4 top-3 text-xs text-zinc-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-violet-400 font-medium">
        {label}
      </label>
    </div>
  );
}`
  },
  {
    id: 'glow-toggle-switch',
    name: 'Glow Toggle Switch',
    category: 'Basic UI Components',
    categoryId: 'basic-ui-components',
    tags: ['switch', 'toggle', 'glow', 'checkbox'],
    description: 'Tactile dark mode toggle switch with glowing active track and smooth spring transition.',
    price: 299,
    previewImageUrl: '/images/magnet.png',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.95,
    reviews: 110,
    author: { name: 'CanvasCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CanvasCraft' },
    code: `import { useState } from 'react';

export default function GlowSwitch({ label = "Dark Mode" }) {
  const [active, setActive] = useState(true);
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <span className="text-xs font-semibold text-zinc-300">{label}</span>
      <div 
        onClick={() => setActive(!active)}
        className={\`w-12 h-6 rounded-full p-1 transition-colors duration-300 border border-white/10 \${active ? 'bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-zinc-900'}\`}
      >
        <div className={\`w-4 h-4 rounded-full bg-white transition-transform duration-300 \${active ? 'translate-x-6' : 'translate-x-0'}\`} />
      </div>
    </label>
  );
}`
  },

  // 2. NAVIGATION COMPONENTS
  {
    id: 'floating-glass-navbar',
    name: 'Floating Glass Navbar',
    category: 'Navigation Components',
    categoryId: 'navigation-components',
    tags: ['navbar', 'glassmorphism', 'header', 'navigation'],
    description: 'Floating pill navigation bar with backdrop blur, active state indicators, and glowing CTA.',
    price: 899,
    previewImageUrl: '/images/glow-glass-pricing.png',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.9,
    reviews: 210,
    author: { name: 'UI UX Labs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UIUXLabs' },
    code: `export default function GlassNavbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl max-w-2xl mx-auto shadow-2xl">
      <div className="font-bold text-white tracking-tight">Neuro<span className="text-violet-400">UX</span></div>
      <div className="flex gap-4 text-xs font-medium text-zinc-400">
        <a href="#" className="text-white">Features</a>
        <a href="#" className="hover:text-white transition">Catalog</a>
        <a href="#" className="hover:text-white transition">Pricing</a>
      </div>
      <button className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-full shadow-glow">Get Started</button>
    </nav>
  );
}`
  },

  // 3. FEEDBACK COMPONENTS
  {
    id: 'glow-toast-notification',
    name: 'Glow Toast Notification',
    category: 'Feedback Components',
    categoryId: 'feedback-components',
    tags: ['toast', 'notification', 'alert', 'feedback'],
    description: 'Animated floating notification card with status icons, glowing border, and auto-dismiss progress bar.',
    price: 599,
    previewImageUrl: '/images/glow-glass-pricing.png',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.85,
    reviews: 78,
    author: { name: 'MotionLabs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MotionLabs' },
    code: `export default function ToastNotification() {
  return (
    <div className="flex items-start gap-3 p-4 bg-zinc-950 border border-emerald-500/30 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.15)] max-w-sm">
      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">✓</div>
      <div>
        <h4 className="text-xs font-bold text-white mb-0.5">Order Confirmed</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">Your invoice #8920 has been generated successfully.</p>
      </div>
    </div>
  );
}`
  },

  // 4. DATA DISPLAY COMPONENTS
  {
    id: 'spotlight-card',
    name: 'Spotlight Card',
    category: 'Data Display Components',
    categoryId: 'data-display-components',
    tags: ['card', 'spotlight', 'glowing-border', 'dark-ui'],
    description: 'Dark-themed card with dynamic radial cursor spotlight and subtle border glow.',
    price: 1299,
    previewImageUrl: '/images/spotlight-card.png',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.95,
    reviews: 310,
    author: { name: 'CanvasCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CanvasCraft' },
    code: `import { useRef, useState } from 'react';

export default function SpotlightCard({ title = "Analytics Insights", desc = "Real-time user event stream" }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top } = cardRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - left, y: e.clientY - top });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative p-6 rounded-2xl bg-zinc-950/80 border border-white/10 overflow-hidden select-none"
    >
      <div 
        className="pointer-events-none absolute -inset-px transition opacity-0 hover:opacity-100"
        style={{ background: \`radial-gradient(600px circle at \${coords.x}px \${coords.y}px, rgba(139,92,246,0.15), transparent 40%)\` }}
      />
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{desc}</p>
    </div>
  );
}`
  },

  // 5. FORM COMPONENTS
  {
    id: 'glass-auth-login-form',
    name: 'Glass Auth Login Form',
    category: 'Form Components',
    categoryId: 'form-components',
    tags: ['login', 'auth', 'form', 'glassmorphism'],
    description: 'Complete authentication card with email, password fields, social login buttons, and validation state.',
    price: 1499,
    previewImageUrl: '/images/glow-glass-pricing.png',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.88,
    reviews: 160,
    author: { name: 'UI UX Labs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UIUXLabs' },
    code: `export default function LoginForm() {
  return (
    <div className="w-full max-w-sm p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-5">
      <div className="text-center">
        <h3 className="text-2xl font-extrabold text-white">Welcome Back</h3>
        <p className="text-xs text-zinc-400 mt-1">Enter credentials to access account</p>
      </div>
      <input type="email" placeholder="email@domain.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500" />
      <button className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition shadow-glow">Sign In</button>
    </div>
  );
}`
  },

  // 6. AI PRODUCT COMPONENTS
  {
    id: 'ai-chat-interface-prompts',
    name: 'AI Chat Interface & Prompts',
    category: 'AI Product Components',
    categoryId: 'ai-product-components',
    tags: ['ai', 'chat', 'llm', 'prompt-input', 'assistant'],
    description: 'Complete AI agent chat interface with suggested prompt pills, typing indicator, and code block formatter.',
    price: 1899,
    previewImageUrl: '/images/split-text.png',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.98,
    reviews: 420,
    author: { name: 'InteractionX', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InteractionX' },
    code: `export default function AIChat() {
  return (
    <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-6 space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-white/8">
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-bold text-xs">AI</div>
        <div>
          <h4 className="text-sm font-bold text-white">Neuro AI Assistant</h4>
          <span className="text-[10px] text-emerald-400 font-mono">GPT-4o Active</span>
        </div>
      </div>
      <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 text-xs text-zinc-300 leading-relaxed">
        Hello! How can I assist you with your component design system today?
      </div>
    </div>
  );
}`
  },

  // 7. UX DELIVERABLES & SYSTEMS
  {
    id: 'enterprise-design-system-figma-kit',
    name: 'Enterprise Design System & Figma UI Kit',
    category: 'UX Deliverables & Systems',
    categoryId: 'ux-deliverables-&-systems',
    tags: ['design-system', 'figma', 'tokens', 'documentation'],
    description: 'Complete enterprise design system library with 200+ Figma components, tokens, and developer docs.',
    price: 4999,
    previewImageUrl: '/images/glow-glass-pricing.png',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 5.0,
    reviews: 512,
    author: { name: 'NeuroUX Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeuroUX' },
    code: `export default function DesignSystemSpec() {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-violet-400 font-mono">
      // Enterprise Design System Specification (200+ Components)
    </div>
  );
}`
  }
];
