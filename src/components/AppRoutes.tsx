
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Properties from '../pages/Properties';
import { PropertyFormContainer } from '../pages/property/PropertyFormContainer';
import Settings from '../pages/Settings';
import Users from '../pages/Users';
import Auth from '../pages/Auth';
import NotFound from '../pages/NotFound';
import React from 'react';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
      <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
      <Route path="/properties/new" element={<ProtectedRoute><PropertyFormContainer /></ProtectedRoute>} />
      <Route path="/properties/:id" element={<ProtectedRoute><PropertyFormContainer /></ProtectedRoute>} />
      <Route path="/properties/:id/edit" element={<ProtectedRoute><PropertyFormContainer /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
