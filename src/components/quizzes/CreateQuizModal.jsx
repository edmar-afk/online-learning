import React, { useEffect, useState } from "react";
import { X, ClipboardList, LoaderCircle } from "lucide-react";
import api from "../../assets/api";

function CreateQuizModal({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDifficulty("Easy");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, loading, onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a quiz title.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/quizzes/", {
        title: trimmedTitle,
        difficulty,
      });

      onCreated();
    } catch (err) {
      console.error("Failed to create quiz:", err);

      const responseData = err.response?.data;
      const titleError = responseData?.title;
      const difficultyError = responseData?.difficulty;

      setError(
        titleError
          ? `Title: ${titleError.join(", ")}`
          : difficultyError
            ? `Difficulty: ${difficultyError.join(", ")}`
            : responseData?.detail ||
              "Unable to create the quiz. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-quiz-title"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-emerald-800 px-5 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>

            <div>
              <h2 id="create-quiz-title" className="text-base font-bold">
                Create Quiz
              </h2>

              <p className="text-xs text-emerald-100 mt-0.5">
                Add a new quiz to your collection
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
            className="p-2 rounded-lg hover:bg-white/15 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Quiz Title */}
          <div>
            <label
              htmlFor="quiz-title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Quiz Title <span className="text-red-500">*</span>
            </label>

            <input
              id="quiz-title"
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError("");
              }}
              placeholder="e.g. Kitchen Fundamentals"
              maxLength={255}
              required
              autoFocus
              disabled={loading}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 disabled:bg-gray-100"
            />

            <p className="text-xs text-gray-400 mt-1 text-right">
              {title.length}/255 characters
            </p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  value: "Easy",
                  description: "Beginner",
                  style: "border-green-200 bg-green-50 text-green-700",
                  active: "border-green-500 ring-2 ring-green-100",
                },
                {
                  value: "Medium",
                  description: "Intermediate",
                  style: "border-amber-200 bg-amber-50 text-amber-700",
                  active: "border-amber-500 ring-2 ring-amber-100",
                },
                {
                  value: "Hard",
                  description: "Advanced",
                  style: "border-red-200 bg-red-50 text-red-700",
                  active: "border-red-500 ring-2 ring-red-100",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition ${
                    option.style
                  } ${
                    difficulty === option.value
                      ? option.active
                      : "opacity-70 hover:opacity-100"
                  } ${loading ? "pointer-events-none opacity-50" : ""}`}
                >
                  <input
                    type="radio"
                    name="quiz-difficulty"
                    value={option.value}
                    checked={difficulty === option.value}
                    onChange={() => setDifficulty(option.value)}
                    disabled={loading}
                    className="sr-only"
                  />

                  <span className="text-sm font-bold">{option.value}</span>

                  <span className="text-[10px]">{option.description}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Quiz"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuizModal;
