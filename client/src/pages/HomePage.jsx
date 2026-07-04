import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Decorative Blur Backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-400">
            <span>✨ Phase 1 Authentication Ready</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-slate-100">
            Original UI/UX Components
            <span className="block mt-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Personalized for your stack.
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-lg text-slate-400 font-normal leading-relaxed">
            Discover a hand-crafted marketplace of premium elements with live interactive previews and downloadable React & HTML code templates. Powered by a hybrid ML recommendation engine.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition duration-150 text-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 px-8 py-4 rounded-xl font-bold active:scale-[0.98] transition duration-150 text-sm"
            >
              Sign In Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
