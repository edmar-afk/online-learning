import React, { useEffect, useState } from "react";
import { X, ClipboardList, LoaderCircle, CheckCircle2 } from "lucide-react";
import api from "../../assets/api";

const initialForm = {
  question_text: "",
  choice_a: "",
  choice_b: "",
  choice_c: "",
  choice_d: "",
  correct_answer: "A",
  explanation: "",
};

export default function AddQuestionModal({
  isOpen,
  quizId,
  quizTitle,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setError("");
      setLoading(false);
    }
  }, [isOpen, quizId]);

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

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = [
      "question_text",
      "choice_a",
      "choice_b",
      "choice_c",
      "choice_d",
    ];

    const missingField = requiredFields.some((field) => !form[field].trim());

    if (missingField) {
      setError("Please fill in the question and all four choices.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post(`/quizzes/${quizId}/questions/`, {
        question_text: form.question_text.trim(),
        choice_a: form.choice_a.trim(),
        choice_b: form.choice_b.trim(),
        choice_c: form.choice_c.trim(),
        choice_d: form.choice_d.trim(),
        correct_answer: form.correct_answer,
        explanation: form.explanation.trim(),
      });

      onCreated();
    } catch (err) {
      console.error("Failed to create question:", err);

      const data = err.response?.data;
      const messages =
        data && typeof data === "object"
          ? Object.entries(data).flatMap(([field, value]) =>
              (Array.isArray(value) ? value : [value]).map(
                (message) =>
                  `${field === "non_field_errors" ? "" : `${field}: `}${message}`,
              ),
            )
          : [];

      setError(
        messages.join(" ") || "Unable to save the question. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const textFields = [
    { name: "choice_a", label: "Choice A", placeholder: "Enter option A" },
    { name: "choice_b", label: "Choice B", placeholder: "Enter option B" },
    { name: "choice_c", label: "Choice C", placeholder: "Enter option C" },
    { name: "choice_d", label: "Choice D", placeholder: "Enter option D" },
  ];

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-question-title"
        className="w-full max-w-lg max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-emerald-800 px-5 py-4 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h2 id="add-question-title" className="font-bold text-base">
                Add Question
              </h2>
              <p className="text-xs text-emerald-100 truncate mt-0.5">
                {quizTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
            className="p-2 rounded-lg hover:bg-white/15 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">
          {/* Question */}
          <div>
            <label
              htmlFor="question-text"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Question <span className="text-red-500">*</span>
            </label>

            <textarea
              id="question-text"
              value={form.question_text}
              onChange={(event) =>
                updateField("question_text", event.target.value)
              }
              placeholder="Write your question here..."
              rows={3}
              required
              disabled={loading}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none resize-y focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 disabled:bg-gray-100"
            />
          </div>

          {/* Answer Choices */}
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Answer Choices
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Select the radio button beside the correct answer.
              </p>
            </div>

            <div className="space-y-3">
              {textFields.map((field) => {
                const letter = field.name.slice(-1).toUpperCase();
                const selected = form.correct_answer === letter;

                return (
                  <div key={field.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor={field.name}
                        className="text-xs font-semibold text-gray-600"
                      >
                        {field.label}
                        <span className="text-red-500"> *</span>
                      </label>

                      <label
                        className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                          selected ? "text-emerald-700" : "text-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="correct_answer"
                          value={letter}
                          checked={selected}
                          onChange={() => updateField("correct_answer", letter)}
                          disabled={loading}
                          className="accent-emerald-700"
                        />
                        Correct
                      </label>
                    </div>

                    <input
                      id={field.name}
                      type="text"
                      value={form[field.name]}
                      onChange={(event) =>
                        updateField(field.name, event.target.value)
                      }
                      placeholder={field.placeholder}
                      maxLength={500}
                      required
                      disabled={loading}
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 disabled:bg-gray-100 ${
                        selected
                          ? "border-emerald-300 bg-emerald-50/40"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label
              htmlFor="question-explanation"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Explanation <span className="text-gray-400">(Optional)</span>
            </label>

            <textarea
              id="question-explanation"
              value={form.explanation}
              onChange={(event) =>
                updateField("explanation", event.target.value)
              }
              placeholder="Explain why the selected answer is correct..."
              rows={2}
              disabled={loading}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none resize-y focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 disabled:bg-gray-100"
            />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 whitespace-pre-wrap"
            >
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !form.question_text.trim() ||
                !form.choice_a.trim() ||
                !form.choice_b.trim() ||
                !form.choice_c.trim() ||
                !form.choice_d.trim()
              }
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Question
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
