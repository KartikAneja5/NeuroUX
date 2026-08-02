import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on initial load
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const loginAction = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logoutAction = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('neuroux_cart');
    localStorage.removeItem('neuroux_wishlist');
    localStorage.removeItem('neuroux_recent_views');
    localStorage.removeItem('neuroux_interactions');
    localStorage.removeItem('neuroux_search_history');
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event('userLogout'));
  };


  return (
    <AuthContext.Provider value={{ user, token, loading, loginAction, logoutAction }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
