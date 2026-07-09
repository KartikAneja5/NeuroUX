import { motion } from 'framer-motion';
import { FiCheckCircle, FiCpu, FiDownloadCloud } from 'react-icons/fi';

const features = [
  {
    icon: <FiCheckCircle size={20} />,
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-teal-600/5 border-emerald-500/15',
    title: 'Premium Quality',
    description: 'Every asset is manually reviewed by our expert team for pixel-perfect quality and clean code.',
  },
  {
    icon: <FiCpu size={20} />,
    color: 'text-violet-400',
    bg: 'from-violet-500/10 to-purple-600/5 border-violet-500/15',
    title: 'AI Recommendations',
    description: 'Stop searching. Our engine learns your style and surfaces exactly what you need next.',
  },
  {
    icon: <FiDownloadCloud size={20} />,
    color: 'text-cyan-400',
    bg: 'from-cyan-500/10 to-blue-600/5 border-cyan-500/15',
    title: 'Instant Downloads',
    description: 'Access source files, docs, and Figma assets immediately after purchase.',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-[#080712] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-25" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-600/6 blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-3">Why Us</p>
          <h2 className="text-3xl font-bold text-white tracking-tight">Why choose NeuroUX</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`p-7 rounded-2xl border bg-gradient-to-br ${f.bg} transition-all duration-300 hover:shadow-card`}
            >
              <div className={`${f.color} mb-4`}>{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-[#8b7fb5] leading-relaxed text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
