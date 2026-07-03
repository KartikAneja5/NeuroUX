import React from 'react';
import { Navigate } from 'react-router-dom';
export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return (token && role === 'admin') ? children : <Navigate to="/" />;
}
