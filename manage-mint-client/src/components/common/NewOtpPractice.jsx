import { useState } from "react"

const NewOtpPract = () => {
  const otpCount = 6;
  const [otp, setOtp] = useState(new Array(otpCount).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value exists
    if (value && index < otpCount - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">OTP VERIFICATION</h1>
      <div className="flex gap-2">
        {otp.map((_, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            className="w-12 h-12 text-center border-2 rounded"
          />
        ))}
      </div>
    </div>
  )
}

export default NewOtpPract;