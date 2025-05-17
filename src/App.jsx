import React from 'react';
import { Routes, Route, Navigate, Router } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import GeneratePage from './pages/GeneratePage';
import ProtectedRoute from './components/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <GeneratePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}