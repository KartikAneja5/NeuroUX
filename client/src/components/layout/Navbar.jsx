import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiZap, FiLogOut, FiUser } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { user, logoutAction } = useContext(AuthContext) || {};
  const { cart } = useContext(CartContext) || { cart: { items: [] } };
  const navigate = useNavigate();

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    if (logoutAction) logoutAction();
    navigate('/');
  };

  const links = [
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Pricing' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[rgba(8,7,18,0.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.07)] shadow-[0_1px_40px_rgba(0,0,0,0.6)]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-glow-sm">
              <FiZap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Neuro<span className="text-violet-400">UX</span>
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <NavLink 
                key={link.to} 
                to={link.to}
                className={({ isActive }) => 
                  `px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${isActive ? 'text-white bg-white/8' : 'text-[#8b7fb5] hover:text-white hover:bg-white/5'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user && (
              <NavLink 
                to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                className={({ isActive }) => 
                  `px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${isActive ? 'text-white bg-white/8' : 'text-[#8b7fb5] hover:text-white hover:bg-white/5'}`
                }
              >
                Dashboard
              </NavLink>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-[#8b7fb5] hover:text-white transition rounded-md hover:bg-white/5">
              <FiSearch size={18} />
            </button>
            <Link to="/customer/cart" className="relative p-2 text-[#8b7fb5] hover:text-white transition rounded-md hover:bg-white/5">
              <FiShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="w-px h-5 bg-white/10"></div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white flex items-center gap-2">
                  <FiUser className="text-violet-400" />
                  {user.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-rose-400 hover:text-rose-300 transition px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20"
                >
                  <FiLogOut size={14} /> Log out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-[#8b7fb5] hover:text-white transition px-3 py-1.5">
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition shadow-glow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden p-2 text-[#8b7fb5] hover:text-white"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0d0b1a] border-b border-white/8 px-4 pb-4 space-y-1">
          {links.map(link => (
            <NavLink 
              key={link.to} 
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-white bg-white/8' : 'text-[#8b7fb5]'}`}
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <NavLink 
              to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-white bg-white/8' : 'text-[#8b7fb5]'}`}
            >
              Dashboard
            </NavLink>
          )}
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <button 
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full text-center text-sm py-2 bg-rose-600/10 border border-rose-500/20 text-rose-400 rounded-lg font-semibold"
              >
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center text-sm py-2 text-[#8b7fb5] border border-white/8 rounded-lg">Log in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center text-sm py-2 bg-violet-600 text-white rounded-lg font-semibold">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
