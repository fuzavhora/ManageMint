import React, { useEffect, useRef, useState } from 'react';

export const NewOtp = ({ otp, setOtp, onVerifyOtp }) => {
  const inputCount = 6;
  const [inputArr, setInputArr] = useState(new Array(inputCount).fill(''));
  const inputRef = useRef([]);

  useEffect(() => {
    inputRef.current[0].focus();
  }, []);

  const onKeyHandler = (e, index) => {
    if (!e.target.value && e.key === 'Backspace' && inputRef.current[index - 1]) {
      inputRef.current[index - 1].focus();
    }
  };

  const onChangeHandler = (value, index) => {
    if (isNaN(value)) return;

    const newArr = [...inputArr];
    newArr[index] = value.slice(-1);
    setInputArr(newArr);

    const newOtp = newArr.join('');
    setOtp(newOtp);

    if (value && inputRef.current[index + 1]) {
      inputRef.current[index + 1].focus();
    }
  };

  return (
    <form
      onSubmit={onVerifyOtp}
      className="flex flex-col items-center justify-center gap-6 mt-4"
    >
      <div className="flex gap-3">
        {inputArr.map((val, index) => (
          <input
            key={index}
            ref={(el) => (inputRef.current[index] = el)}
            type="text"
            value={val}
            onChange={(e) => onChangeHandler(e.target.value, index)}
            onKeyDown={(e) => onKeyHandler(e, index)}
            maxLength={1}
            className="w-12 h-12 text-center border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
          />
        ))}
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 shadow"
      >
        Submit OTP
      </button>
    </form>
  );
};
