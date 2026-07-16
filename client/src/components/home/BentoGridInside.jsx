import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiCode, FiLayers, FiDownload, FiTerminal, FiGlobe, FiDatabase } from 'react-icons/fi';

const pills = [
  'Blob Cursor', 'Soft Aurora', 'Magnet Lines', 'Antigravity', 'Ballpit',
  'Grainient', 'Orbit Images', 'Metallic Paint', 'Balatro', 'AuroraBg',
  'BlurText', 'ShinyText', 'StarBorder', 'SpotlightCard', 'DecayCard'
];

export default function BentoGridInside() {
  const [terminalText, setTerminalText] = useState('');
  const fullText = 'animate hero text';

  // Typing animation loop for AI terminal card
  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let timer;

    const tick = () => {
      if (!isDeleting) {
        setTerminalText(fullText.substring(0, index + 1));
        index++;
        if (index === fullText.length) {
          timer = setTimeout(() => { isDeleting = true; tick(); }, 2000);
          return;
        }
      } else {
        setTerminalText(fullText.substring(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
          timer = setTimeout(tick, 500);
          return;
        }
      }
      timer = setTimeout(tick, isDeleting ? 80 : 120);
    };

    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 bg-[#080712] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-14">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">What's inside</h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Card 1: 32+ Components (col-span 5 on desktop) */}
          <div className="md:col-span-5 glass p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-72">
            {/* Ambient background glow */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-violet-600/10 blur-3xl pointer-events-none" />
            
            {/* Sliding components pills */}
            <div className="relative w-full h-24 overflow-hidden select-none mb-4">
              <div className="flex flex-wrap gap-2 justify-center py-2 h-full opacity-60">
                {pills.map((pill, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-[10px] text-zinc-300 font-mono transition hover:bg-white/10"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-base font-bold text-white mb-2">32+ Premium Components</h3>
              <p className="text-xs text-[#8b7fb5] leading-relaxed font-light">
                Backgrounds, text effects, animations, UI patterns. The stuff you'd build from scratch, already done.
              </p>
            </div>
          </div>

          {/* Card 2: Visual Editors (col-span 3 on desktop) */}
          <div className="md:col-span-3 glass p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-72">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 flex items-center justify-center pointer-events-none">
              <div className="relative w-28 h-28">
                {/* Visual editor node diagram */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 text-sm">🎨</div>
                <div className="absolute bottom-2 left-0 w-9 h-9 rounded-full bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 text-sm">📐</div>
                <div className="absolute bottom-2 right-0 w-9 h-9 rounded-full bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 text-sm">🖼️</div>
                <svg className="absolute inset-0 w-full h-full text-violet-500/10 pointer-events-none" viewBox="0 0 100 100">
                  <line x1="50" y1="25" x2="20" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="50" y1="25" x2="80" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="20" y1="70" x2="80" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                </svg>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-base font-bold text-white mb-2">Visual Editors</h3>
              <p className="text-xs text-[#8b7fb5] leading-relaxed font-light">
                Prop-level playgrounds to customize component values and watch edits update in real-time.
              </p>
            </div>
          </div>

          {/* Card 3: Well Organized (col-span 4 on desktop) */}
          <div className="md:col-span-4 glass p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-72">
            {/* Spinning atomic concentric circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 flex items-center justify-center pointer-events-none">
              <div className="relative w-36 h-36 border border-white/5 rounded-full flex items-center justify-center animate-[spin_25s_linear_infinite]">
                <div className="absolute w-24 h-24 border border-white/5 rounded-full flex items-center justify-center" />
                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 text-sm font-bold">⚛️</div>
                <div className="absolute top-1 left-1 text-[8px]">📝</div>
                <div className="absolute bottom-1 right-1 text-[8px]">🎬</div>
                <div className="absolute top-1 right-1 text-[8px]">🧩</div>
                <div className="absolute bottom-1 left-1 text-[8px]">🌌</div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-base font-bold text-white mb-2">Well Organized</h3>
              <p className="text-xs text-[#8b7fb5] leading-relaxed font-light">
                Four clear categories (Text Animations, Animations, Components, Backgrounds) so you ship layouts fast.
              </p>
            </div>
          </div>

          {/* Card 4: Pick Your Stack (col-span 4 on desktop) */}
          <div className="md:col-span-4 glass p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-72">
            <div className="space-y-2.5 mb-4">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-mono">
                <span className="text-zinc-300">JS + CSS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-mono">
                <span className="text-zinc-300">TS + CSS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-mono">
                <span className="text-zinc-300">JS + Tailwind</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-mono">
                <span className="text-zinc-300">TS + Tailwind</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-base font-bold text-white mb-2">Pick Your Stack</h3>
              <p className="text-xs text-[#8b7fb5] leading-relaxed font-light">
                JS or TypeScript, CSS or Tailwind. Every component comes ready for all stack configurations.
              </p>
            </div>
          </div>

          {/* Card 5: AI-Ready Copilot (col-span 5 on desktop) */}
          <div className="md:col-span-5 glass p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-72">
            {/* Terminal Widget */}
            <div className="w-full bg-[#05040a] rounded-xl border border-white/5 p-4 font-mono text-left mb-4">
              <div className="flex gap-1.5 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
              <div className="text-[10px] text-zinc-400">
                <span className="text-violet-400 font-bold">$</span> animate {terminalText}
                <span className="w-1.5 h-3 bg-violet-400 inline-block ml-0.5 align-middle animate-pulse" />
              </div>
              <div className="text-[9px] text-zinc-600 mt-2">// copilot code completion ready</div>
            </div>

            <div className="relative z-10">
              <h3 className="text-base font-bold text-white mb-2">AI-Ready</h3>
              <p className="text-xs text-[#8b7fb5] leading-relaxed font-light">
                Works great with Cursor, Copilot, and v0. Describe what you need, drop it in, and ship.
              </p>
            </div>
          </div>

          {/* Card 6: Growing Fast (col-span 3 on desktop) */}
          <div className="md:col-span-3 glass p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-72">
            <div className="mb-4">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Downloads</div>
              <div className="text-4xl font-extrabold text-white tracking-tight my-1 shadow-glow-sm">12.8K</div>
              
              {/* Sparkline chart graph */}
              <svg className="w-full h-12 text-violet-500/30 filter drop-shadow-[0_2px_8px_rgba(124,58,237,0.3)] mt-2" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,25 Q15,20 30,18 T60,10 T90,5 L100,2" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                <path d="M0,25 Q15,20 30,18 T60,10 T90,5 L100,2 L100,30 L0,30 Z" fill="url(#grad)" opacity="0.4" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="relative z-10">
              <h3 className="text-base font-bold text-white mb-2">Growing Fast</h3>
              <p className="text-xs text-[#8b7fb5] leading-relaxed font-light">
                High-speed developer downloads with individual zip packages and Tailwind configuration support.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
