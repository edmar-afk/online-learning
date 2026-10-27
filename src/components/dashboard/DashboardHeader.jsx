import React, { useEffect, useState } from "react";
import { FiSearch, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function DashboardHeader() {
  const [firstName, setFirstName] = useState("User");
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem("userInfo");

      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);

        if (userInfo.first_name) {
          setFirstName(userInfo.first_name.trim());
        }
      }
    } catch (error) {
      console.error("Failed to load user information:", error);
    }

    const updateGreeting = () => {
      const hour = Number(
        new Intl.DateTimeFormat("en-PH", {
          timeZone: "Asia/Manila",
          hour: "numeric",
          hour12: false,
        }).format(new Date())
      );

      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();

    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-green-900 px-6 pt-12 pb-4 text-white relative">
      {/* Header Greeting & Logout */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-sm opacity-90 font-medium">
            {greeting},
          </p>

          <h1 className="text-2xl font-bold flex items-center gap-2 mt-0.5">
            {firstName}!
            <span className="text-xl">👋</span>
          </h1>

          <p className="text-xs opacity-80 mt-1">
            Keep learning and cooking!
          </p>
        </div>

        {/* Logout */}
        <Link
          to="/logout"
          aria-label="Logout"
          title="Logout"
          className="bg-white/15 p-2.5 rounded-full hover:bg-white/25 transition relative"
        >
          <FiLogOut className="text-white text-xl" />
        </Link>
      </div>

      {/* Search Bar */}
      {/* <div className="relative -mb-10 shadow-xl rounded-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
          <FiSearch className="text-lg" />
        </span>

        <input
          type="text"
          placeholder="Search lessons, recipes..."
          className="w-full pl-11 pr-4 py-3 bg-white text-gray-800 rounded-full text-sm focus:outline-none shadow-sm placeholder:text-gray-400"
        />
      </div> */}
    </div>
  );
}