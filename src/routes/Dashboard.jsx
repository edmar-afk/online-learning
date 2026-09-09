import React from "react";

import BottomNav from "../components/BottomNav";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import ContinueLearning from "../components/dashboard/ContinueLearning";
import QuickAccess from "../components/dashboard/QuickAccess";
import EncouragementCard from "../components/dashboard/EncouragementCard";

export default function Dashboard() {
  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">

      {/* Mobile Screen Container */}
      <div className="w-full max-w-md bg-white flex flex-col shadow-xl relative pb-20 min-h-screen">

        {/* Header */}
        <DashboardHeader />

        {/* Dashboard Content */}
        <main className="px-6 py-5 space-y-6 flex-1">

          {/* Continue Learning */}
          <ContinueLearning />

          {/* Quick Access */}
          <QuickAccess />

          {/* Encouragement */}
          <EncouragementCard />

        </main>

        {/* Bottom Navigation */}
        <BottomNav />

      </div>
    </div>
  );
}