import { useEffect } from "react";

const OtpStep = ({ otp, setOtp, onVerifyOtp }) => {
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Only allow a single digit (or empty)

    const otpArr = otp.split("");
    otpArr[index] = value;
    const newOtp = otpArr.join("");
    setOtp(newOtp.padEnd(6, "")); // Ensure length stays 6
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  useEffect(() => {
    if (otp.length < 6) {
      const nextInput = document.getElementById(`otp-${otp.length}`);
      nextInput?.focus();
    }
  }, [otp]);

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800">Verify OTP</h2>

      <div className="flex justify-between gap-2">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={otp[index] || ""}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={handleFocus}
            className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:outline-none focus:border-blue-500"
          />
        ))}
      </div>

      <button
        onClick={onVerifyOtp}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default OtpStep;
