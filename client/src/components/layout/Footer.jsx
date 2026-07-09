import { Link } from 'react-router-dom';
import { FiZap, FiGithub, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#04030a] border-t border-white/6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
                <FiZap size={14} className="text-white" />
              </div>
              <span className="font-bold text-white tracking-tight">Neuro<span className="text-violet-400">UX</span></span>
            </Link>
            <p className="text-sm text-[#5a5275] leading-relaxed max-w-xs">
              The AI-powered marketplace for premium digital design assets.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: 'Marketplace',
              links: [
                { to: '/marketplace', label: 'All Assets' },
                { to: '/marketplace?category=templates', label: 'Templates' },
                { to: '/marketplace?category=cards', label: 'UI Cards' },
                { to: '/marketplace?category=icons', label: 'Icons' },
              ]
            },
            {
              title: 'Company',
              links: [
                { to: '/about', label: 'About' },
                { to: '/services', label: 'Pricing' },
                { to: '/contact', label: 'Contact' },
              ]
            },
            {
              title: 'Legal',
              links: [
                { to: '#', label: 'Privacy Policy' },
                { to: '#', label: 'Terms of Service' },
                { to: '#', label: 'Licenses' },
              ]
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-widest mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-[#5a5275] hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#3a3356]">© {currentYear} NeuroUX. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#5a5275] hover:text-violet-400 transition">
              <FiGithub size={16} />
            </a>
            <a href="#" className="text-[#5a5275] hover:text-violet-400 transition">
              <FiTwitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
