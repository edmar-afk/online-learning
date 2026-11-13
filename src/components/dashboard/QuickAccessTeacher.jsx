import React from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiEdit3,
  FiMonitor,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";

function QuickAccessItem({ icon, label, color, link }) {
  return (
    <Link
      to={link}
      className="flex flex-col items-center justify-center gap-4
                 w-full min-h-40 p-5 rounded-2xl bg-white
                 border border-gray-100 shadow-md
                 hover:shadow-lg hover:-translate-y-1
                 transition-all duration-200 group"
    >
      <div
        className={`
          w-16 h-16
          ${color}
          text-white
          rounded-2xl
          flex items-center justify-center
          shadow-sm
          group-hover:scale-110
          transition-transform duration-200
        `}
      >
        {React.cloneElement(icon, { size: 30 })}
      </div>

      <span className="text-sm font-semibold text-gray-800 text-center leading-snug">
        {label}
      </span>
    </Link>
  );
}

export default function QuickAccessTeacher() {
  return (
    <section className="w-full">
      <h2 className="font-bold text-gray-900 text-lg mb-5">Quick Access</h2>

      <div className="grid grid-cols-2 gap-4 text-center">
        <QuickAccessItem
          icon={<FiUser />}
          label="Register Student"
          link="/register"
          color="bg-green-900"
        />

        <QuickAccessItem
          icon={<FiBookOpen />}
          label="Manage Lesson Materials"
          link="/lessons"
          color="bg-green-900"
        />

        <QuickAccessItem
          icon={<FiEdit3 />}
          label={
            <>
              Manage
              <br />
              Quizzes
            </>
          }
          link="/quizzes"
          color="bg-green-900"
        />

        <QuickAccessItem
          icon={<FiMonitor />}
          label="Upload Presentation"
          link="/presentations"
          color="bg-green-900"
        />

        <QuickAccessItem
          icon={<FiTrendingUp />}
          label="View Scores and Progress"
          link="/progress"
          color="bg-green-900"
        />
      </div>
    </section>
  );
}
