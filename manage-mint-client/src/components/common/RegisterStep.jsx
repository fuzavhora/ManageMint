import React from "react";
import { Link } from "react-router-dom";

const RegisterStep = ({
  register,
  errors,
  onSendOtp,
  handleSubmit,
  loading,
}) => {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
  const passwordErrorMessage =
    "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailErrorMessage = "Enter a valid email address.";

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      {/* Side Quote Section */}
      <div className="hidden lg:block lg:w-1/3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-10 rounded-l-2xl">
        <blockquote className="text-2xl italic font-semibold">
          "Transform your business with ManageMint - the future of business management."
        </blockquote>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-xl px-8 py-10 w-full max-w-md mx-auto space-y-6 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Create Account
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Get started with ManageMint 🚀
        </p>

        {errors?.emailOrMobile && (
          <p className="text-center text-sm text-red-500 font-medium">
            {errors.emailOrMobile.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSendOtp)} className="space-y-5">
          {/* Full Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="input-style"
              {...register("name", {
                required: "Full Name is required",
                minLength: {
                  value: 5,
                  message: "Full Name must be at least 5 characters",
                },
              })}
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="input-style"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: emailPattern,
                  message: emailErrorMessage,
                },
              })}
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="input-style"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: passwordPattern,
                  message: passwordErrorMessage,
                },
              })}
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <input
              type="text"
              placeholder="Mobile Number"
              className="input-style"
              {...register("number", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit number",
                },
              })}
            />
            {errors.number && <p className="error-text">{errors.number.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <select
              className="input-style"
              defaultValue=""
              {...register("gender", {
                required: "Gender is required",
              })}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="error-text">{errors.gender.message}</p>}
          </div>

          {/* Age */}
          <div>
            <input
              type="number"
              placeholder="Age"
              className="input-style"
              {...register("age", {
                required: "Age is required",
                min: { value: 13, message: "You must be at least 13" },
              })}
            />
            {errors.age && <p className="error-text">{errors.age.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800 shadow-lg transform hover:scale-105"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center">
          If you already have an account{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterStep;
