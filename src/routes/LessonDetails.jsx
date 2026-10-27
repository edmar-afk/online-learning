
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Image as ImageIcon,
  Video,
  Pencil,
  Trash2,
  Plus,
  X,
  LoaderCircle,
  RefreshCw,
  Play,
  FileVideo,
  Upload,
  Save,
  AlertCircle,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import api from "../assets/api";

export default function LessonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteVideoIds, setDeleteVideoIds] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [newVideos, setNewVideos] = useState([]);
  const [removeImage, setRemoveImage] = useState(false);
  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    topic: "",
    description: "",
  });

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

  const fetchLesson = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/lessons/${id}/`);
      setLesson(response.data);
    } catch (err) {
      console.error("Failed to load lesson:", err);

      setError(
        err.response?.status === 404
          ? "This lesson could not be found."
          : "Unable to load this lesson. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  // Save this lesson and track how far the student has scrolled.
  useEffect(() => {
    if (!lesson || String(lesson.id) !== String(id)) return;

    const storageKey = "lessonProgress";
    const lessonURL = `/lessons/${lesson.id}`;

    let saved = null;

    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch {
      saved = null;
    }

    const isSameLesson = String(saved?.id) === String(lesson.id);

    const initialProgress = isSameLesson
      ? Math.min(100, Math.max(0, Number(saved?.progress) || 0))
      : 0;

    const initialRecord = {
      id: lesson.id,
      title: lesson.title || "Untitled Lesson",
      topic: lesson.topic || "",
      url: lessonURL,
      progress: initialProgress,
      lastVisited: isSameLesson
        ? saved?.lastVisited || new Date().toISOString()
        : new Date().toISOString(),
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(initialRecord));
    } catch (err) {
      console.error("Unable to save lesson:", err);
    }

    setProgress(initialProgress);

    let restoring = true;
    let restoreFrame = 0;
    let retryFrame = 0;
    let restoreAttempts = 0;

    const calculateProgress = () => {
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight || 0
      );

      const maxScroll = Math.max(
        0,
        documentHeight - window.innerHeight
      );

      if (maxScroll <= 0) {
        return 100;
      }

      return Math.round(
        Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100))
      );
    };

    const saveProgress = () => {
      if (restoring) return;

      try {
        const current = JSON.parse(
          localStorage.getItem(storageKey) || "null"
        );

        // Do not overwrite a different lesson's record.
        if (String(current?.id) !== String(lesson.id)) return;

        const nextProgress = calculateProgress();

        const updated = {
          ...current,
          id: lesson.id,
          title: lesson.title || "Untitled Lesson",
          topic: lesson.topic || "",
          url: lessonURL,
          progress: nextProgress,
          lastVisited: new Date().toISOString(),
        };

        localStorage.setItem(storageKey, JSON.stringify(updated));
        setProgress(nextProgress);
      } catch (err) {
        console.error("Unable to update reading progress:", err);
      }
    };

    const restoreScroll = () => {
      restoreAttempts += 1;

      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight || 0
      );

      const maxScroll = Math.max(
        0,
        documentHeight - window.innerHeight
      );

      // Wait for the content to have enough height to restore the position.
      if (
        initialProgress > 0 &&
        maxScroll <= 0 &&
        restoreAttempts < 10
      ) {
        retryFrame = requestAnimationFrame(restoreScroll);
        return;
      }

      if (initialProgress > 0 && maxScroll > 0) {
        window.scrollTo({
          top: maxScroll * (initialProgress / 100),
          behavior: "auto",
        });
      }

      restoring = false;
      saveProgress();
    };

    restoreFrame = requestAnimationFrame(restoreScroll);

    window.addEventListener("scroll", saveProgress, { passive: true });
    window.addEventListener("pagehide", saveProgress);

    return () => {
      cancelAnimationFrame(restoreFrame);
      cancelAnimationFrame(retryFrame);
      window.removeEventListener("scroll", saveProgress);
      window.removeEventListener("pagehide", saveProgress);
    };
  }, [lesson, id]);

  const openEditModal = () => {
    setForm({
      title: lesson.title || "",
      topic: lesson.topic || "",
      description: lesson.description || "",
    });

    setDeleteVideoIds([]);
    setNewImage(null);
    setNewVideos([]);
    setRemoveImage(false);
    setEditError("");
    setIsEditOpen(true);
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!form.title.trim()) {
      setEditError("Please enter a lesson title.");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("topic", form.topic);
    formData.append("description", form.description);

    if (newImage) {
      formData.append("image", newImage);
    } else if (removeImage) {
      formData.append("image", "");
    }

    newVideos.forEach((video) => {
      formData.append("uploaded_videos", video);
    });

    deleteVideoIds.forEach((videoId) => {
      formData.append("delete_video_ids", String(videoId));
    });

    try {
      setIsSaving(true);

      await api.patch(`/lessons/${id}/`, formData);

      // Update the saved title without resetting reading progress.
      try {
        const saved = JSON.parse(
          localStorage.getItem("lessonProgress") || "null"
        );

        if (String(saved?.id) === String(id)) {
          localStorage.setItem(
            "lessonProgress",
            JSON.stringify({
              ...saved,
              title: form.title.trim(),
              topic: form.topic,
              url: `/lessons/${id}`,
            })
          );
        }
      } catch (storageError) {
        console.error("Unable to update saved lesson title:", storageError);
      }

      setIsEditOpen(false);
      await fetchLesson();
    } catch (err) {
      console.error("Failed to update lesson:", err);

      const data = err.response?.data;

      setEditError(
        data && typeof data === "object"
          ? Object.entries(data)
              .map(([field, messages]) => {
                const value = Array.isArray(messages)
                  ? messages.join(", ")
                  : typeof messages === "object"
                    ? JSON.stringify(messages)
                    : messages;

                return `${field}: ${value}`;
              })
              .join(" | ")
          : "Unable to update the lesson. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLesson = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        lesson.title || "this lesson"
      }"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await api.delete(`/lessons/${id}/`);

      try {
        const saved = JSON.parse(
          localStorage.getItem("lessonProgress") || "null"
        );

        if (String(saved?.id) === String(id)) {
          localStorage.removeItem("lessonProgress");
        }
      } catch (storageError) {
        console.error("Unable to clear deleted lesson progress:", storageError);
      }

      navigate("/lessons", { replace: true });
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      window.alert("Unable to delete this lesson. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/lesson-videos/${videoId}/delete/`);
      await fetchLesson();
    } catch (err) {
      console.error("Failed to delete video:", err);
      window.alert("Unable to delete this video. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center bg-gray-100">
        <div className="flex min-h-screen w-full max-w-md flex-col items-center justify-center bg-gray-50 text-gray-500">
          <LoaderCircle className="mb-3 h-9 w-9 animate-spin text-green-700" />
          <p className="text-sm">Loading lesson...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="flex min-h-screen justify-center bg-gray-100">
        <div className="flex min-h-screen w-full max-w-md flex-col items-center justify-center bg-gray-50 px-6 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />

          <h1 className="text-lg font-bold text-gray-900">
            Lesson unavailable
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "This lesson could not be found."}
          </p>

          <button
            type="button"
            onClick={fetchLesson}
            className="mt-5 flex items-center gap-2 rounded-xl bg-green-800 px-4 py-3 text-sm font-semibold text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <button
            type="button"
            onClick={() => navigate("/lessons")}
            className="mt-3 text-sm font-medium text-green-800"
          >
            Back to Lessons
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  const visibleVideos = (lesson.videos || []).filter(
    (video) => !deleteVideoIds.includes(video.id)
  );

  return (
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="min-h-screen w-full max-w-md bg-gray-50 pb-24 shadow-xl">
        <header className="sticky top-0 z-20 flex items-center gap-3 bg-green-800 px-4 py-5 text-white shadow-md">
          <button
            type="button"
            onClick={() => navigate("/lessons")}
            className="rounded-full p-1 transition hover:bg-green-700"
            aria-label="Back to lessons"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">
              Lesson Details
            </h1>
            <p className="text-xs text-green-100">
              View and manage learning materials
            </p>
          </div>

          {isTeacher && (
            <button
              type="button"
              onClick={openEditModal}
              className="rounded-xl bg-white/15 p-2.5 transition hover:bg-white/25"
              aria-label="Edit lesson"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
        </header>

        <main className="space-y-5 px-4 py-5">
          {lesson.image ? (
            <img
              src={getMediaURL(lesson.image)}
              alt={lesson.title || "Lesson"}
              className="h-56 w-full rounded-2xl bg-gray-100 object-cover shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
              <ImageIcon className="h-16 w-16 text-green-300" />
            </div>
          )}

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {lesson.topic && (
              <span className="mb-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                {lesson.topic}
              </span>
            )}

            <h2 className="break-words text-2xl font-bold leading-tight text-gray-900">
              {lesson.title || "Untitled Lesson"}
            </h2>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2">
                <BookOpen className="h-4 w-4 text-green-700" />
                Lesson #{lesson.id}
              </span>

              <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2">
                <Video className="h-4 w-4 text-green-700" />
                {(lesson.videos || []).length} videos
              </span>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <h3 className="mb-2 font-semibold text-gray-900">
                Reading Progress
              </h3>

              <div
                className="h-2.5 overflow-hidden rounded-full bg-gray-100"
                role="progressbar"
                aria-label="Lesson reading progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="h-full rounded-full bg-green-600 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                {progress}% completed
              </p>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <h3 className="mb-2 font-semibold text-gray-900">
                About this lesson
              </h3>

              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-600">
                {lesson.description || "No description has been added yet."}
              </p>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Lesson Videos
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Watch the uploaded learning materials.
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                {visibleVideos.length}
              </span>
            </div>

            {visibleVideos.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white px-5 py-10 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                  <FileVideo className="h-7 w-7 text-green-700" />
                </div>

                <h3 className="font-semibold text-gray-900">
                  No videos uploaded
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Add videos to provide extra learning materials.
                </p>

                {isTeacher && (
                  <button
                    type="button"
                    onClick={openEditModal}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-900"
                  >
                    <Plus className="h-4 w-4" />
                    Add Videos
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {visibleVideos.map((item, index) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                        <Video className="h-6 w-6 text-green-700" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Video {index + 1}
                        </h3>
                        <p className="mt-1 break-all text-xs text-gray-500">
                          {item.video?.split("/").pop() || "Lesson video"}
                        </p>
                      </div>

                      <a
                        href={getMediaURL(item.video)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl bg-green-800 p-2.5 text-white transition hover:bg-green-900"
                        aria-label={`Open video ${index + 1}`}
                      >
                        <Play className="h-4 w-4" />
                      </a>

                      {isTeacher && (
                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(item.id)}
                          className="rounded-xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                          aria-label={`Delete video ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <video
                      controls
                      preload="metadata"
                      className="max-h-64 w-full bg-black"
                    >
                      <source src={getMediaURL(item.video)} />
                      Your browser does not support video playback.
                    </video>
                  </div>
                ))}
              </div>
            )}
          </section>

          {isTeacher && (
            <button
              type="button"
              onClick={handleDeleteLesson}
              disabled={isDeleting}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}

              {isDeleting ? "Deleting Lesson..." : "Delete Lesson"}
            </button>
          )}
        </main>
      </div>

      <BottomNav />

      {isEditOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isSaving) {
              setIsEditOpen(false);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Edit Lesson
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Update details and manage uploaded files.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                disabled={isSaving}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5 p-5">
              {editError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {editError}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Lesson Title *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Topic
                </label>

                <input
                  name="topic"
                  value={form.topic}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Lesson Image
                </label>

                {lesson.image && !removeImage && !newImage && (
                  <div className="mb-3 overflow-hidden rounded-xl border border-gray-100">
                    <img
                      src={getMediaURL(lesson.image)}
                      alt="Current lesson"
                      className="h-36 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => setRemoveImage(true)}
                      className="w-full bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Remove current image
                    </button>
                  </div>
                )}

                {removeImage && (
                  <p className="mb-2 text-xs text-amber-700">
                    Current image will be removed when you save.
                  </p>
                )}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4 hover:border-green-500">
                  <ImageIcon className="h-6 w-6 text-green-700" />

                  <span className="min-w-0 flex-1 text-sm text-gray-600">
                    {newImage
                      ? newImage.name
                      : "Choose a replacement image (optional)"}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isSaving}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setNewImage(file);

                      if (file) setRemoveImage(false);
                    }}
                  />
                </label>

                {newImage && (
                  <button
                    type="button"
                    onClick={() => setNewImage(null)}
                    className="mt-2 text-xs font-medium text-red-600"
                  >
                    Cancel new image
                  </button>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Existing Videos
                </label>

                {(lesson.videos || []).length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No videos uploaded.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(lesson.videos || []).map((item) => {
                      const marked = deleteVideoIds.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 rounded-xl border p-3 ${
                            marked
                              ? "border-red-200 bg-red-50"
                              : "border-gray-100 bg-gray-50"
                          }`}
                        >
                          <Video className="h-5 w-5 shrink-0 text-green-700" />

                          <span
                            className={`min-w-0 flex-1 break-all text-xs ${
                              marked
                                ? "text-red-500 line-through"
                                : "text-gray-600"
                            }`}
                          >
                            {item.video?.split("/").pop() ||
                              `Video ${item.id}`}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteVideoIds((prev) =>
                                marked
                                  ? prev.filter(
                                      (videoId) => videoId !== item.id
                                    )
                                  : [...prev, item.id]
                              )
                            }
                            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                              marked
                                ? "bg-white text-gray-600"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                          >
                            {marked ? "Undo" : "Remove"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Add More Videos
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4 hover:border-green-500">
                  <Upload className="h-6 w-6 text-green-700" />

                  <span className="min-w-0 flex-1 text-sm text-gray-600">
                    Select multiple video files
                  </span>

                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    disabled={isSaving}
                    onChange={(e) => {
                      const selected = Array.from(e.target.files || []);

                      setNewVideos((prev) => [...prev, ...selected]);
                      e.target.value = "";
                    }}
                  />
                </label>

                {newVideos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {newVideos.map((video, index) => (
                      <div
                        key={`${video.name}-${video.size}-${index}`}
                        className="flex items-center gap-3 rounded-lg bg-green-50 p-3"
                      >
                        <Video className="h-5 w-5 shrink-0 text-green-700" />

                        <span className="min-w-0 flex-1 truncate text-xs text-gray-700">
                          {video.name}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setNewVideos((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          className="rounded-lg p-1 text-red-600 hover:bg-red-100"
                          aria-label={`Remove ${video.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  disabled={isSaving}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-800 px-4 py-3 text-sm font-semibold text-white hover:bg-green-900 disabled:opacity-50"
                >
                  {isSaving ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
