
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  BookOpen,
  ChevronRight,
  Video,
  Image as ImageIcon,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import CreateLessonModal from "../components/lessons/CreateLessonModal";
import api from "../assets/api";

export default function Lessons() {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const storedUser = localStorage.getItem("userInfo");
  let userInfo = null;

  try {
    userInfo = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    userInfo = null;
  }

  const isTeacher =
    (userInfo?.role || userInfo?.user?.role || "").toLowerCase() ===
    "teacher";

  const mediaBaseURL = (api.defaults?.baseURL || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

  const getMediaURL = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;

    return `${mediaBaseURL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/lessons/");
      const data = response.data;

      setLessons(
        Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
      );
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      setError(
        "Unable to load lessons. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Save the most recently visited lesson.
  const handleLessonClick = (lesson) => {
    const storageKey = "lessonProgress";
    const lessonURL = `/lessons/${lesson.id}`;

    try {
      let previous = null;

      try {
        previous = JSON.parse(
          localStorage.getItem(storageKey) || "null"
        );
      } catch {
        previous = null;
      }

      const isSameLesson =
        String(previous?.id) === String(lesson.id);

      const lessonProgress = {
        id: lesson.id,
        title: lesson.title || "Untitled Lesson",
        topic: lesson.topic || "",
        url: lessonURL,
        progress: isSameLesson
          ? Math.min(100, Math.max(0, Number(previous?.progress) || 0))
          : 0,
        lastVisited: new Date().toISOString(),
      };

      localStorage.setItem(
        storageKey,
        JSON.stringify(lessonProgress)
      );
    } catch (err) {
      console.error("Unable to save lesson progress:", err);
    }

    navigate(lessonURL);
  };

  const filteredLessons = lessons.filter((lesson) => {
    const keyword = search.toLowerCase().trim();

    return (
      (lesson.title || "").toLowerCase().includes(keyword) ||
      (lesson.topic || "").toLowerCase().includes(keyword) ||
      (lesson.description || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="flex min-h-screen w-full max-w-md flex-col bg-gray-50 shadow-xl">
        <header className="sticky top-0 z-20 bg-green-900 px-4 py-5 text-white shadow-md">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full p-1 transition hover:bg-green-700"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold tracking-wide">
                Lessons
              </h1>
              <p className="mt-0.5 text-xs text-green-100">
                {lessons.length}{" "}
                {lessons.length === 1 ? "lesson" : "lessons"} available
              </p>
            </div>

            {isTeacher && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-green-900 shadow-sm transition hover:bg-green-50"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            )}
          </div>
        </header>

        <main className="mb-24 flex-1 space-y-4 overflow-y-auto px-4 py-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lessons or topics..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <LoaderCircle className="mb-3 h-8 w-8 animate-spin text-green-700" />
              <p className="text-sm">Loading lessons...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-white px-5 py-8 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={fetchLessons}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-900"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : filteredLessons.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white px-5 py-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                <BookOpen className="h-8 w-8 text-green-700" />
              </div>

              <h2 className="font-semibold text-gray-900">
                {search
                  ? "No matching lessons"
                  : isTeacher
                    ? "No lessons yet"
                    : "No lessons available"}
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">
                {search
                  ? "Try a different title, topic, or keyword."
                  : isTeacher
                    ? "Create your first lesson and upload learning materials for your students."
                    : "There are no lessons available yet. Please check again later."}
              </p>

              {!search && isTeacher && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
                >
                  <Plus className="h-4 w-4" />
                  Create First Lesson
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLessons.map((lesson) => {
                const videoCount = lesson.videos?.length || 0;
                const imageURL = getMediaURL(lesson.image);

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => handleLessonClick(lesson)}
                    className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {imageURL ? (
                      <img
                        src={imageURL}
                        alt={lesson.title || "Lesson image"}
                        className="h-44 w-full bg-gray-100 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                        <ImageIcon className="h-12 w-12 text-green-300" />
                      </div>
                    )}

                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h2 className="break-words text-base font-bold text-gray-900">
                            {lesson.title || "Untitled Lesson"}
                          </h2>

                          {lesson.topic && (
                            <span className="mt-2 inline-block rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-900">
                              {lesson.topic}
                            </span>
                          )}
                        </div>

                        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gray-400" />
                      </div>

                      {lesson.description && (
                        <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-500">
                          {lesson.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Video className="h-4 w-4 text-green-700" />
                          {videoCount}{" "}
                          {videoCount === 1 ? "video" : "videos"}
                        </span>

                        {lesson.image && (
                          <span className="inline-flex items-center gap-1.5">
                            <ImageIcon className="h-4 w-4 text-green-700" />
                            Image included
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <BottomNav />

      {isTeacher && (
        <CreateLessonModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={fetchLessons}
        />
      )}
    </div>
  );
}
