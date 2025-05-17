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
  Smartphone,
  BarChart3,
  Activity,
  ArrowDownLeft,
  LogOut,
  User,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import AddCreditCardModal from "../../components/Modals/AddCreditCardModal";
import CardTransactions from "../../components/Cards/CardTransactions";
import AddTransactionModal from "../../components/Modals/AddTransactionModal";
import AddMobileTrans from "../../components/Modals/AddMobileTrans";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Sidebar navigation items
const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: <BarChart3 className="w-5 h-5" /> },
  { key: "cards", label: "Cards", icon: <CreditCard className="w-5 h-5" /> },
  { key: "accounts", label: "Accounts", icon: <Building2 className="w-5 h-5" /> },
  { key: "expenses", label: "Expenses", icon: <ArrowDownLeft className="w-5 h-5" /> },
  { key: "mobile", label: "Mobile", icon: <Smartphone className="w-5 h-5" /> },
];

const MOTIVATIONAL_QUOTES = [
  "Success is not the key to happiness. Happiness is the key to success.",
  "The best way to get started is to quit talking and begin doing.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
];

const Dashboard = () => {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    userAccount: null,
    cardsRes: [],
    transactions: [],
    mobileTransactions: [],
  });
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isAddMobileModalOpen, setIsAddMobileModalOpen] = useState(false);

  // Pick a random quote on each load
  const [quote, setQuote] = useState("");
  useEffect(() => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [accountRes, cardsRes, transactionsRes, mobileTransactions] =
        await Promise.all([
          fetchUser(`user/accounts/${dashboardData.userAccount?._id}`),
          fetchUser("user/credit-cards"),
          fetchUser("user/transactions/recent"),
          fetchUser("user/mobile/mobile-transactions"),
        ]);

      if (!accountRes?.data?.userAccount)
        return toast.error("Failed to load user account");
      if (!cardsRes?.data?.cards)
        return toast.error("Failed to load credit cards");

      setDashboardData({
        userAccount: accountRes.data.userAccount,
        cardsRes: cardsRes.data.cards,
        transactions: transactionsRes.data.transactions || [],
        mobileTransactions: mobileTransactions.data || [],
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
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-white border-r flex flex-col py-6 px-2 md:px-4">
        <div className="flex items-center gap-2 mb-8">
          <Activity className="w-8 h-8 text-blue-600" />
          <span className="hidden md:inline text-xl font-bold text-blue-700">ManageMint</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium ${
                activeTab === item.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <User className="w-5 h-5" />
            <span className="hidden md:inline">Profile</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 py-4 px-6 flex items-center justify-center">
          <span className="text-lg italic text-blue-700 font-medium text-center">{quote}</span>
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            {NAV_ITEMS.find((item) => item.key === activeTab)?.icon}
            {NAV_ITEMS.find((item) => item.key === activeTab)?.label}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddTransactionModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 px-4 md:px-8 py-4">
          {activeTab === "overview" && (
            <OverviewTab dashboardData={dashboardData} />
          )}
          {activeTab === "cards" && (
            <CardsTab
              cards={dashboardData.cardsRes}
              onAddCard={() => setIsAddCardModalOpen(true)}
            />
          )}
          {activeTab === "expenses" && (
            <ExpensesTab
              transactions={dashboardData.transactions}
              onAddTransaction={() => setIsAddTransactionModalOpen(true)}
            />
          )}
          {activeTab === "mobile" && (
            <MobileTab
              mobileTransactions={dashboardData.mobileTransactions}
              onAddMobile={() => setIsAddMobileModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddCreditCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <AddMobileTrans
        isOpen={isAddMobileModalOpen}
        onClose={() => setIsAddMobileModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow hover:shadow-md transition">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{formatCurrency(value)}</p>
    </div>
    <div className="bg-blue-50 text-blue-600 rounded-full p-3">{icon}</div>
  </div>
);

const OverviewTab = ({ dashboardData }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Income vs Expenses
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData.transactions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-500" />
          Credit Card Usage
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dashboardData.cardsRes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bankName" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="outstandingAmount"
                stroke="#22c55e"
                fill="#bbf7d0"
                name="Outstanding"
              />
              <Area
                type="monotone"
                dataKey="creditLimit"
                stroke="#2563eb"
                fill="#dbeafe"
                name="Credit Limit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-2 bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {dashboardData.transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction._id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <p
                className={`font-semibold ${
                  transaction.transactionType === "expense"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {transaction.transactionType === "expense" ? "-" : "+"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CardsTab = ({ cards, onAddCard }) => (
  <>
    {cards.length === 0 ? (
      <div className="text-center py-12">
        <CreditCard className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Credit Cards Found</h2>
        <button
          onClick={onAddCard}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg mx-auto hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Your First Card
        </button>
      </div>
    ) : (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Credit Cards</h2>
          <button
            onClick={onAddCard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Card
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div key={card._id} className="p-4 border rounded-lg bg-white hover:shadow-md transition">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">{card.bankName}</p>
                  <p className="text-sm text-gray-500">
                    Outstanding: {formatCurrency(card.outstandingAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Credit Limit</p>
                  <p className="font-medium">
                    {formatCurrency(card.creditLimit)}
                  </p>
                </div>
              </div>
              <CardTransactions transactions={card.transactions} />
            </div>
          ))}
        </div>
      </div>
    )}
  </>
);

const ExpensesTab = ({ transactions, onAddTransaction }) => (
  <>
    {transactions.length === 0 ? (
      <div className="text-center py-12">
        <ArrowDownLeft className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No transactions found</h2>
        <button
          onClick={onAddTransaction}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg mx-auto hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Your First Expense
        </button>
      </div>
    ) : (
      <div className="text-center py-8">
        <button
          onClick={onAddTransaction}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg mx-auto hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>
    )}
  </>
);

const MobileTab = ({ mobileTransactions, onAddMobile }) => (
  <>
    {mobileTransactions.length === 0 ? (
      <div className="text-center py-12">
        <Smartphone className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Mobile Transactions Found</h2>
        <button
          onClick={onAddMobile}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg mx-auto hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Your First Mobile Transaction
        </button>
      </div>
    ) : (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-blue-500" />
            Mobile Business
          </h2>
          <button
            onClick={onAddMobile}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Mobile Transaction
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mobileTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-white border rounded-2xl shadow-sm hover:shadow-md p-5 transition group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {transaction.mobileName}
                  </h3>
                  <p className="text-sm text-gray-500">{transaction.name}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {transaction.cashback > 0 && (
                      <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                        💸 Cashback: {formatCurrency(transaction.cashback)}
                      </span>
                    )}
                    {transaction.isSold && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                        🛒 Sold: {formatCurrency(transaction.soldAmount)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      transaction.isSold
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {formatCurrency(transaction.price)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button className="text-sm font-medium text-red-500 bg-black/5 px-4 py-1.5 rounded hover:text-red-600 transition">
                  Mark as Sold
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </>
);

export default Dashboard;
