import React, { useState } from "react";
import {
  ChefHat,
  Soup,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../assets/api";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const username = formData.email.trim();
    const password = formData.password;

    if (!username || !password) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter your email or school ID and password.",
        confirmButtonColor: "#2d682c",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Django SimpleJWT expects username and password.
      // Teachers use their email as their username.
      // Students use their school ID as their username.
      const response = await api.post("/login/", {
        username,
        password,
      });

      const { access, refresh, user } = response.data;

      if (!access || !refresh || !user) {
        throw new Error("The server returned an incomplete login response.");
      }

      // Include the complete Django user object, its extra_info,
      // and the authentication tokens in the saved user information.
      const userInfo = {
        ...user,
        extra_info: user.extra_info || {},
        access,
        refresh,
      };

      // Save all user information in localStorage.
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      // Display success before redirecting.
      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${user.first_name || user.username}!`,
        confirmButtonColor: "#2d682c",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      // Do not leave stale or invalid user information after a failed login.
      localStorage.removeItem("userInfo");

      const data = error.response?.data;

      let errorMessage =
        "Unable to log in. Please check your connection and try again.";

      if (error.response) {
        if (data?.detail) {
          errorMessage = data.detail;
        } else if (data?.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors)
            ? data.non_field_errors.join(" ")
            : data.non_field_errors;
        } else if (data?.username) {
          errorMessage = Array.isArray(data.username)
            ? data.username.join(" ")
            : data.username;
        } else if (data?.password) {
          errorMessage = Array.isArray(data.password)
            ? data.password.join(" ")
            : data.password;
        } else if (data && typeof data === "object") {
          errorMessage = Object.entries(data)
            .map(([field, value]) => {
              const message = Array.isArray(value)
                ? value.join(" ")
                : String(value);

              return `${field}: ${message}`;
            })
            .join("\n");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        confirmButtonColor: "#2d682c",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-white px-6 py-8 overflow-hidden font-sans select-none">
      {/* BACKGROUND DECORATIVE OUTLINE ICONS */}
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

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
        {/* LOGO */}
        <div className="relative flex items-center justify-center mt-8 mb-4">
          {/* Fork */}
          <div className="text-green-700 mr-[-10px] z-20">
            <svg
              className="w-10 h-14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
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
            <svg
              className="w-10 h-14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C9.24 2 7 4.24 7 7c0 2.21 1.41 4.09 3.38 4.75L10 22h4l-.38-10.25C15.59 11.09 17 9.21 17 7c0-2.76-2.24-5-5-5z" />
            </svg>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-extrabold tracking-wide mt-2">
          <span className="text-[#2d682c]">COOK</span>
          <span className="text-gray-700 mx-1.5">&</span>
          <span className="text-[#f47b20]">LEARN</span>
        </h1>

        <p className="text-gray-800 font-medium text-base mt-1">
          Welcome back!
        </p>

        {/* DIVIDER */}
        <div className="relative w-full flex items-center justify-center my-6">
          <div className="absolute w-full border-t border-green-700/60"></div>
          <div className="relative z-10 w-2.5 h-2.5 bg-green-700 rounded-full"></div>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="w-full">
          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">
              Email or School ID
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
              />

              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email or school ID"
                autoComplete="username"
                required
                className="
                  w-full
                  h-12
                  pl-11 pr-4
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
          <div className="mb-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="
                  w-full
                  h-12
                  pl-11 pr-11
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
                className="
                  absolute
                  right-3.5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-[#2d682c]
                  transition
                "
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2 mt-8
              bg-[#2d682c]
              hover:bg-[#245523]
              text-white
              font-semibold
              py-3.5
              rounded-xl
              shadow-md
              transition-all
              duration-200
              active:scale-[0.98]
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? "Logging in..." : "Login"}
            {!isSubmitting && <ArrowRight size={19} />}
          </button>
        </form>

        {/* REGISTER LINK */}
        <div className="flex items-center justify-center mt-6">
          <p className="text-xs text-gray-500">Don't have an account?</p>

          <Link
            to={"/register"}
            className="
              ml-1
              text-sm
              font-semibold
              text-[#2d682c]
              hover:text-[#f47b20]
              transition
            "
          >
            Register
          </Link>
        </div>

        {/* FOOTER */}
        <p className="text-center text-[10px] text-gray-400 mt-6 mb-4">
          Learn. Cook. Succeed.
        </p>
      </div>
    </div>
  );
}
