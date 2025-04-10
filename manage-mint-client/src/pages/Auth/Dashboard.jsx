import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white w-64 p-4 space-y-4 fixed top-0 left-0 h-full transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative z-40`}>
        <h1 className="text-2xl font-bold">ManageMint</h1>
        <nav className="mt-6 space-y-2">
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Dashboard</a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Users</a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Transactions</a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 bg-gray-100">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white p-4 shadow-md">
          <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="text-sm text-gray-600">Welcome, Admin</div>
        </header>

        {/* Main Section */}
        <main className="p-6 flex-grow">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold mb-2">Overview</h3>
            <p className="text-gray-600">This is your ManageMint dashboard. Add stats, charts, and features here.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
