import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Phone,
  GraduationCap,
  Calendar,
  Clock,
  Edit,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-emerald-800 flex justify-center items-center p-0 sm:p-4">
      {/* Mobile container wrapper */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[auto] sm:rounded-3xl shadow-xl overflow-hidden flex flex-col pb-24">
        {/* Top Green Header Bar */}
        <div className="bg-[#2E6930] px-4 py-6 flex items-center justify-between text-white">
          <button
            onClick={() => navigate(-1)}
            className="focus:outline-none cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium tracking-wide">My Profile</h1>
          <button className="focus:outline-none">
            <Edit className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 pt-6 pb-8 flex-1 flex flex-col justify-between bg-white rounded-t-[30px] relative z-10">
          <div>
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-emerald-200 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-3">
                Juan Dela Cruz
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                juan.delacruz@email.com
              </p>

              {/* Student Badge */}
              <span className="mt-2.5 px-4 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                Student
              </span>
            </div>

            {/* Info Cards List */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
              {/* Mobile Number */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Mobile Number
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  09123456789
                </span>
              </div>

              {/* Course */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Course
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  BTVTED-FSM
                </span>
              </div>

              {/* Year Level */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Year Level
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  3rd Year
                </span>
              </div>

              {/* Member Since */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Member Since
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  May 10, 2024
                </span>
              </div>
            </div>
          </div>

          {/* Log Out Button */}
          <div className="mt-8 w-full">
            <Link
              to="/login"
              className="block w-full py-3.5 border-2 border-orange-500 text-orange-500 font-semibold rounded-xl hover:bg-orange-50 transition-colors focus:outline-none tracking-wide text-sm cursor-pointer text-center"
            >
              LOG OUT
            </Link>
          </div>
        </div>
      </div>
      <BottomNav/>
    </div>
  );
}
