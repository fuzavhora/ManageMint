import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegistrationSuccess = ({ headMessage = "Registration Successful!" }) => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-white to-purple-100"
    >
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 max-w-md w-full text-center animate-fadeIn">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full shadow-md ring-4 ring-green-300 animate-pulse">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">{headMessage}</h2>

        <p className="text-gray-600 text-base leading-relaxed mb-8">
          🎉 Your registration has been submitted. Once approved by the admin,
          you’ll be notified and can log in.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white px-6 py-3 rounded-full font-semibold text-sm transition duration-300 ease-in-out shadow-lg"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess
