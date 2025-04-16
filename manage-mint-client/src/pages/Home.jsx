import React from "react";
import { Link } from "react-router-dom";
import BgImage from "../assets/money-bg.jpg"; // Replace with your 3D business/finance image

export const Home = () => {
  return (
    <div
      className="h-screen w-full relative bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to ManageMint 💼
        </h1>
        <p className="text-lg lg:text-xl max-w-2xl mb-8 text-gray-200">
          Your all-in-one solution for managing finances, tracking credit cards, expenses,
          and growing your business.
        </p>
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl text-xl transition duration-300 shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};
