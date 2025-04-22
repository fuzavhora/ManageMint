import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaClock, FaBan } from 'react-icons/fa';
import AdminLayout from '../../components/Admin/AdminLayout';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    rejectedUsers: 0
  });
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  console.log("token", token);
  

  const fetchStats = useCallback(async () => {
    try {
      if (!token) {
        toast.error('No token found');
        return; 
      }
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
      toast.error('Failed to fetch dashboard stats');
      console.error('Error fetching stats:', error);
    }
  }, [fetchUser]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
              </div>
              <FaUsers className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Pending Approvals</p>
                <h3 className="text-2xl font-bold">{stats.pendingUsers}</h3>
              </div>
              <FaClock className="text-yellow-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Rejected Users</p>
                <h3 className="text-2xl font-bold">{stats.rejectedUsers}</h3>
              </div>
              <FaBan className="text-red-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/pending-users')}
              className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaClock className="mr-2" />
              <span>Review Pending Applications</span>
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FaUsers className="mr-2" />
              <span>Manage Users</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
