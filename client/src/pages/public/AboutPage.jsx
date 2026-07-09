import { motion } from 'framer-motion';
import { FiCpu, FiCode, FiActivity, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: <FiActivity size={20} />,
    title: 'Performance First',
    desc: 'Animations should never compromise load speed. We use lightweight canvas rendering and optimized framer-motion layers to keep bundle sizes minimal.',
  },
  {
    icon: <FiCode size={20} />,
    title: 'DX (Developer Experience)',
    desc: 'Built for fast copy-pasting. Single-file components, tailwind-ready styles, and clean parameter variables let you ship layouts in minutes.',
  },
  {
    icon: <FiCpu size={20} />,
    title: 'Highly Custom-Tailored',
    desc: 'Every animation features declarative props. Adjust speeds, colors, values, and rotation angles directly in your react elements.',
  },
];

const stats = [
  { value: '32+', label: 'Premium Components' },
  { value: '12,000+', label: 'Creative Developers' },
  { value: '99.9%', label: 'Optimization Score' },
  { value: '24/7', label: 'Discord Support' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080712] text-white pt-24 pb-20 relative">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      
      {/* Background glow blobbies */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mission Statement */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Our Mission</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Bridging the gap between <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">design & code</span>
          </h1>
          <p className="text-[#8b7fb5] text-lg font-light leading-relaxed">
            NeuroUX was founded by a collective of visual designers and React developers who were tired of heavy, bloated template packages. We build clean, modular, copy-pasteable interactions that load instantly and elevate UX.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 border-y border-white/5 py-10 bg-zinc-950/20 backdrop-blur-sm rounded-3xl px-6">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1.5">{s.value}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Values Columns */}
        <div className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Our Core Principles</h2>
            <p className="text-sm text-[#8b7fb5]">How we design and compile components for the marketplace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="glass p-7 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                <div className="p-3 bg-violet-600/10 text-violet-400 border border-violet-500/20 rounded-xl mb-5">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                <p className="text-xs text-[#8b7fb5] leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-violet-500/10 blur-[80px] pointer-events-none" />
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 relative z-10">Start building modern websites today</h3>
          <p className="text-xs text-[#8b7fb5] max-w-md mx-auto mb-8 relative z-10 font-light leading-relaxed">
            Copy premium animated UI cards, text-splits, buttons, and backgrounds directly into your source code. Elevate your layouts instantly.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-100 transition shadow-glow-sm"
            >
              Explore Components <FiArrowRight size={14} />
            </Link>
            <Link 
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/8 text-white font-medium text-xs rounded-xl hover:bg-white/10 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
