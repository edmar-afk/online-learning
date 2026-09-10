import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Utensils,
  Soup,
  CookingPot,
  Cake,
  Coffee,
  ChefHat,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

export default function Lessons() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Appetizers",
      lessons: "12 Lessons",
      icon: <Utensils className="w-6 h-6 text-white" />,
      bgColor: "bg-amber-500",
    },
    {
      title: "Soups",
      lessons: "10 Lessons",
      icon: <Soup className="w-6 h-6 text-white" />,
      bgColor: "bg-emerald-600",
    },
    {
      title: "Main Courses",
      lessons: "18 Lessons",
      icon: <CookingPot className="w-6 h-6 text-white" />,
      bgColor: "bg-orange-500",
    },
    {
      title: "Desserts",
      lessons: "14 Lessons",
      icon: <Cake className="w-6 h-6 text-white" />,
      bgColor: "bg-pink-400",
    },
    {
      title: "Beverages",
      lessons: "8 Lessons",
      icon: <Coffee className="w-6 h-6 text-white" />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Baking",
      lessons: "15 Lessons",
      icon: <ChefHat className="w-6 h-6 text-white" />,
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-gray-50 flex flex-col shadow-xl">
        
        {/* Top Header */}
        <header className="bg-emerald-800 text-white px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="focus:outline-none hover:opacity-80 transition-opacity"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <h1 className="text-lg font-medium tracking-wide">
              Lesson Categories
            </h1>
          </div>
        </header>

        {/* Categories List */}
        <main className="flex-1 px-4 py-5 space-y-4 overflow-y-auto mb-18">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-3.5 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Left Side: Icon & Titles */}
              <div className="flex items-center space-x-4">
                <div
                  className={`${cat.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm`}
                >
                  {cat.icon}
                </div>

                <div>
                  <h2 className="text-gray-900 font-semibold text-base">
                    {cat.title}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    {cat.lessons}
                  </p>
                </div>
              </div>

              {/* Right Side: Arrow Icon */}
              <div className="pr-2 text-gray-400">
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          ))}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}