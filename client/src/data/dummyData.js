export const dummyProducts = [
  // TEXT ANIMATIONS
  {
    id: 'split-text',
    name: 'Split Text',
    category: 'Text Animations',
    categoryId: 'text-animations',
    tags: ['text', 'framer-motion', 'split', 'letters'],
    description: 'Animate text split by letters or words with customized delay, stagger, and easing controls.',
    price: 12.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.9,
    reviews: 124,
    author: { name: 'MotionLabs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MotionLabs' },
    code: `import { motion } from 'framer-motion';

export default function SplitText({ text, delay = 0, stagger = 0.05 }) {
  const letters = text.split('');
  return (
    <div className="flex flex-wrap overflow-hidden justify-center text-4xl font-extrabold text-white">
      {letters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ delay: delay + index * stagger, ease: 'easeOut', duration: 0.5 }}
          className="inline-block mr-[2px]"
        >
          {char === ' ' ? '\\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
}`
  },
  {
    id: 'blur-text',
    name: 'Blur Text',
    category: 'Text Animations',
    categoryId: 'text-animations',
    tags: ['text', 'blur', 'reveal', 'cinematic'],
    description: 'Cinematic text reveal effect where letters fade in and sharpen from a blurred state.',
    price: 15.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.8,
    reviews: 95,
    author: { name: 'UI UX Labs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UIUXLabs' },
    code: `import { motion } from 'framer-motion';

export default function BlurText({ text, delay = 0, duration = 0.8 }) {
  const words = text.split(' ');
  return (
    <div className="flex flex-wrap gap-x-3 justify-center text-3xl md:text-5xl font-bold text-white">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 10 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration, delay: delay + i * 0.15, ease: 'easeOut' }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}`
  },
  {
    id: 'shiny-text',
    name: 'Shiny Text',
    category: 'Text Animations',
    categoryId: 'text-animations',
    tags: ['text', 'shimmer', 'gradient', 'css-mask'],
    description: 'Apply a sweeping shiny metallic gradient overlay to text. Fits premium hero headers.',
    price: 9.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.7,
    reviews: 82,
    author: { name: 'CanvasCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CanvasCraft' },
    code: `import React from 'react';

export default function ShinyText({ text, speed = '3s' }) {
  return (
    <span 
      className="inline-block font-semibold bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 via-white to-zinc-500 bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]"
      style={{ animationDuration: speed }}
    >
      {text}
    </span>
  );
}`
  },
  {
    id: 'decrypted-text',
    name: 'Decrypted Text',
    category: 'Text Animations',
    categoryId: 'text-animations',
    tags: ['text', 'scramble', 'hacker', 'matrix'],
    description: 'A cybernetic text scrambler that decrypts random characters into standard text on hover.',
    price: 18.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.95,
    reviews: 167,
    author: { name: 'Launchpad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Launchpad' },
    code: `import { useState, useEffect } from 'react';

export default function DecryptedText({ text, speed = 40 }) {
  const [displayText, setDisplayText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text.split('').map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className="font-mono text-cyan-400 text-3xl tracking-wide">{displayText}</span>;
}`
  },
  {
    id: 'true-focus',
    name: 'True Focus',
    category: 'Text Animations',
    categoryId: 'text-animations',
    tags: ['text', 'focus', 'hover', 'glow'],
    description: 'Dynamic text line where individual words focus and glow as the user hovers over them.',
    price: 14.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.6,
    reviews: 43,
    author: { name: 'InteractionX', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InteractionX' },
    code: `import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TrueFocus({ sentence }) {
  const words = sentence.split(' ');
  const [focusIndex, setFocusIndex] = useState(0);

  return (
    <div className="flex flex-wrap gap-4 text-4xl font-extrabold text-white">
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          onMouseEnter={() => setFocusIndex(idx)}
          animate={{
            filter: focusIndex === idx ? 'blur(0px)' : 'blur(4px)',
            opacity: focusIndex === idx ? 1 : 0.4,
            scale: focusIndex === idx ? 1.05 : 1
          }}
          className="cursor-pointer transition-all duration-300"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}`
  },
  {
    id: 'rotating-text',
    name: 'Rotating Text',
    category: 'Text Animations',
    categoryId: 'text-animations',
    tags: ['text', 'carousel', 'cycler', 'infinite'],
    description: 'Rotate multiple text tags sequentially inside a sentence. Ideal for headline keywords.',
    price: 11.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.7,
    reviews: 58,
    author: { name: 'DesignFlow', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignFlow' },
    code: `import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RotatingText({ items = [], interval = 2500 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items, interval]);

  return (
    <div className="h-10 overflow-hidden relative inline-block text-violet-400 font-bold">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}`
  },
  {
    id: 'glitch-text',
    name: 'Glitch Text',
    category: 'Text Animations',
    categoryId: 'text-animations',
    tags: ['text', 'glitch', 'cyberpunk', 'retro'],
    description: 'A stylistic cyberpunk text glitch effect triggered either on hover or continuously.',
    price: 13.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.85,
    reviews: 110,
    author: { name: 'MotionLabs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MotionLabs' },
    code: `import React from 'react';

export default function GlitchText({ text }) {
  return (
    <span className="relative inline-block font-black text-5xl uppercase tracking-wider text-white select-none
      before:content-[attr(data-text)] before:absolute before:left-[2px] before:text-red-500 before:bg-[#080712] before:clip-path-glitch-1 before:animate-glitch-anim-1
      after:content-[attr(data-text)] after:absolute after:left-[-2px] after:text-cyan-400 after:bg-[#080712] after:clip-path-glitch-2 after:animate-glitch-anim-2"
      data-text={text}
    >
      {text}
    </span>
  );
}`
  },
  {
    id: 'count-up',
    name: 'Count Up',
    category: 'Text Animations',
    categoryId: 'text-animations',
    tags: ['text', 'number', 'scroll', 'stats'],
    description: 'Smooth scrolling number ticker. Counts up from zero when scrolled into view.',
    price: 8.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.8,
    reviews: 140,
    author: { name: 'UI UX Labs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UIUXLabs' },
    code: `import { useState, useEffect } from 'react';

export default function CountUp({ endValue, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(endValue);
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

  return <span className="font-bold text-4xl text-emerald-400">{count}+</span>;
}`
  },

  // ANIMATIONS
  {
    id: 'animated-content',
    name: 'Animated Content',
    category: 'Animations',
    categoryId: 'animations',
    tags: ['animation', 'scroll', 'reveal', 'framer-motion'],
    description: 'Wrapper component that triggers fade-ups, slides, and scale animations on scroll.',
    price: 16.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.9,
    reviews: 114,
    author: { name: 'CanvasCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CanvasCraft' },
    code: `import { motion } from 'framer-motion';

export default function AnimatedContent({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}`
  },
  {
    id: 'fade-content',
    name: 'Fade Content',
    category: 'Animations',
    categoryId: 'animations',
    tags: ['animation', 'fade', 'scroll', 'intersection-observer'],
    description: 'Smooth intersection-observer powered lazy fader that fades in content elements as they enter.',
    price: 11.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.75,
    reviews: 63,
    author: { name: 'Launchpad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Launchpad' },
    code: `import { useRef, useState, useEffect } from 'react';

export default function FadeContent({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(ref.current);
      }
    }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={\`transition-opacity duration-1000 \${isVisible ? 'opacity-100' : 'opacity-0'}\`}>
      {children}
    </div>
  );
}`
  },
  {
    id: 'electric-border',
    name: 'Electric Border',
    category: 'Animations',
    categoryId: 'animations',
    tags: ['animation', 'border', 'glow', 'svg'],
    description: 'Border animation where a laser-like electrical spark circles around card borders.',
    price: 24.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.98,
    reviews: 195,
    author: { name: 'InteractionX', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InteractionX' },
    code: `import React from 'react';

export default function ElectricBorder({ children }) {
  return (
    <div className="relative group p-[2px] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 via-cyan-500 to-pink-500 animate-[spin_4s_linear_infinite] opacity-30 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 bg-[#0c0b1e] rounded-[14px] p-6">
        {children}
      </div>
    </div>
  );
}`
  },
  {
    id: 'orbit-images',
    name: 'Orbit Images',
    category: 'Animations',
    categoryId: 'animations',
    tags: ['animation', 'orbit', 'rotate', 'gallery'],
    description: 'An interactive circular orbit display where multiple images float around a central core.',
    price: 26.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.82,
    reviews: 104,
    author: { name: 'DesignFlow', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignFlow' },
    code: `import React from 'react';

export default function OrbitImages({ images = [] }) {
  return (
    <div className="relative w-72 h-72 rounded-full border border-white/5 flex items-center justify-center animate-[spin_30s_linear_infinite]">
      <div className="w-16 h-16 rounded-full bg-violet-600 shadow-glow" />
      {images.map((img, i) => {
        const angle = (i * 360) / images.length;
        return (
          <img
            key={i}
            src={img}
            alt="orbit"
            className="absolute w-12 h-12 rounded-full object-cover border-2 border-white/20 hover:scale-110 transition-transform"
            style={{ transform: \`rotate(\${angle}deg) translate(120px) rotate(-\${angle}deg)\` }}
          />
        );
      })}
    </div>
  );
}`
  },
  {
    id: 'glare-hover',
    name: 'Glare Hover',
    category: 'Animations',
    categoryId: 'animations',
    tags: ['animation', 'glare', 'hover', 'card'],
    description: 'Card component featuring a dynamic glare reflection sheet following the hover angle.',
    price: 15.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.9,
    reviews: 147,
    author: { name: 'MotionLabs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MotionLabs' },
    code: `import React, { useState } from 'react';

export default function GlareHover({ children }) {
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
        style={{ '--x': \`\${pos.x}%\`, '--y': \`\${pos.y}%\` }}
      />
      {children}
    </div>
  );
}`
  },
  {
    id: 'star-border',
    name: 'Star Border',
    category: 'Animations',
    categoryId: 'animations',
    tags: ['animation', 'border', 'star', 'glow'],
    description: 'A button border animation with glowing starlight effects revolving along the container edge.',
    price: 12.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.88,
    reviews: 139,
    author: { name: 'UI UX Labs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UIUXLabs' },
    code: `import React from 'react';

export default function StarBorder({ children }) {
  return (
    <button className="relative px-8 py-3.5 bg-black rounded-xl border border-white/15 overflow-hidden text-sm font-semibold text-white group shadow-glow-sm hover:shadow-glow transition-shadow">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-400 opacity-20 group-hover:opacity-30 transition-opacity" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}`
  },
  {
    id: 'click-spark',
    name: 'Click Spark',
    category: 'Animations',
    categoryId: 'animations',
    tags: ['animation', 'click', 'spark', 'cursor'],
    description: 'Emit colorful spark particles from the cursor position whenever the user clicks.',
    price: 10.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.65,
    reviews: 67,
    author: { name: 'CanvasCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CanvasCraft' },
    code: `import { useState } from 'react';

export default function ClickSpark() {
  const [sparks, setSparks] = useState([]);
  
  const handleClick = (e) => {
    const newSpark = { id: Date.now(), x: e.clientX, y: e.clientY };
    setSparks((prev) => [...prev, newSpark]);
    setTimeout(() => {
      setSparks((prev) => prev.filter(s => s.id !== newSpark.id));
    }, 800);
  };

  return (
    <div onClick={handleClick} className="w-full h-48 border border-white/5 bg-zinc-900/50 rounded-xl relative overflow-hidden flex items-center justify-center cursor-crosshair">
      <span className="text-sm text-[#8b7fb5]">Click anywhere inside this viewport</span>
      {sparks.map(s => (
        <span 
          key={s.id}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping pointer-events-none"
          style={{ left: s.x - 4, top: s.y - 4 }}
        />
      ))}
    </div>
  );
}`
  },
  {
    id: 'magnet',
    name: 'Magnet',
    category: 'Animations',
    categoryId: 'animations',
    tags: ['animation', 'magnet', 'hover', 'mouse-follow'],
    description: 'Smooth magnetic attraction that pulls buttons and icons towards the mouse position.',
    price: 9.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.84,
    reviews: 91,
    author: { name: 'Launchpad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Launchpad' },
    code: `import { useRef, useState } from 'react';

export default function Magnet({ children }) {
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
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block transition-transform duration-100 ease-out"
      style={{ transform: \`translate3d(\${position.x}px, \${position.y}px, 0)\` }}
    >
      {children}
    </div>
  );
}`
  },

  // COMPONENTS
  {
    id: 'animated-list',
    name: 'Animated List',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'list', 'reorder', 'framer-motion'],
    description: 'List component that handles add/remove transitions and drag-to-reorder list animations.',
    price: 22.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.87,
    reviews: 132,
    author: { name: 'InteractionX', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InteractionX' },
    code: `import { motion, Reorder } from 'framer-motion';
import { useState } from 'react';

export default function AnimatedList() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  return (
    <Reorder.Group values={items} onReorder={setItems} className="space-y-2">
      {items.map(item => (
        <Reorder.Item key={item} value={item} className="bg-white/5 border border-white/8 rounded-lg p-3 cursor-grab active:cursor-grabbing text-white">
          {item}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}`
  },
  {
    id: 'scroll-stack',
    name: 'Scroll Stack',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'scroll', 'stack', 'parallax'],
    description: 'Deck of cards that stack on top of each other sequentially as the user scrolls down.',
    price: 29.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.94,
    reviews: 153,
    author: { name: 'DesignFlow', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignFlow' },
    code: `// Scroll Stack Premium Component Source Code`
  },
  {
    id: 'bubble-menu',
    name: 'Bubble Menu',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'menu', 'bubble', 'liquid'],
    description: 'A floating bubble menu that expands with organic, springy, liquid physics bubble bubbles.',
    price: 19.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.81,
    reviews: 79,
    author: { name: 'MotionLabs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MotionLabs' },
    code: `// Liquid bubble menu source code`
  },
  {
    id: 'magic-bento',
    name: 'Magic Bento Grid',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'bento', 'grid', 'layout'],
    description: 'Fully responsive Bento grid featuring mouse-follow glowing tiles and custom cards.',
    price: 35.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.97,
    reviews: 242,
    author: { name: 'UI UX Labs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UIUXLabs' },
    code: `// Bento Grid Premium source code`
  },
  {
    id: 'reflective-card',
    name: 'Reflective Card',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'card', 'reflective', 'glassmorphism'],
    description: 'Glassmorphic card featuring detailed light reflections shifting based on mouse coordinates.',
    price: 24.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.9,
    reviews: 167,
    author: { name: 'CanvasCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CanvasCraft' },
    code: `// Reflective Card layout code`
  },
  {
    id: 'staggered-menu',
    name: 'Staggered Menu',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'menu', 'stagger', 'delay'],
    description: 'Vertical drop-down accordion menu with cascading staggered delay entrance animations.',
    price: 15.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.88,
    reviews: 118,
    author: { name: 'Launchpad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Launchpad' },
    code: `// Staggered accordion menu`
  },
  {
    id: 'dock',
    name: 'Dock',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'dock', 'macos', 'magnification'],
    description: 'Sleek macOS-inspired navigation bar with interactive magnification scaling on hover.',
    price: 19.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.91,
    reviews: 151,
    author: { name: 'InteractionX', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InteractionX' },
    code: `// OS Dock source code`
  },
  {
    id: 'pixel-card',
    name: 'Pixel Card',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'card', 'pixel', 'retro'],
    description: 'Retro game inspired grid card that renders micro-pixel particle grids when hovered.',
    price: 18.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.79,
    reviews: 84,
    author: { name: 'DesignFlow', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignFlow' },
    code: `// Pixel Card particles grid generator`
  },
  {
    id: 'spotlight-card',
    name: 'Spotlight Card',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'card', 'spotlight', 'mouse-glow'],
    description: 'Card layout that illuminates borders and backgrounds relative to mouse spotlight position.',
    price: 14.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.9,
    reviews: 143,
    author: { name: 'MotionLabs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MotionLabs' },
    code: `import React, { useRef, useState } from 'react';

export default function SpotlightCard({ children }) {
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
      className="relative p-6 rounded-2xl bg-zinc-950/80 border border-white/5 overflow-hidden group cursor-pointer"
    >
      <div 
        className="absolute inset-0 bg-[radial-gradient(350px_circle_at_var(--x)_var(--y),rgba(124,58,237,0.12)_0%,transparent_80%)] pointer-events-none"
        style={{ '--x': \`\${coords.x}px\`, '--y': \`\${coords.y}px\` }}
      />
      {children}
    </div>
  );
}`
  },
  {
    id: 'border-glow',
    name: 'Border Glow',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'border', 'glow', 'hover'],
    description: 'Card border glow helper that dynamically lights up container perimeter on hover.',
    price: 12.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.85,
    reviews: 99,
    author: { name: 'UI UX Labs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UIUXLabs' },
    code: `// Border Glow frame modifier`
  },
  {
    id: 'decay-card',
    name: 'Decay Card',
    category: 'Components',
    categoryId: 'components',
    tags: ['component', 'card', 'decay', 'dissolve'],
    description: 'Card layout displaying beautiful disintegrating noise patterns along edges during mouse hover.',
    price: 24.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.8,
    reviews: 89,
    author: { name: 'CanvasCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CanvasCraft' },
    code: `// Decay card edge dissolve`
  },

  // BACKGROUNDS
  {
    id: 'particles',
    name: 'Particles',
    category: 'Backgrounds',
    categoryId: 'backgrounds',
    tags: ['background', 'canvas', 'particles', 'constellation'],
    description: 'Performant canvas particle network rendering connecting nodes responding to pointer movement.',
    price: 19.99,
    previewImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'html-css',
    rating: 4.92,
    reviews: 215,
    author: { name: 'Launchpad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Launchpad' },
    code: `import React, { useRef, useEffect } from 'react';

export default function ParticlesBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const points = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(124, 58, 237, 0.4)';
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.08)';
      
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
          if (dist < 100) {
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-[#080712] pointer-events-none" />;
}`
  },
  {
    id: 'waves',
    name: 'Waves',
    category: 'Backgrounds',
    categoryId: 'backgrounds',
    tags: ['background', 'canvas', 'waves', 'harmonic'],
    description: 'Smooth harmonic wave lines animating across the screen width. Adds fluid movement.',
    price: 18.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.81,
    reviews: 112,
    author: { name: 'InteractionX', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InteractionX' },
    code: `// Harmonic Waves canvas code`
  },
  {
    id: 'aurora',
    name: 'Aurora',
    category: 'Backgrounds',
    categoryId: 'backgrounds',
    tags: ['background', 'gradient', 'aurora', 'mesh'],
    description: 'Flowing animated CSS mesh gradients displaying moving Northern Lights/Aurora effects.',
    price: 22.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'html-css',
    rating: 4.96,
    reviews: 184,
    author: { name: 'DesignFlow', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignFlow' },
    code: `// Aurora mesh animated gradients`
  },
  {
    id: 'grid-scan',
    name: 'Grid Scan',
    category: 'Backgrounds',
    categoryId: 'backgrounds',
    tags: ['background', 'grid', 'scanline', 'tech'],
    description: 'A glowing wireframe grid with sweeping scanlines, ideal for futuristic technical dashboards.',
    price: 15.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.7,
    reviews: 63,
    author: { name: 'MotionLabs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MotionLabs' },
    code: `// Scanning futuristic tech grid`
  },
  {
    id: 'liquid-ether',
    name: 'Liquid Ether',
    category: 'Backgrounds',
    categoryId: 'backgrounds',
    tags: ['background', 'fluid', 'liquid', 'organic'],
    description: 'Organic flowing fluid simulation using GLSL shader rendering glowing liquid waves.',
    price: 28.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.98,
    reviews: 122,
    author: { name: 'UI UX Labs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UIUXLabs' },
    code: `// GLSL shader background`
  },
  {
    id: 'beams',
    name: 'Beams',
    category: 'Backgrounds',
    categoryId: 'backgrounds',
    tags: ['background', 'beams', 'light', 'laser'],
    description: 'Luminous light beams and rays that filter down and float across dark screen areas.',
    price: 19.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.77,
    reviews: 81,
    author: { name: 'CanvasCraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CanvasCraft' },
    code: `// Multi-beam light layer`
  },
  {
    id: 'lightning',
    name: 'Lightning',
    category: 'Backgrounds',
    categoryId: 'backgrounds',
    tags: ['background', 'canvas', 'lightning', 'energy'],
    description: 'Realistic electrical branch discharges and lightning bolt bursts generated on canvas clicks.',
    price: 25.00,
    previewImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'react',
    rating: 4.88,
    reviews: 74,
    author: { name: 'Launchpad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Launchpad' },
    code: `// Lightning discharge canvas renderer`
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    category: 'Backgrounds',
    categoryId: 'backgrounds',
    tags: ['background', 'canvas', 'stars', 'galaxy'],
    description: 'A 3D spiraling galaxy render featuring thousands of rotating star particles on canvas.',
    price: 29.99,
    previewImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    livePreviewUrl: '#',
    framework: 'html-css',
    rating: 4.95,
    reviews: 139,
    author: { name: 'InteractionX', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InteractionX' },
    code: `// Spiraling 3D galaxy rotation`
  }
];

export const dummyCategories = [
  { id: 'text-animations', name: 'Text Animations', count: 8 },
  { id: 'animations', name: 'Animations', count: 8 },
  { id: 'components', name: 'Components', count: 11 },
  { id: 'backgrounds', name: 'Backgrounds', count: 8 }
];
