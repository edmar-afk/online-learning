import React, { useMemo, useState } from "react";

import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  IdCard,
  Users,
  LoaderCircle,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import api from "../assets/api";

const initialFormData = {
  fullName: "",

  schoolId: "",

  email: "",

  yearLevel: "",

  course: "",

  password: "",

  confirmPassword: "",
};

const inputClass =
  "w-full h-11 pl-10 pr-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#1E6B38] focus:ring-2 focus:ring-[#1E6B38]/10 transition shadow-sm";

const selectClass =
  "appearance-none w-full h-11 pl-10 pr-10 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-[#1E6B38] focus:ring-2 focus:ring-[#1E6B38]/10 transition shadow-sm";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState(initialFormData);

  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const isFormValid = useMemo(() => {
    const commonFieldsFilled =
      formData.fullName.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "";

    const roleFieldsFilled =
      role === "student"
        ? formData.schoolId.trim() !== "" &&
          formData.yearLevel !== "" &&
          formData.course.trim() !== ""
        : formData.email.trim() !== "" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

    return (
      commonFieldsFilled &&
      roleFieldsFilled &&
      passwordsMatch &&
      formData.password.length >= 8
    );
  }, [formData, role, passwordsMatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({ ...previous, [name]: value }));

    setErrorMessage("");

    setSuccessMessage("");
  };

  const handleRoleChange = (event) => {
    const nextRole = event.target.value;

    setRole(nextRole);

    // Clear role-specific fields to prevent values from the previous role*

    // from being accidentally submitted.*

    setFormData((previous) => ({
      ...previous,

      schoolId: "",

      email: "",

      yearLevel: "",

      course: "",
    }));

    setErrorMessage("");

    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    setSuccessMessage("");

    if (!isFormValid) {
      setErrorMessage("Please complete all required fields correctly.");

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");

      return;
    }

    // No mobile-number field is collected or submitted.

    // Student school ID is used as username; teacher email is used as username.

    // Course is mapped to UserExtraInfo.section because the current model

    // does not contain a separate course field.

    const payload = {
      username:
        role === "student" ? formData.schoolId.trim() : formData.email.trim(),

      password: formData.password,

      email: role === "teacher" ? formData.email.trim() : "",

      first_name: formData.fullName.trim(),

      last_name: "",

      year_level: role === "student" ? formData.yearLevel : "",

      section: role === "student" ? formData.course.trim() : "",

      role,
    };

    try {
      setIsSubmitting(true);

      // Assumes your api instance has the Django API base URL configured.

      const response = await api.post("/register/", payload);

      setSuccessMessage(
        response.data?.message || "Your account was created successfully.",
      );

      setFormData(initialFormData);

      // Redirect to login after successful registration.*

      window.setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      const data = error.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data)

          .map(([field, value]) => {
            const text = Array.isArray(value) ? value.join(" ") : String(value);

            return `${field}: ${text}`;
          })

          .join(" ");

        setErrorMessage(messages || "Registration failed. Please try again.");
      } else {
        setErrorMessage(
          "Unable to register. Check your connection and try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-white px-5 py-6 font-sans select-none">
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

      <main className="relative z-10 flex w-full max-w-xs flex-col items-center mt-12">
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

        <form onSubmit={handleSubmit} className="w-full space-y-3 mt-4">
          {/* Role selection */}
          <fieldset>
            <legend className="mb-1.5 block text-xs font-semibold text-gray-600">
              Register as
            </legend>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition shadow-sm ${
                  role === "student"
                    ? "border-[#1E6B38] bg-green-50 ring-2 ring-[#1E6B38]/10"
                    : "border-gray-200 bg-white hover:border-green-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={handleRoleChange}
                  className="accent-[#1E6B38]"
                />

                <GraduationCap size={18} className="text-[#1E6B38]" />

                <span className="text-sm font-semibold text-gray-700">
                  Student
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition shadow-sm ${
                  role === "teacher"
                    ? "border-[#1E6B38] bg-green-50 ring-2 ring-[#1E6B38]/10"
                    : "border-gray-200 bg-white hover:border-green-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={handleRoleChange}
                  className="accent-[#1E6B38]"
                />

                <Users size={18} className="text-[#1E6B38]" />

                <span className="text-sm font-semibold text-gray-700">
                  Teacher
                </span>
              </label>
            </div>
          </fieldset>

          {/* Full name */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Full Name
            </label>

            <div className="relative">
              <User
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Student school ID OR teacher email */}
          {role === "student" ? (
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                School ID
              </label>

              <div className="relative">
                <IdCard
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleChange}
                  placeholder="Enter your school ID"
                  autoComplete="username"
                  required
                  className={inputClass}
                />
              </div>

              <p className="mt-1 text-[11px] text-gray-500">
                Use your school ID to log in.
              </p>
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>

              <p className="mt-1 text-[11px] text-gray-500">
                Use your email address to log in.
              </p>
            </div>
          )}

          {/* Student-only fields */}
          {role === "student" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Year Level
                </label>

                <div className="relative">
                  <GraduationCap
                    size={17}
                    className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                  />

                  <select
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleChange}
                    required
                    className={selectClass}
                  >
                    <option value="">Select year level</option>

                    <option value="1st Year">1st Year</option>

                    <option value="2nd Year">2nd Year</option>

                    <option value="3rd Year">3rd Year</option>

                    <option value="4th Year">4th Year</option>
                  </select>

                  <ArrowRight
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Course
                </label>

                <div className="relative">
                  <BookOpen
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="Enter your course (e.g. BSIT)"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Password
            </label>

            <div className="relative">
              <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (at least 8 characters)"
                autoComplete="new-password"
                minLength={8}
                required
                className={`${inputClass} pr-11`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E6B38]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {formData.password && formData.password.length < 8 && (
              <p className="mt-1 text-xs text-red-600">
                Password must contain at least 8 characters.
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Retype Password
            </label>

            <div className="relative">
              <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retype your password"
                autoComplete="new-password"
                required
                className={`${inputClass} pr-11 ${
                  passwordsMismatch
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : passwordsMatch
                      ? "border-green-500"
                      : ""
                }`}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E6B38]"
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {passwordsMismatch && (
              <p className="mt-1 text-xs text-red-600">
                Passwords do not match.
              </p>
            )}

            {passwordsMatch && (
              <p className="mt-1 text-xs text-[#1E6B38]">Passwords match.</p>
            )}
          </div>

          {/* API messages */}
          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-[#1E6B38]"
            >
              {successMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E6B38] py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#16522a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mb-24 mt-4 text-center">
          <p className="inline text-xs text-gray-500">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="ml-1 text-xs font-semibold text-[#1E6B38] hover:underline transition"
          >
            Login
          </Link>
        </div>
      </main>

      {/* Bottom Decorative Green Waves */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-20 text-[#1E6B38] opacity-60 -mb-15"
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
