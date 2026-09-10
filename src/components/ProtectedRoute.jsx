import React from 'react';
import { Navigate } from 'react-router';

export default function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}