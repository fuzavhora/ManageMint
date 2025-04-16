import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OtpStep from "../../components/common/OtpStep";
import RegisterStep from "../../components/common/RegisterStep";
import { useForm } from "react-hook-form";
import { NewOtp } from "../../components/common/NewOtp";

const Register = () => {
  const [step, setStep] = useState("register"); // "register" or "otp"

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError
  } = useForm();

  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const { loading, setLoading, setUser, fetchUser } = useAuth();
  const handleSendOtp = async (formData) => {
    try {
      setLoading(true);
      const res = await fetchUser("user/register", formData);
      if (res.data.status === "failed") {
        console.log("failed message :",res.data.message);
        setError("emailOrMobile", {
          type: "manual",
          message: res.data.message,
        });
        
        // navigate('/login')
        return 
      }
      else if (res?.status === 200) {
        setStep("otp");
        setUser(res.data.tempUser); // Store temp user if backend returns it
      }

      console.log("resposnse : ", res);
      
  
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Register error (full):", err);
  
      // Extract error message safely
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
  
      // Show specific validation message
      if (status === 409 && message === "User already exists") {
        setError("emailOrMobile", {
          type: "manual",
          message: "User already registered. Please login.",
        });
      } else if (status === 400 && message) {
        setError("emailOrMobile", {
          type: "manual",
          message: message,
        });
      } else {
        setError("emailOrMobile", {
          type: "manual",
          message: "Something went wrong. Please try again.",
        });
      }
    }
  };
  
  

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    try {
      const res = await fetchUser("user/verify-otp", {
        otp
      });
      console.log("OTP DATA : ", res.status);
      if(res?.status === 400){
        if(res?.data.message === "Invalid OTP or email"){
          setError("Invalid Otp ot email")
        }
      }
      if (res?.status === 201) {
        navigate("/register-success"); // Redirect to success page
      }
      if(res?.status === 400){
        console.log("status : ", res?.data.message);
        
      }
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      console.log("I am in error");
      

      console.log("Error status : ",status);
      console.log("Error message : ",message);
      

    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {step === "register" ? (
        <RegisterStep
          loading={loading}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSendOtp={handleSendOtp}
        />
      ) : (
        // <OtpStep otp={otp} setOtp={setOtp} onVerifyOtp={handleVerifyOtp} />

        <NewOtp otp={otp} setOtp={setOtp} onVerifyOtp={handleVerifyOtp} />
      )}
    </div>
  );
};

export default Register;
