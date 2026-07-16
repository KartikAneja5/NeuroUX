import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import BlurText from '../ui/BlurText';

export default function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // State corresponding to the 9 editable props in reactbits.dev screenshot
  const [color, setColor] = useState('#A855F7');
  const [speed, setSpeed] = useState(0.2);
  const [frequency, setFrequency] = useState(1.0);
  const [noise, setNoise] = useState(0.15);
  const [bandwidth, setBandwidth] = useState(0.14);
  const [rotation, setRotation] = useState(90);
  const [fadeTop, setFadeTop] = useState(0.75);
  const [iterations, setIterations] = useState(1);
  const [intensity, setIntensity] = useState(1.3);

  // Hardware-accelerated CSS variable mouse tracker
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty('--mouse-x', `-1000px`);
    containerRef.current.style.setProperty('--mouse-y', `-1000px`);
  };

  // Hex to RGB parser helper
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 168, g: 85, b: 247 };
  };

  // Animation and canvas setup for ColorBends
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

      // 1. Draw base dark background
      ctx.fillStyle = '#080712';
      ctx.fillRect(0, 0, width, height);

      // 2. Setup rotation and scale for rendering waves
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);

      ctx.globalCompositeOperation = 'screen';

      // Draw multi-color glowing bends waves based on iterations
      const loops = Math.min(4, Math.max(1, iterations));
      for (let b = 0; b < loops; b++) {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        // Base alpha set higher (0.45+) to make waves highly pigmented and bright
        const alpha = (0.45 + b * 0.12) * intensity;
        
        // Multi-color stops mapping: Cyan -> Primary Color (Violet) -> Saturated Fuchsia
        grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
        grad.addColorStop(0.35, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
        grad.addColorStop(0.65, `rgba(236, 72, 153, ${alpha * 0.95})`);
        grad.addColorStop(1, 'rgba(8, 7, 18, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();

        // Top Wavy Path with double-octave sines for organic fluid bending
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 15) {
          const angle = (x / width) * Math.PI * 2 * frequency + t + b * (Math.PI / 3);
          const secondaryAngle = (x / width) * Math.PI * 4 * frequency - t * 0.3;
          
          const noiseOffset = Math.sin(angle * 3.5) * noise * 120;
          const waveHeight = (Math.sin(angle) + Math.cos(secondaryAngle) * 0.3) * (height * 0.2);
          
          const y = height / 2 + waveHeight + noiseOffset;
          ctx.lineTo(x, y - (bandwidth * 400));
        }

        // Bottom Wavy Path
        for (let x = width; x >= 0; x -= 15) {
          const angle = (x / width) * Math.PI * 2 * frequency + t + b * (Math.PI / 3);
          const secondaryAngle = (x / width) * Math.PI * 4 * frequency - t * 0.3;
          
          const noiseOffset = Math.sin(angle * 3.5) * noise * 120;
          const waveHeight = (Math.sin(angle) + Math.cos(secondaryAngle) * 0.3) * (height * 0.2);
          
          const y = height / 2 + waveHeight + noiseOffset;
          ctx.lineTo(x, y + (bandwidth * 400));
        }

        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      // 3. Draw top fade gradient overlay
      if (fadeTop > 0) {
        ctx.globalCompositeOperation = 'source-over';
        const fadeGrad = ctx.createLinearGradient(0, 0, 0, height * fadeTop);
        fadeGrad.addColorStop(0, '#080712');
        fadeGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = fadeGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Increment t based on speed prop
      t += 0.01 * speed * 5;

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [color, speed, frequency, noise, bandwidth, rotation, fadeTop, iterations, intensity]);

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080712] pt-20 px-4 group"
    >
      
      {/* Dynamic ColorBends Canvas Background (soft blurred gaseous layers) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block blur-[50px] scale-[1.08] opacity-85" />
        
        {/* Sharp Dot Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.3) 1.3px, transparent 1.3px)`,
            backgroundSize: '26px 26px',
          }}
        />

        {/* Hardware-Accelerated Mouse Spotlight highlighting the dot grid */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(350px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), ${color}1e 0%, transparent 80%)`,
          }}
        />
        
        {/* Bottom fade out to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080712] to-transparent z-[5]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center py-12 md:py-24">
        
        {/* LEFT COLUMN: Texts and Actions */}
        <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-600/10 backdrop-blur-md mb-6 shadow-glow-sm cursor-pointer hover:border-violet-500/40 transition-colors"
          >
            <span className="text-[9px] font-bold bg-violet-500 px-1.5 py-0.5 rounded text-white uppercase tracking-wider">New component</span>
            <span className="text-[10px] font-medium text-[#c4b5fd] flex items-center gap-1">
              Line Sidebar <FiArrowRight size={11} />
            </span>
          </motion.div>

          {/* Headline */}
          <div className="mb-6">
            <BlurText 
              text="React components for" 
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-2 leading-tight" 
              delay={80}
              animateBy="words"
            />
            <BlurText 
              text="creative developers" 
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-violet-400 pb-2 leading-tight" 
              delay={80}
              animateBy="words"
            />
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-[#8b7fb5] text-base md:text-lg max-w-lg mb-10 leading-relaxed font-light"
          >
            Highly customizable animated components & backgrounds that drop into your project and instantly make it stand out.
          </motion.p>

          {/* Browse Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Link 
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition shadow-glow hover:shadow-glow-lg border border-violet-400"
            >
              Browse Components <FiArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Interactive Code Sandbox Editor */}
        <div className="md:col-span-5 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-md bg-[#0c0b1e]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl relative font-mono text-left select-none backdrop-blur-md"
          >
            {/* Window header decoration */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">ColorBends.jsx</span>
            </div>

            {/* Code Body Content */}
            <div className="text-[10.5px] leading-relaxed text-zinc-400 space-y-0.5">
              <div>
                <span className="text-pink-400">import</span> {'{ ColorBends }'} <span className="text-pink-400">from</span> <span className="text-emerald-400">'@components/ColorBends'</span>;
              </div>
              <br />
              <div>
                <span className="text-violet-400">function</span> <span className="text-blue-400">App</span>() {'{'}
              </div>
              <div className="pl-4">
                <span className="text-pink-400">return</span> (
              </div>
              <div className="pl-8 text-zinc-300">
                &lt;<span className="text-blue-400">ColorBends</span>
              </div>
              
              {/* Clickable/Editable Prop Values */}
              <div className="pl-12 space-y-0.5 text-zinc-300">
                {/* 1. Color Picker */}
                <div className="flex items-center gap-1.5 h-6">
                  <span className="text-purple-400">color</span>=
                  <span className="text-zinc-500">"</span>
                  <div className="relative flex items-center gap-1 bg-white/5 border border-white/8 hover:border-white/20 rounded px-1.5 py-0.5 cursor-pointer">
                    <input 
                      type="color" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)} 
                      className="w-3.5 h-3.5 bg-transparent border-none cursor-pointer outline-none p-0 rounded-full"
                    />
                    <span className="text-emerald-400 font-bold text-[9px] uppercase">{color}</span>
                  </div>
                  <span className="text-zinc-500">"</span>
                </div>

                {/* 2. Speed Input */}
                <div className="flex items-center gap-1.5 h-6">
                  <span className="text-purple-400">speed</span>={'{'}
                  <input 
                    type="number" 
                    step="0.05" 
                    min="0.01" 
                    max="2.0"
                    value={speed} 
                    onChange={(e) => setSpeed(Math.max(0.01, parseFloat(e.target.value) || 0.01))} 
                    className="w-12 bg-zinc-900 border border-white/10 text-cyan-300 rounded text-center py-0.5 outline-none font-mono text-[10px]" 
                  />
                  {'}'}
                </div>

                {/* 3. Frequency Input */}
                <div className="flex items-center gap-1.5 h-6">
                  <span className="text-purple-400">frequency</span>={'{'}
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1" 
                    max="5.0"
                    value={frequency} 
                    onChange={(e) => setFrequency(Math.max(0.1, parseFloat(e.target.value) || 0.1))} 
                    className="w-12 bg-zinc-900 border border-white/10 text-cyan-300 rounded text-center py-0.5 outline-none font-mono text-[10px]" 
                  />
                  {'}'}
                </div>

                {/* 4. Noise Input */}
                <div className="flex items-center gap-1.5 h-6">
                  <span className="text-purple-400">noise</span>={'{'}
                  <input 
                    type="number" 
                    step="0.05" 
                    min="0.0" 
                    max="1.0"
                    value={noise} 
                    onChange={(e) => setNoise(Math.max(0, parseFloat(e.target.value) || 0))} 
                    className="w-12 bg-zinc-900 border border-white/10 text-cyan-300 rounded text-center py-0.5 outline-none font-mono text-[10px]" 
                  />
                  {'}'}
                </div>

                {/* 5. Bandwidth Input */}
                <div className="flex items-center gap-1.5 h-6">
                  <span className="text-purple-400">bandwidth</span>={'{'}
                  <input 
                    type="number" 
                    step="0.02" 
                    min="0.01" 
                    max="0.5"
                    value={bandwidth} 
                    onChange={(e) => setBandwidth(Math.max(0.01, parseFloat(e.target.value) || 0.01))} 
                    className="w-12 bg-zinc-900 border border-white/10 text-cyan-300 rounded text-center py-0.5 outline-none font-mono text-[10px]" 
                  />
                  {'}'}
                </div>

                {/* 6. Rotation Input */}
                <div className="flex items-center gap-1.5 h-6">
                  <span className="text-purple-400">rotation</span>={'{'}
                  <input 
                    type="number" 
                    step="5" 
                    min="0" 
                    max="360"
                    value={rotation} 
                    onChange={(e) => setRotation(Math.max(0, parseInt(e.target.value) || 0))} 
                    className="w-12 bg-zinc-900 border border-white/10 text-cyan-300 rounded text-center py-0.5 outline-none font-mono text-[10px]" 
                  />
                  {'}'}
                </div>

                {/* 7. FadeTop Input */}
                <div className="flex items-center gap-1.5 h-6">
                  <span className="text-purple-400">fadeTop</span>={'{'}
                  <input 
                    type="number" 
                    step="0.05" 
                    min="0.0" 
                    max="1.0"
                    value={fadeTop} 
                    onChange={(e) => setFadeTop(Math.max(0, parseFloat(e.target.value) || 0))} 
                    className="w-12 bg-zinc-900 border border-white/10 text-cyan-300 rounded text-center py-0.5 outline-none font-mono text-[10px]" 
                  />
                  {'}'}
                </div>

                {/* 8. Iterations Input */}
                <div className="flex items-center gap-1.5 h-6">
                  <span className="text-purple-400">iterations</span>={'{'}
                  <input 
                    type="number" 
                    step="1" 
                    min="1" 
                    max="4"
                    value={iterations} 
                    onChange={(e) => setIterations(Math.max(1, parseInt(e.target.value) || 1))} 
                    className="w-12 bg-zinc-900 border border-white/10 text-cyan-300 rounded text-center py-0.5 outline-none font-mono text-[10px]" 
                  />
                  {'}'}
                </div>

                {/* 9. Intensity Input */}
                <div className="flex items-center gap-1.5 h-6">
                  <span className="text-purple-400">intensity</span>={'{'}
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1" 
                    max="5.0"
                    value={intensity} 
                    onChange={(e) => setIntensity(Math.max(0.1, parseFloat(e.target.value) || 0.1))} 
                    className="w-12 bg-zinc-900 border border-white/10 text-cyan-300 rounded text-center py-0.5 outline-none font-mono text-[10px]" 
                  />
                  {'}'}
                </div>
              </div>

              <div className="pl-8 text-zinc-300">
                /&gt;
              </div>
              <div className="pl-4">
                );
              </div>
              <div>
                {'}'}
              </div>
            </div>

            {/* Bottom Tooltip */}
            <div className="mt-5 text-center text-[9px] text-zinc-500 border-t border-white/5 pt-3">
              drag or click values to edit and watch the waves morph
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
