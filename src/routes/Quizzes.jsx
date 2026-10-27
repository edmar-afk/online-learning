import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Clock3,
  BookOpen,
  Trophy,
  Flame,
  Plus,
  LoaderCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import CreateQuizModal from "../components/quizzes/CreateQuizModal";
import api from "../assets/api";

function Quizzes() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("userInfo");
  const userInfo = storedUser ? JSON.parse(storedUser) : null;

  const isTeacher =
    (userInfo?.role || userInfo?.user?.role || "").toLowerCase() === "teacher";

  const [search, setSearch] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/quizzes/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setQuizzes(data);

      // Get the logged-in user's saved attempt for each quiz.
      const storedUser = localStorage.getItem("userInfo");
      const userInfo = storedUser ? JSON.parse(storedUser) : null;
      const token = userInfo?.access || userInfo?.user?.access;

      if (!token) {
        setAttempts({});
        return;
      }

      const attemptResults = await Promise.all(
        data.map(async (quiz) => {
          try {
            const attemptResponse = await api.get(
              `/quizzes/${quiz.id}/my-attempt/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            return [quiz.id, attemptResponse.data];
          } catch (err) {
            // A 404 means this user has not taken this quiz yet.
            if (err.response?.status === 404) {
              return [quiz.id, null];
            }

            console.error(`Failed to load score for quiz ${quiz.id}:`, err);

            return [quiz.id, null];
          }
        }),
      );

      setAttempts(Object.fromEntries(attemptResults));
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load quizzes. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const filteredQuizzes = quizzes.filter((quiz) =>
    (quiz.title || "").toLowerCase().includes(search.toLowerCase()),
  );

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-50 text-green-700";
      case "Medium":
        return "bg-amber-50 text-amber-700";
      case "Hard":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getQuizColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-600";
      case "Medium":
        return "bg-amber-500";
      case "Hard":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getQuizIcon = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "🍳";
      case "Medium":
        return "🍲";
      case "Hard":
        return "👨‍🍳";
      default:
        return "📝";
    }
  };

  const handleQuizCreated = () => {
    setShowCreateModal(false);
    fetchQuizzes();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-gray-50 flex flex-col shadow-xl min-h-screen">
        {/* Header */}
        <header className="bg-green-900 text-white px-4 pt-6 pb-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
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

            {isTeacher && (
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 bg-white text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                Create
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pt-5 pb-24 overflow-y-auto">
          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search quizzes by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 shadow-sm"
            />
          </div>

          {/* Summary */}
          <div className="bg-green-900 rounded-2xl p-4 mb-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs text-emerald-100">
                Available quizzes
              </span>
              <span className="text-sm font-bold">{quizzes.length}</span>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">All Quizzes</h2>

            <span className="text-xs text-gray-400">
              {filteredQuizzes.length} quizzes
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <LoaderCircle className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Loading quizzes and scores...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-white rounded-2xl p-6 text-center border border-red-100">
              <p className="text-sm font-semibold text-red-600">{error}</p>

              <button
                type="button"
                onClick={fetchQuizzes}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900 text-white text-sm font-semibold hover:bg-emerald-800"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {/* Quiz Cards */}

          {/* Quiz Cards */}
          {!loading && !error && (
            <div className="space-y-4">
              {filteredQuizzes.map((quiz) => {
                const questionCount = Number(quiz.number_of_questions) || 0;
                const attempt = attempts[quiz.id];

                const hasAttempt =
                  attempt &&
                  attempt.score !== undefined &&
                  attempt.total_questions !== undefined;

                const percentage = hasAttempt
                  ? Number(
                      attempt.percentage ??
                        (attempt.total_questions > 0
                          ? (attempt.score / attempt.total_questions) * 100
                          : 0),
                    )
                  : 0;

                return (
                  <button
                    type="button"
                    key={quiz.id}
                    onClick={() => navigate(`/quizzes/${quiz.id}`)}
                    className="w-full text-left bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all overflow-hidden"
                  >
                    <div className="p-4">
                      {/* Title and Icon */}
                      <div className="flex items-start gap-3">
                        <div
                          className={`${getQuizColor(
                            quiz.difficulty,
                          )} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0`}
                        >
                          {getQuizIcon(quiz.difficulty)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 leading-5 break-words">
                            {quiz.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            Quiz #{quiz.id}
                          </p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                      </div>

                      {/* Difficulty and Quiz Details */}
                      <div className="flex items-center gap-2 flex-wrap mt-4">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${getDifficultyStyle(
                            quiz.difficulty,
                          )}`}
                        >
                          {quiz.difficulty || "General"}
                        </span>

                        <span className="h-4 w-px bg-gray-200" />

                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                          <BookOpen className="w-3.5 h-3.5" />
                          {questionCount}{" "}
                          {questionCount === 1 ? "Question" : "Questions"}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock3 className="w-3.5 h-3.5" />
                          {questionCount} min
                        </span>
                      </div>
                    </div>

                    {/* Score Section */}
                    <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-3">
                      {hasAttempt ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                              <Trophy className="w-4 h-4 text-green-900" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-800">
                                Your Score
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                {attempt.score} out of {attempt.total_questions}{" "}
                                correct
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-green-900 leading-5">
                              {percentage.toFixed(0)}%
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              Completed
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                              <BookOpen className="w-4 h-4 text-gray-500" />
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-700">
                                Not taken yet
                              </p>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                Tap to start this quiz
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-semibold text-green-900">
                            Start Quiz
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* No Results */}
              {filteredQuizzes.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />

                  <h3 className="text-sm font-semibold text-gray-700">
                    {search ? "No quizzes found" : "No quizzes available"}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {search
                      ? "Try searching for another quiz title."
                      : isTeacher
                        ? "Create your first quiz to get started."
                        : "There are no quizzes available yet. Please wait for the teacher."}
                  </p>

                  {!search && isTeacher && (
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900 text-white text-sm font-semibold hover:bg-emerald-800"
                    >
                      <Plus className="w-4 h-4" />
                      Create Quiz
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <BottomNav />

      {/* Create Quiz Modal */}
      <CreateQuizModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleQuizCreated}
      />
    </div>
  );
}

export default Quizzes;
