import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiGithub, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin, 
  FiYoutube, 
  FiStar, 
  FiGitBranch, 
  FiUsers, 
  FiCheckCircle, 
  FiMessageSquare, 
  FiRepeat, 
  FiHeart, 
  FiShare2, 
  FiZap,
  FiPlay
} from 'react-icons/fi';

export default function SocialPreviewModal({ platform, onClose }) {
  // Handle Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!platform) return null;

  const mockRepos = [
    { name: 'neuroux-frontend', desc: 'MERN + ReactBits UI component marketplace client application.', stars: 428, forks: 84, lang: 'JavaScript' },
    { name: 'neuroux-recommender', desc: 'Django hybrid collaborative & content-based recommendation service.', stars: 312, forks: 62, lang: 'Python' },
    { name: 'neuroux-ai-engine', desc: 'Real-time user affinity modeling & interaction logging engine.', stars: 189, forks: 29, lang: 'Python' },
  ];

  const mockTweets = [
    {
      time: '2h ago',
      text: '🚀 NeuroUX v2.0 is live! Explore our upgraded dual-layer personalization engine and 45+ production-ready React UI components.',
      stats: { retweets: 142, likes: 890 }
    },
    {
      time: '1d ago',
      text: '⚡ Just dropped new Glassmorphism & Cyberpunk animated component sets! Fully styled with Tailwind CSS.',
      stats: { retweets: 98, likes: 654 }
    }
  ];

  const mockInstaPosts = [
    '/images/glow-glass-pricing.png',
    '/images/spotlight-card.png',
    '/images/magnet.png',
    '/images/blur-text.png',
    '/images/shiny-text.png',
    '/images/split-text.png',
    '/images/glow-glass-pricing.png',
    '/images/spotlight-card.png',
    '/images/magnet.png'
  ];

  const mockVideos = [
    { title: 'Building Dual-Layer Recommenders in MERN', views: '24k views', time: '2 weeks ago' },
    { title: 'ReactBits & Framer Motion Animation Guide', views: '18k views', time: '1 month ago' },
    { title: 'Design Systems at Scale with Tailwind', views: '32k views', time: '2 months ago' },
    { title: 'Fullstack AI Analytics Dashboard Demo', views: '14k views', time: '3 months ago' }
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-xl bg-[#0f0e21] border border-white/12 rounded-3xl overflow-hidden shadow-2xl relative text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#14132c] border-b border-white/8">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                Preview — Demo Content
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
              title="Close modal"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Platform Specific Mock Content Body */}
          <div className="p-6 max-h-[80vh] overflow-y-auto font-sans">

            {/* 1. GITHUB MOCKUP */}
            {platform === 'github' && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-white border border-white/10 shadow-md">
                    <FiGithub size={36} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      NeuroUX <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono font-normal">Organization</span>
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">@neuroux</p>
                    <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                      Dual-layer personalization MERN marketplace for React UI components and animated background shaders.
                    </p>
                    <div className="flex gap-4 text-xs text-zinc-400 mt-3 font-mono">
                      <span><strong className="text-white">12</strong> Repositories</span>
                      <span><strong className="text-white">480</strong> Followers</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/8">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Pinned Repositories</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mockRepos.map(repo => (
                      <div key={repo.name} className="p-3.5 rounded-xl bg-white/5 border border-white/8 space-y-2 hover:border-violet-500/30 transition">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-violet-400 font-mono">
                          <FiGitBranch size={13} /> {repo.name}
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">{repo.desc}</p>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono pt-1">
                          <span className="flex items-center gap-1 text-yellow-400"><FiStar size={11} className="fill-current" /> {repo.stars}</span>
                          <span>Forks: {repo.forks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. INSTAGRAM MOCKUP */}
            {platform === 'instagram' && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-[#0f0e21] p-1 flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xl">
                        <FiZap size={28} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">@neuroux</h3>
                      <span className="px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-lg">Follow</span>
                    </div>
                    <div className="flex gap-6 text-xs text-zinc-300">
                      <span><strong className="text-white">42</strong> posts</span>
                      <span><strong className="text-white">12.4k</strong> followers</span>
                      <span><strong className="text-white">18</strong> following</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">
                      NeuroUX UI/UX Component Marketplace ✨<br />
                      Production-ready React & Tailwind UI Snippets 🚀
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/8">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Recent Posts</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {mockInstaPosts.map((src, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/8 relative group">
                        <img src={src} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-xs font-bold text-white">
                          <FiHeart className="fill-current text-rose-500" size={14} /> 1.2k
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. TWITTER / X MOCKUP */}
            {platform === 'twitter' && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-white/8">
                  <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    <FiZap size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      NeuroUX <FiCheckCircle className="text-violet-400 fill-current" size={16} />
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">@neuroux · 8.9k Followers</p>
                    <p className="text-xs text-zinc-300 mt-1">Building the next generation of personalized UI components.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockTweets.map((tweet, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-3">
                      <div className="flex justify-between text-xs text-zinc-400 font-mono">
                        <span className="font-bold text-white">NeuroUX Official</span>
                        <span>{tweet.time}</span>
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed">{tweet.text}</p>
                      <div className="flex gap-6 text-xs text-zinc-400 pt-2 border-t border-white/5 font-mono">
                        <span className="flex items-center gap-1.5"><FiMessageSquare size={13} /> 24</span>
                        <span className="flex items-center gap-1.5"><FiRepeat size={13} /> {tweet.stats.retweets}</span>
                        <span className="flex items-center gap-1.5 text-rose-400"><FiHeart size={13} /> {tweet.stats.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. LINKEDIN MOCKUP */}
            {platform === 'linkedin' && (
              <div className="space-y-5">
                <div className="flex items-start gap-4 pb-4 border-b border-white/8">
                  <div className="w-16 h-16 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                    <FiLinkedin size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">NeuroUX Inc.</h3>
                    <p className="text-xs text-violet-300 font-mono">Software & UI/UX Design Systems</p>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">San Francisco, CA · 15,240 Followers</p>
                    <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                      NeuroUX empowers engineering teams with customizable, high-performance React UI components powered by hybrid recommendation algorithms.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-3">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Featured Organization Update</span>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    We are thrilled to announce the completion of our Dual-Layer Personalization Engine update! Seamlessly blending real-time behavioral signals with collaborative filtering.
                  </p>
                </div>
              </div>
            )}

            {/* 5. YOUTUBE MOCKUP */}
            {platform === 'youtube' && (
              <div className="space-y-5">
                <div className="h-24 rounded-2xl bg-gradient-to-r from-violet-800 via-purple-900 to-indigo-900 border border-white/10 relative overflow-hidden flex items-end p-4">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold shadow-lg">
                      <FiYoutube size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">NeuroUX Design Systems</h3>
                      <p className="text-xs text-zinc-300 font-mono">24.5k subscribers · 48 videos</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Popular Tutorials</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {mockVideos.map((vid, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/8 space-y-2 hover:border-violet-500/30 transition group cursor-pointer">
                        <div className="aspect-video rounded-lg bg-black/60 relative overflow-hidden flex items-center justify-center border border-white/5">
                          <FiPlay size={24} className="text-rose-500 group-hover:scale-110 transition" />
                        </div>
                        <h5 className="text-xs font-semibold text-white line-clamp-1">{vid.title}</h5>
                        <p className="text-[10px] text-zinc-400 font-mono">{vid.views} · {vid.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
