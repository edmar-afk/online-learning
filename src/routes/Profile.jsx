import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  GraduationCap,
  Calendar,
  Clock,
  Edit,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem("userInfo");

      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (error) {
      console.error("Failed to load user information:", error);
    }
  }, []);

  const role = (userInfo?.extra_info?.role || "student").toLowerCase();
  const isTeacher = role === "teacher";

  const fullName =
    [userInfo?.first_name, userInfo?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    userInfo?.username ||
    "User";

  const email = userInfo?.email || userInfo?.username || "Not provided";
  const schoolId = userInfo?.username || "Not provided";
  const course = userInfo?.extra_info?.section || "";
  const yearLevel = userInfo?.extra_info?.year_level || "";

  const memberSince = userInfo?.date_joined
    ? new Date(userInfo.date_joined).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-emerald-800 flex justify-center items-center p-0 sm:p-4">
      {/* Mobile container wrapper */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[auto] sm:rounded-3xl shadow-xl overflow-hidden flex flex-col pb-24">
        {/* Top Green Header Bar */}
        <div className="bg-emerald-800 text-white px-4 py-6 flex items-center justify-between shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-emerald-700 transition cursor-pointer focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-semibold tracking-wide">My Profile</h1>

          <div className="w-6" />
        </div>

        {/* Content Body */}
        <div className="px-6 pt-6 pb-8 flex-1 flex flex-col justify-between bg-white rounded-t-[30px] relative z-10">
          <div>
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-emerald-200 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
                <img
                  src={
                    isTeacher
                      ? "https://thumbs.dreamstime.com/b/male-teacher-avatar-educacion-school-character-profile-user-person-people-icon-vector-illustration-isolated-220472411.jpg"
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUU83J9alLn2hGDTtS-HMc5alqJ5SggXYzhFzyuETjrg&s=10"
                  }
                  alt={isTeacher ? "Teacher Avatar" : "Student Avatar"}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-3 text-center">
                {fullName}
              </h2>

              <p className="text-sm text-gray-500 mt-0.5 break-all text-center">
                {email}
              </p>

              {/* Role Badge */}
              <span className="mt-2.5 px-4 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100 capitalize">
                {role}
              </span>
            </div>

            {/* Info Cards List */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
              {/* School ID / Username */}
              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <UserRound className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {isTeacher ? "Username" : "School ID"}
                  </span>
                </div>

                <span className="text-sm font-semibold text-gray-900 text-right break-all">
                  {schoolId}
                </span>
              </div>

              {/* Role */}
              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Role
                  </span>
                </div>

                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {role}
                </span>
              </div>

              {/* Course - Students Only */}
              {!isTeacher && (
                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Course
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {course || "Not provided"}
                  </span>
                </div>
              )}

              {/* Year Level - Students Only */}
              {!isTeacher && (
                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Year Level
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {yearLevel || "Not provided"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Log Out Button */}
          <div className="mt-8 w-full">
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full py-3.5 border-2 border-orange-500 text-orange-500 font-semibold rounded-xl hover:bg-orange-50 transition-colors focus:outline-none tracking-wide text-sm cursor-pointer text-center"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
