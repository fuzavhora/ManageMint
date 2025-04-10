import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     emailOrMobile: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("/auth/login", {
//         emailOrMobile: formData.emailOrMobile,
//         password: formData.password,
//       });

//       toast.success("Login successful");
//       navigate("/dashboard"); // Redirect to dashboard
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Login failed");
//     }
//   };

const navigate = useNavigate(); // Initialize useNavigate hook
const handleLogin = async (e) => { 
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Login form submitted"); // Debugging line
    navigate("/dashboard"); // Redirect to dashboard after login
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Email or Mobile</label>
            <input
              type="text"
              name="emailOrMobile"
            //   value={formData.emailOrMobile}
            //   onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email or mobile number"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
            //   value={formData.password}
            //   onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
