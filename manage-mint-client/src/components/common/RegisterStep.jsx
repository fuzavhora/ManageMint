const RegisterStep = ({
  register,
  errors,

  onSendOtp,
  handleSubmit,
  loading
}) => {
  // const onSubmit = async (data) => {
  //   console.log("Validated Data:", data);
  //   setFormData({ ...formData, ...data }); // Sync formData if needed
  //   onSendOtp();
  // };

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
  const passwordErrorMessage = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailErrorMessage = "Enter a valid email address.";

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800">Register</h2>

      <form onSubmit={handleSubmit(onSendOtp)} className="space-y-4">
        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          {...register("name", {
            required: "Full Name is required",
            minLength:{
              value: 5,
              message: "Full Name must be at least 5 characters",
            }
          })}
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          {...register("email", {
            required: "Email is required",
            pattern :{
              value : emailPattern,
              message : emailErrorMessage,
            }
          })}
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            pattern:{
              value: passwordPattern,
              message: passwordErrorMessage,
            }
          })}
        />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}

        {/* Mobile Number */}
        <input
          type="text"
          placeholder="Mobile Number"
          className="w-full p-2 border rounded"
          {...register("number", {
            required: "Mobile number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10-digit number",
            },
          })}
        />
        {errors.number && <span className="text-red-500">{errors.number.message}</span>}

        {/* Gender */}
        <select
          className="w-full p-2 border rounded"
          defaultValue=""
          {...register("gender", {
            required: "Gender is required",
          })}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <span className="text-red-500">{errors.gender.message}</span>}

        {/* Age */}
        <input
          type="number"
          placeholder="Age"
          className="w-full p-2 border rounded"
          {...register("age", {
            required: "Age is required",
            min: { value: 13, message: "You must be at least 13" },
          })}
        />
        {errors.age && <span className="text-red-500">{errors.age.message}</span>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded transition ${
            loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default RegisterStep;
