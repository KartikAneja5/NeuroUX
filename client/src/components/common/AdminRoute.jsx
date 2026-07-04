import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function AdminRoute({ children }) {
  const { user, token, loading } = useAuth();
  
  if (loading) return <div>Loading session...</div>;
  return (token && user?.role === 'admin') ? children : <Navigate to="/" />;}
