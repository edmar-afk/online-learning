import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
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
        confirmButtonColor: "#1E6B38",
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
        confirmButtonColor: "#1E6B38",
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
        confirmButtonColor: "#1E6B38",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen bg-white px-6 py-6 overflow-hidden font-sans select-none">
      {/* Top Decorative Green Waves */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-24 text-[#1E6B38]"
        >
          <path
            fill="currentColor"
            d="M0,0 L500,0 L500,60 C400,120 300,40 180,80 C80,110 0,60 0,60 Z"
          />
        </svg>
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-20 text-[#1E6B38] opacity-60 -mt-16"
        >
          <path
            fill="currentColor"
            d="M0,0 L500,0 L500,40 C350,90 250,20 120,70 C50,90 0,40 0,40 Z"
          />
        </svg>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xs mt-10">
        {/* LOGO */}
        <div className="my-2 flex items-center justify-center">
          <svg
            className="w-32 h-32 text-[#1E6B38]"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            {/* Spoon */}
            <path d="M 45 60 C 35 60 25 75 25 95 C 25 110 35 120 45 120 L 45 150 C 45 155 49 155 49 150 L 49 120 C 59 120 65 110 65 95 C 65 75 55 60 45 60 Z M 45 112 C 37 112 33 103 33 95 C 33 80 40 68 45 68 C 50 68 57 80 57 95 C 57 103 53 112 45 112 Z" />

            {/* Chef Hat + Open Book */}
            <path d="M 100 30 C 90 30 83 37 83 46 C 78 46 73 51 73 57 C 73 63 77 67 82 68 L 118 68 C 123 67 127 63 127 57 C 127 51 122 46 117 46 C 117 37 110 30 100 30 Z" />
            <path d="M 100 80 L 70 68 L 70 115 L 100 128 L 130 115 L 130 68 Z M 96 120 L 76 109 L 76 76 L 96 85 Z M 124 109 L 104 120 L 104 85 L 124 76 Z" />

            {/* Fork */}
            <path d="M 155 60 L 151 60 L 151 90 C 151 96 147 100 143 100 L 143 150 C 143 155 147 155 147 150 L 147 106 C 153 106 159 101 159 95 L 159 60 Z M 146 82 L 146 64 L 149 64 L 149 82 Z M 153 82 L 153 64 L 156 64 L 156 82 Z" />
          </svg>
        </div>

        {/* TITLE & SUBTITLE */}
        <h1 className="text-xl font-extrabold text-[#1E6B38] tracking-tight text-center leading-snug">
          Mobile-Based Learning System
        </h1>
        <p className="text-[#1E6B38] font-medium text-xs text-center mt-1">
          with Multimedia Content and Automated Evaluation
        </p>

        {/* BADGE BANNER */}
        <div className="mt-3 w-full bg-[#D8EFE0] text-[#1E6B38] font-semibold py-2 px-3 rounded-full text-xs text-center shadow-sm">
          <span className="font-normal">(Quantity Cookery)</span>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="w-full mt-4">
          {/* EMAIL */}
          <div className="mb-3">
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Username"
                autoComplete="username"
                required
                className="
                  w-full
                  h-11
                  pl-10 pr-4
                  bg-white
                  border border-gray-200
                  rounded-xl
                  text-sm
                  text-gray-800
                  placeholder-gray-400
                  outline-none
                  focus:border-[#1E6B38]
                  focus:ring-2
                  focus:ring-[#1E6B38]/10
                  transition
                  shadow-sm
                "
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete="current-password"
                required
                className="
                  w-full
                  h-11
                  pl-10 pr-10
                  bg-white
                  border border-gray-200
                  rounded-xl
                  text-sm
                  text-gray-800
                  placeholder-gray-400
                  outline-none
                  focus:border-[#1E6B38]
                  focus:ring-2
                  focus:ring-[#1E6B38]/10
                  transition
                  shadow-sm
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
                  hover:text-[#1E6B38]
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
              gap-2
              bg-[#1E6B38]
              hover:bg-[#16522a]
              text-white
              font-semibold
              py-3
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
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </form>

        {/* REGISTER LINK */}
        <div className="flex items-center justify-center mt-4">
          <p className="text-xs text-center text-gray-500">Don't have an account? Ask Teacher physically for Account Creation.</p>
        </div>
      </div>

      {/* Bottom Decorative Green Waves */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-20 text-[#1E6B38] opacity-60 -mb-14"
        >
          <path
            fill="currentColor"
            d="M0,150 L500,150 L500,110 C380,60 280,130 150,80 C50,50 0,110 0,110 Z"
          />
        </svg>
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-24 text-[#1E6B38]"
        >
          <path
            fill="currentColor"
            d="M0,150 L500,150 L500,90 C400,30 300,110 180,70 C80,40 0,90 0,90 Z"
          />
        </svg>
      </div>
    </div>
  );
}
