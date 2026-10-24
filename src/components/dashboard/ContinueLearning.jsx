import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlay, FiBookOpen, FiRefreshCw } from "react-icons/fi";
import api from "../../assets/api";

export default function ContinueLearning() {
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastVisitedLesson = async () => {
      try {
        setLoading(true);

        // Get the last visited lesson ID saved by the lesson details page.
        const lastLessonId = localStorage.getItem("lastVisitedLessonId");

        if (!lastLessonId) {
          setLesson(null);
          return;
        }

        // Fetch the latest lesson information from Django.
        const response = await api.get(`/lessons/${lastLessonId}/`);
        setLesson(response.data);
      } catch (error) {
        console.error("Failed to load the last visited lesson:", error);
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLastVisitedLesson();
  }, []);

  const handleContinue = () => {
    if (lesson?.id) {
      navigate(`/lessons/${lesson.id}`);
    }
  };

  const imageUrl = lesson?.image
    ? lesson.image.startsWith("http")
      ? lesson.image
      : `${api.defaults.baseURL?.replace(/\/api\/?$/, "")}${lesson.image}`
    : null;

  return (
    <section>
      <div className="flex justify-between items-center mb-3 mt-12">
        <h2 className="font-bold text-gray-900 text-base">Continue Learning</h2>

        <button
          type="button"
          onClick={() => navigate("/lessons")}
          className="text-xs font-semibold text-[#2e7d32] hover:underline"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-center gap-2 text-gray-500">
          <FiRefreshCw className="animate-spin" />
          <span className="text-sm">Loading your last lesson...</span>
        </div>
      ) : lesson ? (
        <div
          onClick={handleContinue}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleContinue();
            }
          }}
          className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm flex items-center gap-4 relative cursor-pointer hover:shadow-md transition"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={lesson.title || "Lesson"}
              className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl shrink-0"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl shrink-0 bg-green-50 flex items-center justify-center">
              <FiBookOpen className="text-3xl text-[#2e7d32]" />
            </div>
          )}

          <div className="flex-1 min-w-0 pr-10">
            <span className="text-xs text-gray-400 font-medium block">
              Continue your lesson
            </span>

            <h3 className="font-bold text-gray-900 text-sm mt-1 line-clamp-2">
              {lesson.title || "Untitled Lesson"}
            </h3>

            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {lesson.topic ||
                lesson.description ||
                "Pick up where you left off."}
            </p>

            <p className="text-xs text-[#2e7d32] font-semibold mt-3">
              Resume learning
            </p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleContinue();
            }}
            aria-label="Continue lesson"
            className="absolute right-3 bottom-4 bg-[#2e7d32] text-white p-2.5 rounded-full shadow-md flex items-center justify-center hover:bg-green-700 transition"
          >
            <FiPlay className="text-xs fill-current ml-0.5" />
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
          <FiBookOpen className="text-3xl text-gray-300 mx-auto mb-2" />

          <p className="text-sm font-semibold text-gray-700">
            No recently visited lesson
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Open a lesson to start learning.
          </p>

          <button
            type="button"
            onClick={() => navigate("/lessons")}
            className="mt-4 bg-[#2e7d32] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition"
          >
            Browse Lessons
          </button>
        </div>
      )}
    </section>
  );
}
