import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logoutAction } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
          NeuroUX
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-sm">
          <Link to="/" className="text-slate-300 hover:text-white transition-colors duration-150">
            Catalog
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Admin Dashboard
                </Link>
              )}
              <span className="text-slate-400">
                Hi, <span className="text-slate-200 font-medium">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition duration-150 text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors duration-150">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-600/10 transition duration-150 text-xs"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
