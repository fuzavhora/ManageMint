import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { fetchUser, setError, error, setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",  // Change this from emailOrNumber to match backend
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = async () => {
  //   // e.preventDefault();
  //   console.log("zvcnshfvnshfdh");
    
    
  //   try {
  //     const res = await fetchUser("admin/login", {
  //       email: formData.email,  // Make sure to send email, not emailOrNumber
  //       password: formData.password
  //     });

  //     if (res?.status === 200) {
  //       setUser({
  //         ...res.data,
  //         role: 'admin'  // Make sure role is set
  //       });
  //       localStorage.setItem('token', res.data.token);
  //       navigate("/admin");
  //     } else {
  //       setError(res?.data?.message || "bhai log hsdvfjhegfjgfsdhkjas dfhvsdn v vsdhgfcndfhnf");
  //     }
  //   } catch (err) {
  //     console.error('Admin login error:', err);
  //     setError(err?.response?.data?.message || "Something went wrong");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Data is coming");
    
    const res = await fetchUser("admin/login",formData)
    console.log("res",res);
  
    console.log(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email or Phone</label>
            <input
              type="text"
              name="email"  // Changed from emailOrPhone
              value={formData.email}  // Changed from emailOrPhone
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter email or phone"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
