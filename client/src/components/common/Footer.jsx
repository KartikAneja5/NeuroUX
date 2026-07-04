import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          &copy; 2026 <span className="text-indigo-400 font-semibold">NeuroUX</span>. All rights reserved.
        </div>
        <div className="flex space-x-6 text-xs">
          <a href="#" className="hover:text-white transition-colors duration-150">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors duration-150">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors duration-150">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}
