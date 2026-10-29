import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  Search,
  Target,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import BottomNav from "../BottomNav";
import api from "../../assets/api";

const getToken = () => {
  try {
    const stored = localStorage.getItem("userInfo");
    const info = stored ? JSON.parse(stored) : null;
    return (
      info?.access ||
      info?.user?.access ||
      info?.tokens?.access ||
      localStorage.getItem("access")
    );
  } catch {
    return localStorage.getItem("access");
  }
};

const formatDate = (value) => {
  if (!value) return "No quiz attempts yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const percent = (value) => `${Number(value || 0).toFixed(1)}%`;

export default function StudentsProgress() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({
    students_count: 0,
    lessons_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    quizzes: true,
    categories: true,
    lessons: true,
  });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = getToken();
    if (!token) {
      setStudents([]);
      setError("Please log in with a teacher account.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/teacher/students-progress/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data || {};
      setStudents(Array.isArray(data.students) ? data.students : []);
      setSummary({
        students_count: Number(data.students_count || 0),
        lessons_count: Number(data.lessons_count || 0),
        quizzes_count: Number(data.quizzes_count || 0),
      });
    } catch (err) {
      console.error("Failed to load students progress:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load student progress. Check your teacher account and API endpoint.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;

    return students.filter((student) =>
      [
        student.full_name,
        student.username,
        student.email,
        student.year_level,
        student.section,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [students, search]);

  const toggleSection = (section) => {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const SectionHeader = ({ title, section, icon: Icon }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between gap-3 py-3 text-left"
    >
      <span className="flex items-center gap-2 font-bold text-gray-800">
        <Icon className="w-4 h-4 text-green-700" />
        {title}
      </span>
      {expandedSections[section] ? (
        <ChevronUp className="w-4 h-4 text-gray-400" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg min-h-screen pb-24">
        <header className="bg-green-800 text-white px-4 py-5 sm:px-6 flex items-center justify-between shadow-md">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 rounded-full hover:bg-green-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold tracking-wide">
              Students Progress
            </h1>
            <p className="text-xs text-green-100 mt-1">
              Monitor quiz results and lesson completion
            </p>
          </div>
          <button
            type="button"
            onClick={fetchStudents}
            aria-label="Refresh student progress"
            className="p-2 rounded-full hover:bg-green-700"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </header>

        <main className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center mb-3">
                <UserRound className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500">Registered Students</p>
              <p className="text-2xl font-black text-gray-900">
                {loading ? "…" : summary.students_count}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500">Available Quizzes</p>
              <p className="text-2xl font-black text-gray-900">
                {loading ? "…" : (summary.quizzes_count ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500">Available Lessons</p>
              <p className="text-2xl font-black text-gray-900">
                {loading ? "…" : summary.lessons_count}
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students by name, username, email, year, or section..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-14 text-center">
              <LoaderCircle className="w-8 h-8 animate-spin text-green-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Loading registered students...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={fetchStudents}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                <RefreshCw className="w-4 h-4" /> Try again
              </button>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 p-10 text-center">
              <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">
                {search
                  ? "No students match your search"
                  : "No registered students found"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {search
                  ? "Try another name, username, year level, or section."
                  : "Accounts with the student role will appear here."}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-800">All Students</h2>
                <span className="text-xs text-gray-500">
                  {filteredStudents.length} result
                  {filteredStudents.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredStudents.map((student) => (
                  <button
                    type="button"
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="text-left rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:border-green-200 hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0">
                        <UserRound className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 break-words">
                          {student.full_name || student.username}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 break-all">
                          @{student.username}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {[student.year_level, student.section]
                            .filter(Boolean)
                            .join(" • ") || "Year level / section not set"}
                        </p>
                      </div>
                      <span className="text-green-700 text-xs font-bold">
                        View
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-500">Quizzes</p>
                        <p className="text-lg font-black text-gray-800">
                          {student.quizzes_taken}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-500">Average</p>
                        <p className="text-lg font-black text-green-700">
                          {percent(student.average_score)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-500">Lessons</p>
                        <p className="text-lg font-black text-gray-800">
                          {student.lessons_completed}/{student.lessons_total}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                        <span>Average lesson progress</span>
                        <span>{percent(student.lesson_progress_average)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-600"
                          style={{
                            width: `${Math.max(0, Math.min(100, Number(student.lesson_progress_average || 0)))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </main>

        {selectedStudent && (
          <div
            className="fixed inset-0 z-50 bg-black/50 p-3 sm:p-6 flex items-center justify-center"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget)
                setSelectedStudent(null);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedStudent.full_name} progress`}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="sticky top-0 z-10 bg-green-800 text-white p-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">
                    {selectedStudent.full_name || selectedStudent.username}
                  </h2>
                  <p className="text-xs text-green-100 mt-1">
                    @{selectedStudent.username}
                    {selectedStudent.email ? ` • ${selectedStudent.email}` : ""}
                  </p>
                  <p className="text-xs text-green-100 mt-1">
                    {[selectedStudent.year_level, selectedStudent.section]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  aria-label="Close student details"
                  className="p-2 rounded-lg hover:bg-green-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ["Quizzes taken", selectedStudent.quizzes_taken],
                    ["Average score", percent(selectedStudent.average_score)],
                    ["Highest score", percent(selectedStudent.highest_score)],
                    [
                      "Lessons completed",
                      `${selectedStudent.lessons_completed}/${selectedStudent.lessons_total}`,
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-gray-100 p-3"
                    >
                      <p className="text-[11px] text-gray-500">{label}</p>
                      <p className="text-lg font-black text-gray-900 mt-1">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <section>
                  <SectionHeader
                    title="Quiz Attempts"
                    section="quizzes"
                    icon={FileText}
                  />
                  {expandedSections.quizzes &&
                    (selectedStudent.attempts?.length ? (
                      <div className="divide-y divide-gray-100 border-y border-gray-100">
                        {selectedStudent.attempts.map((attempt) => (
                          <div
                            key={attempt.id}
                            className="py-3 flex items-start justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 break-words">
                                {attempt.quiz_title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {attempt.category} • {attempt.score}/
                                {attempt.total_questions} correct
                              </p>
                              <p className="text-[11px] text-gray-400 mt-1">
                                {formatDate(attempt.completed_at)}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-black text-green-700">
                                {percent(attempt.percentage)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-4">
                        This student has not taken any quizzes yet.
                      </p>
                    ))}
                </section>

                <section>
                  <SectionHeader
                    title="Scores by Quiz Difficulty"
                    section="categories"
                    icon={Target}
                  />
                  {expandedSections.categories &&
                    (selectedStudent.categories?.length ? (
                      <div className="space-y-4 border-t border-gray-100 pt-4">
                        {selectedStudent.categories.map((category) => (
                          <div key={category.category}>
                            <div className="flex justify-between gap-3 text-sm">
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {category.category}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {category.attempts} attempt
                                  {category.attempts === 1 ? "" : "s"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-700">
                                  {percent(category.average_score)} average
                                </p>
                                <p className="text-xs text-gray-500">
                                  Best: {percent(category.highest_score)}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600 rounded-full"
                                style={{
                                  width: `${Math.max(0, Math.min(100, Number(category.average_score || 0)))}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-4">
                        Category scores will appear after the student takes a
                        quiz.
                      </p>
                    ))}
                </section>

                <section>
                  <SectionHeader
                    title="Lesson Progress"
                    section="lessons"
                    icon={BookOpen}
                  />
                  {expandedSections.lessons &&
                    (selectedStudent.lesson_progress?.length ? (
                      <div className="divide-y divide-gray-100 border-y border-gray-100">
                        {selectedStudent.lesson_progress.map((lesson) => (
                          <div key={lesson.lesson_id} className="py-3">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-semibold text-gray-800">
                                {lesson.title}
                              </p>
                              <span
                                className={`flex items-center gap-1 text-xs font-semibold ${lesson.completed ? "text-green-700" : "text-gray-500"}`}
                              >
                                {lesson.completed && (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                {lesson.completed
                                  ? "Completed"
                                  : percent(lesson.progress_percent)}
                              </span>
                            </div>
                            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${lesson.completed ? "bg-green-600" : "bg-sky-600"}`}
                                style={{
                                  width: `${Math.max(0, Math.min(100, Number(lesson.progress_percent || 0)))}%`,
                                }}
                              />
                            </div>
                            {lesson.updated_at && (
                              <p className="text-[11px] text-gray-400 mt-1">
                                Updated {formatDate(lesson.updated_at)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-4">
                        No lessons are available yet.
                      </p>
                    ))}
                </section>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Quiz averages are calculated from all saved attempts, not only
                  each quiz's latest attempt.
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
