import React from "react";
import { FiSearch, FiBell } from "react-icons/fi";

export default function DashboardHeader() {
  return (
    <div className="bg-[#2e7d32] px-6 pt-12 pb-4 text-white relative">
      {/* Header Greeting & Notification */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-sm opacity-90 font-medium">Good Morning,</p>

          <h1 className="text-2xl font-bold flex items-center gap-2 mt-0.5">
            Juan Dela Cruz!
            <span className="text-xl">👋</span>
          </h1>

          <p className="text-xs opacity-80 mt-1">Keep learning and cooking!</p>
        </div>

        {/* Notification */}
        <button className="bg-white/15 p-2.5 rounded-full hover:bg-white/25 transition relative">
          <FiBell className="text-white text-xl" />

          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#2e7d32]" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative -mb-10 shadow-xl rounded-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
          <FiSearch className="text-lg" />
        </span>

        <input
          type="text"
          placeholder="Search lessons, recipes..."
          className="w-full pl-11 pr-4 py-3 bg-white text-gray-800 rounded-full text-sm focus:outline-none shadow-sm placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
