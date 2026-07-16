import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiSettings, FiSliders, FiEye } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('NeuroUX Marketplace');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowSignups, setAllowSignups] = useState(true);
  const [success, setSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="max-w-xl mx-auto px-4 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">
          Admin <span className="text-violet-400">Settings</span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#0c0b1e]/40 backdrop-blur-md space-y-6"
        >
          {/* Form */}
          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Site Name</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-white">Maintenance Mode</h4>
                  <p className="text-xs text-[#8b7fb5] font-light leading-relaxed">
                    Temporarily shut down client browsability and show a static offline screen.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors flex-shrink-0 duration-300 ${
                    maintenanceMode ? 'bg-rose-600' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                      maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-white">New User Registration</h4>
                  <p className="text-xs text-[#8b7fb5] font-light leading-relaxed">
                    Allow guest visitors to sign up for customer accounts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowSignups(!allowSignups)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors flex-shrink-0 duration-300 ${
                    allowSignups ? 'bg-violet-600' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                      allowSignups ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-glow hover:shadow-glow-lg border border-violet-400/20"
            >
              Save Configuration Settings
            </button>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-semibold mt-4 bg-emerald-500/5 border border-emerald-500/20 py-2 rounded-lg"
              >
                <FiCheckCircle size={16} /> Global settings saved successfully!
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
