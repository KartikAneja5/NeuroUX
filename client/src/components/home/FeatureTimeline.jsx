import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiCode, FiEye, FiMoon, FiZap } from 'react-icons/fi';

const timelineData = [
  {
    title: 'High Quality',
    subtitle: 'VERIFIED',
    description: 'Every asset is manually reviewed by our expert team for pixel-perfect quality.',
    icon: <FiCode size={14} />
  },
  {
    title: 'Instant Delivery',
    subtitle: 'DOWNLOAD',
    description: 'Get immediate access to source files, Figma documents, and documentation.',
    icon: <FiEye size={14} />
  },
  {
    title: 'Dark mode',
    subtitle: 'SYSTEM',
    description: 'Flawless dark and light modes with seamless system preference sync.',
    icon: <FiMoon size={14} />
  },
  {
    title: 'Community Rated',
    subtitle: 'TRUSTED',
    description: 'Read reviews and ratings from thousands of creators before you buy.',
    icon: <FiZap size={14} />
  }
];

export default function FeatureTimeline() {
  const containerRef = useRef(null);
  
  // Track scroll progress within this component
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Height of the glowing progress line
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-32 bg-[#080712] relative" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left: Text Content */}
          <div className="lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="inline-flex items-center justify-center p-3 rounded-2xl glass mb-6 border border-white/10 shadow-glow-sm">
                <FiZap size={24} className="text-violet-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
                Ship weeks of work <br />
                <span className="text-[#8b7fb5]">in an afternoon</span>
              </h2>
              <p className="text-lg text-[#8b7fb5] leading-relaxed max-w-lg mb-8">
                Components, blocks, full templates. The full launch in a single library, 
                architected to the highest industry standards.
              </p>
              
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
                  <span className="text-violet-400">❖</span> Premium Standards
                </h3>
                <p className="text-sm text-[#5a5275]">
                  Figma files, clean code, responsive layouts.<br/>
                  Download and launch.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Timeline */}
          <div className="relative pl-4 md:pl-10">
            {/* Background track line */}
            <div className="absolute top-0 bottom-0 left-[23px] w-px bg-white/10" />
            
            {/* Animated glowing progress line */}
            <motion.div 
              className="absolute top-0 left-[23px] w-px bg-gradient-to-b from-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(124,58,237,0.8)] z-10"
              style={{ height: lineHeight }}
            />

            <div className="space-y-16 py-8 relative z-20">
              {timelineData.map((item, index) => {
                // Calculate when this specific node should "light up"
                // e.g., node 0 lights up at 0%, node 1 at 33%, etc.
                const startProgress = index / (timelineData.length - 1);
                
                return (
                  <TimelineNode 
                    key={index}
                    item={item}
                    scrollYProgress={scrollYProgress}
                    triggerPoint={startProgress}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Sub-component for individual nodes to handle their own localized animation based on global scroll
function TimelineNode({ item, scrollYProgress, triggerPoint }) {
  // Glow opacity based on scroll reaching this node
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, triggerPoint - 0.2), triggerPoint],
    [0.3, 1]
  );
  
  const scale = useTransform(
    scrollYProgress,
    [Math.max(0, triggerPoint - 0.2), triggerPoint],
    [0.8, 1.1]
  );

  return (
    <div className="relative flex items-start gap-8 group">
      {/* Node Dot */}
      <motion.div 
        className="mt-1 w-4 h-4 rounded-full bg-[#080712] border-2 border-white/20 flex-shrink-0 z-20 relative"
        style={{ scale }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full bg-violet-400"
          style={{ opacity }}
        />
        <motion.div 
          className="absolute inset-0 rounded-full bg-violet-400 blur-md"
          style={{ opacity }}
        />
      </motion.div>

      {/* Content Card */}
      <motion.div 
        style={{ opacity }}
        className="glass-strong p-6 rounded-2xl border border-white/10 flex-1 hover:border-violet-500/30 transition-colors"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-1.5 rounded-lg bg-white/5 text-violet-400">
            {item.icon}
          </div>
          <h4 className="text-white font-semibold">{item.title}</h4>
          <span className="text-[10px] uppercase tracking-widest text-[#5a5275] ml-auto font-mono">
            {item.subtitle}
          </span>
        </div>
        <p className="text-sm text-[#8b7fb5] leading-relaxed">
          {item.description}
        </p>
      </motion.div>
    </div>
  );
}
