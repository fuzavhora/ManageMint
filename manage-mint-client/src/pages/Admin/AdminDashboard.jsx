import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaClock, FaBan, FaTachometerAlt, FaBars, FaTimes } from 'react-icons/fa';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    rejectedUsers: 0
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0 -ml-64'} bg-gray-800 text-white fixed h-full transition-all duration-300 z-30 md:relative md:ml-0`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <button onClick={toggleSidebar} className="md:hidden">
              <FaTimes size={20} />
            </button>
          </div>
          <nav className="space-y-4">
            <button onClick={() => handleNavigation('/admin')} 
              className="flex items-center space-x-2 w-full p-3 rounded hover:bg-gray-700">
              <FaTachometerAlt />
              <span>Dashboard</span>
            </button>
            <button onClick={() => handleNavigation('/admin/users')} 
              className="flex items-center space-x-2 w-full p-3 rounded hover:bg-gray-700">
              <FaUsers />
              <span>All Users</span>
            </button>
            <button onClick={() => handleNavigation('/admin/pending-users')} 
              className="flex items-center space-x-2 w-full p-3 rounded hover:bg-gray-700">
              <FaClock />
              <span>Pending Users</span>
            </button>
            <button onClick={() => handleNavigation('/admin/rejected-users')} 
              className="flex items-center space-x-2 w-full p-3 rounded hover:bg-gray-700">
              <FaBan />
              <span>Rejected Users</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <div className="flex items-center justify-between">
            <button onClick={toggleSidebar} className="md:hidden">
              <FaBars size={20} />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome,</span>
              <span className="font-semibold">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                </div>
                <FaUsers className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Pending Approvals</p>
                  <h3 className="text-2xl font-bold">{stats.pendingUsers}</h3>
                </div>
                <FaClock className="text-yellow-500" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Rejected Users</p>
                  <h3 className="text-2xl font-bold">{stats.rejectedUsers}</h3>
                </div>
                <FaBan className="text-red-500" size={24} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleNavigation('/admin/pending-users')}
                className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FaClock />
                <span>Review Pending Applications</span>
              </button>
              <button
                onClick={() => handleNavigation('/admin/users')}
                className="flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FaUsers />
                <span>Manage Users</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
