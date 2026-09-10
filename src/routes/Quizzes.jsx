import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Clock3,
  BookOpen,
  Trophy,
  Flame,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

function Quizzes() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const quizzes = [
    {
      title: "Kitchen Fundamentals",
      description: "Test your knowledge of basic cooking techniques and kitchen skills.",
      category: "Basics",
      questions: 10,
      duration: "10 min",
      difficulty: "Easy",
      color: "bg-amber-500",
      icon: "🍳",
    },
    {
      title: "Food Safety & Sanitation",
      description: "Learn how to safely handle, prepare, and store food.",
      category: "Food Safety",
      questions: 15,
      duration: "15 min",
      difficulty: "Easy",
      color: "bg-emerald-600",
      icon: "🧼",
    },
    {
      title: "Cooking Methods",
      description: "Challenge yourself on baking, boiling, frying, roasting, and more.",
      category: "Techniques",
      questions: 15,
      duration: "15 min",
      difficulty: "Medium",
      color: "bg-orange-500",
      icon: "🍲",
    },
    {
      title: "Knife Skills",
      description: "Test your knowledge of proper knife handling and cutting techniques.",
      category: "Techniques",
      questions: 10,
      duration: "10 min",
      difficulty: "Medium",
      color: "bg-blue-500",
      icon: "🔪",
    },
    {
      title: "Sauces & Seasonings",
      description: "Identify sauces, seasonings, herbs, spices, and their uses.",
      category: "Cooking",
      questions: 12,
      duration: "12 min",
      difficulty: "Medium",
      color: "bg-purple-500",
      icon: "🥣",
    },
    {
      title: "Baking Basics",
      description: "Put your baking knowledge to the test with ingredients and techniques.",
      category: "Baking",
      questions: 15,
      duration: "15 min",
      difficulty: "Hard",
      color: "bg-pink-500",
      icon: "🧁",
    },
    {
      title: "Vegetables & Nutrition",
      description: "Test your knowledge of vegetables, nutrients, and healthy preparation.",
      category: "Nutrition",
      questions: 10,
      duration: "10 min",
      difficulty: "Easy",
      color: "bg-green-500",
      icon: "🥬",
    },
    {
      title: "Professional Cooking",
      description: "A challenging quiz covering advanced culinary knowledge.",
      category: "Advanced",
      questions: 20,
      duration: "20 min",
      difficulty: "Hard",
      color: "bg-red-500",
      icon: "👨‍🍳",
    },
  ];

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(search.toLowerCase()) ||
    quiz.category.toLowerCase().includes(search.toLowerCase())
  );

  const getDifficultyStyle = (difficulty) => {
    if (difficulty === "Easy") {
      return "bg-green-50 text-green-700";
    }

    if (difficulty === "Medium") {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-red-50 text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile Frame */}
      <div className="w-full max-w-md bg-gray-50 flex flex-col shadow-xl min-h-screen">

        {/* Header */}
        <header className="bg-emerald-800 text-white px-4 pt-6 pb-5">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="hover:opacity-80 transition-opacity focus:outline-none"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-lg font-semibold tracking-wide">
                Cooking Quizzes
              </h1>
              <p className="text-emerald-100 text-xs mt-0.5">
                Test your culinary knowledge
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pt-5 pb-24 overflow-y-auto">

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                bg-white
                border
                border-gray-100
                rounded-2xl
                pl-11
                pr-4
                py-3
                text-sm
                text-gray-800
                outline-none
                focus:ring-2
                focus:ring-emerald-200
                focus:border-emerald-400
                shadow-sm
              "
            />
          </div>

          {/* Quiz Summary */}
          <div className="bg-emerald-700 rounded-2xl p-4 mb-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Ready to test yourself?
                  </p>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Choose a quiz and start learning
                  </p>
                </div>
              </div>

              <Flame className="w-6 h-6 text-amber-300" />
            </div>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">
              All Quizzes
            </h2>

            <span className="text-xs text-gray-400">
              {filteredQuizzes.length} quizzes
            </span>
          </div>

          {/* Quiz Cards */}
          <div className="space-y-3">
            {filteredQuizzes.map((quiz, index) => (
              <div
                key={index}
                onClick={() => navigate(`/quizzes/${quiz.title.toLowerCase().replace(/\s+/g, "-")}`)}
                className="
                  bg-white
                  rounded-2xl
                  p-4
                  border
                  border-gray-100
                  shadow-sm
                  hover:shadow-md
                  transition
                  cursor-pointer
                  group
                "
              >
                <div className="flex items-start space-x-3">

                  {/* Quiz Icon */}
                  <div
                    className={`
                      ${quiz.color}
                      w-12
                      h-12
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      text-2xl
                      flex-shrink-0
                      shadow-sm
                    `}
                  >
                    {quiz.icon}
                  </div>

                  {/* Quiz Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {quiz.title}
                        </h3>

                        <p className="text-xs text-gray-400 mt-0.5">
                          {quiz.category}
                        </p>
                      </div>

                      <ChevronRight
                        className="
                          w-5
                          h-5
                          text-gray-300
                          group-hover:text-emerald-600
                          group-hover:translate-x-0.5
                          transition
                          flex-shrink-0
                        "
                      />
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed mt-2">
                      {quiz.description}
                    </p>

                    {/* Quiz Details */}
                    <div className="flex items-center flex-wrap gap-2 mt-3">

                      <span className="flex items-center gap-1 text-[11px] text-gray-500">
                        <BookOpen className="w-3.5 h-3.5" />
                        {quiz.questions} Questions
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Clock3 className="w-3.5 h-3.5" />
                        {quiz.duration}
                      </span>

                      <span
                        className={`
                          text-[10px]
                          font-semibold
                          px-2
                          py-1
                          rounded-full
                          ${getDifficultyStyle(quiz.difficulty)}
                        `}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* No Results */}
            {filteredQuizzes.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />

                <h3 className="text-sm font-semibold text-gray-700">
                  No quizzes found
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Try searching for another cooking topic.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default Quizzes;
