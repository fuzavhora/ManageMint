import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CardTransactions = ({ transactions }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === 'credit'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {transaction.type === 'credit' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className={`font-semibold ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default CardTransactions;