import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Loader2, Plus, ArrowUpRight, ArrowDownRight,
  CreditCard, Building2, Wallet, TrendingUp
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import axios from 'axios';
import { toast } from 'react-hot-toast';


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('transactions');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    userAccount: null,
    bankAccounts: [],
    creditCards: [],
    recentTransactions: [],
    monthlyStats: [],
  });

  const navigate = useNavigate();

  const isMounted = useRef(true);
  const fetchTimeout = useRef(null);

  const fetchDashboardData = useCallback(() => {
    if (!isMounted.current) return;

    setIsLoading(true);
    setError(null);

    if (fetchTimeout.current) {
      clearTimeout(fetchTimeout.current);
    }

    fetchTimeout.current = setTimeout(() => {
      (async () => {
        try {
          const [
            userAccountResponse,
            bankAccountsResponse,
            creditCardsResponse,
            transactionsResponse,
            monthlyStatsResponse,
          ] = await Promise.all([
            fetchUser('/api/user/account'),
            fetchUser('/api/user/bank-accounts'),
            fetchUser('/api/user/credit-cards'),
            fetchUser('/api/user/transactions/recent'),
            fetchUser('/api/user/transactions/monthly-stats'),
          ]);

          if (!isMounted.current) return;

          setDashboardData({
            userAccount: userAccountResponse?.data || null,
            bankAccounts: bankAccountsResponse?.data || [],
            creditCards: creditCardsResponse?.data || [],
            recentTransactions: transactionsResponse?.data || [],
            monthlyStats: monthlyStatsResponse?.data || [],
          });

        } catch (err) {
          console.error('Dashboard fetch error:', err);
          setError(err.message || 'Failed to load dashboard data');
        } finally {
          if (isMounted.current) {
            setIsLoading(false);
          }
        }
      })();
    }, 500);
  }, [fetchUser]);

  const addBankAccount = () => {
    console.log('Add Bank Account');
    navigate('/dashboard/bank-accounts');
  };

  useEffect(() => {
    isMounted.current = true;
    fetchDashboardData();

    return () => {
      isMounted.current = false;
      if (fetchTimeout.current) {
        clearTimeout(fetchTimeout.current);
      }
    };
  }, []);

  // Optional re-fetch functions
  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get('/api/user/transactions/recent', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDashboardData(prev => ({ ...prev, recentTransactions: response.data }));
    } catch (error) {
      console.error('Recent transactions error:', error);
      toast.error('Failed to fetch recent transactions');
    }
  };

  const fetchMonthlyStats = async () => {
    try {
      const response = await axios.get('/api/user/transactions/monthly-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDashboardData(prev => ({ ...prev, monthlyStats: response.data }));
    } catch (error) {
      console.error('Monthly stats error:', error);
      toast.error('Failed to fetch monthly statistics');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error Loading Dashboard</p>
          <p>{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</h3>
            <Wallet className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(dashboardData.userAccount?.totalSaving || 0)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank Balance</h3>
            <Building2 className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(dashboardData.userAccount?.bankBalance || 0)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Credit Card Outstanding</h3>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(dashboardData.userAccount?.creditCardOutstanding || 0)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cash in Hand</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(dashboardData.userAccount?.totalCashInHand || 0)}
          </div>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Recent Transactions
            </button>
            <button
              onClick={() => setActiveTab('bank-accounts')}
              className={`${
                activeTab === 'bank-accounts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Bank Accounts
            </button>
            <button
              onClick={() => setActiveTab('credit-cards')}
              className={`${
                activeTab === 'credit-cards'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Credit Cards
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'transactions' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
                <div className="space-y-4">
                  {Array.isArray(dashboardData.recentTransactions) && dashboardData.recentTransactions.length > 0 ? (
                    dashboardData.recentTransactions.map((transaction) => (
                      <div
                        key={transaction._id || Math.random()}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.transactionType === 'income'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {transaction.transactionType === 'income' ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {transaction.description || 'No description'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'No date'}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`font-medium ${
                            transaction.transactionType === 'income'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.transactionType === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount || 0)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No transactions found
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank-accounts' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bank Accounts</h2>
                <div className="space-y-4">
                  {(dashboardData.bankAccounts || []).map((account) => (
                    <div
                      key={account._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{account.bankName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Balance: {formatCurrency(account.balance)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button
                  onClick={addBankAccount}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bank Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'credit-cards' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Credit Cards</h2>
                <div className="space-y-4">
                  {(dashboardData.creditCards || []).map((card) => (
                    <div
                      key={card._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{card.bankName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Outstanding: {formatCurrency(card.outstandingAmount)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Due Date: {new Date(card.billDueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Credit Card
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Analytics</h2>
                <div className="h-[400px]">
                  {Array.isArray(dashboardData.monthlyStats) && dashboardData.monthlyStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dashboardData.monthlyStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="income"
                          stroke="#22c55e"
                          name="Income"
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="expense"
                          stroke="#ef4444"
                          name="Expense"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      No analytics data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 