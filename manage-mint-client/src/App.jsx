// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// Import your components/pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import RegistrationSuccess from "./pages/Auth/RegistrationSuccess";
import AdminLogin from "./pages/Admin/AdminLogin";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { Home } from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import BankAccounts from './pages/Dashboard/BankAccounts';
import BankAccountDetails from './pages/Dashboard/BankAccountDetails';
import PendingUsers from "./pages/Admin/PendingUsers";
import ApprovedUsers from "./pages/Admin/ApprovedUsers";
import RejectedUsers from "./pages/Admin/RejectedUsers";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        {/* <Practis /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
              
            </ProtectedRoute>
          } />
          <Route path="/register-success" element={<RegistrationSuccess />} />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/pending-users" element={
            <AdminProtectedRoute>
              <PendingUsers />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <AdminProtectedRoute>
              <ApprovedUsers />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/rejected-users" element={
            <AdminProtectedRoute>
              <RejectedUsers />
            </AdminProtectedRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard/bank-accounts" element={
            <ProtectedRoute>
              <BankAccounts />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/bank-accounts/:id" element={
            <ProtectedRoute>
              <BankAccountDetails />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
