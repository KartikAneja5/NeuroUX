import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiClock, FiShield } from 'react-icons/fi';
import { getAdminUsers } from '../../api/adminApi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAdminUsers();
        setUsers(response.data || []);
      } catch (err) {
        console.error("Failed to load user directory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080712]">
        <div className="w-12 h-12 border-4 border-violet-950 border-t-violet-500 rounded-full animate-spin shadow-glow-sm"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080712] pt-28 pb-24 text-white relative">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">
          Customer <span className="text-violet-400">Directory</span>
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300 bg-[#0c0b1e]/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
            <thead className="text-xs text-[#8b7fb5] uppercase bg-black/40 border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined On</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                      alt={u.name}
                      className="w-8 h-8 rounded-full border border-white/10"
                    />
                    {u.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      u.role === 'admin' 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                        : 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
