
import React, { useEffect, useState } from "react";

import BottomNav from "../components/BottomNav";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ContinueLearning from "../components/dashboard/ContinueLearning";
import QuickAccess from "../components/dashboard/QuickAccess";
import QuickAccessTeacher from "../components/dashboard/QuickAccessTeacher";

export default function Dashboard() {
  const [role, setRole] = useState("");

  useEffect(() => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo") || "{}"
      );

      const userRole = userInfo?.extra_info?.role || "";

      setRole(userRole);

      console.log("User role:", userRole);
    } catch (error) {
      console.error("Failed to parse userInfo:", error);
    }
  }, []);

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white flex flex-col shadow-xl relative pb-20 min-h-screen">
        <DashboardHeader />

        <main className="px-6 py-5 space-y-6 flex-1">
          {role !== "teacher" && <ContinueLearning />}

          {role === "teacher" ? (
            <QuickAccessTeacher />
          ) : (
            <QuickAccess />
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
