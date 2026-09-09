import React from "react";
import {
  FiHome,
  FiBookOpen,
  FiEdit3,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const navItems = [
    {
      label: "Home",
      icon: FiHome,
      path: "/dashboard",
    },
    {
      label: "Lessons",
      icon: FiBookOpen,
      path: "/lessons",
    },
    {
      label: "Quizzes",
      icon: FiEdit3,
      path: "/quizzes",
    },
    {
      label: "Progress",
      icon: FiTrendingUp,
      path: "/progress",
    },
    {
      label: "Profile",
      icon: FiUser,
      path: "/profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center text-xs shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center transition ${
                isActive
                  ? "text-[#2e7d32]"
                  : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`text-xl mb-1 ${
                    isActive ? "stroke-[2.5]" : ""
                  }`}
                />

                <span
                  className={`text-[10px] ${
                    isActive ? "font-semibold" : "font-normal"
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}