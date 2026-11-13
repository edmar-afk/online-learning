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
  Trash2,
} from "lucide-react";

import Swal from "sweetalert2";

import BottomNav from "../components/BottomNav";
import CreateLessonModal from "../components/lessons/CreateLessonModal";
import api from "../assets/api";

// Safely retrieve the logged-in user's information.
function getStoredUserInfo() {
  try {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse userInfo:", error);
    return null;
  }
}

// Support the role structure used by your application.
function getUserRole(userInfo) {
  const role =
    userInfo?.role ??
    userInfo?.extra_info?.role ??
    userInfo?.user?.role ??
    userInfo?.user?.extra_info?.role ??
    userInfo?.profile?.role ??
    "";

  return String(role).trim().toLowerCase();
}

export default function Lessons() {
  const navigate = useNavigate();

  const [userInfo] = useState(() => getStoredUserInfo());

  // Teacher role
  const role = getUserRole(userInfo);
  const isTeacher = role === "teacher";

  const [lessons, setLessons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState(null);

  // Convert relative media paths into absolute URLs.
  const mediaBaseURL = (api.defaults?.baseURL || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

  const getMediaURL = (path) => {
    if (!path || typeof path !== "string") {
      return "";
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    return `${mediaBaseURL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // Fetch lessons from the API.
  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/lessons/");
      const data = response.data;

      const lessonList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];

      setLessons(lessonList);
    } catch (err) {
      console.error(
        "Failed to fetch lessons:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to load lessons. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Open the lesson creation modal.
  const openCreateModal = () => {
    if (!isTeacher) {
      console.warn("Only teachers can create lessons.");
      return;
    }

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE LESSON WITH SWEETALERT2
  // ==========================================================
  const handleDeleteLesson = async (e, lesson) => {
    // Prevent opening the lesson when clicking delete.
    e.stopPropagation();

    if (!isTeacher || deletingLessonId !== null) {
      return;
    }

    const result = await Swal.fire({
      title: "Delete Lesson?",
      html: `
        <p style="color:#6b7280;font-size:14px;">
          Are you sure you want to delete
          <strong style="color:#111827;">
            ${String(lesson.title || "Untitled Lesson")
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;")}
          </strong>?
        </p>
        <p style="color:#dc2626;font-size:12px;margin-top:10px;">
          This action cannot be undone.
        </p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingLessonId(lesson.id);

      await api.delete(`/lessons/${lesson.id}/`);

      // Remove deleted lesson from the current list.
      setLessons((previousLessons) =>
        previousLessons.filter((item) => String(item.id) !== String(lesson.id)),
      );

      // Remove saved local progress if it belongs to this lesson.
      try {
        const savedProgress = JSON.parse(
          localStorage.getItem("lessonProgress") || "null",
        );

        if (String(savedProgress?.id) === String(lesson.id)) {
          localStorage.removeItem("lessonProgress");
        }
      } catch (storageError) {
        console.error("Failed to update saved lesson progress:", storageError);
      }

      await Swal.fire({
        title: "Deleted!",
        text: "The lesson has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#166534",
        timer: 1800,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error(
        "Failed to delete lesson:",
        err.response?.data || err.message,
      );

      Swal.fire({
        title: "Delete Failed",
        text:
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to delete this lesson. Please try again.",
        icon: "error",
        confirmButtonColor: "#166534",
      });
    } finally {
      setDeletingLessonId(null);
    }
  };

  // Save the most recently visited lesson.
  const handleLessonClick = (lesson) => {
    const storageKey = "lessonProgress";
    const lessonURL = `/lessons/${lesson.id}`;

    try {
      let previous = null;

      try {
        previous = JSON.parse(localStorage.getItem(storageKey) || "null");
      } catch {
        previous = null;
      }

      const isSameLesson = String(previous?.id) === String(lesson.id);

      const previousProgress = Number(previous?.progress) || 0;

      const lessonProgress = {
        id: lesson.id,
        title: lesson.title || "Untitled Lesson",
        topic: lesson.topic || "",
        url: lessonURL,
        progress: isSameLesson
          ? Math.min(100, Math.max(0, previousProgress))
          : 0,
        lastVisited: new Date().toISOString(),
      };

      localStorage.setItem(storageKey, JSON.stringify(lessonProgress));
    } catch (err) {
      console.error("Unable to save lesson progress:", err);
    }

    navigate(lessonURL);
  };

  // Filter lessons by title, topic, or description.
  const keyword = search.trim().toLowerCase();

  const filteredLessons = lessons.filter((lesson) => {
    return (
      String(lesson.title || "")
        .toLowerCase()
        .includes(keyword) ||
      String(lesson.topic || "")
        .toLowerCase()
        .includes(keyword) ||
      String(lesson.description || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  // Close modal and refresh after creation.
  const handleLessonCreated = async () => {
    setIsModalOpen(false);
    await fetchLessons();
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="flex min-h-screen w-full max-w-md flex-col bg-gray-50 shadow-xl">
        {/* Header */}
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
              <h1 className="text-lg font-semibold tracking-wide">Lessons</h1>

              <p className="mt-0.5 text-xs text-green-100">
                {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}{" "}
                available
              </p>
            </div>

            {/* Add button - teachers only */}
            {isTeacher && (
              <button
                type="button"
                onClick={openCreateModal}
                className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-green-900 shadow-sm transition hover:bg-green-50"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="mb-24 flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {/* Search */}
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

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <LoaderCircle className="mb-3 h-8 w-8 animate-spin text-green-700" />
              <p className="text-sm">Loading lessons...</p>
            </div>
          ) : error ? (
            /* Error */
            <div className="rounded-2xl border border-red-100 bg-white px-5 py-8 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={fetchLessons}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : filteredLessons.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-gray-100 bg-white px-5 py-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                <BookOpen className="h-8 w-8 text-green-700" />
              </div>

              <h2 className="font-semibold text-gray-900">
                {keyword
                  ? "No matching lessons"
                  : isTeacher
                    ? "No lessons yet"
                    : "No lessons available"}
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">
                {keyword
                  ? "Try a different title, topic, or keyword."
                  : isTeacher
                    ? "Create your first lesson and upload learning materials for your students."
                    : "There are no lessons available yet. Please check again later."}
              </p>

              {!keyword && isTeacher && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  <Plus className="h-4 w-4" />
                  Create First Lesson
                </button>
              )}
            </div>
          ) : (
            /* Lesson Cards */
            <div className="space-y-4">
              {filteredLessons.map((lesson) => {
                const videoCount = Array.isArray(lesson.videos)
                  ? lesson.videos.length
                  : 0;

                const imageURL = getMediaURL(lesson.image);
                const isDeleting =
                  String(deletingLessonId) === String(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Teacher-only Delete Button */}
                    {isTeacher && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteLesson(e, lesson)}
                        disabled={deletingLessonId !== null}
                        title="Delete lesson"
                        aria-label={`Delete ${lesson.title || "lesson"}`}
                        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white/95 text-red-600 shadow-md backdrop-blur-sm transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    )}

                    {/* Lesson Content - Click to open */}
                    <button
                      type="button"
                      onClick={() => handleLessonClick(lesson)}
                      className="block w-full text-left"
                    >
                      {/* Lesson Image */}
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

                        {/* Media Information */}
                        <div className="flex items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1.5">
                            <Video className="h-4 w-4 text-green-700" />
                            {videoCount} {videoCount === 1 ? "video" : "videos"}
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
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <BottomNav />

      {/* Create Lesson Modal */}
      {isTeacher && (
        <CreateLessonModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={handleLessonCreated}
        />
      )}
    </div>
  );
}
