import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import instance from "../../api/axios";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgBusiness from "../../assets/images/bg-business.png"


// Optional: replace this with a business-themed gradient background
// const backgroundStyle = {
//   backgroundImage:
//     "linear-gradient(to right, #1e3c72, #2a5298)", // professional gradient
//   backgroundSize: "cover",
//   backgroundPosition: "center",
// };

const Login = () => {
  const navigate = useNavigate();
  const { register, setError, formState: { errors } ,loading} = useForm();

  const [formData, setFormData] = useState({
    emailOrNumber: "",
    password: "",
  });

  const { setUser, fetchUser } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const findUser = async () => {
        try {
          const userLogged = await instance.get("api/auth/profile");
          if (userLogged.status === 200) {
            navigate("/dashboard");
          }
        } catch (err) {
          console.log("Token invalid or expired");
          localStorage.removeItem("token");
          navigate("/login");
        }
      };
      findUser();
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchUser("auth/login", { ...formData });

      if (response.status === 200) {
        setUser(response.data);
        const token = response.data.token;
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        navigate("/dashboard");

        setTimeout(() => {
          localStorage.removeItem("token");
          toast.info("Session expired. Please login again.");
        },20000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid Email or Password or User is not verified";
      setError("apiError", {
        type: "manual",
        message: errorMessage,
      });
    }
  };
  
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
            Simplify your business finances with smart automation and seamless user experience.
          </p>
        </div>
      </div>

      {/* Right - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-10 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Sign in to ManageMint
          </h2>

          {/* Error message */}
          {errors?.apiError && (
            <div className="text-red-600 text-sm font-semibold text-center mb-4">
              {errors.apiError.message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email or Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile</label>
              <input
                type="text"
                name="emailOrNumber"
                {...register("emailOrNumber", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                value={formData.emailOrNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="you@example.com"
              />
              {errors.emailOrNumber && (
                <span className="text-red-500 text-sm">{errors.emailOrNumber.message}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                Please wait...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Register / Forgot password links */}
          <div className="pt-6 text-sm text-center text-gray-700 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium ml-1 hover:underline">
              Register
            </Link>
          </div>

          <div className="text-sm text-center mt-2">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Login;
