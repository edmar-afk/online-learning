import React, { useEffect, useState } from "react";
import { Loader2, LogIn, UserPlus } from "lucide-react";
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
    <div className="relative flex flex-col items-center justify-between min-h-screen bg-white px-6 py-8 overflow-hidden font-sans select-none">
      {/* Top Decorative Green Waves */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-28 text-[#1E6B38]"
        >
          <path
            fill="currentColor"
            d="M0,0 L500,0 L500,60 C400,120 300,40 180,80 C80,110 0,60 0,60 Z"
          />
        </svg>
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-24 text-[#1E6B38] opacity-60 -mt-20"
        >
          <path
            fill="currentColor"
            d="M0,0 L500,0 L500,40 C350,90 250,20 120,70 C50,90 0,40 0,40 Z"
          />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center mt-12 w-full max-w-sm text-center">
        {/* Central Logo Graphic */}
        <div className="my-4 flex items-center justify-center">
          <svg
            className="w-40 h-40 text-[#1E6B38]"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            {/* Spoon */}
            <path d="M 45 60 C 35 60 25 75 25 95 C 25 110 35 120 45 120 L 45 150 C 45 155 49 155 49 150 L 49 120 C 59 120 65 110 65 95 C 65 75 55 60 45 60 Z M 45 112 C 37 112 33 103 33 95 C 33 80 40 68 45 68 C 50 68 57 80 57 95 C 57 103 53 112 45 112 Z" />

            {/* Chef Hat + Open Book */}
            {/* Chef Hat */}
            <path d="M 100 30 C 90 30 83 37 83 46 C 78 46 73 51 73 57 C 73 63 77 67 82 68 L 118 68 C 123 67 127 63 127 57 C 127 51 122 46 117 46 C 117 37 110 30 100 30 Z" />
            {/* Book Base */}
            <path d="M 100 80 L 70 68 L 70 115 L 100 128 L 130 115 L 130 68 Z M 96 120 L 76 109 L 76 76 L 96 85 Z M 124 109 L 104 120 L 104 85 L 124 76 Z" />

            {/* Fork */}
            <path d="M 155 60 L 151 60 L 151 90 C 151 96 147 100 143 100 L 143 150 C 143 155 147 155 147 150 L 147 106 C 153 106 159 101 159 95 L 159 60 Z M 146 82 L 146 64 L 149 64 L 149 82 Z M 153 82 L 153 64 L 156 64 L 156 82 Z" />
          </svg>
        </div>

        {/* Main Header Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E6B38] tracking-tight leading-snug">
          Mobile-Based <br /> Learning System
        </h1>

        {/* Subtitle */}
        <p className="text-[#1E6B38] font-medium text-sm sm:text-base mt-2 max-w-xs">
          with Multimedia Content <br /> and Automated Evaluation
        </p>

        {/* Badge Banner */}
        <div className="mt-6 w-full bg-[#D8EFE0] text-[#1E6B38] font-semibold py-3 px-4 rounded-full text-xs sm:text-sm shadow-sm">
          <span className="font-normal">(Quantity Cookery)</span>
        </div>
      </div>

      {/* Dynamic Action Section (Loading vs Login/Register) */}
      <div className="relative z-10 w-full max-w-xs my-6">
        {loading ? (
          /* ========================= */
          /* LOADING SCREEN */
          /* ========================= */
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#1E6B38] animate-spin mb-2 stroke-[2.5]" />
            <span className="text-[#1E6B38] font-[#1E6B38] text-sm font-medium">
              Loading...
            </span>
          </div>
        ) : (
          /* ========================= */
          /* LOGIN / REGISTER */
          /* ========================= */
          <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
            <p className="text-gray-600 text-sm mb-4">
              Welcome to Cook & Learn
            </p>

            {/* Login Button */}
            <Link
              to={"/login"}
              className="
                w-full
                flex items-center justify-center gap-2
                bg-[#1E6B38]
                hover:bg-[#16522a]
                text-white
                font-semibold
                py-3
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
            {/* <Link
              to={"/register"}
              className="
                w-full
                flex items-center justify-center gap-2
                mt-3
                bg-[#1E6B38]
                hover:bg-[#6eb27a]
                text-white
                font-semibold
                py-3
                rounded-xl
                shadow-md
                transition-all
                duration-200
                active:scale-95
              "
            >
              <UserPlus className="w-5 h-5" />
              Register
            </Link> */}

            {/* Small Separator */}
            <div className="flex items-center w-full mt-4 mb-24"></div>
          </div>
        )}
      </div>

      {/* Bottom Decorative Green Waves */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-24 text-[#1E6B38] opacity-60 -mb-16"
        >
          <path
            fill="currentColor"
            d="M0,150 L500,150 L500,110 C380,60 280,130 150,80 C50,50 0,110 0,110 Z"
          />
        </svg>
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-28 text-[#1E6B38]"
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
