import React from "react";
import { FiPlay } from "react-icons/fi";

export default function ContinueLearning() {
  return (
    <section>
      <div className="flex justify-between items-center mb-3 mt-12">
        <h2 className="font-bold text-gray-900 text-base">
          Continue Learning
        </h2>

        <button className="text-xs font-semibold text-[#2e7d32] hover:underline">
          View All
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm flex items-center gap-4 relative">
        <img
          src="https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=300&auto=format&fit=crop&q=80"
          alt="Pasta and Sauces"
          className="w-32 h-32 object-cover rounded-xl shrink-0"
        />

        <div className="flex-1 min-w-0">
          <span className="text-xs text-gray-400 font-medium block">
            Lesson 3
          </span>

          <h3 className="font-bold text-gray-900 text-sm truncate mt-0.5">
            Pasta and Sauces
          </h3>

          <p className="text-xs text-gray-500 mt-2 mb-1">
            75% Complete
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#f97316] h-full rounded-full"
              style={{ width: "75%" }}
            />
          </div>
        </div>

        {/* Play Button */}
        <button className="absolute right-2 bottom-6 bg-[#2e7d32] text-white p-2.5 rounded-full shadow-md flex items-center justify-center hover:bg-green-700 transition">
          <FiPlay className="text-xs fill-current ml-0.5" />
        </button>
      </div>
    </section>
  );
}