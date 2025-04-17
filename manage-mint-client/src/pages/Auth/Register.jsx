import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OtpStep from "../../components/common/OtpStep";
import RegisterStep from "../../components/common/RegisterStep";
import { useForm } from "react-hook-form";
import { NewOtp } from "../../components/common/NewOtp";

const Register = () => {
  const [step, setStep] = useState("register"); // "register" or "otp"
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError: setFormError
  } = useForm();

  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const { loading, setLoading, setUser, fetchUser } = useAuth();

  const handleSendOtp = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchUser("user/register", formData);
      
      if (res?.data?.status === "failed") {
        setError(res.data.message);
        return;
      }
      
      if (res?.status === 200) {
        setStep("otp");
        setUser(res.data.tempUser);
      }
    } catch (err) {
      setLoading(false);
      console.error("Register error:", err);
      
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      
      if (status === 409 || message === "User already exists") {
        setError("User already registered. Please login.");
      } else if (status === 400 && message) {
        setError(message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await fetchUser("user/verify-otp", { otp });
      
      if (res?.status === 201) {
        navigate("/register-success");
      } else if (res?.status === 400) {
        setError(res?.data?.message || "Invalid OTP");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {step === "register" ? (
        <RegisterStep
          loading={loading}
          register={register}
          handleSubmit={handleSubmit}
          errors={{ ...errors, emailOrMobile: error ? { message: error } : null }}
          onSendOtp={handleSendOtp}
        />
      ) : (
        <NewOtp 
          otp={otp} 
          setOtp={setOtp} 
          onVerifyOtp={handleVerifyOtp}
          error={error}
        />
      )}
    </div>
  );
};

export default Register;
