import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

const AddMobileTrans = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [creditCards, setCreditCards] = useState([]);
  const { fetchUser } = useAuth();

  useEffect(() => {
    const getCards = async () => {
      try {
        const response = await fetchUser("user/credit-cards");
        setCreditCards(response.data.cards || []);
      } catch (error) {
        console.error("Error fetching cards:", error);
        toast.error("Failed to fetch credit cards");
      }
    };

    if (isOpen) {
      getCards();
      reset(); // clear form when modal opens
    }
  }, [isOpen, fetchUser, reset]);

  const addMobile = async (data) => {
    try {
      const transactionData = {
        name: data.name,
        platform: data.platform,
        price: parseFloat(data.price),
        cashback: parseFloat(data.cashback) || 0,
        cardId: data.cardId, // ✅ corrected key
      };
      

      const response = await fetchUser(
        "user/mobile/add-mobile-transactions",
      transactionData
      );

      if (response?.status === 201 || response?.status === 200) {
        toast.success("Mobile transaction added successfully");
        onSuccess?.();
        onClose();
        reset();
      } else {
        throw new Error("Failed to add transaction");
      }
    } catch (error) {
      console.error("Add mobile transaction error:", error);
      toast.error(error?.message || "Failed to add mobile transaction");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Add Mobile Transaction
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(addMobile)} className="space-y-4">
            {/* Mobile Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Mobile name is required" })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter mobile name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <input
                type="text"
                {...register("platform", {
                  required: "Platform is required",
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="e.g., Amazon, Flipkart"
              />
              {errors.platform && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.platform.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Purchase Price
              </label>
              <input
                type="number"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 1, message: "Price must be greater than 0" },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter purchase price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Cashback */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cashback Amount
              </label>
              <input
                type="number"
                {...register("cashback")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter cashback amount (optional)"
              />
            </div>

            {/* Credit Card Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Credit Card
              </label>
              <select
                {...register("cardId", {
                  required: "Please select a credit card",
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Choose a card</option>
                {creditCards.map((card) => (
                  <option key={card._id} value={card._id}>
                    {card.bankName} - ****{card.cardNumber.slice(-4)}
                  </option>
                ))}
              </select>
              {errors.cardId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cardId.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
            >
              Add Mobile Transaction
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddMobileTrans;
