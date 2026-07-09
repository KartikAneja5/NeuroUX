import { useState } from 'react';
import ReviewList from './ReviewList';
import { FiCheckCircle, FiLock, FiCopy, FiCheck } from 'react-icons/fi';

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  // Check if this product has been purchased (simulate via localStorage)
  const isPurchased = localStorage.getItem(`purchased_${product.id}`) === 'true';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'code', label: 'Source Code' },
    { id: 'reviews', label: `Reviews (${product.reviews || 0})` },
  ];

  const features = [
    '200+ Premium Components',
    'Dark & Light Mode Support',
    'Fully Responsive Design',
    'Framer Motion Animations',
    'Clean, commented code',
    'Figma source files included',
    'Lifetime updates',
    'Premium support',
  ];

  const handleCopyCode = () => {
    if (!product.code) return;
    navigator.clipboard.writeText(product.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-12 select-none">
      {/* Tab headers */}
      <div className="border-b border-white/8 flex gap-8 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-medium whitespace-nowrap relative transition-colors ${
              activeTab === tab.id ? 'text-white font-semibold' : 'text-[#5a5275] hover:text-[#8b7fb5]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-t-full shadow-glow-sm" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-8">
        {activeTab === 'overview' && (
          <div>
            <p className="text-[#c4b5fd] leading-relaxed mb-5">
              {product.name} is a meticulously crafted digital asset designed to accelerate your workflow. 
              Built with modern best practices, it provides a solid foundation for any premium SaaS, dashboard, or landing page project.
            </p>
            <p className="text-[#8b7fb5] leading-relaxed mb-8">
              Stop wasting hours recreating the wheel. This package includes everything you need to launch faster, 
              with pixel-perfect precision and smooth interactions out of the box.
            </p>
            <div className="p-5 glass rounded-2xl border border-white/8">
              <h4 className="font-semibold text-white mb-3 text-sm">What's included?</h4>
              <ul className="space-y-2 text-sm text-[#8b7fb5]">
                {['React/Vite Source Code', 'Tailwind CSS Configuration', 'Figma Design System (.fig)', 'Comprehensive Docs'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                     <FiCheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <FiCheckCircle size={16} className="text-violet-400 flex-shrink-0" />
                <span className="text-[#c4b5fd] text-sm">{feature}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-black/40">
            {isPurchased ? (
              // PURCHASED VIEW
              <div className="p-6 relative">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{product.name.replace(/\s+/g, '')}.jsx</span>
                  <button 
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 text-xs text-white transition-colors"
                  >
                    {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                    {copied ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
                <pre className="overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed p-4 bg-zinc-950/70 border border-white/5 rounded-xl select-text max-h-[400px]">
                  <code>{product.code || `// Source code is ready for download.\n// Please check the codeFileUrl folder.`}</code>
                </pre>
              </div>
            ) : (
              // LOCKED VIEW (DOM inspect secure)
              <div className="p-6 relative min-h-[300px] flex items-center justify-center">
                {/* Blurred backdrop containing ONLY dummy text. DevTools cannot inspect the actual code because it doesn't exist in the state/DOM! */}
                <pre className="absolute inset-0 p-6 overflow-hidden text-xs font-mono text-zinc-600/30 leading-relaxed blur-[3.5px] select-none pointer-events-none">
                  <code>{`// premium-component.jsx
// SOURCE CODE LOCKED - NeuroUX Premium Asset
// ----------------------------------------------------------------------
// To protect original content creators and enforce marketplace licensing,
// the source code of this premium component is hidden from inspection.
//
// Please purchase this component to unlock full source code viewing,
// one-click copying, and download access to Vite/React zip packages.
// ----------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PremiumComponent() {
  // [LOCK] Code blocks are protected.
  // Purchase to reveal the state mechanics and animation controllers.
}`}</code>
                </pre>

                {/* Locked overlay Card */}
                <div className="relative z-10 text-center max-w-sm p-6 glass rounded-2xl border border-white/10 shadow-2xl">
                  <div className="w-12 h-12 mx-auto bg-violet-600/15 border border-violet-500/30 rounded-full flex items-center justify-center text-violet-400 mb-4 animate-bounce">
                    <FiLock size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Source Code Locked</h4>
                  <p className="text-sm text-[#8b7fb5] mb-5">
                    This premium asset code is protected. Complete your purchase to view and copy the source file.
                  </p>
                  <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
                    Vite + React (Framer Motion)
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && <ReviewList />}
      </div>
    </div>
  );
}
