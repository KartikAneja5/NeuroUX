import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  
  if (loading) return <div>Loading session...</div>;
  return token ? children : <Navigate to="/login" />;}
