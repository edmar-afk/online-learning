import React, { useEffect, useState } from "react";
import { ChefHat, Soup, Loader2, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
export default function Welcome() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen bg-white px-6 py-12 overflow-hidden font-sans select-none">
      {/* Background Decorative Outline Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {/* Top Left */}
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

        {/* Top Center */}
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

        {/* Top Right */}
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

        {/* Middle Left */}
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

        {/* Bottom Left */}
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

        {/* Bottom Right */}
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

        {/* Bottom Left Chef */}
        <div className="absolute bottom-6 left-6 text-green-700">
          <ChefHat className="w-16 h-16" />
        </div>

        {/* Bottom Right Bowl */}
        <div className="absolute bottom-6 right-6 text-green-700">
          <Soup className="w-16 h-16" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center mt-12 w-full max-w-xs">
        {/* Logo */}
        <div className="relative flex items-center justify-center my-6">
          {/* Fork */}
          <div className="text-green-700 mr-[-10px] z-20">
            <svg className="w-12 h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2v6c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V2h2v6c0 2.21-1.79 4-4 4s-4-1.79-4-4V2h2zm2 13h2v7H9v-7z" />
            </svg>
          </div>

          {/* Center Logo */}
          <div className="relative flex flex-col items-center">
            <div className="relative bg-[#2d682c] w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-md">
              {/* Chef Hat */}
              <div className="absolute -top-10 text-[#2d682c]">
                <ChefHat className="w-24 h-24 stroke-[2.5]" />
              </div>

              {/* Steam */}
              <div className="flex space-x-1.5 mt-4 mb-1 text-white">
                <span className="w-0.5 h-4 bg-white rounded-full animate-pulse"></span>
                <span className="w-0.5 h-5 bg-white rounded-full animate-pulse delay-75"></span>
                <span className="w-0.5 h-4 bg-white rounded-full animate-pulse delay-150"></span>
              </div>

              {/* Bowl */}
              <div className="w-20 h-9 bg-[#f47b20] rounded-b-full border-2 border-white flex items-center justify-center shadow-inner">
                <div className="w-12 h-1.5 bg-[#d96515] rounded-full mt-[-4px]"></div>
              </div>
            </div>
          </div>

          {/* Spoon */}
          <div className="text-green-700 ml-[-10px] z-20">
            <svg className="w-12 h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.24 2 7 4.24 7 7c0 2.21 1.41 4.09 3.38 4.75L10 22h4l-.38-10.25C15.59 11.09 17 9.21 17 7c0-2.76-2.24-5-5-5z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-wide mt-6">
          <span className="text-[#2d682c]">COOK</span>
          <span className="text-gray-700 mx-2">&</span>
          <span className="text-[#f47b20]">LEARN</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-800 font-medium text-lg mt-1 tracking-tight">
          Learn. Cook. Succeed.
        </p>

        {/* Divider */}
        <div className="relative w-full flex items-center justify-center my-6">
          <div className="absolute w-full border-t border-green-700/60"></div>
          <div className="relative z-10 w-2.5 h-2.5 bg-green-700 rounded-full"></div>
        </div>

        {loading ? (
          /* ========================= */
          /* LOADING SCREEN */
          /* ========================= */

          <div className="text-center text-gray-600 text-sm leading-relaxed px-4">
            <p>Your mobile learning partner</p>
            <p>for cooking excellence.</p>
          </div>
        ) : (
          /* ========================= */
          /* LOGIN / REGISTER */
          /* ========================= */

          <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
            <p className="text-gray-600 text-sm mb-5">
              Welcome to Cook & Learn
            </p>

            {/* Login Button */}
            <Link
             to={"/login"}
              className="
                w-full
                flex items-center justify-center gap-3
                bg-[#2d682c]
                hover:bg-[#245523]
                text-white
                font-semibold
                py-3.5
                rounded-xl
                shadow-md
                transition-all
                duration-200
                active:scale-95
              "
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>

            {/* Register Button */}
            <Link
              to={"/register"}
              className="
                w-full
                flex items-center justify-center gap-3
                mt-3
                bg-[#f47b20]
                hover:bg-[#dc6917]
                text-white
                font-semibold
                py-3.5
                rounded-xl
                shadow-md
                transition-all
                duration-200
                active:scale-95
              "
            >
              <UserPlus className="w-5 h-5" />
              Register
            </Link>

            {/* Small separator */}
            <div className="flex items-center w-full my-5">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-xs text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Footer text */}
            <p className="text-xs text-gray-500 text-center">
              Start your journey toward
              <span className="text-[#2d682c] font-semibold">
                {" "}
                cooking excellence.
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center mb-4 z-10">
        {loading ? (
          <>
            <Loader2 className="w-7 h-7 text-[#2d682c] animate-spin mb-2" />

            <span className="text-green-700 font-semibold text-sm tracking-wide">
              Loading...
            </span>
          </>
        ) : (
          <span className="text-gray-400 text-xs">Cook & Learn</span>
        )}
      </div>
    </div>
  );
}
