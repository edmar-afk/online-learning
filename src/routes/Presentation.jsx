
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Presentation as PresentationIcon,
  Upload,
  Search,
  FileText,
  File,
  Download,
  ExternalLink,
  Trash2,
  LoaderCircle,
  X,
  FileUp,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Plus
} from "lucide-react";
import api from "../assets/api";
import BottomNav from "../components/BottomNav";

export default function Presentation() {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef(null);

  const getUserInfo = () => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
      return null;
    }
  };

  const userInfo = getUserInfo();

  const role = (
    userInfo?.role ||
    userInfo?.extra_info?.role ||
    userInfo?.user?.role ||
    ""
  ).toLowerCase();

  const isTeacher = role === "teacher";

  const fetchPresentations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/presentations/");
      const data = response.data;

      setPresentations(
        Array.isArray(data) ? data : data.results || data.presentations || []
      );
    } catch (err) {
      console.error("Failed to load presentations:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load presentations. Check your API endpoint."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresentations();
  }, [fetchPresentations]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["ppt", "pptx"].includes(extension)) {
      setError("Only PowerPoint files (.ppt and .pptx) are supported.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    if (!title.trim()) {
      setTitle(file.name.replace(/\.(pptx|ppt)$/i, ""));
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!isTeacher) {
      setError("Only teachers can upload presentations.");
      return;
    }

    if (!selectedFile) {
      setError("Please select a .ppt or .pptx file.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a presentation title.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("file", selectedFile);

      await api.post("/presentations/", formData);

      setTitle("");
      setSelectedFile(null);
      setShowUpload(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess("Presentation uploaded successfully.");
      await fetchPresentations();
    } catch (err) {
      console.error("Failed to upload presentation:", err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.file?.[0] ||
          "Upload failed. Please check your Django upload endpoint."
      );
    } finally {
      setUploading(false);
    }
  };

  const getFileUrl = (presentation) => {
    const file = presentation.file_url || presentation.file;

    if (!file) return "";

    if (/^https?:\/\//i.test(file)) return file;

    const baseURL = api.defaults?.baseURL || window.location.origin;

    return new URL(file, baseURL.endsWith("/") ? baseURL : `${baseURL}/`).href;
  };

  const openPresentation = (presentation) => {
    const url = getFileUrl(presentation);

    if (!url) {
      setError("This presentation does not have a valid file URL.");
      return;
    }

    // Opens the file in the browser. The user can download it
    // and open it with WPS Office or Microsoft PowerPoint.
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const downloadPresentation = (presentation) => {
    const url = getFileUrl(presentation);

    if (!url) {
      setError("This presentation does not have a valid file URL.");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = presentation.file?.split("/").pop() || presentation.title;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDelete = async (presentation) => {
    if (!isTeacher) return;

    const confirmed = window.confirm(
      `Delete "${presentation.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/presentations/${presentation.id}/`);

      setPresentations((previous) =>
        previous.filter((item) => item.id !== presentation.id)
      );

      setSuccess("Presentation deleted successfully.");
    } catch (err) {
      console.error("Failed to delete presentation:", err);
      setError(
        err.response?.data?.detail || "Unable to delete this presentation."
      );
    }
  };

  const filteredPresentations = presentations.filter((item) =>
    (item.title || item.file?.split("/").pop() || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="mx-auto min-h-screen w-full max-w-5xl bg-gray-50 shadow-sm">
        <header className="bg-green-800 px-5 pb-8 pt-8 text-white sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <PresentationIcon className="h-7 w-7" />
              </div>

              <h1 className="text-2xl font-bold">Presentations</h1>
              <p className="mt-2 max-w-md text-sm text-green-100">
                Access lesson slides and PowerPoint learning materials.
              </p>
            </div>

            {isTeacher && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setShowUpload(true);
                }}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-green-800 shadow-sm hover:bg-green-50"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
            <BookOpen className="h-5 w-5 shrink-0 text-green-100" />
            <div>
              <p className="text-sm font-semibold">
                {presentations.length}{" "}
                {presentations.length === 1 ? "presentation" : "presentations"}
              </p>
              <p className="text-xs text-green-100">
                {isTeacher
                  ? "Manage and share your lesson slides"
                  : "Browse available learning materials"}
              </p>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-8">
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="flex-1">{error}</p>
              <button type="button" onClick={() => setError("")}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <span>{success}</span>
              <button type="button" onClick={() => setSuccess("")}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Learning materials
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                PowerPoint presentations shared with your class.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search presentations..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
              <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-green-700" />
              <p className="mt-3 text-sm text-gray-500">
                Loading presentations...
              </p>
            </div>
          ) : filteredPresentations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <FileUp className="h-8 w-8" />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                {search ? "No matching presentations" : "No presentations yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                {search
                  ? "Try a different search term."
                  : isTeacher
                    ? "Upload a PowerPoint file to share it with your students."
                    : "Your teacher has not uploaded any presentations yet."}
              </p>

              {isTeacher && !search && (
                <button
                  type="button"
                  onClick={() => setShowUpload(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white hover:bg-green-800"
                >
                  <Plus className="h-4 w-4" />
                  Upload Presentation
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredPresentations.map((presentation) => {
                const fileName =
                  presentation.file?.split("/").pop() ||
                  presentation.file_url?.split("/").pop() ||
                  "";
                const isPptx = /\.pptx$/i.test(fileName);

                return (
                  <article
                    key={presentation.id}
                    className="group rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-green-200 hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                          isPptx
                            ? "bg-orange-50 text-orange-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        <FileText className="h-7 w-7" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-bold text-gray-900">
                          {presentation.title || fileName || "Presentation"}
                        </h3>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {fileName || "PowerPoint file"}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase text-orange-700">
                            {isPptx ? "PPTX" : "PPT"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(
                              presentation.uploaded_at ||
                                presentation.created_at
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={() => openPresentation(presentation)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-3 py-3 text-sm font-bold text-white hover:bg-green-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadPresentation(presentation)}
                        title="Download presentation"
                        className="flex items-center justify-center rounded-xl border border-gray-200 px-3 text-gray-600 hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      {isTeacher && (
                        <button
                          type="button"
                          onClick={() => handleDelete(presentation)}
                          title="Delete presentation"
                          className="flex items-center justify-center rounded-xl border border-red-100 px-3 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && (
            <button
              type="button"
              onClick={fetchPresentations}
              className="mx-auto mt-6 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-white hover:text-green-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh presentations
            </button>
          )}
        </main>
      </div>

      {isTeacher && showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Upload Presentation
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Share PowerPoint slides with your students.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (uploading) return;
                  setShowUpload(false);
                  setSelectedFile(null);
                  setTitle("");
                  setError("");
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Presentation title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Introduction to Cooking"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  PowerPoint file
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center rounded-xl border-2 border-dashed border-gray-300 px-4 py-7 text-center transition hover:border-green-500 hover:bg-green-50/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                    <Upload className="h-6 w-6" />
                  </div>

                  <span className="mt-3 text-sm font-bold text-gray-800">
                    {selectedFile ? "Choose another file" : "Choose a file"}
                  </span>

                  <span className="mt-1 max-w-full break-all text-xs text-gray-500">
                    {selectedFile
                      ? selectedFile.name
                      : "PPT or PPTX · Select from your device"}
                  </span>
                </button>

                <p className="mt-2 text-xs text-gray-400">
                  Only .ppt and .pptx files are accepted.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    setShowUpload(false);
                    setSelectedFile(null);
                    setTitle("");
                    setError("");
                  }}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading || !selectedFile || !title.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
