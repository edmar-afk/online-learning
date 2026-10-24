/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
  X,
  Lightbulb,
  Send,
  Trophy,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../assets/api";
import BottomNav from "../components/BottomNav";
import AddQuestionModal from "../components/quizzes/AddQuestionModal";

export default function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Selected answers: { questionId: "A" }
  const [answers, setAnswers] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Existing saved attempt
  const [existingAttempt, setExistingAttempt] = useState(null);
  const [checkingAttempt, setCheckingAttempt] = useState(true);
  const [attemptError, setAttemptError] = useState("");

  // Controls visibility of correct answers and explanations
  const [showAnswerReview, setShowAnswerReview] = useState(false);

  const choices = [
    { key: "A", field: "choice_a" },
    { key: "B", field: "choice_b" },
    { key: "C", field: "choice_c" },
    { key: "D", field: "choice_d" },
  ];

  const getUserInfo = () => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
      return null;
    }
  };

  const userInfo = getUserInfo();

  const isTeacher =
    (
      userInfo?.role ||
      userInfo?.extra_info?.role ||
      userInfo?.user?.role ||
      ""
    ).toLowerCase() === "teacher";

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/quizzes/${id}/`);
      setQuiz(response.data);
    } catch (err) {
      console.error("Failed to load quiz:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load this quiz. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchExistingAttempt = useCallback(async () => {
    try {
      setCheckingAttempt(true);
      setAttemptError("");

      const userInfo = getUserInfo();

      if (!userInfo?.access) {
        setExistingAttempt(null);
        setAttemptError("Your login session is missing. Please log in again.");
        return;
      }

      if (userInfo.extra_info?.role === "teacher") {
        setExistingAttempt(null);
        return;
      }

      const response = await api.get(`/quizzes/${id}/my-attempt/`, {
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
        },
      });

      // Supports either a direct attempt object or { attempt: {...} }.
      const attempt = response.data?.attempt ?? response.data;

      if (
        attempt &&
        typeof attempt === "object" &&
        attempt.score !== undefined &&
        attempt.total_questions !== undefined
      ) {
        setExistingAttempt(attempt);
        setResult(attempt);
        setSubmitted(true);
        setShowAnswerReview(false);
        setAnswers({});
      } else {
        setExistingAttempt(null);
        setResult(null);
        setSubmitted(false);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // No saved attempt for this student and quiz.
        setExistingAttempt(null);
        setResult(null);
        setSubmitted(false);
      } else if (err.response?.status === 401) {
        setAttemptError("Your login session has expired. Please log in again.");
      } else {
        console.error("Failed to load saved attempt:", err);

        setAttemptError(
          err.response?.data?.detail ||
            err.response?.data?.error ||
            "Unable to check your previous score. Please try again.",
        );
      }
    } finally {
      setCheckingAttempt(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuiz();
    fetchExistingAttempt();
  }, [fetchQuiz, fetchExistingAttempt]);

  const handleQuestionCreated = () => {
    setShowAddModal(false);
    fetchQuiz();
  };

  const selectAnswer = (questionId, answer) => {
    if (submitted || submitting || existingAttempt) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));

    setSubmitError("");
  };

  const handleSubmitQuiz = async () => {
    if (
      submitted ||
      submitting ||
      existingAttempt ||
      checkingAttempt ||
      attemptError
    ) {
      return;
    }

    const questions = quiz?.questions || [];

    if (questions.length === 0) {
      setSubmitError("This quiz has no questions to answer.");
      return;
    }

    const unanswered = questions.filter((question) => !answers[question.id]);

    if (unanswered.length > 0) {
      setSubmitError(
        `Please answer all questions. You still have ${
          unanswered.length
        } unanswered ${unanswered.length === 1 ? "question" : "questions"}.`,
      );
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const userInfo = getUserInfo();

      if (!userInfo?.access) {
        setSubmitError("Your login session is missing. Please log in again.");
        return;
      }

      if (userInfo.extra_info?.role === "teacher") {
        setSubmitError("Only student accounts can submit quiz attempts.");
        return;
      }

      const response = await api.post(
        `/quizzes/${id}/submit/`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${userInfo.access}`,
          },
        },
      );

      const savedResult = response.data?.result ?? response.data;

      setResult(savedResult);
      setExistingAttempt(savedResult);
      setSubmitted(true);
      setShowAnswerReview(true);
    } catch (err) {
      console.error("Failed to submit quiz:", err);

      if (err.response?.status === 401) {
        setSubmitError("Your login session has expired. Please log in again.");
      } else {
        setSubmitError(
          err.response?.data?.error ||
            err.response?.data?.detail ||
            "Unable to submit your quiz. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryLoading = () => {
    fetchQuiz();
    fetchExistingAttempt();
  };

  const totalQuestions = quiz?.questions?.length || 0;

  const answeredCount = Object.keys(answers).filter((questionId) =>
    quiz?.questions?.some(
      (question) => String(question.id) === String(questionId),
    ),
  ).length;

  const percentage =
    result?.percentage ??
    (Number(result?.total_questions) > 0
      ? (Number(result.score) / Number(result.total_questions)) * 100
      : 0);

  const reviewVisible = submitted && showAnswerReview;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md h-screen bg-gray-50 flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <header className="bg-emerald-800 text-white px-4 pt-6 pb-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => navigate("/quizzes")}
                aria-label="Back to quizzes"
                className="hover:opacity-80"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <div className="min-w-0">
                <h1 className="text-lg font-bold truncate">
                  {submitted ? "Quiz Results" : "Attempt Quiz"}
                </h1>

                <p className="text-xs text-emerald-100 mt-0.5">
                  {submitted
                    ? "View your score and review correct answers"
                    : "Select the best answer for each question"}
                </p>
              </div>
            </div>

            {isTeacher && !submitted && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                disabled={!quiz || submitting || checkingAttempt}
                className="flex items-center gap-1.5 bg-white text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 min-h-0 px-4 py-5 pb-24 overflow-y-auto">
          {/* Loading quiz */}
          {loading && (
            <div className="bg-white rounded-2xl p-8 text-center">
              <LoaderCircle className="w-8 h-8 animate-spin text-emerald-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Loading quiz...</p>
            </div>
          )}

          {/* Quiz loading error */}
          {!loading && error && (
            <div className="bg-white rounded-2xl p-6 text-center border border-red-100">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={handleRetryLoading}
                className="mt-4 inline-flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && quiz && (
            <>
              {/* Quiz information */}
              <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-6 h-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-emerald-700 flex flex-row justify-between items-center gap-2">
                      QUIZ #{quiz.id}
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          quiz.difficulty === "Easy"
                            ? "bg-green-50 text-green-700"
                            : quiz.difficulty === "Medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-600"
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-1 break-words">
                      {quiz.title}
                    </h2>

                    <p className="text-xs text-gray-500 mt-2">
                      {submitted
                        ? "You have already completed this quiz."
                        : `${answeredCount} of ${totalQuestions} questions answered`}
                    </p>
                  </div>
                </div>
              </section>

              {/* Checking saved score */}
              {checkingAttempt && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5 flex items-center gap-3">
                  <LoaderCircle className="w-5 h-5 animate-spin text-emerald-700" />
                  <p className="text-sm text-gray-600">
                    Checking your previous score...
                  </p>
                </div>
              )}

              {/* Saved score */}
              {!checkingAttempt && existingAttempt && (
                <section className="bg-white border border-emerald-200 rounded-2xl p-4 mb-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900">
                        Your Previous Score
                      </h3>

                      <p className="text-sm text-gray-500">
                        {existingAttempt.score}/
                        {existingAttempt.total_questions} correct answers
                      </p>

                      <p className="text-sm font-bold text-emerald-700 mt-1">
                        {Number(
                          existingAttempt.percentage ??
                            (Number(existingAttempt.total_questions) > 0
                              ? (Number(existingAttempt.score) /
                                  Number(existingAttempt.total_questions)) *
                                100
                              : 0),
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAnswerReview((previous) => !previous)}
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3"
                  >
                    {showAnswerReview ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}

                    {showAnswerReview
                      ? "Hide Correct Answers & Explanations"
                      : "Show Correct Answers & Explanations"}
                  </button>
                </section>
              )}

              {/* Error checking saved score */}
              {!checkingAttempt && attemptError && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                  <p className="text-sm text-amber-800">{attemptError}</p>

                  <button
                    type="button"
                    onClick={handleRetryLoading}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-900"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              )}

              {/* Quiz progress */}
              {!submitted && totalQuestions > 0 && (
                <div className="sticky -top-5 z-40 -mx-4 px-4 py-3 mb-4 bg-gray-50 border-b border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-2">
                    <span>Quiz progress</span>
                    <span>
                      {answeredCount} of {totalQuestions} answered
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          totalQuestions > 0
                            ? (answeredCount / totalQuestions) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Questions heading */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900">
                  {reviewVisible
                    ? "Correct Answers & Explanations"
                    : submitted
                      ? "Quiz Questions"
                      : "Questions"}
                </h2>

                <span className="text-xs text-gray-400">
                  {totalQuestions} total
                </span>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {(quiz.questions || []).map((question, index) => {
                  const selectedAnswer = answers[question.id];

                  const isCorrect = selectedAnswer === question.correct_answer;

                  return (
                    <article
                      key={question.id}
                      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                    >
                      {/* Question */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 leading-relaxed whitespace-pre-wrap">
                            {question.question_text}
                          </h3>
                        </div>
                      </div>

                      {/* Answer choices */}
                      <div className="mt-4 space-y-2">
                        {choices.map((choice) => {
                          const isSelected = selectedAnswer === choice.key;

                          const isCorrectChoice =
                            question.correct_answer === choice.key;

                          let choiceStyle =
                            "border-gray-200 bg-white text-gray-700";

                          if (!submitted && isSelected) {
                            choiceStyle =
                              "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500";
                          }

                          if (reviewVisible && isCorrectChoice) {
                            choiceStyle =
                              "border-emerald-400 bg-emerald-50 text-emerald-900";
                          } else if (
                            reviewVisible &&
                            isSelected &&
                            !isCorrectChoice
                          ) {
                            choiceStyle =
                              "border-red-300 bg-red-50 text-red-800";
                          }

                          return (
                            <button
                              key={choice.key}
                              type="button"
                              onClick={() =>
                                selectAnswer(question.id, choice.key)
                              }
                              disabled={
                                submitted ||
                                submitting ||
                                checkingAttempt ||
                                !!attemptError
                              }
                              aria-pressed={isSelected}
                              className={`w-full flex items-start gap-2.5 rounded-xl border p-3 text-left text-sm transition-colors disabled:cursor-default ${choiceStyle}`}
                            >
                              <span
                                className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-lg text-xs font-bold ${
                                  reviewVisible && isCorrectChoice
                                    ? "bg-emerald-200 text-emerald-800"
                                    : reviewVisible &&
                                        isSelected &&
                                        !isCorrectChoice
                                      ? "bg-red-200 text-red-800"
                                      : isSelected
                                        ? "bg-emerald-600 text-white"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {choice.key}
                              </span>

                              <span className="flex-1 break-words whitespace-pre-wrap pt-0.5">
                                {question[choice.field]}
                              </span>

                              {reviewVisible && isCorrectChoice && (
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                              )}

                              {reviewVisible &&
                                isSelected &&
                                !isCorrectChoice && (
                                  <X className="w-5 h-5 flex-shrink-0 text-red-600" />
                                )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Correct answer and explanation */}
                      {reviewVisible && (
                        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />

                            <p className="text-sm font-bold text-emerald-800">
                              Correct Answer
                            </p>
                          </div>

                          <p className="text-sm text-emerald-900 mt-2 leading-relaxed whitespace-pre-wrap">
                            <span className="font-bold">
                              {question.correct_answer}.
                            </span>{" "}
                            {
                              question[
                                `choice_${String(
                                  question.correct_answer || "",
                                ).toLowerCase()}`
                              ]
                            }
                          </p>

                          {question.explanation?.trim() && (
                            <div className="mt-3 pt-3 border-t border-emerald-200 flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />

                              <div>
                                <p className="text-xs font-bold text-gray-800 mb-1">
                                  Explanation
                                </p>

                                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                                  {question.explanation}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}

                {/* Empty quiz */}
                {totalQuestions === 0 && (
                  <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                    <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />

                    <h3 className="text-sm font-bold text-gray-700">
                      No questions yet
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Add questions before attempting this quiz.
                    </p>

                    {isTeacher && !submitted && (
                      <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        disabled={checkingAttempt || !!attemptError}
                        className="mt-4 inline-flex items-center gap-2 bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-800 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                        Add First Question
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Submission errors */}
              {submitError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              {/* Submit quiz */}
              {!submitted && totalQuestions > 0 && (
                <section className="mt-5">
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={
                      submitting ||
                      loading ||
                      checkingAttempt ||
                      !!attemptError ||
                      !!existingAttempt
                    }
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3.5 px-4 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        Submitting Quiz...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Quiz
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-2">
                    Answer all {totalQuestions} questions before submitting.
                  </p>
                </section>
              )}

              {/* Score summary */}
              {submitted && result && (
                <section className="mt-6 mb-4 bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Trophy className="w-7 h-7" />
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 text-center mt-3">
                    Quiz Completed!
                  </h2>

                  <p className="text-sm text-gray-500 text-center mt-1">
                    {existingAttempt
                      ? "Your saved quiz result"
                      : "Here are your final results."}
                  </p>

                  <div className="text-center mt-5">
                    <p className="text-4xl font-extrabold text-emerald-700">
                      {result.score}/{result.total_questions}
                    </p>

                    <p className="text-sm font-semibold text-gray-600 mt-2">
                      Total Correct Answers
                    </p>
                  </div>

                  <div className="mt-5 bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-sm text-gray-600">
                        Final Percentage
                      </span>

                      <span className="text-lg font-extrabold text-emerald-700">
                        {Number(percentage).toFixed(2)}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, Number(percentage) || 0),
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 mt-3">
                      <span>
                        Incorrect:{" "}
                        {Math.max(
                          0,
                          Number(result.total_questions) - Number(result.score),
                        )}
                      </span>

                      <span>Items: {result.total_questions}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAnswerReview((previous) => !previous)}
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-bold text-sm py-3"
                  >
                    {showAnswerReview ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}

                    {showAnswerReview
                      ? "Hide Correct Answers & Explanations"
                      : "Show Correct Answers & Explanations"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/quizzes")}
                    className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Quizzes
                  </button>
                </section>
              )}
            </>
          )}
        </main>
      </div>

      <BottomNav />

      {isTeacher && (
        <AddQuestionModal
          isOpen={showAddModal}
          quizId={id}
          quizTitle={quiz?.title || ""}
          onClose={() => setShowAddModal(false)}
          onCreated={handleQuestionCreated}
        />
      )}
    </div>
  );
}
