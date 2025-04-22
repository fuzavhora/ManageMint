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

// Add this import at the top
import AddCreditCardModal from "../../components/Modals/AddCreditCardModal";
import CardTransactions from '../../components/Cards/CardTransactions';

// Add this import
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AddTransactionModal from "../../components/Modals/AddTransactionModal";

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
  // Add this state
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

  // Add this function
  const handleAddCardSuccess = () => {
    fetchDashboardData();
  };

  // Add this function after handleAddCardSuccess
  const handleAddTransactionSuccess = () => {
    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [accountRes, cardsRes, transactionsRes] = await Promise.all([
        fetchUser(`user/accounts/${dashboardData.userAccount?._id}`),
        fetchUser("user/credit-cards"),
        fetchUser("user/transactions/recent"),
      ]);

      if (!accountRes?.data?.userAccount) {
        toast.error("Failed to load user account");
        return;
      }

      if (!cardsRes?.data?.cards) {
        toast.error("Failed to load credit cards");
        return;
      }

    
  
      setDashboardData({
        userAccount: accountRes.data.userAccount || null,
        cardsRes: cardsRes.data.cards ,
        transactions:  transactionsRes.data.transactions || [],
      });

      console.log("useraccount",dashboardData.userAccount);
      
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          title="Total Balance"
          value={dashboardData.userAccount?.totalSaving}
          icon={<Wallet />}
        />
        <SummaryCard
          title="Bank Balance"
          value={dashboardData.userAccount?.bankBalance}
          icon={<Building2 />}
        />
        <SummaryCard
          title="Credit Card Outstanding"
          value={dashboardData.userAccount?.creditCardOutstanding}
          icon={<CreditCard />}
        />
        <SummaryCard
          title="Cash in Hand"
          value={dashboardData.userAccount?.totalCashInHand}
          icon={<TrendingUp />}
        />
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <nav className="flex space-x-4 border-b">
          {["overview", "cards", "accounts", "expenses", "mobile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          
          {/* Add new content sections */}
          {activeTab === "expenses" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Expense Transactions</h2>
                <button
                  onClick={"/"}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  Add Expense
                </button>
              </div>
              <div className="grid gap-4">
                {dashboardData.transactions?.filter(t => t.transactionType === 'expense').map((transaction) => (
                  <div key={transaction._id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{transaction.description}</h3>
                        <p className="text-sm text-gray-500">{transaction.category}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-red-600 font-semibold">
                        -{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "mobile" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Mobile Business</h2>
                <button
                  onClick={() => navigate("/add-mobile-transaction")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  Add Mobile Transaction
                </button>
              </div>
              <div className="grid gap-4">
                {dashboardData.transactions?.filter(t => t.businessType === 'mobile').map((transaction) => (
                  <div key={transaction._id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{transaction.mobileName}</h3>
                        <p className="text-sm text-gray-500">{transaction.platform}</p>
                        <div className="flex gap-2 mt-1">
                          {transaction.cashback > 0 && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                              Cashback: {formatCurrency(transaction.cashback)}
                            </span>
                          )}
                          {transaction.isSold && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              Sold: {formatCurrency(transaction.soldAmount)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`${transaction.isSold ? "text-green-600" : "text-blue-600"} font-semibold`}>
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense vs Income Chart */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardData.transactions}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#8884d8" name="Amount" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Credit Card Usage Chart */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Credit Card Usage</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dashboardData.cardsRes}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bankName" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="outstandingAmount" 
                          stroke="#82ca9d" 
                          fill="#82ca9d" 
                          name="Outstanding"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="creditLimit" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          name="Credit Limit"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {dashboardData.transactions?.slice(0, 5).map((transaction) => (
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
                  <h2 className="text-xl font-semibold mb-4">
                    No Credit Cards Found
                  </h2>
                  <button
                    onClick={() => setIsAddCardModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Card
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Credit Cards</h2>
                    <button
                      onClick={() => setIsAddCardModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                      Add Card
                    </button>
                  </div>
                  {dashboardData.cardsRes.map((card) => (
                    <div key={card._id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-medium">{card.bankName}</p>
                          <p className="text-sm text-gray-500">
                            Outstanding: {formatCurrency(card.outstandingAmount)}
                          </p>
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

              <AddCreditCardModal
                isOpen={isAddCardModalOpen}
                onClose={() => setIsAddCardModalOpen(false)}
                onSuccess={handleAddCardSuccess}
              />
            </>
          )}
          
          {activeTab === "expenses" && (
            <>
              {dashboardData.transactions?.length === 0 ? (
                <div className="text-center py-8">
                  <h2 className="text-xl font-semibold mb-4">
                    No transactions found
                  </h2>
                  <button
                    onClick={() => setIsAddTransactionModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Expense
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Expenses</h2>
                    <button
                      onClick={() => setIsAddTransactionModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Expense
                    </button>
                  </div>
                  {/* Rest of your expenses content */}
                </div>
              )}
              
              <AddTransactionModal
                isOpen={isAddTransactionModalOpen}
                onClose={() => setIsAddTransactionModalOpen(false)}
                onSuccess={handleAddTransactionSuccess}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {icon}
    </div>
    <div className="text-2xl font-bold">{formatCurrency(value || 0)}</div>
  </div>
);

export default Dashboard;
