import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiZap, 
  FiGithub, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin, 
  FiYoutube, 
  FiSend, 
  FiCheckCircle, 
  FiX, 
  FiShield, 
  FiFileText, 
  FiAward 
} from 'react-icons/fi';
import SocialPreviewModal from '../common/SocialPreviewModal';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState(null);
  const [activeSocialPlatform, setActiveSocialPlatform] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  const legalDocs = {
    privacy: {
      title: 'Privacy Policy',
      icon: <FiShield className="text-violet-400" size={24} />,
      content: `NeuroUX is committed to protecting your privacy. We collect minimal personal data required for authentication, billing, and recommendations. We do not sell your personal data to third parties. All source code downloads and interactions are processed securely.`
    },
    terms: {
      title: 'Terms of Service',
      icon: <FiFileText className="text-violet-400" size={24} />,
      content: `By using NeuroUX Component Marketplace, you agree to use our design components, templates, and UI assets in accordance with our licensing terms. Redistribution of raw template source code as competing component libraries is prohibited.`
    },
    licenses: {
      title: 'License Agreement',
      icon: <FiAward className="text-violet-400" size={24} />,
      content: `Personal & Commercial License: Granted upon component purchase. Allows unlimited personal and client projects. Includes full access to React JSX source code, Tailwind classes, and live sandbox editors.`
    }
  };

  const socials = [
    { id: 'github', icon: <FiGithub size={16} />, label: 'GitHub' },
    { id: 'twitter', icon: <FiTwitter size={16} />, label: 'Twitter / X' },
    { id: 'instagram', icon: <FiInstagram size={16} />, label: 'Instagram' },
    { id: 'linkedin', icon: <FiLinkedin size={16} />, label: 'LinkedIn' },
    { id: 'youtube', icon: <FiYoutube size={16} />, label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#04030a] border-t border-white/6 relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-glow-sm">
                <FiZap size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">Neuro<span className="text-violet-400">UX</span></span>
            </Link>
            <p className="text-sm text-[#8b7fb5] leading-relaxed max-w-sm font-light">
              The AI-powered component marketplace for modern web developers and UI design systems. Elevate your workflow with production-ready React components.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Subscribe to Component Updates</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-glow-sm"
                >
                  <FiSend size={14} /> Subscribe
                </button>
              </form>
              {subscribed && (
                <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                  <FiCheckCircle size={14} /> Thank you! You've been subscribed to component updates.
                </div>
              )}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-xs font-bold text-[#8b7fb5] uppercase tracking-widest mb-4">Marketplace</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/marketplace', label: 'All Components' },
                { to: '/marketplace?category=basic-ui-components', label: 'Basic UI' },
                { to: '/marketplace?category=navigation-components', label: 'Navigation' },
                { to: '/marketplace?category=dashboard-components', label: 'Dashboards' },
                { to: '/marketplace?category=ai-product-components', label: 'AI Products' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-[#8b7fb5] hover:text-violet-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-xs font-bold text-[#8b7fb5] uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/services', label: 'Pricing & Plans' },
                { to: '/contact', label: 'Contact Support' },
                { to: '/search', label: 'Component Search' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-[#8b7fb5] hover:text-violet-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3 - Legal */}
          <div>
            <h4 className="text-xs font-bold text-[#8b7fb5] uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveLegalModal('privacy')} className="text-xs text-[#8b7fb5] hover:text-violet-300 transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveLegalModal('terms')} className="text-xs text-[#8b7fb5] hover:text-violet-300 transition-colors text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setActiveLegalModal('licenses')} className="text-xs text-[#8b7fb5] hover:text-violet-300 transition-colors text-left">
                  Licenses & Docs
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Social Bar */}
        <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#5a5275]">© {currentYear} NeuroUX Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-3">
            {socials.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSocialPlatform(s.id)}
                title={`Preview ${s.label}`}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/8 text-[#8b7fb5] hover:text-white hover:bg-violet-600/30 hover:border-violet-500/50 flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                {s.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Modal Popup */}
      {activeLegalModal && legalDocs[activeLegalModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#0c0b1e] border border-white/10 rounded-3xl p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition"
            >
              <FiX size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-600/15 border border-violet-500/30 rounded-2xl">
                {legalDocs[activeLegalModal].icon}
              </div>
              <h3 className="text-lg font-bold text-white">{legalDocs[activeLegalModal].title}</h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-white/8">
              {legalDocs[activeLegalModal].content}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Preview Modal */}
      {activeSocialPlatform && (
        <SocialPreviewModal 
          platform={activeSocialPlatform} 
          onClose={() => setActiveSocialPlatform(null)} 
        />
      )}
    </footer>
  );
}
