import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OtpStep from "../../components/common/OtpStep";
import RegisterStep from "../../components/common/RegisterStep";
import { useForm } from "react-hook-form";

const Register = () => {
  const [step, setStep] = useState("register"); // "register" or "otp"
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   number: "",
  //   password: "",
  //   gender: "",
  //   age: "",
  // });

  
  const { register, handleSubmit, formState: { errors } } = useForm();

  
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const { loading, setLoading, setUser, setError, fetchUser } = useAuth();

  const handleSendOtp = async () => {
    // console.log("formData sent to backend:", formData);

    try {
      setLoading(true); // Set loading state
      const res = await fetchUser("/user/register", {
        ...formData,
      }); // This should be POST
      console.log("Backend response:", res.data);

      if (res?.status === 200) {
        // proceed with OTP step
           setStep("otp");
           setLoading(false); // Reset loading state
        setUser(res.data.tempUser); // If backend returns temp user
        setFormData(res.data.tempUser); // Sync formData with temp user data
      } else {
        // handle unexpected backend response
        console.log("Unexpected backend response:", res.data);
        console.log("Backend response status:", res.status);
      }
      return res // Check if the response is successful
    } catch (err) {
      console.error("Register error (full):", err); // full error object
      console.error("Backend response:", err.response);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to send OTP"
      );
    }
    
  }

  const handleVerifyOtp = async () => {
    try {
      const res = await fetchUser("/user/verify-otp", {
        otp,
        email: formData.email,
      });
      if (res?.status === 201) {
        navigate("/register-success"); // Redirect to success page
      }

    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {step === "register" ? (
        <RegisterStep loading={loading} register={register} handleSubmit={handleSubmit} errors={errors}  onSendOtp={handleSendOtp} />
      ) : (
        <OtpStep otp={otp} setOtp={setOtp} onVerifyOtp={handleVerifyOtp} />
      )}
    </div>
  );
};

export default Register;
