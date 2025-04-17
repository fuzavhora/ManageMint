import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RegistrationSuccess from "./RegistrationSuccess";
import { Loader2 } from "lucide-react";
import bgBusiness from "../../assets/images/bg-business.png";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { fetchUser, loading, error, setError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [successMessage, setSuccessMessage] = useState("");

  const onRequestOTP = async (data) => {
    setError(null);
    setSuccessMessage("");
    const response = await fetchUser("/auth/request-reset", {
      emailOrNumber: data.emailOrNumber,
    });

    if (response?.status === 200) {
      setSuccessMessage(response.data.message);
      setStep(2);
    }
  };

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
      setStep(1);
    }
  };

  if (successMessage === "Password reset successful.") {
    return <RegistrationSuccess headMessage="Password Reset Successfully!" />;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Left - 3D Business Background */}
      <div className="hidden lg:flex items-center justify-center w-full lg:w-1/2 relative overflow-hidden">
        <img
          src={bgBusiness}
          alt="Business Background"
          className="absolute w-full h-full object-cover blur-sm brightness-75"
        />
        <div className="relative z-10 text-center max-w-md text-white px-8">
          <h2 className="text-4xl font-bold mb-4">ManageMint</h2>
          <p className="text-lg">
            Simplify your business finances with smart automation and seamless
            user experience.
          </p>
        </div>
      </div>

      {/* Right - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-10 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            {step === 1 ? "Forgot Password" : "Verify OTP & Reset"}
          </h2>

          {/* Alert Messages */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-center mb-4">{successMessage}</p>
          )}

          <form
            onSubmit={handleSubmit(step === 1 ? onRequestOTP : onVerifyOtp)}
            className="space-y-4"
          >
            {step === 1 && (
              <>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your email or mobile"
                  {...register("emailOrNumber", {
                    required: "This field is required",
                  })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.emailOrNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.emailOrNumber.message}
                  </p>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                  OTP
                </label>
                <input
                  type="number"
                  placeholder="Enter OTP"
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numbers allowed",
                    },
                  })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp.message}</p>
                )}

                <label className="block text-gray-700 dark:text-gray-300 font-medium mt-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.newPassword.message}
                  </p>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" /> Please wait...
                </span>
              ) : step === 1 ? (
                "Send OTP"
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Remembered your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Go to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
// import React, { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import RegistrationSuccess from "./RegistrationSuccess";
// import { Loader2 } from "lucide-react";
// import bgBusiness from "../../assets/images/bg-business.png";

// const ForgotPassword = () => {
//   const [step, setStep] = useState(1);
//   const navigate = useNavigate();
//   const { fetchUser, loading, error, setError } = useAuth();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();
//   const [successMessage, setSuccessMessage] = useState("");

//   const onRequestOTP = async (data) => {
//     setError(null);
//     setSuccessMessage("");
//     const response = await fetchUser("/auth/request-reset", {
//       emailOrNumber: data.emailOrNumber,
//     });

//     if (response?.status === 200) {
//       setSuccessMessage(response.data.message);
//       setStep(2);
//     }
//   };

//   const onVerifyOtp = async (data) => {
//     setError(null);
//     setSuccessMessage("");
//     const response = await fetchUser("/auth/verify-reset-otp", {
//       otp: data.otp,
//       newPassword: data.newPassword,
//     });

//     if (response?.status === 200) {
//       setSuccessMessage(response.data.message);
//       reset();
//       setStep(1);
//     }
//   };

//   if (successMessage === "Password reset successful.") {
//     return <RegistrationSuccess headMessage="Password Reset Successfully!" />;
//   }

//   return (
//     <div className="h-screen flex flex-col lg:flex-row">
//       {/* Left - 3D Business Background */}
//       <div className="hidden lg:flex items-center justify-center w-full lg:w-1/2 relative overflow-hidden">
//         <img
//           src={bgBusiness}
//           alt="Business Background"
//           className="absolute w-full h-full object-cover blur-sm brightness-75"
//         />
//         <div className="relative z-10 text-center max-w-md text-white px-8">
//           <h2 className="text-4xl font-bold mb-4">ManageMint</h2>
//           <p className="text-lg">
//             Simplify your business finances with smart automation and seamless
//             user experience.
//           </p>
//         </div>
//       </div>

//       {/* Right - Form Section */}
//       <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-10 bg-white dark:bg-gray-900 min-h-screen">
//         <div className="max-w-md w-full mx-auto">
//           <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
//             {step === 1 ? "Forgot Password" : "Verify OTP & Reset"}
//           </h2>

//           {/* Alert Messages */}
//           {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//           {successMessage && (
//             <p className="text-green-600 text-center mb-4">{successMessage}</p>
//           )}

//           <form
//             onSubmit={handleSubmit(step === 1 ? onRequestOTP : onVerifyOtp)}
//             className="space-y-4"
//           >
//             {step === 1 && (
//               <>
//                 <label className="block text-gray-700 dark:text-gray-300 font-medium">
//                   Email or Mobile Number
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter your email or mobile"
//                   {...register("emailOrNumber", {
//                     required: "This field is required",
//                   })}
//                   disabled={loading}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                 />
//                 {errors.emailOrNumber && (
//                   <p className="text-red-500 text-sm">
//                     {errors.emailOrNumber.message}
//                   </p>
//                 )}
//               </>
//             )}

//             {step === 2 && (
//               <>
//                 <label className="block text-gray-700 dark:text-gray-300 font-medium">
//                   OTP
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="Enter OTP"
//                   {...register("otp", {
//                     required: "OTP is required",
//                     pattern: {
//                       value: /^[0-9]+$/,
//                       message: "Only numbers allowed",
//                     },
//                   })}
//                   disabled={loading}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                 />
//                 {errors.otp && (
//                   <p className="text-red-500 text-sm">{errors.otp.message}</p>
//                 )}

//                 <label className="block text-gray-700 dark:text-gray-300 font-medium mt-2">
//                   New Password
//                 </label>
//                 <input
//                   type="password"
//                   placeholder="Enter new password"
//                   {...register("newPassword", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Minimum 6 characters required",
//                     },
//                   })}
//                   disabled={loading}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                 />
//                 {errors.newPassword && (
//                   <p className="text-red-500 text-sm">
//                     {errors.newPassword.message}
//                   </p>
//                 )}
//               </>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <Loader2 className="animate-spin w-5 h-5" /> Please wait...
//                 </span>
//               ) : step === 1 ? (
//                 "Send OTP"
//               ) : (
//                 "Reset Password"
//               )}
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
//             Remembered your password?{" "}
//             <span
//               onClick={() => navigate("/login")}
//               className="text-blue-600 hover:underline cursor-pointer"
//             >
//               Go to Login
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;