import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { login } from '../api/authApi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginAction } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email, password });
      const { token, user } = response.data;
      
      loginAction(token, user);
      
      // Navigate to admin if admin, otherwise to home
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            NeuroUX
          </Link>
          <h2 className="text-2xl font-bold mt-3 text-slate-100">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to access your purchased components</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200 text-slate-100 placeholder-slate-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200 text-slate-100 placeholder-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 text-white rounded-lg py-3 text-sm font-semibold hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition duration-200 flex items-center justify-center"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-400 relative z-10">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-150">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
