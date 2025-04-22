import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

const AddMobileTrans = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [creditCards,setCreditCards] = useState([]);

  const { user, fetchUser } = useAuth();

  useEffect(() => {
    const getCards = async () => {
      try {
        const response = await fetchUser('user/credit-cards');
        setCreditCards(response.data || []);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    getCards();
  }, []);
  
  const addMobile = async (data) => {
    try {
      // Handle form submission
      console.log(data);
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <form>
        
      </form>
    </div>
  );
};

export default AddMobileTrans;
