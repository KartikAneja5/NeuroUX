import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. BLUR TEXT
export function BlurText({ text = "Blur Text Reveal", duration = 0.6 }) {
  const words = text.split(' ');
  return (
    <div className="flex flex-wrap gap-x-3 justify-center text-3xl md:text-4xl font-extrabold text-white text-center py-6 select-none">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(12px)', opacity: 0, y: 15 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration, delay: i * 0.15, ease: 'easeOut' }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// 2. SHINY TEXT
export function ShinyText({ text = "Shiny Shimmer Text" }) {
  return (
    <div className="text-center py-6 select-none">
      <span 
        className="inline-block font-extrabold text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 via-white to-zinc-500 bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]"
        style={{
          backgroundImage: 'linear-gradient(90deg, #71717a 0%, #ffffff 50%, #71717a 100%)',
          WebkitBackgroundClip: 'text',
          backgroundSize: '200% 100%',
        }}
      >
        {text}
      </span>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

// 3. MAGNET
export function Magnet({ text = "Hover Me (Magnetic)" }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex items-center justify-center h-full py-8 select-none">
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="inline-block transition-transform duration-100 ease-out"
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      >
        <button className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl border border-violet-400 shadow-glow transition-colors">
          {text}
        </button>
      </div>
    </div>
  );
}

// 4. SPOTLIGHT CARD
export function SpotlightCard({ title = "Spotlight Hover Card", desc = "Move your cursor over this card to illuminate the glowing radial gradient." }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top } = cardRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - left, y: e.clientY - top });
  };

  return (
    <div className="flex justify-center items-center py-6 select-none">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative max-w-sm p-6 rounded-2xl bg-zinc-950/80 border border-white/10 overflow-hidden cursor-pointer"
      >
        <div 
          className="absolute inset-0 bg-[radial-gradient(280px_circle_at_var(--x)_var(--y),rgba(124,58,237,0.18)_0%,transparent_80%)] pointer-events-none transition-opacity duration-300"
          style={{ 
            '--x': `${coords.x}px`, 
            '--y': `${coords.y}px`,
            opacity: hovered ? 1 : 0 
          }}
        />
        <div className="relative z-10">
          <div className="w-10 h-10 rounded-lg bg-violet-600/25 flex items-center justify-center text-violet-400 font-bold mb-4">⭐</div>
          <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
          <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

// 5. STAR BORDER
export function StarBorder({ text = "Star Border Button" }) {
  return (
    <div className="flex justify-center items-center py-6 select-none">
      <button className="relative px-8 py-3.5 bg-black rounded-xl overflow-hidden text-sm font-semibold text-white group shadow-glow-sm hover:shadow-glow transition-all">
        {/* Animated glowing border */}
        <div className="absolute inset-0 p-[1.5px] rounded-xl bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-500 animate-[spin_5s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-[1.5px] bg-black rounded-[10px]" />
        <span className="relative z-10 flex items-center gap-2">
          <span>✨</span> {text}
        </span>
      </button>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// 6. DECAY CARD
export function DecayCard({ title = "Decay Card Hover" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex justify-center items-center py-6 select-none">
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-64 h-40 bg-zinc-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-end group cursor-pointer"
      >
        <div className={`absolute inset-0 bg-gradient-to-t from-violet-950/60 to-transparent transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-20'}`} />
        
        {/* Simulated decaying grid overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(124,58,237,0.3) 1px, transparent 1px)`,
            backgroundSize: '12px 12px',
            filter: hovered ? 'blur(0px)' : 'blur(2px)'
          }}
        />

        <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
          <h4 className="text-base font-bold text-white mb-1">{title}</h4>
          <p className="text-xs text-zinc-500">Hovering reveals hidden grid resolution.</p>
        </div>
      </div>
    </div>
  );
}

// 7. PARTICLES BACKGROUND
export function ParticlesBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.width = canvas.parentElement?.offsetWidth || 500;
    let height = canvas.height = canvas.parentElement?.offsetHeight || 250;

    const points = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.06)';
      
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0a0914] overflow-hidden rounded-xl">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
        <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Canvas Particles Canvas</span>
      </div>
    </div>
  );
}

// 8. AURORA BACKGROUND
export function AuroraBg() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#070611] overflow-hidden rounded-xl relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#070611]/80 z-10" />
      {/* Mesh glowing blobs */}
      <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] bg-radial-glow animate-aurora-glow" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
        <span className="text-violet-400 font-bold text-lg tracking-widest animate-pulse">AURORA WAVES</span>
      </div>
      <style>{`
        .bg-radial-glow {
          background: radial-gradient(circle 350px at 40% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 70%),
                      radial-gradient(circle 300px at 70% 60%, rgba(6, 182, 212, 0.15) 0%, transparent 70%);
          filter: blur(40px);
        }
        @keyframes aurora-glow {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2%, 3%) scale(1.05); }
          100% { transform: translate(-1%, -1%) scale(0.97); }
        }
        .animate-aurora-glow {
          animation: aurora-glow 10s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}

// 9. TRUE FOCUS
export function TrueFocus({ sentence = "True Focus Animation" }) {
  const words = sentence.split(' ');
  const [focusIndex, setFocusIndex] = useState(0);
  return (
    <div className="flex flex-wrap gap-3 justify-center text-3xl font-extrabold text-white py-6">
      {words.map((word, idx) => (
        <span
          key={idx}
          onMouseEnter={() => setFocusIndex(idx)}
          className="cursor-pointer transition-all duration-300 select-none"
          style={{
            filter: focusIndex === idx ? 'blur(0px)' : 'blur(4px)',
            opacity: focusIndex === idx ? 1 : 0.35,
            transform: focusIndex === idx ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

// 10. ROTATING TEXT
export function RotatingText({ items = [], interval = 2000 }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items, interval]);
  return (
    <span className="text-violet-400 font-bold ml-2 transition-all duration-300">
      {items[index]}
    </span>
  );
}

// 11. COUNT UP
export function CountUp({ endValue, duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(endValue) || 100;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [endValue, duration]);
  return <span className="font-extrabold text-4xl text-emerald-400">{count}+</span>;
}

// 12. ANIMATED CONTENT
export function AnimatedContent({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// 13. FADE CONTENT
export function FadeContent({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
}

// 14. ELECTRIC BORDER
export function ElectricBorder({ children }) {
  return (
    <div className="relative p-[1.5px] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 group shadow-glow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-cyan-500 to-pink-500 animate-[spin_4s_linear_infinite] opacity-50" />
      <div className="relative z-10 bg-zinc-950 rounded-[10px] p-6">
        {children}
      </div>
    </div>
  );
}

// 15. ORBIT IMAGES
export function OrbitImages({ images = [] }) {
  return (
    <div className="relative w-48 h-48 rounded-full border border-white/5 flex items-center justify-center animate-[spin_20s_linear_infinite] my-4">
      <div className="w-12 h-12 rounded-full bg-violet-600 shadow-glow" />
      {images.map((img, i) => {
        const angle = (i * 360) / images.length;
        return (
          <img
            key={i}
            src={img}
            alt="orbit"
            className="absolute w-8 h-8 rounded-full object-cover border-2 border-white/20 hover:scale-110 transition-transform"
            style={{ transform: `rotate(${angle}deg) translate(80px) rotate(-${angle}deg)` }}
          />
        );
      })}
    </div>
  );
}

// 16. GLITCH TEXT
export function GlitchText({ text = "GLITCH" }) {
  const [glitchedText, setGlitchedText] = useState(text);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const scrambled = text.split('').map(char => {
          if (char === ' ') return char;
          return Math.random() > 0.5 ? char : String.fromCharCode(33 + Math.floor(Math.random() * 90));
        }).join('');
        setGlitchedText(scrambled);
        setTimeout(() => setGlitchedText(text), 80);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="font-black text-4xl tracking-wider text-white font-mono select-none relative animate-pulse">
      {glitchedText}
    </span>
  );
}

// 17. GLARE HOVER
export function GlareHover({ children }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer"
    >
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(255,255,255,0.07)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ '--x': `${pos.x}%`, '--y': `${pos.y}%` }}
      />
      {children}
    </div>
  );
}

// 18. ANIMATED LIST
export function AnimatedList() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item} className="bg-white/5 border border-white/8 rounded-lg p-3 text-white text-xs select-none">
          {item}
        </div>
      ))}
    </div>
  );
}

// 19. CLICK SPARK
export function ClickSpark() {
  const [sparks, setSparks] = useState([]);
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newSpark = { id: Date.now() + Math.random(), x, y };
    setSparks((prev) => [...prev, newSpark]);
    setTimeout(() => {
      setSparks((prev) => prev.filter(s => s.id !== newSpark.id));
    }, 800);
  };

  return (
    <div onClick={handleClick} className="w-full h-48 border border-white/5 bg-zinc-900/50 rounded-xl relative overflow-hidden flex items-center justify-center cursor-crosshair select-none">
      <span className="text-sm text-[#8b7fb5]">Click anywhere inside this viewport to trigger sparks</span>
      {sparks.map(s => (
        <span 
          key={s.id}
          className="absolute w-4 h-4 bg-violet-400 rounded-full animate-ping pointer-events-none"
          style={{ left: s.x - 8, top: s.y - 8 }}
        />
      ))}
    </div>
  );
}

// 20. UNIVERSAL DYNAMIC PLAYGROUND (Guarantees 100% interactive preview coverage for every catalog asset)
export function UniversalComponentPlayground({ title = "Interactive UI Component", category = "UI Component", tags = [] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [count, setCount] = useState(42);
  const [enabled, setEnabled] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [clicked, setClicked] = useState(false);

  const handleAction = () => {
    setClicked(true);
    setCount(prev => prev + 1);
    setTimeout(() => setClicked(false), 300);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-950/90 border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden select-none">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-2xl pointer-events-none" />
      
      {/* Header spec bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide uppercase truncate max-w-[200px]">{title}</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-violet-600/20 text-violet-300 text-[10px] font-mono font-semibold border border-violet-500/30 shrink-0">
          {category}
        </span>
      </div>

      {/* Interactive Controls Playground */}
      <div className="space-y-4">
        {/* Toggle & State Controller */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="text-xs font-medium text-zinc-300">
            Interactive State: <span className={enabled ? "text-emerald-400 font-bold" : "text-zinc-500 font-bold"}>{enabled ? "ACTIVE" : "DISABLED"}</span>
          </div>
          <button 
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${enabled ? "bg-violet-600 shadow-glow-sm" : "bg-zinc-800"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Live Input Field */}
        <div className="relative">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type to test live input state..."
            className="w-full px-3.5 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition"
          />
          {inputValue && (
            <span className="absolute right-3 top-2.5 text-[10px] font-mono text-violet-400">
              {inputValue.length} chars
            </span>
          )}
        </div>

        {/* Interactive Action Button & Counter */}
        <div className="flex items-center justify-between gap-3 pt-0.5">
          <button 
            type="button"
            onClick={handleAction}
            disabled={!enabled}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 shadow-glow flex items-center justify-center gap-2 ${
              clicked 
                ? "scale-95 bg-violet-400 text-black" 
                : enabled 
                ? "bg-violet-600 hover:bg-violet-500 text-white active:scale-95" 
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            <span>⚡ Trigger Action</span>
            {clicked && <span className="animate-bounce">✨</span>}
          </button>

          <div className="px-3.5 py-1.5 bg-zinc-900 border border-white/10 rounded-xl text-center shrink-0">
            <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Value</span>
            <span className="text-xs font-bold text-violet-300 font-mono">{count}</span>
          </div>
        </div>

        {/* Interactive Tabs */}
        <div className="flex gap-1.5 p-1 bg-zinc-900 rounded-xl border border-white/5">
          {["Overview", "Props", "Events"].map((tab, idx) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`flex-1 py-1 rounded-lg text-[10px] font-semibold transition ${
                activeTab === idx ? "bg-violet-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/5 text-[11px] text-zinc-400 min-h-[44px]">
          {activeTab === 0 && <p className="leading-relaxed">Explorable live preview for <strong className="text-white">{title}</strong>. Click controls and hover elements live.</p>}
          {activeTab === 1 && <p className="font-mono text-violet-300 text-[10px]">{`props: { state: "${enabled ? "active" : "disabled"}", val: ${count}, text: "${inputValue}" }`}</p>}
          {activeTab === 2 && <p className="text-emerald-400 font-mono text-[10px]">Event: onClick triggered ({new Date().toLocaleTimeString()})</p>}
        </div>
      </div>
    </div>
  );
}

// Helper switcher component to render a preview by product id / name / category / tags
export default function ComponentPreviewSwitcher({ productId, productName, category = "", tags = [], code = "" }) {
  const getTargetId = () => {
    if (productId && typeof productId === 'string' && !productId.match(/^[0-9a-fA-F]{24}$/)) {
      return productId.toLowerCase().trim();
    }
    if (productName) {
      return productName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    return productId || "";
  };
  const targetId = getTargetId();
  const catLower = (category || "").toLowerCase();
  const tagsList = Array.isArray(tags) ? tags.map(t => String(t).toLowerCase()) : [];

  switch (targetId) {
    case 'split-text':
      return <BlurText text="SPLIT TEXT REVEAL" duration={0.4} />;
    case 'blur-text':
    case 'blur-text-animation':
      return <BlurText text="Blur Text Animation Reveal" duration={0.8} />;
    case 'shiny-text':
    case 'shiny-shimmer-text':
      return <ShinyText text="Shiny Shimmer Metallic Text" />;
    case 'decrypted-text':
      return <div className="py-8"><span className="font-mono text-cyan-400 text-3xl">D3cr¥pt€d Text Reveal</span></div>;
    case 'true-focus':
      return <TrueFocus sentence="True Focus Hover Words" />;
    case 'rotating-text':
      return (
        <div className="text-xl font-bold py-6 text-white text-center">
          Modern and <RotatingText items={['animated', 'highly-performant', 'interactive', 'responsive']} /> assets
        </div>
      );
    case 'glitch-text':
      return <div className="py-6 text-center"><GlitchText text="NEUROUX" /></div>;
    case 'count-up':
      return <div className="py-6 text-center text-[#8b7fb5]">We powered <CountUp endValue={1420} duration={1500} /> components</div>;
    case 'animated-content':
      return (
        <AnimatedContent>
          <div className="bg-white/5 border border-white/8 p-6 rounded-2xl text-center text-white font-semibold">
            Scroll triggered Animated Container
          </div>
        </AnimatedContent>
      );
    case 'fade-content':
      return (
        <FadeContent>
          <div className="bg-white/5 border border-white/8 p-6 rounded-2xl text-center text-cyan-300 font-semibold">
            Lazy fade in content viewport
          </div>
        </FadeContent>
      );
    case 'electric-border':
      return (
        <div className="w-64 mx-auto my-4">
          <ElectricBorder>
            <div className="text-white text-center text-sm font-bold">Electric Border Container</div>
          </ElectricBorder>
        </div>
      );
    case 'orbit-images':
      return (
        <div className="flex justify-center py-4">
          <OrbitImages images={[
            'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=100&q=80',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
            'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=100&q=80'
          ]} />
        </div>
      );
    case 'glare-hover':
      return (
        <div className="w-64 mx-auto my-4">
          <GlareHover>
            <div className="p-8 text-center text-white font-bold text-sm">Interactive Glare Hover Card</div>
          </GlareHover>
        </div>
      );
    case 'star-border':
      return <StarBorder />;
    case 'click-spark':
      return <ClickSpark />;
    case 'magnet':
    case 'ripple-impact-button':
      return <Magnet text={productName || "Hover Me (Magnetic)"} />;
    case 'animated-list':
      return <div className="w-64 mx-auto my-4"><AnimatedList /></div>;
    case 'spotlight-card':
      return <SpotlightCard title={productName || "Spotlight Hover Card"} />;
    case 'decay-card':
      return <DecayCard title={productName || "Decay Card Hover"} />;
    case 'magic-bento':
    case 'magic-bento-grid':
    case 'bento-grid-feature-matrix':
      return (
        <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto p-4 select-none">
          <div className="bg-violet-900/20 border border-violet-500/30 p-4 rounded-xl text-center hover:bg-violet-800/30 transition">
            <span className="text-violet-400 font-bold block text-sm">🍱 Fast Layout</span>
            <span className="text-[10px] text-zinc-400">Flex Grid</span>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl text-center hover:bg-cyan-800/30 transition">
            <span className="text-cyan-400 font-bold block text-sm">⚡ Reactive</span>
            <span className="text-[10px] text-zinc-400">Live State</span>
          </div>
        </div>
      );
    case 'dock':
    case 'macos-dock':
    case 'radial-speed-dial-menu':
    case 'animated-breadcrumb-dock':
      return (
        <div className="flex items-center justify-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl mx-auto my-4">
          {['🏠', '🔍', '⚙️', '🔔', '🚀'].map((icon, i) => (
            <button key={i} className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-lg hover:scale-125 hover:-translate-y-1 transition-all">
              {icon}
            </button>
          ))}
        </div>
      );
    case 'particles':
    case 'hero-section-with-animated-canvas':
      return <div className="w-full h-48 relative"><ParticlesBg /></div>;
    case 'waves':
    case 'liquid-ether-background-shader':
      return (
        <div className="w-full h-48 bg-[#0a0914] rounded-xl flex items-center justify-center relative overflow-hidden">
          <span className="text-zinc-400 font-mono text-xs uppercase tracking-wider z-10 font-bold">Liquid Ether Shader Viewport</span>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-violet-600/30 via-cyan-500/20 to-transparent animate-pulse" />
        </div>
      );
    case 'aurora':
    case 'luminous-light-beams':
      return <div className="w-full h-48 relative"><AuroraBg /></div>;
    case 'cyberpunk-neon-button':
      return (
        <div className="py-6 text-center">
          <button className="relative px-8 py-3.5 bg-black border-2 border-cyan-400 text-cyan-400 font-mono font-bold tracking-widest uppercase text-sm hover:bg-cyan-400 hover:text-black transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95">
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 inline-block" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 inline-block" />
            EXECUTE DEMO
          </button>
        </div>
      );
    case 'floating-glass-input':
      return (
        <div className="py-6 flex justify-center w-full">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              className="peer w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 backdrop-blur-md transition-all text-sm"
              placeholder="Email Address"
            />
            <label className="absolute left-4 top-3 text-xs text-zinc-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-violet-400 font-medium">
              Email Address
            </label>
          </div>
        </div>
      );
    case 'glow-toggle-switch':
      return (
        <div className="py-6 flex justify-center">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <span className="text-xs font-semibold text-zinc-300">Dark Mode Active</span>
            <div className="w-12 h-6 rounded-full p-1 bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10">
              <div className="w-4 h-4 rounded-full bg-white translate-x-6 transition-transform duration-300" />
            </div>
          </label>
        </div>
      );
    case 'floating-glass-navbar':
      return (
        <div className="w-full py-4 px-2">
          <nav className="flex items-center justify-between px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl max-w-xl mx-auto shadow-2xl">
            <div className="font-bold text-white tracking-tight text-sm">Neuro<span className="text-violet-400">UX</span></div>
            <div className="flex gap-4 text-xs font-medium text-zinc-400">
              <a href="#" className="text-white">Features</a>
              <a href="#" className="hover:text-white transition">Catalog</a>
            </div>
            <button className="px-3.5 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-full shadow-glow">Start Free</button>
          </nav>
        </div>
      );
    case 'glow-toast-notification':
    case 'pulsing-alert-banner':
    case 'hologram-modal-dialog':
      return (
        <div className="py-4 flex justify-center">
          <div className="flex items-start gap-3 p-4 bg-zinc-950 border border-emerald-500/30 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.15)] max-w-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">✓</div>
            <div>
              <h4 className="text-xs font-bold text-white mb-0.5">Notification Demo</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Interactive alert component is active.</p>
            </div>
          </div>
        </div>
      );
    case 'ai-chat-interface-prompts':
      return (
        <div className="w-full max-w-md mx-auto my-2 bg-zinc-950 border border-white/10 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-3 pb-2 border-b border-white/8">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center font-bold text-xs">AI</div>
            <div>
              <h4 className="text-xs font-bold text-white">Neuro AI Assistant</h4>
              <span className="text-[9px] text-emerald-400 font-mono">GPT-4o Active</span>
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-zinc-300 leading-relaxed">
            Hello! How can I assist you with your component design system today?
          </div>
        </div>
      );

    default:
      // Keyword & Tag Matchers
      if (tagsList.includes('button') || targetId.includes('button')) {
        return <Magnet text={productName || "Interactive Button"} />;
      }
      if (tagsList.includes('card') || targetId.includes('card')) {
        return <SpotlightCard title={productName || "Interactive Card"} />;
      }
      if (tagsList.includes('toggle') || tagsList.includes('switch') || targetId.includes('switch')) {
        return (
          <div className="py-6 flex justify-center">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <span className="text-xs font-semibold text-zinc-300">{productName || "Toggle State"}</span>
              <div className="w-12 h-6 rounded-full p-1 bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10">
                <div className="w-4 h-4 rounded-full bg-white translate-x-6 transition-transform duration-300" />
              </div>
            </label>
          </div>
        );
      }
      if (tagsList.includes('input') || tagsList.includes('form') || catLower.includes('form')) {
        return (
          <div className="py-6 flex justify-center w-full">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 backdrop-blur-md text-sm"
                placeholder={productName || "Type here..."}
              />
            </div>
          </div>
        );
      }
      if (catLower.includes('ai') || tagsList.includes('ai')) {
        return (
          <div className="w-full max-w-md mx-auto my-2 bg-zinc-950 border border-white/10 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b border-white/8">
              <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center font-bold text-xs">AI</div>
              <div>
                <h4 className="text-xs font-bold text-white">{productName || "AI Assistant"}</h4>
                <span className="text-[9px] text-emerald-400 font-mono">Neural Stream Active</span>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-zinc-300 leading-relaxed">
              Live AI component stream preview active.
            </div>
          </div>
        );
      }

      // Universal Interactive Playground for 100% component coverage
      return (
        <UniversalComponentPlayground 
          title={productName || "Interactive UI Component"} 
          category={category || "UI/UX Asset"} 
          tags={tags} 
        />
      );
  }
}


