export default function Newsletter() {
  return (
    <section className="py-24 bg-[#080712] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />
      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/12 blur-[100px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-strong rounded-3xl p-10 md:p-14 gradient-border relative overflow-hidden">
          {/* Inner glow blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/8 blur-3xl rounded-full" />

          <div className="relative z-10">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">Newsletter</p>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              Get the best assets delivered weekly
            </h2>
            <p className="text-[#8b7fb5] mb-8 max-w-md mx-auto">
              Join 20,000+ creators who get our curated list of premium UI resources every Tuesday.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-grow px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#5a5275] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm transition"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl whitespace-nowrap transition shadow-glow"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-[#3a3356] mt-4">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
