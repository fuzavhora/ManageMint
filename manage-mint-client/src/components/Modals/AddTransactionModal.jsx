import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AddTransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const { fetchUser } = useAuth();
  // Add to state declarations
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  
  // Add this state to formData
  const [formData, setFormData] = useState({
    transactionType: 'expense',
    amount: '',
    category: '',
    description: '',
    paymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    isBusiness: false,
    businessType: '',
    mobileName: '',
    platform: '',
    cashback: 0,
    isSold: false,
    soldAmount: 0
  });

  // Add this after the payment method select field
  {formData.paymentMethod === 'credit' && (
    <div>
      <label className="block text-sm font-medium text-gray-700">Select Card</label>
      <select
        value={selectedCard}
        onChange={(e) => setSelectedCard(e.target.value)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        required
      >
        <option value="">Choose a card</option>
        {savedCards.map((card) => (
          <option key={card._id} value={card._id}>
            {card.bankName} (**** {card.cardNumber.slice(-4)})
          </option>
        ))}
      </select>
    </div>
  )}

  // Add this function after state declarations
  const fetchSavedCards = async () => {
    try {
      const response = await fetchUser('user/credit-cards');
      if (response?.data) {
        setSavedCards(response.data);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };
  
  // Add useEffect after fetchSavedCards function
  useEffect(() => {
    if (isOpen && formData.paymentMethod === 'credit') {
      fetchSavedCards();
    }
  }, [isOpen, formData.paymentMethod]);

  // Modify handleSubmit to include selectedCard
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        cardId: formData.paymentMethod === 'credit' ? selectedCard : undefined
      };
      const response = await fetchUser('user/transactions', submitData, 'POST');

      if (response?.status === 201) {
        toast.success('Transaction added successfully');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to add transaction');
      console.error('Add transaction error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">Add Transaction</Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
              <select
                value={formData.transactionType}
                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Select category</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="entertainment">Entertainment</option>
                <option value="utilities">Utilities</option>
                <option value="shopping">Shopping</option>
                <option value="mobile">Mobile</option>
                <option value="gold">Gold</option>
                <option value="salary">Salary</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Select payment method</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
            >
              Add Transaction
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddTransactionModal;