import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaClock, FaBan, FaTachometerAlt, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0 -ml-64'} bg-gray-800 text-white fixed h-full transition-all duration-300 z-30 md:relative md:ml-0`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
              <FaTimes size={20} />
            </button>
          </div>
          <nav className="space-y-4">
            <button onClick={() => navigate('/admin')} 
              className="flex items-center space-x-2 w-full p-3 rounded hover:bg-gray-700">
              <FaTachometerAlt />
              <span>Dashboard</span>
            </button>
            <button onClick={() => navigate('/admin/users')} 
              className="flex items-center space-x-2 w-full p-3 rounded hover:bg-gray-700">
              <FaUsers />
              <span>All Users</span>
            </button>
            <button onClick={() => navigate('/admin/pending-users')} 
              className="flex items-center space-x-2 w-full p-3 rounded hover:bg-gray-700">
              <FaClock />
              <span>Pending Users</span>
            </button>
            <button onClick={() => navigate('/admin/rejected-users')} 
              className="flex items-center space-x-2 w-full p-3 rounded hover:bg-gray-700">
              <FaBan />
              <span>Rejected Users</span>
            </button>
            <button onClick={handleLogout} 
              className="flex items-center space-x-2 w-full p-3 rounded hover:bg-red-600 mt-8">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
              <FaBars size={20} />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome,</span>
              <span className="font-semibold">{user?.name}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;