import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Clock,
  CheckCircle2,
  Video,
  Utensils,
  Soup,
  CookingPot,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

export default function Progress() {
  const navigate = useNavigate();

  // Percentage complete for the circular progress bar
  const percentage = 68;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-lg flex flex-col min-h-screen pb-24">
        {/* Top Header */}
        <div className="bg-emerald-800 text-white px-4 py-6 flex items-center justify-between shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-emerald-700 transition cursor-pointer focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-semibold tracking-wide">My Progress</h1>

          <div className="w-6" />
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto pb-8">
          {/* Overall Progress Section */}
          <div>
            <h2 className="text-gray-800 font-bold text-base mb-3">
              Overall Progress
            </h2>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-row items-center gap-4">
              {/* Circular Progress Indicator */}
              <div className="relative flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-36 h-36 transform -rotate-90 overflow-visible"
                  viewBox="0 0 160 160"
                >
                  {/* Background Track */}
                  <circle
                    cx="80"
                    cy="80"
                    r={68}
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-gray-100"
                    fill="transparent"
                  />

                  {/* Progress Indicator */}
                  <circle
                    cx="80"
                    cy="80"
                    r={68}
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-emerald-700 transition-all duration-1000 ease-out"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-emerald-800">
                    {percentage}%
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    Complete
                  </span>
                </div>
              </div>

              {/* Stat Cards Column */}
              <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                {/* Lessons Completed */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium truncate">
                      Lessons Completed
                    </p>
                    <p className="text-sm font-bold text-gray-800">24 / 35</p>
                  </div>
                </div>

                {/* Quizzes Taken */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium truncate">
                      Quizzes Taken
                    </p>
                    <p className="text-sm font-bold text-gray-800">18 / 25</p>
                  </div>
                </div>

                {/* Study Time */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="p-2 bg-sky-100 text-sky-600 rounded-lg flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium truncate">
                      Study Time
                    </p>
                    <p className="text-sm font-bold text-gray-800">12h 45m</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-800 font-bold text-base">
                Recent Activity
              </h2>

              <button className="text-emerald-700 text-xs font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-100">
              {/* Activity Item 1 */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-700 text-white rounded-xl">
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-800">
                      Completed Lesson
                    </h3>
                    <p className="text-xs text-gray-500">Pasta and Sauces</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-gray-400 font-medium">
                    Today, 8:30 AM
                  </span>

                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                </div>
              </div>

              {/* Activity Item 2 */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-500 text-white rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-800">
                      Quiz Passed
                    </h3>
                    <p className="text-xs text-gray-500">Lesson 2 Quiz</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-gray-400 font-medium">
                    Yesterday, 4:15 PM
                  </span>

                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                </div>
              </div>

              {/* Activity Item 3 */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-500 text-white rounded-xl">
                    <Video className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-800">
                      Watched Video
                    </h3>
                    <p className="text-xs text-gray-500">Basic Knife Skills</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-gray-400 font-medium">
                    May 18, 2024
                  </span>

                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                </div>
              </div>
            </div>
          </div>

          {/* Progress by Category Section */}
          <div>
            <h2 className="text-gray-800 font-bold text-base mb-3">
              Progress by Category
            </h2>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 space-y-4">
              {/* Category 1: Appetizers */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-orange-500 text-white rounded-xl">
                      <Utensils className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-bold text-gray-800">
                      Appetizers
                    </span>
                  </div>

                  <span className="text-xs font-bold text-orange-500">
                    8 / 12
                  </span>
                </div>

                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full"
                    style={{ width: "66%" }}
                  />
                </div>
              </div>

              {/* Category 2: Soups */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-700 text-white rounded-xl">
                      <Soup className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-bold text-gray-800">
                      Soups
                    </span>
                  </div>

                  <span className="text-xs font-bold text-emerald-700">
                    7 / 10
                  </span>
                </div>

                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full"
                    style={{ width: "70%" }}
                  />
                </div>
              </div>

              {/* Category 3: Main Courses */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-orange-500 text-white rounded-xl">
                      <CookingPot className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-bold text-gray-800">
                      Main Courses
                    </span>
                  </div>

                  <span className="text-xs font-bold text-orange-500">
                    12 / 18
                  </span>
                </div>

                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full"
                    style={{ width: "66%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav/>
    </div>
  );
}
