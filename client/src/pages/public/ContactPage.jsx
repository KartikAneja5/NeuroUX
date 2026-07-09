import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiMessageSquare, FiGithub, FiCheckCircle } from 'react-icons/fi';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#080712] text-white pt-24 pb-20 relative">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      
      {/* Background glow blobbies */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Get in Touch</p>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">help you</span>?
          </h1>
          <p className="text-[#8b7fb5] text-base font-light leading-relaxed">
            Have a question about component licensing, custom animations, or experienced an issue with a purchase? Drop us a line.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Info Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Box 1: Support channels */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Support Channels</h3>
              
              <div className="flex items-start gap-3 text-xs">
                <div className="p-2 bg-violet-600/10 text-violet-400 rounded-lg">
                  <FiMail size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Email Support</h4>
                  <a href="mailto:support@neuroux.com" className="text-[#8b7fb5] hover:text-white transition">support@neuroux.com</a>
                  <p className="text-[10px] text-zinc-500 mt-1">Average response time: &lt; 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="p-2 bg-violet-600/10 text-violet-400 rounded-lg">
                  <FiMessageSquare size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Community Chat</h4>
                  <a href="https://discord.gg/neuroux" target="_blank" rel="noopener noreferrer" className="text-[#8b7fb5] hover:text-white transition">Join our Discord Server</a>
                  <p className="text-[10px] text-zinc-500 mt-1">Instant chat with core developers and creators.</p>
                </div>
              </div>
            </div>

            {/* Box 2: Social/Github */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white mb-1">Open Source</h3>
              <p className="text-xs text-[#8b7fb5] leading-relaxed">
                Many of our foundational canvas wave scripts are open-sourced under the MIT license on GitHub. Check them out, star the repository, or contribute!
              </p>
              <a 
                href="https://github.com/neuroux" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-xs font-semibold text-white hover:text-violet-400 transition"
              >
                <FiGithub size={15} /> github.com/neuroux
              </a>
            </div>

          </div>

          {/* RIGHT: Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit} 
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b7fb5]">Your Name</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b7fb5]">Email Address</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b7fb5]">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Licensing Question / Custom Project"
                        className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b7fb5]">Your Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="How can we help? Explain your project or licensing question in detail..."
                        className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white font-bold text-xs rounded-xl border border-violet-400 shadow-glow transition flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    className="text-center py-12 flex flex-col items-center justify-center space-y-4"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <FiCheckCircle size={48} className="text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
                    <p className="text-xs text-[#8b7fb5] max-w-sm leading-relaxed">
                      Thank you for contacting NeuroUX. One of our core developer-support engineers will review your request and get back to you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2 bg-white/5 border border-white/8 hover:bg-white/10 text-white font-semibold text-xs rounded-lg transition"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
