import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext"; // Adjust path if needed

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const { fetchUser, loading, error, setError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [successMessage, setSuccessMessage] = useState("");

  // STEP 1: Request OTP
  const onRequestOtp = async (data) => {
    setError(null);
    setSuccessMessage("");
    const response = await fetchUser("/auth/request-password-reset", {
      emailOrNumber: data.emailOrNumber,
    });

    if (response?.status === 200) {
      setSuccessMessage(response.data.message);
      setStep(2);
    }
  };

  // STEP 2: Verify OTP and Reset Password
  const onVerifyOtp = async (data) => {
    setError(null);
    setSuccessMessage("");
    const response = await fetchUser("/auth/verify-reset-otp", {
      otp: data.otp,
      newPassword: data.newPassword,
    });

    if (response?.status === 200) {
      setSuccessMessage(response.data.message);
      reset();
      setStep(1); // or redirect to login
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {step === 1 ? "Forgot Password" : "Verify OTP & Reset Password"}
      </h2>

      {error && <p className="text-red-500 text-center mb-2">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-2">{successMessage}</p>}

      <form onSubmit={handleSubmit(step === 1 ? onRequestOtp : onVerifyOtp)}>
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Email or Mobile Number"
              {...register("emailOrNumber", { required: "This field is required" })}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              disabled={loading}
            />
            {errors.emailOrNumber && (
              <p className="text-red-400">{errors.emailOrNumber.message}</p>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              {...register("otp", { required: "OTP is required" })}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              disabled={loading}
            />
            {errors.otp && <p className="text-red-400">{errors.otp.message}</p>}

            <input
              type="password"
              placeholder="New Password"
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              disabled={loading}
            />
            {errors.newPassword && (
              <p className="text-red-400">{errors.newPassword.message}</p>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 font-bold rounded mt-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Please wait..."
            : step === 1
            ? "Send OTP"
            : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
