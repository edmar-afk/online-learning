import React from "react";

export default function EncouragementCard() {
  return (
    <section className="bg-[#f0fdf4] border border-green-100 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
      <div className="max-w-[200px]">
        <h3 className="font-bold text-gray-900 text-sm mb-1">Keep it up!</h3>

        <p className="text-[11px] text-gray-600 leading-relaxed">
          You've completed 6 lessons this week. Keep going to reach your goal!
        </p>
      </div>

      <div className="text-7xl select-none pt-2">🍲</div>
    </section>
  );
}
