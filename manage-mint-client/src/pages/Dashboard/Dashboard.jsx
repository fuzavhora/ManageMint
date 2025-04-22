// Due to the length of the original code exceeding message limits, here is the complete Dashboard.js file

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Plus,
  CreditCard,
  Building2,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import AddCreditCardModal from "../../components/Modals/AddCreditCardModal";
import CardTransactions from '../../components/Cards/CardTransactions';
import AddTransactionModal from "../../components/Modals/AddTransactionModal";
import AddMobileTrans from '../../components/Modals/AddMobileTrans';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const Dashboard = () => {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    userAccount: null,
    cardsRes: [],
    transactions: [],
  });
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isAddMobileModalOpen, setIsAddMobileModalOpen] = useState(false);

  const handleAddCardSuccess = () => fetchDashboardData();
  const handleAddTransactionSuccess = () => fetchDashboardData();
  const handleAddMobileSuccess = () => fetchDashboardData();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [accountRes, cardsRes, transactionsRes] = await Promise.all([
        fetchUser(`user/accounts/${dashboardData.userAccount?._id}`),
        fetchUser("user/credit-cards"),
        fetchUser("user/transactions/recent"),
      ]);

      if (!accountRes?.data?.userAccount) return toast.error("Failed to load user account");
      if (!cardsRes?.data?.cards) return toast.error("Failed to load credit cards");

      setDashboardData({
        userAccount: accountRes.data.userAccount,
        cardsRes: cardsRes.data.cards,
        transactions: transactionsRes.data.transactions || [],
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error("Dashboard error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard title="Total Balance" value={dashboardData.userAccount?.totalSaving} icon={<Wallet />} />
        <SummaryCard title="Bank Balance" value={dashboardData.userAccount?.bankBalance} icon={<Building2 />} />
        <SummaryCard title="Credit Card Outstanding" value={dashboardData.userAccount?.creditCardOutstanding} icon={<CreditCard />} />
        <SummaryCard title="Cash in Hand" value={dashboardData.userAccount?.totalCashInHand} icon={<TrendingUp />} />
      </div>

      <div className="space-y-4">
        <nav className="flex space-x-4 border-b">
          {["overview", "cards", "accounts", "expenses", "mobile"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.transactions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#8884d8" name="Amount" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Credit Card Usage</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardData.cardsRes}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bankName" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="outstandingAmount" stroke="#82ca9d" fill="#82ca9d" name="Outstanding" />
                        <Area type="monotone" dataKey="creditLimit" stroke="#8884d8" fill="#8884d8" name="Credit Limit" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="lg:col-span-2 bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {dashboardData.transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                        <p className={`font-semibold ${transaction.transactionType === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                          {transaction.transactionType === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cards" && (
            <>
              {dashboardData.cardsRes.length === 0 ? (
                <div className="text-center py-8">
                  <h2 className="text-xl font-semibold mb-4">No Credit Cards Found</h2>
                  <button onClick={() => setIsAddCardModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto">
                    <Plus className="h-4 w-4" />
                    Add Your First Card
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Credit Cards</h2>
                    <button onClick={() => setIsAddCardModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
                      <Plus className="h-4 w-4" />
                      Add Card
                    </button>
                  </div>
                  {dashboardData.cardsRes.map((card) => (
                    <div key={card._id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-medium">{card.bankName}</p>
                          <p className="text-sm text-gray-500">Outstanding: {formatCurrency(card.outstandingAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Credit Limit</p>
                          <p className="font-medium">{formatCurrency(card.creditLimit)}</p>
                        </div>
                      </div>
                      <CardTransactions transactions={card.transactions} />
                    </div>
                  ))}
                </div>
              )}
              <AddCreditCardModal isOpen={isAddCardModalOpen} onClose={() => setIsAddCardModalOpen(false)} onSuccess={handleAddCardSuccess} />
            </>
          )}

          {activeTab === "expenses" && (
            <>
              {dashboardData.transactions.length === 0 ? (
                <div className="text-center py-8">
                  <h2 className="text-xl font-semibold mb-4">No transactions found</h2>
                  <button onClick={() => setIsAddTransactionModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto">
                    <Plus className="h-4 w-4" />
                    Add Your First Expense
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <button onClick={() => setIsAddTransactionModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto">
                    <Plus className="h-4 w-4" />
                    Add Expense
                  </button>
                </div>
              )}
              <AddTransactionModal isOpen={isAddTransactionModalOpen} onClose={() => setIsAddTransactionModalOpen(false)} onSuccess={handleAddTransactionSuccess} />
            </>
          )}

          {activeTab === "mobile" && (
            <>
              <div className="text-center py-8">
                <button onClick={() => setIsAddMobileModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto">
                  <Plus className="h-4 w-4" />
                  Add Mobile Transaction
                </button>
              </div>
              <AddMobileTrans isOpen={isAddMobileModalOpen} onClose={() => setIsAddMobileModalOpen(false)} onSuccess={handleAddMobileSuccess} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <div className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-semibold">{formatCurrency(value)}</p>
    </div>
    <div className="text-blue-500">{icon}</div>
  </div>
);

export default Dashboard;