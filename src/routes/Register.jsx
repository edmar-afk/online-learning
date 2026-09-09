import React, { useState } from "react";
import {
  ChefHat,
  Soup,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    yearLevel: "",
    course: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Mobile number validation
    if (!/^09\d{9}$/.test(formData.mobileNumber)) {
      alert("Please enter a valid mobile number starting with 09.");
      return;
    }

    console.log("Registration Data:", formData);

    // Connect your Django registration API here.
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-white px-6 py-8 overflow-hidden font-sans select-none">
      {/* =====================================================
          BACKGROUND DECORATIVE OUTLINE ICONS
      ===================================================== */}

      <div className="absolute inset-0 pointer-events-none opacity-10">
        {/* Top Left - Tomato */}
        <div className="absolute top-8 left-8 text-green-700">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314l1.414 1.414m9.9 9.9l1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z"
            />
          </svg>
        </div>

        {/* Top Center - Leaf */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-green-700">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21c-4.97 0-9-4.03-9-9 0-4.97 4.03-9 9-9 4.97 0 9 4.03 9 9 0 4.97-4.03 9-9 9zm0 0v-9m0 0H7m5 0h5"
            />
          </svg>
        </div>

        {/* Top Right - Bell Pepper */}
        <div className="absolute top-8 right-8 text-green-700">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v3m0 0a3 3 0 00-3 3v1a6 6 0 106 0V9a3 3 0 00-3-3z"
            />
          </svg>
        </div>

        {/* Middle Left - Carrot */}
        <div className="absolute top-1/3 left-6 text-green-700">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.5 13.5l7-7m0 0L14 3l3 3 3 3-3.5 3.5m-6.5-6.5l3.5 3.5"
            />
          </svg>
        </div>

        {/* Bottom Left Leaf */}
        <div className="absolute bottom-32 left-8 text-green-700">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 3l14 9-14 9V3z"
            />
          </svg>
        </div>

        {/* Bottom Right Apple */}
        <div className="absolute bottom-32 right-8 text-green-700">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v3m3-3a3 3 0 013 3v1a6 6 0 11-12 0V6a3 3 0 013-3z"
            />
          </svg>
        </div>

        {/* Bottom Left Chef Hat */}
        <div className="absolute bottom-6 left-6 text-green-700">
          <ChefHat className="w-16 h-16" />
        </div>

        {/* Bottom Right Bowl */}
        <div className="absolute bottom-6 right-6 text-green-700">
          <Soup className="w-16 h-16" />
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
        {/* =====================================================
            LOGO
        ===================================================== */}

        <div className="relative flex items-center justify-center mt-2 mb-3">
          {/* Fork */}
          <div className="text-green-700 mr-[-10px] z-20">
            <svg className="w-10 h-14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2v6c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V2h2v6c0 2.21-1.79 4-4 4s-4-1.79-4-4V2h2zm2 13h2v7H9v-7z" />
            </svg>
          </div>

          {/* Central Logo */}
          <div className="relative flex flex-col items-center">
            <div className="relative bg-[#2d682c] w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-md">
              {/* Chef Hat */}
              <div className="absolute -top-8 text-[#2d682c]">
                <ChefHat className="w-20 h-20 stroke-[2.5]" />
              </div>

              {/* Steam */}
              <div className="flex space-x-1.5 mt-4 mb-1 text-white">
                <span className="w-0.5 h-3 bg-white rounded-full animate-pulse"></span>
                <span className="w-0.5 h-4 bg-white rounded-full animate-pulse delay-75"></span>
                <span className="w-0.5 h-3 bg-white rounded-full animate-pulse delay-150"></span>
              </div>

              {/* Orange Bowl */}
              <div className="w-16 h-7 bg-[#f47b20] rounded-b-full border-2 border-white flex items-center justify-center shadow-inner">
                <div className="w-10 h-1 bg-[#d96515] rounded-full mt-[-4px]"></div>
              </div>
            </div>
          </div>

          {/* Spoon */}
          <div className="text-green-700 ml-[-10px] z-20">
            <svg className="w-10 h-14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.24 2 7 4.24 7 7c0 2.21 1.41 4.09 3.38 4.75L10 22h4l-.38-10.25C15.59 11.09 17 9.21 17 7c0-2.76-2.24-5-5-5z" />
            </svg>
          </div>
        </div>

        {/* =====================================================
            TITLE
        ===================================================== */}

        <h1 className="text-2xl font-extrabold tracking-wide mt-2">
          <span className="text-[#2d682c]">COOK</span>
          <span className="text-gray-700 mx-1.5">&</span>
          <span className="text-[#f47b20]">LEARN</span>
        </h1>

        <p className="text-gray-800 font-medium text-base mt-1">
          Create your account
        </p>

        {/* =====================================================
            DIVIDER
        ===================================================== */}

        <div className="relative w-full flex items-center justify-center my-4">
          <div className="absolute w-full border-t border-green-700/60"></div>
          <div className="relative z-10 w-2.5 h-2.5 bg-green-700 rounded-full"></div>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          {/* FULL NAME */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Full Name
            </label>

            <div className="relative">
              <User
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
              />

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="
                  w-full
                  h-11
                  pl-10 pr-3
                  bg-gray-50
                  border border-gray-200
                  rounded-xl
                  text-sm
                  text-gray-800
                  placeholder-gray-400
                  outline-none
                  focus:border-[#2d682c]
                  focus:ring-2
                  focus:ring-[#2d682c]/10
                  transition
                "
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Email
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="
                  w-full
                  h-11
                  pl-10 pr-3
                  bg-gray-50
                  border border-gray-200
                  rounded-xl
                  text-sm
                  text-gray-800
                  placeholder-gray-400
                  outline-none
                  focus:border-[#2d682c]
                  focus:ring-2
                  focus:ring-[#2d682c]/10
                  transition
                "
              />
            </div>
          </div>

          {/* MOBILE NUMBER */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Mobile Number
            </label>

            <div className="relative">
              <Phone
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
              />

              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="09XXXXXXXXX"
                maxLength={11}
                inputMode="numeric"
                required
                className="
                  w-full
                  h-11
                  pl-10 pr-3
                  bg-gray-50
                  border border-gray-200
                  rounded-xl
                  text-sm
                  text-gray-800
                  placeholder-gray-400
                  outline-none
                  focus:border-[#2d682c]
                  focus:ring-2
                  focus:ring-[#2d682c]/10
                  transition
                "
              />
            </div>
          </div>

          {/* YEAR LEVEL */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Year Level
            </label>

            <div className="relative">
              <GraduationCap
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c] z-10"
              />

              <select
                name="yearLevel"
                value={formData.yearLevel}
                onChange={handleChange}
                required
                className="
                  appearance-none
                  w-full
                  h-11
                  pl-10 pr-10
                  bg-gray-50
                  border border-gray-200
                  rounded-xl
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-[#2d682c]
                  focus:ring-2
                  focus:ring-[#2d682c]/10
                  transition
                "
              >
                <option value="" disabled>
                  Select year level
                </option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>

              <ArrowRight
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* COURSE */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Course
            </label>

            <div className="relative">
              <BookOpen
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
              />

              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="Enter your course"
                required
                className="
                  w-full
                  h-11
                  pl-10 pr-3
                  bg-gray-50
                  border border-gray-200
                  rounded-xl
                  text-sm
                  text-gray-800
                  placeholder-gray-400
                  outline-none
                  focus:border-[#2d682c]
                  focus:ring-2
                  focus:ring-[#2d682c]/10
                  transition
                "
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Password
            </label>

            <div className="relative">
              <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="
                  w-full
                  h-11
                  pl-10 pr-11
                  bg-gray-50
                  border border-gray-200
                  rounded-xl
                  text-sm
                  text-gray-800
                  placeholder-gray-400
                  outline-none
                  focus:border-[#2d682c]
                  focus:ring-2
                  focus:ring-[#2d682c]/10
                  transition
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2d682c]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="
                  w-full
                  h-11
                  pl-10 pr-11
                  bg-gray-50
                  border border-gray-200
                  rounded-xl
                  text-sm
                  text-gray-800
                  placeholder-gray-400
                  outline-none
                  focus:border-[#2d682c]
                  focus:ring-2
                  focus:ring-[#2d682c]/10
                  transition
                "
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2d682c]"
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-[#2d682c]
              hover:bg-[#245523]
              text-white
              font-semibold
              py-3
              rounded-xl
              shadow-md
              transition-all
              duration-200
              active:scale-[0.98]
              mt-4
            "
          >
            Create Account
            <ArrowRight size={18} />
          </button>
        </form>

        {/* =====================================================
            LOGIN LINK
        ===================================================== */}

        <div className="text-center mt-5 mb-6">
          <p className="text-xs text-gray-500 inline">
            Already have an account?
          </p>

          <Link
            to={"/login"}
            className="
              ml-1
              text-sm
              font-semibold
              text-[#2d682c]
              hover:text-[#f47b20]
              transition
            "
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
