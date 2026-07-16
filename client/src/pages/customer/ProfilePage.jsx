import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext) || { user: { name: 'Customer', email: 'customer@example.com' } };

  // Profile Form State
  const [name, setName] = useState(user?.name || 'Kartik Aneja');
  const [email, setEmail] = useState(user?.email || 'kartik@example.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatarSeed, setAvatarSeed] = useState(user?.avatarSeed || 'Kartik');
  
  // UI States
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // Update AuthContext user state if available
      if (setUser) {
        setUser(prev => ({
          ...prev,
          name,
          email,
          avatarSeed
        }));
      }

      // Persist in local storage
      const storedUser = JSON.parse(localStorage.getItem('neuroux_user') || '{}');
      const updatedUser = { ...storedUser, name, email, avatarSeed };
      localStorage.setItem('neuroux_user', JSON.stringify(updatedUser));

      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative">
      {/* Background accents */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-xl mx-auto px-4 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">
          My <span className="text-violet-400">Profile</span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#0c0b1e]/40 backdrop-blur-md"
        >
          {/* Avatar Customization */}
          <div className="flex flex-col items-center gap-4 mb-8 text-center pb-6 border-b border-white/5">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-violet-500/30 p-0.5 bg-black/45 shadow-glow-sm"
            />
            <div className="w-full max-w-xs space-y-1.5">
              <label className="text-[10px] font-semibold text-[#8b7fb5] uppercase tracking-wider">Avatar Customization Seed</label>
              <input
                type="text"
                value={avatarSeed}
                onChange={(e) => setAvatarSeed(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-center focus:outline-none focus:border-violet-500/50 font-mono"
                placeholder="Type anything to randomize avatar"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                />
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                />
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8b7fb5] uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-glow hover:shadow-glow-lg border border-violet-400/20"
            >
              {loading ? 'Saving Changes...' : 'Save Workspace Changes'}
            </button>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-semibold mt-4 bg-emerald-500/5 border border-emerald-500/20 py-2 rounded-lg"
              >
                <FiCheckCircle size={16} /> Profile changes saved successfully!
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
