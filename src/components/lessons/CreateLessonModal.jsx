import React, { useState } from "react";
import { X, ImagePlus, Video, Upload, LoaderCircle } from "lucide-react";
import api from "../../assets/api";

export default function CreateLessonModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    topic: "",
  });
  const [image, setImage] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Please enter a lesson title.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description);
    formData.append("topic", form.topic);

    if (image) {
      formData.append("image", image);
    }

    Array.from(videos).forEach((video) => {
      formData.append("uploaded_videos", video);
    });

    try {
      setLoading(true);
      await api.post("/lessons/", formData);

      setForm({ title: "", description: "", topic: "" });
      setImage(null);
      setVideos([]);
      onCreated();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === "object"
          ? Object.entries(data)
              .map(
                ([field, messages]) =>
                  `${field}: ${
                    Array.isArray(messages) ? messages.join(", ") : messages
                  }`,
              )
              .join(" | ")
          : "Failed to create lesson. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Create Lesson</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add lesson information and learning materials.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Lesson Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter lesson title"
              maxLength={255}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Topic <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              name="topic"
              value={form.topic}
              onChange={handleChange}
              placeholder="e.g. Baking, Food Safety"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what students will learn..."
              rows={4}
              className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ImagePlus className="h-4 w-4 text-emerald-700" />
              Lesson Image{" "}
              <span className="font-normal text-gray-400">(Optional)</span>
            </label>

            <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-200 p-5 text-center transition hover:border-emerald-500 hover:bg-emerald-50/50">
              {image ? (
                <>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Lesson preview"
                    className="mb-3 h-36 w-full rounded-lg object-cover"
                  />
                  <span className="break-all text-sm font-medium text-gray-700">
                    {image.name}
                  </span>
                </>
              ) : (
                <>
                  <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Click to upload an image
                  </span>
                  <span className="mt-1 text-xs text-gray-400">
                    PNG, JPG, or WebP
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={loading}
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>

            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="mt-2 text-xs font-medium text-red-600 hover:underline"
              >
                Remove image
              </button>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Video className="h-4 w-4 text-emerald-700" />
              Lesson Videos{" "}
              <span className="font-normal text-gray-400">
                (Optional, multiple allowed)
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-emerald-500 hover:bg-emerald-50/50">
              <div className="rounded-lg bg-emerald-50 p-3">
                <Upload className="h-5 w-5 text-emerald-700" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Choose video files
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Select one or multiple videos
                </p>
              </div>

              <input
                type="file"
                accept="video/*"
                multiple
                disabled={loading}
                className="hidden"
                onChange={(e) => setVideos(Array.from(e.target.files || []))}
              />
            </label>

            {videos.length > 0 && (
              <div className="mt-3 space-y-2">
                {videos.map((video, index) => (
                  <div
                    key={`${video.name}-${video.size}-${index}`}
                    className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                  >
                    <Video className="h-5 w-5 shrink-0 text-emerald-700" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-700">
                        {video.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(video.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setVideos((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
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
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create Lesson"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
