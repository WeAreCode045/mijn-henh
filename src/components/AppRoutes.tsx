
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Properties } from '../pages/Properties';
import { PropertyFormContainer } from '../pages/property/PropertyFormContainer';
import { Settings } from '../pages/Settings';
import { Users } from '../pages/Users';
import { Auth } from '../pages/Auth';
import { NotFound } from '../pages/NotFound';
import React from 'react';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute element={<Properties />} />} />
      <Route path="/properties" element={<ProtectedRoute element={<Properties />} />} />
      <Route path="/properties/new" element={<ProtectedRoute element={<PropertyFormContainer />} />} />
      <Route path="/properties/:id" element={<ProtectedRoute element={<PropertyFormContainer />} />} />
      <Route path="/properties/:id/edit" element={<ProtectedRoute element={<PropertyFormContainer />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
      <Route path="/users" element={<ProtectedRoute element={<Users />} />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
