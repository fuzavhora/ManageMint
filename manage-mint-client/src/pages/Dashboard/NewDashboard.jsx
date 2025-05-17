// CompleteDashboard.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaMoneyCheckAlt,
  FaCreditCard,
  FaListAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const navItems = [
  { label: "Overview", icon: <FaChartPie /> },
  { label: "Expenses", icon: <FaMoneyCheckAlt /> },
  { label: "Bank Accounts", icon: <FaCreditCard /> },
  { label: "Transactions", icon: <FaListAlt /> },
];

const CompleteDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, logout, getUserAccount } = useAuth();
  const navigate = useNavigate();

  const logOutUser = () => {
    logout();
    navigate("/login");
  };

  const fetchAccountData = async () => {
    try {
      console.log("fetchAccoundata is called...");
      
      setLoading(true);
      setError(null);
      console.log("user from fe");
      
      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }
      const res = await getUserAccount(user.id);
      console.log("response : ", res);
      
      if (!res) {
        throw new Error("Invalid response from server");
      }
      setAccountData(res);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Error loading account data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    console.log("user");
    console.log("user :", user);
    
    if (user) {
      console.log("user found");
      
      fetchAccountData();
    }
  }, [user]);

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const cardsData = accountData
    ? [
        {
          title: "Bank Balance",
          value: formatCurrency(accountData.bankBalance),
          color: "bg-blue-100 text-blue-800",
        },
        {
          title: "Credit Outstanding",
          value: formatCurrency(accountData.creditCardOutstanding),
          color: "bg-yellow-100 text-yellow-800",
        },
        {
          title: "Cash In Hand",
          value: formatCurrency(accountData.totalCashInHand),
          color: "bg-green-100 text-green-800",
        },
        {
          title: "Total Expenses",
          value: formatCurrency(accountData.expenses),
          color: "bg-red-100 text-red-800",
        },
        {
          title: "Total Income",
          value: formatCurrency(accountData.totalIncome),
          color: "bg-purple-100 text-purple-800",
        },
        {
          title: "Savings",
          value: formatCurrency(accountData.totalSaving),
          color: "bg-indigo-100 text-indigo-800",
        },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 md:static top-0 left-0 min-h-screen w-64 bg-white shadow-md border-r border-gray-200 p-6 space-y-6 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">ManageMint</div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="text-sm text-gray-500 italic">
          “Track your money, grow your future.”
        </div>
        <nav className="mt-10 space-y-4">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-3 w-full text-gray-700 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-all"
            >
              <span className="text-indigo-500 text-lg">{item.icon}</span>
              <span className="text-md font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto w-full px-3 pb-4 space-y-2">
          <button className="w-full text-left text-sm text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
            Profile
          </button>
          <button
            onClick={logOutUser}
            className="w-full text-sm font-medium text-white bg-indigo-500 px-4 py-2 rounded-lg transition-all hover:bg-indigo-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-3 w-full justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-2xl text-gray-600"
              >
                <FaBars />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold">
                  Welcome back 👋
                </h1>
                <span className="text-sm text-gray-500">
                  ManageMint — Empowering Finances
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-500 mt-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 mt-10">{error}</div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cardsData.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`rounded-xl p-4 shadow-md ${card.color}`}
                >
                  <h3 className="text-sm font-medium">{card.title}</h3>
                  <p className="text-xl font-semibold">{card.value}</p>
                </motion.div>
              ))}
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Recent Expenses</h2>
              <div className="bg-white shadow-sm rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span>Marketing Campaign</span>
                  <span className="text-red-500">-₹10,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Software Subscription</span>
                  <span className="text-red-500">-₹5,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Utilities</span>
                  <span className="text-red-500">-₹2,000</span>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default CompleteDashboard;
