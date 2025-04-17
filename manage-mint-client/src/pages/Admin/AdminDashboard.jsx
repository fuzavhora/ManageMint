import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    rejectedUsers: 0
  });
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, pending, rejected] = await Promise.all([
          fetchUser('admin/get-users'),
          fetchUser('admin/pending-users'),
          fetchUser('admin/rejected-users')
        ]);

        setStats({
          totalUsers: users?.data?.length || 0,
          pendingUsers: pending?.data?.length || 0,
          rejectedUsers: rejected?.data?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          <button 
            onClick={() => handleNavigation('/admin/users')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            View All Users →
          </button>
        </div>

        {/* Pending Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Pending Approvals</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingUsers}</p>
          <button 
            onClick={() => handleNavigation('/admin/pending-users')}
            className="mt-4 text-yellow-600 hover:text-yellow-800"
          >
            Review Pending →
          </button>
        </div>

        {/* Rejected Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Rejected Users</h3>
          <p className="text-3xl font-bold text-red-600">{stats.rejectedUsers}</p>
          <button 
            onClick={() => handleNavigation('/admin/rejected-users')}
            className="mt-4 text-red-600 hover:text-red-800"
          >
            View Rejected →
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleNavigation('/admin/pending-users')}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Review Pending Applications
          </button>
          <button
            onClick={() => handleNavigation('/admin/users')}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
};
