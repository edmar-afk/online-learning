import React, { useMemo, useState } from "react";

import {
  ChefHat,
  Soup,
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
  "w-full h-11 pl-10 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#2d682c] focus:ring-2 focus:ring-[#2d682c]/10 transition";

const selectClass =
  "appearance-none w-full h-11 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-[#2d682c] focus:ring-2 focus:ring-[#2d682c]/10 transition";

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
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white px-5 py-7 font-sans">
      {/* Decorative background icons */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.08]">
        <ChefHat className="absolute bottom-8 left-7 h-16 w-16 text-green-700" />

        <Soup className="absolute bottom-8 right-7 h-16 w-16 text-green-700" />

        <BookOpen className="absolute left-8 top-1/3 h-14 w-14 text-green-700" />

        <GraduationCap className="absolute right-8 top-1/3 h-14 w-14 text-green-700" />
      </div>

      <main className="relative z-10 flex w-full max-w-sm flex-col items-center">
        {/* Logo */}

        <div className="relative mt-2 flex items-center justify-center">
          <div className="z-20 mr-[-10px] text-green-700">
            <svg className="h-14 w-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2v6c0 1.1.9 2 2 2s2-.9 2-2V2h2v6c0 2.21-1.79 4-4 4S5 10.21 5 8V2h2zm2 13h2v7H9v-7z" />
            </svg>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#2d682c] shadow-md">
              <ChefHat className="absolute -top-8 h-20 w-20 stroke-[2.5] text-[#2d682c]" />

              <div className="mb-1 mt-4 flex space-x-1.5 text-white">
                <span className="h-3 w-0.5 animate-pulse rounded-full bg-white" />

                <span className="h-4 w-0.5 animate-pulse rounded-full bg-white delay-75" />

                <span className="h-3 w-0.5 animate-pulse rounded-full bg-white delay-150" />
              </div>

              <div className="flex h-7 w-16 items-center justify-center rounded-b-full border-2 border-white bg-[#f47b20] shadow-inner">
                <div className="-mt-1 h-1 w-10 rounded-full bg-[#d96515]" />
              </div>
            </div>
          </div>

          <div className="z-20 ml-[-10px] text-green-700">
            <svg className="h-14 w-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.24 2 7 4.24 7 7c0 2.21 1.41 4.09 3.38 4.75L10 22h4l-.38-10.25C15.59 11.09 17 9.21 17 7c0-2.76-2.24-5-5-5z" />
            </svg>
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-wide">
          <span className="text-[#2d682c]">COOK</span>

          <span className="mx-1.5 text-gray-700">&</span>

          <span className="text-[#f47b20]">LEARN</span>
        </h1>

        <p className="mt-1 text-base font-medium text-gray-800">
          Create your account
        </p>

        <div className="relative my-5 flex w-full items-center justify-center">
          <div className="absolute w-full border-t border-green-700/60" />

          <div className="relative z-10 h-2.5 w-2.5 rounded-full bg-green-700" />
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          {/* Role selection */}

          <fieldset>
            <legend className="mb-2 block text-xs font-semibold text-gray-600">
              Register as
            </legend>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition ${
                  role === "student"
                    ? "border-[#2d682c] bg-green-50 ring-2 ring-[#2d682c]/10"
                    : "border-gray-200 bg-gray-50 hover:border-green-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={handleRoleChange}
                  className="accent-[#2d682c]"
                />

                <GraduationCap size={18} className="text-[#2d682c]" />

                <span className="text-sm font-semibold text-gray-700">
                  Student
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition ${
                  role === "teacher"
                    ? "border-[#2d682c] bg-green-50 ring-2 ring-[#2d682c]/10"
                    : "border-gray-200 bg-gray-50 hover:border-green-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={handleRoleChange}
                  className="accent-[#2d682c]"
                />

                <Users size={18} className="text-[#2d682c]" />

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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
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
                    className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#2d682c]"
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
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2d682c]"
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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d682c]"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2d682c]"
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
              <p className="mt-1 text-xs text-green-700">Passwords match.</p>
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
              className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
            >
              {successMessage}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d682c] py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#245523] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
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

        <div className="mb-6 mt-5 text-center">
          <p className="inline text-xs text-gray-500">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="ml-1 text-sm font-semibold text-[#2d682c] transition hover:text-[#f47b20]"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
