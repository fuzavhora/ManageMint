import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const BankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [newBankName, setNewBankName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const response = await fetchUser('/api/user/bank-accounts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBankAccounts(response.data.bankAccounts || []);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      toast.error('Failed to fetch bank accounts');
    }
  };

  const handleAddBankAccount = async (e) => {
    e.preventDefault();
    if (!newBankName.trim()) {
      toast.error('Bank name is required');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        '/api/user/bank-accounts',
        { bankName: newBankName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Bank account added successfully');
      setNewBankName('');
      fetchBankAccounts();
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast.error(error.response?.data?.message || 'Failed to add bank account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bank Accounts</h1>
      
      {/* Add Bank Account Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Bank Account</h2>
        <form onSubmit={handleAddBankAccount} className="space-y-4">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              value={newBankName}
              onChange={(e) => setNewBankName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter bank name"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Bank Account'}
          </button>
        </form>
      </div>

      {/* Bank Accounts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Bank Accounts</h2>
        {bankAccounts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No bank accounts added yet</p>
        ) : (
          <div className="space-y-4">
            {bankAccounts.map((account) => (
              <div
                key={account._id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{account.bankName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Balance: ₹{account.balance || 0}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/dashboard/bank-accounts/${account._id}`)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BankAccounts; 