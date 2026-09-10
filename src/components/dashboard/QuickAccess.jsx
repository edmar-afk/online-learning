import React from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiClipboard,
  FiVideo,
  FiEdit3,
  FiMonitor,
  FiTrendingUp,
  FiBookmark,
} from "react-icons/fi";

function QuickAccessItem({
  icon,
  label,
  color,
  iconColor = "text-white",
  link,
}) {
  return (
    <Link to={link} className="flex flex-col items-center cursor-pointer group">
      <div
        className={`
          w-13 h-13
          ${color}
          ${iconColor}
          rounded-2xl
          flex
          items-center
          justify-center
          shadow-sm
          group-hover:scale-105
          transition
        `}
      >
        {icon}
      </div>

      <span className="text-xs text-gray-700 font-medium mt-1.5">{label}</span>
    </Link>
  );
}

export default function QuickAccess() {
  return (
    <section>
      <h2 className="font-bold text-gray-900 text-base mb-4">Quick Access</h2>

      <div className="grid grid-cols-4 gap-y-5 gap-x-2 text-center">
        <QuickAccessItem
          icon={<FiBookOpen className="text-xl" />}
          label="Lessons"
          link="/lessons"
          color="bg-amber-500"
        />

        <QuickAccessItem
          icon={<FiClipboard className="text-xl" />}
          label="Recipe Guides"
          link="/recipe-guides"
          color="bg-emerald-600"
        />

        <QuickAccessItem
          icon={<FiVideo className="text-xl" />}
          label="Videos"
          link="/videos"
          color="bg-blue-500"
        />

        <QuickAccessItem
          icon={<FiEdit3 className="text-xl" />}
          label="Quizzes"
          link="/quizzes"
          color="bg-amber-500"
        />

        <QuickAccessItem
          icon={<FiMonitor className="text-xl" />}
          label="Presentations"
          link="/presentations"
          color="bg-red-500"
        />

        <QuickAccessItem
          icon={<FiTrendingUp className="text-xl" />}
          label="My Progress"
          link="/progress"
          color="bg-purple-500"
        />

        <QuickAccessItem
          icon={<FiBookmark className="text-xl" />}
          label="Bookmarks"
          link="/bookmarks"
          color="bg-emerald-500"
        />
      </div>
    </section>
  );
}
