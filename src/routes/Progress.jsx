
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Clock,
  CheckCircle2,
  Trophy,
  Target,
  TrendingUp,
  LoaderCircle,
  RefreshCw,
  CalendarDays,
  ChevronRight,
  BookMarked,
  PlayCircle,
} from "lucide-react";

import BottomNav from "../components/BottomNav";
import api from "../assets/api";
import StudentsProgress from "../components/progress/StudentsProgress";

/* -----------------------------------------
   USER HELPERS
----------------------------------------- */

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to read user information:", error);
    return null;
  }
};

const getUserRole = () => {
  const userInfo = getStoredUser();

  return String(
    userInfo?.role ||
      userInfo?.extra_info?.role ||
      userInfo?.user?.role ||
      userInfo?.user?.extra_info?.role ||
      userInfo?.userExtraInfo?.role ||
      userInfo?.user?.userExtraInfo?.role ||
      ""
  )
    .trim()
    .toLowerCase();
};

const getToken = () => {
  const userInfo = getStoredUser();

  return (
    userInfo?.access ||
    userInfo?.user?.access ||
    userInfo?.tokens?.access ||
    localStorage.getItem("access") ||
    null
  );
};

const getList = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.results)) {
    return responseData.results;
  }

  if (Array.isArray(responseData?.lessons)) {
    return responseData.lessons;
  }

  if (Array.isArray(responseData?.attempts)) {
    return responseData.attempts;
  }

  return [];
};

const formatDate = (dateString) => {
  if (!dateString) return "Date unavailable";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getCategoryStyle = (category) => {
  switch (String(category || "").toLowerCase()) {
    case "easy":
      return {
        text: "text-green-700",
        bar: "bg-green-600",
      };

    case "medium":
      return {
        text: "text-orange-500",
        bar: "bg-orange-500",
      };

    case "hard":
      return {
        text: "text-red-600",
        bar: "bg-red-500",
      };

    default:
      return {
        text: "text-sky-600",
        bar: "bg-sky-600",
      };
  }
};

/* -----------------------------------------
   MAIN ROLE ROUTER
----------------------------------------- */

export default function Progress() {
  const role = getUserRole();

  if (role === "teacher") {
    return <StudentsProgress />;
  }

  return <StudentProgress />;
}

/* -----------------------------------------
   STUDENT PROGRESS DASHBOARD
----------------------------------------- */

function StudentProgress() {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [loadingScores, setLoadingScores] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(true);

  const [scoreError, setScoreError] = useState("");
  const [lessonError, setLessonError] = useState("");

  const [showAllScores, setShowAllScores] = useState(false);
  const [showAllLessons, setShowAllLessons] = useState(false);

  const fetchScores = useCallback(async () => {
    try {
      setLoadingScores(true);
      setScoreError("");

      const token = getToken();

      if (!token) {
        setAttempts([]);
        setScoreError("Please log in to view your quiz scores.");
        return;
      }

      const response = await api.get("/quiz-attempts/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = getList(response.data).slice();

      data.sort((a, b) => {
        const dateA = new Date(a.completed_at || 0).getTime();
        const dateB = new Date(b.completed_at || 0).getTime();

        return dateB - dateA;
      });

      setAttempts(data);
    } catch (error) {
      console.error("Failed to load quiz scores:", error);

      setScoreError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Unable to load your quiz scores. Please try again."
      );
    } finally {
      setLoadingScores(false);
    }
  }, []);

  const fetchLessons = useCallback(async () => {
    try {
      setLoadingLessons(true);
      setLessonError("");

      const token = getToken();

      if (!token) {
        setLessons([]);
        setLessonError("Please log in to view saved lessons.");
        return;
      }

      const response = await api.get("/lessons/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = getList(response.data);

      data.sort((a, b) =>
        String(a.title || "").localeCompare(String(b.title || ""))
      );

      setLessons(data);
    } catch (error) {
      console.error("Failed to load lessons:", error);

      setLessonError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Unable to load saved lessons. Please try again."
      );
    } finally {
      setLoadingLessons(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
    fetchLessons();
  }, [fetchScores, fetchLessons]);

  const quizzesTaken = attempts.length;

  const averageScore = quizzesTaken
    ? attempts.reduce(
        (total, attempt) =>
          total + Number(attempt.percentage ?? 0),
        0
      ) / quizzesTaken
    : 0;

  const highestScore = quizzesTaken
    ? Math.max(
        ...attempts.map((attempt) =>
          Number(attempt.percentage ?? 0)
        )
      )
    : 0;

  const latestAttempt = attempts[0] || null;

  const completedLessonIds = useMemo(() => {
    const ids = new Set();

    attempts.forEach((attempt) => {
      const lessonId =
        attempt.lesson_id ??
        attempt.lesson?.id ??
        attempt.lesson;

      if (lessonId !== null && lessonId !== undefined) {
        ids.add(String(lessonId));
      }
    });

    return ids;
  }, [attempts]);

  const completedLessons = lessons.filter((lesson) =>
    completedLessonIds.has(String(lesson.id))
  ).length;

  const overallProgress = lessons.length
    ? Math.round((completedLessons / lessons.length) * 100)
    : 0;

  const visibleLessons = showAllLessons
    ? lessons
    : lessons.slice(0, 5);

  const visibleAttempts = showAllScores
    ? attempts
    : attempts.slice(0, 5);

  const categoryStats = useMemo(() => {
    const groups = {};

    attempts.forEach((attempt) => {
      const category = attempt.category || "General";
      const score = Number(attempt.percentage ?? 0);

      if (!groups[category]) {
        groups[category] = {
          category,
          count: 0,
          totalPercentage: 0,
          highestPercentage: 0,
        };
      }

      groups[category].count += 1;
      groups[category].totalPercentage += score;
      groups[category].highestPercentage = Math.max(
        groups[category].highestPercentage,
        score
      );
    });

    return Object.values(groups).map((group) => ({
      ...group,
      average: group.count
        ? group.totalPercentage / group.count
        : 0,
    }));
  }, [attempts]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-lg flex flex-col min-h-screen pb-24">
        {/* Header */}
        <div className="bg-green-800 text-white px-4 py-6 flex items-center justify-between shadow-md">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-green-700 transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-semibold tracking-wide">
            My Progress
          </h1>

          <button
            type="button"
            onClick={() => {
              fetchLessons();
              fetchScores();
            }}
            className="p-1 rounded-full hover:bg-green-700 transition"
            aria-label="Refresh progress"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 flex-1 overflow-y-auto pb-8">
          {/* Overall Progress */}
          <section>
            <h2 className="text-gray-800 font-bold text-base mb-3">
              Overall Progress
            </h2>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className="relative flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-32 h-32 -rotate-90"
                  viewBox="0 0 160 160"
                >
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-gray-100"
                    fill="transparent"
                  />

                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-green-700 transition-all duration-700"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      68 *
                      (1 - overallProgress / 100)
                    }
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-green-800">
                    {loadingLessons ? "..." : `${overallProgress}%`}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    Complete
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="p-2 bg-green-100 text-green-800 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">
                      Lessons Completed
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {loadingLessons
                        ? "..."
                        : `${completedLessons} / ${lessons.length}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">
                      Quizzes Taken
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {loadingScores ? "..." : quizzesTaken}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                    <BookMarked className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">
                      Saved Lessons
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {loadingLessons ? "..." : lessons.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!loadingLessons && lessons.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Completion is based on quiz attempts linked to lessons.
              </p>
            )}
          </section>

          {/* Quiz Performance */}
          <section>
            <h2 className="text-gray-800 font-bold text-base mb-3">
              Quiz Performance
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>

                <p className="text-xs text-gray-500 font-medium">
                  Average Score
                </p>

                <p className="text-2xl font-black text-green-800 mt-1">
                  {loadingScores
                    ? "..."
                    : `${averageScore.toFixed(1)}%`}
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  Across all attempts
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                  <Trophy className="w-5 h-5" />
                </div>

                <p className="text-xs text-gray-500 font-medium">
                  Highest Score
                </p>

                <p className="text-2xl font-black text-gray-800 mt-1">
                  {loadingScores
                    ? "..."
                    : `${highestScore.toFixed(1)}%`}
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  Best quiz attempt
                </p>
              </div>
            </div>
          </section>

          {/* Saved Lessons */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-gray-800 font-bold text-base">
                  Saved Lessons
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Lessons available in your database
                </p>
              </div>

              {!loadingLessons && lessons.length > 5 && (
                <button
                  type="button"
                  onClick={() =>
                    setShowAllLessons((current) => !current)
                  }
                  className="text-green-700 text-xs font-semibold hover:underline"
                >
                  {showAllLessons ? "Show Less" : "View All"}
                </button>
              )}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-100">
              {loadingLessons ? (
                <div className="p-6 text-center">
                  <LoaderCircle className="w-7 h-7 text-green-700 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    Loading saved lessons...
                  </p>
                </div>
              ) : lessonError ? (
                <div className="p-5 text-center">
                  <p className="text-xs text-red-600">
                    {lessonError}
                  </p>

                  <button
                    type="button"
                    onClick={fetchLessons}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-green-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                </div>
              ) : lessons.length === 0 ? (
                <div className="p-6 text-center">
                  <BookOpen className="w-9 h-9 text-gray-300 mx-auto mb-2" />

                  <p className="text-sm font-semibold text-gray-700">
                    No lessons found
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Lessons saved by your teacher will appear here.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/lessons")}
                    className="mt-3 px-4 py-2 bg-green-700 text-white rounded-xl text-xs font-semibold hover:bg-green-800"
                  >
                    Browse Lessons
                  </button>
                </div>
              ) : (
                visibleLessons.map((lesson) => {
                  const isCompleted = completedLessonIds.has(
                    String(lesson.id)
                  );

                  const videoCount = Array.isArray(lesson.videos)
                    ? lesson.videos.length
                    : 0;

                  return (
                    <button
                      type="button"
                      key={lesson.id}
                      onClick={() =>
                        navigate(`/lessons/${lesson.id}`)
                      }
                      className="w-full text-left p-3.5 flex items-start gap-3 hover:bg-gray-50 transition"
                    >
                      <div className="w-12 h-12 bg-green-100 text-green-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-800 break-words">
                          {lesson.title || "Untitled Lesson"}
                        </h3>

                        {lesson.topic && (
                          <p className="text-xs text-green-700 mt-1 break-words">
                            {lesson.topic}
                          </p>
                        )}

                        {lesson.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {lesson.difficulty && (
                            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
                              {lesson.difficulty}
                            </span>
                          )}

                          {videoCount > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-gray-500">
                              <PlayCircle className="w-3 h-3" />
                              {videoCount}{" "}
                              {videoCount === 1 ? "video" : "videos"}
                            </span>
                          )}

                          <span
                            className={`flex items-center gap-1 text-[10px] font-semibold ${
                              isCompleted
                                ? "text-green-700"
                                : "text-gray-400"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}

                            {isCompleted
                              ? "Completed"
                              : "Not completed"}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    </button>
                  );
                })
              )}

              {!loadingLessons &&
                !lessonError &&
                !showAllLessons &&
                lessons.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAllLessons(true)}
                    className="w-full p-3 text-center text-xs font-semibold text-green-700 hover:bg-green-50"
                  >
                    View all {lessons.length} lessons
                  </button>
                )}
            </div>
          </section>

          {/* Most Recent Quiz */}
          <section>
            <h2 className="text-gray-800 font-bold text-base mb-3">
              Most Recent Quiz
            </h2>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              {loadingScores ? (
                <div className="py-5 text-center">
                  <LoaderCircle className="w-7 h-7 text-green-700 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    Loading your latest quiz...
                  </p>
                </div>
              ) : latestAttempt ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-orange-500 text-white rounded-xl flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-800 break-words">
                        {latestAttempt.quiz_title || "Untitled Quiz"}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {latestAttempt.category || "General"}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(latestAttempt.completed_at)}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-black text-green-700">
                        {Number(
                          latestAttempt.percentage ?? 0
                        ).toFixed(0)}
                        %
                      </p>

                      <p className="text-[11px] text-gray-500">
                        {latestAttempt.score ?? 0}/
                        {latestAttempt.total_questions ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                    <div
                      className="h-full bg-green-600 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            Number(latestAttempt.percentage ?? 0)
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/quizzes/${latestAttempt.quiz_id ?? latestAttempt.lesson_id ?? latestAttempt.lesson?.id ?? latestAttempt.lesson}`
                      )
                    }
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-green-50 text-green-800 rounded-xl py-2.5 text-xs font-bold hover:bg-green-100 transition"
                  >
                    Review Quiz
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-center py-5">
                  <Target className="w-9 h-9 text-gray-300 mx-auto mb-2" />

                  <p className="text-sm font-semibold text-gray-700">
                    No quiz attempts yet
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Complete a quiz to see your results here.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/quizzes")}
                    className="mt-3 px-4 py-2 bg-green-700 text-white rounded-xl text-xs font-semibold hover:bg-green-800"
                  >
                    Browse Quizzes
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Recent Quiz Activity */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-800 font-bold text-base">
                Recent Activity
              </h2>

              {attempts.length > 5 && (
                <button
                  type="button"
                  onClick={() =>
                    setShowAllScores((current) => !current)
                  }
                  className="text-green-700 text-xs font-semibold hover:underline"
                >
                  {showAllScores ? "Show Less" : "View All"}
                </button>
              )}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-100">
              {loadingScores ? (
                <div className="p-6 text-center">
                  <LoaderCircle className="w-6 h-6 text-green-700 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    Loading activity...
                  </p>
                </div>
              ) : scoreError ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-red-600">
                    {scoreError}
                  </p>

                  <button
                    type="button"
                    onClick={fetchScores}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-green-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                </div>
              ) : attempts.length === 0 ? (
                <div className="p-5 text-center">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    Your quiz activity will appear here.
                  </p>
                </div>
              ) : (
                visibleAttempts.map((attempt, index) => {
                  const quizId =
                    attempt.quiz_id ??
                    attempt.lesson_id ??
                    attempt.lesson?.id ??
                    attempt.lesson;

                  return (
                    <button
                      type="button"
                      key={attempt.id ?? `${quizId}-${index}`}
                      onClick={() => {
                        if (quizId !== null && quizId !== undefined) {
                          navigate(`/quizzes/${quizId}`);
                        }
                      }}
                      className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-orange-500 text-white rounded-xl flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-gray-800 break-words">
                            {attempt.quiz_title || "Untitled Quiz"}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1">
                            {attempt.category || "General"} ·{" "}
                            {attempt.score ?? 0}/
                            {attempt.total_questions ?? 0} correct
                          </p>

                          <p className="text-[11px] text-gray-400 mt-1">
                            {formatDate(attempt.completed_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-sm font-bold text-green-700">
                          {Number(
                            attempt.percentage ?? 0
                          ).toFixed(0)}
                          %
                        </span>

                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* Score by Category */}
          <section>
            <h2 className="text-gray-800 font-bold text-base mb-3">
              Score by Category
            </h2>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 space-y-5">
              {loadingScores ? (
                <div className="py-4 text-center">
                  <LoaderCircle className="w-6 h-6 text-green-700 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    Calculating category scores...
                  </p>
                </div>
              ) : scoreError ? (
                <p className="text-xs text-red-600">
                  {scoreError}
                </p>
              ) : categoryStats.length === 0 ? (
                <div className="py-4 text-center">
                  <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    Category scores will appear after you take a quiz.
                  </p>
                </div>
              ) : (
                categoryStats.map((category) => {
                  const style = getCategoryStyle(category.category);

                  return (
                    <div key={category.category}>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-gray-800">
                            {category.category}
                          </span>

                          <p className="text-[11px] text-gray-400">
                            {category.count}{" "}
                            {category.count === 1
                              ? "attempt"
                              : "attempts"}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span
                            className={`text-sm font-bold ${style.text}`}
                          >
                            {category.average.toFixed(1)}%
                          </span>

                          <p className="text-[10px] text-gray-400">
                            Average
                          </p>
                        </div>
                      </div>

                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`${style.bar} h-full rounded-full transition-all duration-700`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, category.average)
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="text-[10px] text-gray-400 mt-1.5">
                        Highest score:{" "}
                        {category.highestPercentage.toFixed(1)}%
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
