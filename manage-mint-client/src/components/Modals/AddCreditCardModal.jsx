import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AddCreditCardModal = ({ isOpen, onClose, onSuccess }) => {
  const { fetchUser } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetchUser('user/add-credit-card', data, 'POST');
      
      if (response?.status === 200 || response?.status === 201) {
        toast.success('Credit card added successfully');
        reset();
        onSuccess();
        onClose();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage === "Credit card already exists") {
        toast.error("This credit card is already registered");
      } else {
        toast.error(errorMessage || 'Failed to add credit card');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Add Credit Card</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              {...register('bankName', { required: 'Bank name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>

            <input
              type="text"
              maxLength="16"
              {...register('cardNumber', { 
                required: 'Card number is required',
                pattern: {
                  value: /^\d{16}$/,
                  message: 'Please enter a valid 16-digit card number'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Card Type</label>
            <select
              {...register('cardType', { required: 'Card type is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select card type</option>
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
              <option value="American Express">American Express</option>
              <option value="Discover">Discover</option>
              <option value="rupay">Rupay</option>
            </select>
            {errors.cardType && <p className="text-red-500 text-sm">{errors.cardType.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                {...register('expiryDate', { 
                  required: 'Expiry date is required',
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                    message: 'Please enter a valid date (MM/YY)'
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="password"
                maxLength="3"
                {...register('cvv', { 
                  required: 'CVV is required',
                  pattern: {
                    value: /^\d{3}$/,
                    message: 'Please enter a valid 3-digit CVV'
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Card Holder Name</label>
            <input
              {...register('cardHolderName', { required: 'Card holder name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.cardHolderName && <p className="text-red-500 text-sm">{errors.cardHolderName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
            <input
              type="number"
              {...register('creditLimit', { 
                required: 'Credit limit is required',
                min: {
                  value: 1000,
                  message: 'Credit limit must be at least 1000'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.creditLimit && <p className="text-red-500 text-sm">{errors.creditLimit.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Outstanding Amount</label>
            <input
              type="number"
              {...register('outstandingAmount', { 
                required: 'Outstanding amount is required',
                min: {
                  value: 0,
                  message: 'Outstanding amount cannot be negative'
                },
                validate: (value, formValues) => 
                  parseInt(value) <= parseInt(formValues.creditLimit) || 
                  'Outstanding amount cannot exceed credit limit'
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.outstandingAmount && <p className="text-red-500 text-sm">{errors.outstandingAmount.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add Card
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCreditCardModal;