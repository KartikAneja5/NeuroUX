import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  FiArrowRight, 
  FiZap, 
  FiCode, 
  FiSliders, 
  FiActivity, 
  FiGrid
} from 'react-icons/fi';
import BlurText from '../ui/BlurText';

export default function Hero() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 18 };
  const shadowX = useSpring(mouseX, springConfig);
  const shadowY = useSpring(mouseY, springConfig);

  const cardRotateX = useTransform(shadowY, [-300, 300], [6, -6]);
  const cardRotateY = useTransform(shadowX, [-300, 300], [-8, 8]);

  const elem1X = useTransform(shadowX, [-300, 300], [-12, 12]);
  const elem1Y = useTransform(shadowY, [-300, 300], [-12, 12]);

  const elem2X = useTransform(shadowX, [-300, 300], [15, -15]);
  const elem2Y = useTransform(shadowY, [-300, 300], [-15, 15]);

  const elem3X = useTransform(shadowX, [-300, 300], [-18, 18]);
  const elem3Y = useTransform(shadowY, [-300, 300], [12, -12]);

  // ColorBends ALL interactive props
  const [color, setColor] = useState('#A855F7');
  const [speed, setSpeed] = useState(0.2);
  const [frequency, setFrequency] = useState(1.0);
  const [rotation, setRotation] = useState(90);
  const [warp, setWarp] = useState(1.2);
  const [waveCount, setWaveCount] = useState(3);

  // Interactive Live Components State
  const [cyberActive, setCyberActive] = useState(false);
  const [glowSwitch, setGlowSwitch] = useState(true);
  const [liveConversions, setLiveConversions] = useState(1420);

  // Mouse move handler for 3D stage parallax
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 168, g: 85, b: 247 };
  };

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrameId;
    let t = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const rgb = hexToRgb(color);

      ctx.fillStyle = '#080712';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);
      ctx.globalCompositeOperation = 'screen';

      for (let wave = 0; wave < waveCount; wave++) {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
        grad.addColorStop(0.35, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.35 / (wave + 1)})`);
        grad.addColorStop(0.65, `rgba(236, 72, 153, ${0.25 / (wave + 1)})`);
        grad.addColorStop(1, 'rgba(8, 7, 18, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 15) {
          const angle = (x / width) * Math.PI * 2 * frequency + t + (wave * 0.8);
          const y = height * (0.4 + wave * 0.1) + Math.sin(angle) * (height * 0.12 * warp);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      t += 0.008 * speed * 5;
      animFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [color, speed, frequency, rotation, warp, waveCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveConversions(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const heroCategories = [
    { label: 'Basic UI', category: 'basic-ui-components' },
    { label: 'Navigation', category: 'navigation-components' },
    { label: 'Dashboards', category: 'dashboard-components' },
    { label: 'AI Products', category: 'ai-product-components' },
    { label: 'E-commerce', category: 'e-commerce-components' }
  ];

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#080712] pt-20 pb-16 px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* Canvas Background Shader */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block opacity-85" />
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080712] to-transparent z-[5]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: Clean High-Contrast Copy & Clickable Buttons */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left z-30">
          
          {/* Clickable Badge Pill */}
          <Link 
            to="/search"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/90 backdrop-blur-md mb-6 shadow-md cursor-pointer hover:border-violet-400 hover:bg-slate-800 transition-all z-30 pointer-events-auto"
          >
            <span className="text-[10px] font-extrabold bg-violet-600 px-2 py-0.5 rounded text-white uppercase tracking-wider flex items-center gap-1">
              <FiZap size={10} /> Live Components
            </span>
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
              Explore 200+ Animated UI Blocks <FiArrowRight size={12} />
            </span>
          </Link>

          {/* Headline */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              React <span className="text-violet-400">components</span> for
            </h1>
            <div className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight text-white">
              <BlurText 
                text="creative developers" 
                delay={100} 
                animateBy="words" 
                direction="top" 
                className="text-slate-100"
              />
            </div>
          </div>

          <p className="text-slate-300 text-base md:text-lg max-w-lg mb-8 leading-relaxed font-light">
            Production-ready, highly customizable animated components & background shaders that drop into your project and make it instantly look state-of-the-art.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 z-30 pointer-events-auto mb-8">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link 
                to="/search"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition shadow-md border border-violet-400/30 text-sm cursor-pointer z-30 pointer-events-auto"
              >
                Browse Marketplace <FiArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link 
                to="/search"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-2xl transition border border-slate-700 text-sm backdrop-blur-md cursor-pointer z-30 pointer-events-auto"
              >
                Live Interactive Demo
              </Link>
            </motion.div>
          </div>

          {/* Clickable Hero Categories Row */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 z-30 pointer-events-auto">
            <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
              <FiGrid size={11} /> Quick Category Filter:
            </span>
            {heroCategories.map(cat => (
              <button
                key={cat.label}
                onClick={() => navigate(`/search?category=${cat.category}`)}
                className="px-3 py-1 bg-slate-900/90 hover:bg-violet-600/30 hover:border-violet-500 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 transition cursor-pointer z-30 pointer-events-auto"
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: 3D Interactive Stage with ALL ColorBends Controls */}
        <div className="lg:col-span-6 flex justify-center items-center relative min-h-[440px] z-20">
          
          {/* Floating Widget 1: Interactive Cyberpunk Button */}
          <motion.div 
            style={{ x: elem1X, y: elem1Y }}
            className="absolute -top-6 right-2 sm:right-6 z-30 pointer-events-auto"
          >
            <motion.button 
              onClick={() => setCyberActive(!cyberActive)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`px-4 py-2 bg-slate-950 border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer rounded-xl ${
                cyberActive 
                  ? 'border-fuchsia-400 text-fuchsia-400' 
                  : 'border-cyan-400 text-cyan-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cyberActive ? 'bg-fuchsia-400 animate-ping' : 'bg-cyan-400'}`} />
              CYBER_BTN: {cyberActive ? 'ACTIVE' : 'CLICK ME'}
            </motion.button>
          </motion.div>

          {/* Floating Widget 2: Live Conversions Counter */}
          <motion.div 
            style={{ x: elem2X, y: elem2Y }}
            className="absolute top-10 -left-4 sm:left-0 z-30 pointer-events-none hidden sm:block"
          >
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl backdrop-blur-xl shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <FiActivity size={16} />
              </div>
              <div className="text-left font-mono">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Live Component Uses</div>
                <div className="text-sm font-extrabold text-white">{liveConversions.toLocaleString()}+</div>
              </div>
            </div>
          </motion.div>

          {/* Main 3D Card: Code Sandbox Editor for ColorBends with ALL Controls */}
          <motion.div
            style={{ rotateX: cardRotateX, rotateY: cardRotateY }}
            className="w-full max-w-lg bg-[#0e0d22] border border-slate-800 rounded-3xl p-6 shadow-2xl relative font-mono text-left select-none backdrop-blur-2xl z-20"
          >
            {/* Window Top Controls */}
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-800 mb-4">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
                <FiCode size={13} className="text-violet-400" /> ColorBends.jsx
              </span>
            </div>

            {/* Code Editor Viewport */}
            <div className="text-xs leading-relaxed text-slate-400 space-y-2">
              <div>
                <span className="text-pink-400">import</span> {'{ ColorBends }'} <span className="text-pink-400">from</span> <span className="text-emerald-400">'@components/ColorBends'</span>;
              </div>
              <div className="pt-0.5">
                <span className="text-violet-400">function</span> <span className="text-blue-400">HeroStage</span>() {'{'}
              </div>
              <div className="pl-3">
                <span className="text-pink-400">return</span> (
              </div>
              <div className="pl-6 text-white">
                &lt;<span className="text-violet-400">ColorBends</span>
              </div>
              
              {/* ALL ColorBends Sandbox Controls */}
              <div className="pl-10 space-y-2 text-slate-300">
                
                {/* 1. Color Control */}
                <div className="flex items-center gap-2 h-6">
                  <span className="text-purple-300">color</span>=
                  <div className="relative flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 cursor-pointer hover:border-violet-500 transition">
                    <input 
                      type="color" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)} 
                      className="w-4 h-4 bg-transparent border-none cursor-pointer outline-none p-0 rounded-full"
                    />
                    <span className="text-emerald-400 font-bold text-xs uppercase">{color}</span>
                  </div>
                </div>

                {/* 2. Speed Control */}
                <div className="flex items-center gap-2 h-6">
                  <span className="text-purple-300">speed</span>={'{'}
                  <input 
                    type="number" 
                    step="0.05" 
                    min="0.01" 
                    max="2.0"
                    value={speed} 
                    onChange={(e) => setSpeed(Math.max(0.01, parseFloat(e.target.value) || 0.01))} 
                    className="w-14 bg-slate-950 border border-slate-700 text-cyan-300 rounded text-center py-0.5 outline-none font-mono text-xs focus:border-cyan-400" 
                  />
                  {'}'}
                </div>

                {/* 3. Frequency Control */}
                <div className="flex items-center gap-2 h-6">
                  <span className="text-purple-300">frequency</span>={'{'}
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1" 
                    max="5.0"
                    value={frequency} 
                    onChange={(e) => setFrequency(Math.max(0.1, parseFloat(e.target.value) || 0.1))} 
                    className="w-14 bg-slate-950 border border-slate-700 text-cyan-300 rounded text-center py-0.5 outline-none font-mono text-xs focus:border-cyan-400" 
                  />
                  {'}'}
                </div>

                {/* 4. Rotation Control */}
                <div className="flex items-center gap-2 h-6">
                  <span className="text-purple-300">rotation</span>={'{'}
                  <input 
                    type="number" 
                    step="5" 
                    min="0" 
                    max="360"
                    value={rotation} 
                    onChange={(e) => setRotation(parseInt(e.target.value) || 0)} 
                    className="w-14 bg-slate-950 border border-slate-700 text-amber-300 rounded text-center py-0.5 outline-none font-mono text-xs focus:border-amber-400" 
                  />
                  {'}'}
                </div>

                {/* 5. Warp Control */}
                <div className="flex items-center gap-2 h-6">
                  <span className="text-purple-300">warp</span>={'{'}
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1" 
                    max="3.0"
                    value={warp} 
                    onChange={(e) => setWarp(Math.max(0.1, parseFloat(e.target.value) || 0.1))} 
                    className="w-14 bg-slate-950 border border-slate-700 text-rose-300 rounded text-center py-0.5 outline-none font-mono text-xs focus:border-rose-400" 
                  />
                  {'}'}
                </div>

                {/* 6. Wave Count Control */}
                <div className="flex items-center gap-2 h-6">
                  <span className="text-purple-300">waveCount</span>={'{'}
                  <input 
                    type="number" 
                    step="1" 
                    min="1" 
                    max="8"
                    value={waveCount} 
                    onChange={(e) => setWaveCount(Math.max(1, parseInt(e.target.value) || 1))} 
                    className="w-14 bg-slate-950 border border-slate-700 text-violet-300 rounded text-center py-0.5 outline-none font-mono text-xs focus:border-violet-400" 
                  />
                  {'}'}
                </div>
              </div>

              <div className="pl-6 text-white">&lt;/&gt;</div>
              <div className="pl-3">);</div>
              <div>{'}'}</div>
            </div>

            {/* Bottom Color Palette Presets */}
            <div className="mt-4 text-center border-t border-slate-800 pt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Color Presets:</span>
              <div className="flex gap-2">
                {[
                  { name: 'Neon Purple', hex: '#A855F7' },
                  { name: 'Cyan Glow', hex: '#06B6D4' },
                  { name: 'Pink Cyber', hex: '#EC4899' },
                  { name: 'Sunset Gold', hex: '#F59E0B' },
                  { name: 'Emerald Wave', hex: '#10B981' },
                  { name: 'Ice Blue', hex: '#3B82F6' }
                ].map(preset => (
                  <button
                    key={preset.hex}
                    onClick={() => setColor(preset.hex)}
                    title={preset.name}
                    className="w-4 h-4 rounded-full border border-slate-600 cursor-pointer hover:scale-125 transition"
                    style={{ backgroundColor: preset.hex }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating Widget 3: Glow Toggle Switch */}
          <motion.div 
            style={{ x: elem3X, y: elem3Y }}
            className="absolute -bottom-6 left-4 sm:left-8 z-30 pointer-events-auto"
          >
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl backdrop-blur-xl shadow-xl flex items-center gap-3">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <FiSliders className="text-violet-400" size={13} /> Dark Glow Mode
              </span>
              <div 
                onClick={() => setGlowSwitch(!glowSwitch)}
                className={`w-11 h-6 rounded-full p-1 transition-all duration-300 border cursor-pointer ${
                  glowSwitch ? 'bg-violet-600 border-violet-500' : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${glowSwitch ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
