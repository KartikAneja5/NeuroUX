import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiBell, FiUnlock, FiSliders } from 'react-icons/fi';

export default function CustomerSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [updateAlerts, setUpdateAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative">
      {/* Background accents */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-xl mx-auto px-4 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">
          Workspace <span className="text-violet-400">Settings</span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#0c0b1e]/40 backdrop-blur-md space-y-6"
        >
          {/* Notification section */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-4 text-[#8b7fb5]">
              <FiBell size={16} className="text-violet-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Email Preferences</span>
            </div>
            
            <div className="space-y-4">
              {[
                { state: emailAlerts, setState: setEmailAlerts, title: 'Order Invoices', desc: 'Receive invoice copies by email immediately after checkout.' },
                { state: updateAlerts, setState: setUpdateAlerts, title: 'Component Release Alerts', desc: 'Get notified when purchased components receive source updates.' },
                { state: marketingEmails, setState: setMarketingEmails, title: 'Developer Digest', desc: 'A weekly round-up of the best premium UI components added to the catalog.' },
              ].map((pref, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-white">{pref.title}</h4>
                    <p className="text-xs text-[#8b7fb5] font-light leading-relaxed">{pref.desc}</p>
                  </div>
                  <button
                    onClick={() => pref.setState(!pref.state)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors flex-shrink-0 duration-300 ${
                      pref.state ? 'bg-violet-600' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                        pref.state ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Licenses Section */}
          <div className="pt-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-4 text-[#8b7fb5]">
              <FiUnlock size={16} className="text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider">License Management</span>
            </div>
            <div className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-zinc-400">Current Plan</span>
                <span className="text-violet-400 font-bold uppercase">Developer Pro License</span>
              </div>
              <p className="text-[#8b7fb5] font-light leading-relaxed">
                Your license allows unlimited project usage. Reselling standalone component bundles or source files is strictly prohibited under our terms.
              </p>
            </div>
          </div>

          {/* CTA Submit Button */}
          <form onSubmit={handleSaveSettings}>
            <button
              type="submit"
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-glow hover:shadow-glow-lg border border-violet-400/20"
            >
              Save Configuration Settings
            </button>
          </form>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-semibold mt-4 bg-emerald-500/5 border border-emerald-500/20 py-2 rounded-lg"
            >
              <FiCheckCircle size={16} /> Configuration settings saved!
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
