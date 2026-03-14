import { useState, useEffect } from "react";
import { addWord, getWords } from "../api";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [arabic, setArabic] = useState("");
  const [hebrew, setHebrew] = useState("");
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState(null);
  const [words, setWords] = useState([]);

  useEffect(() => { getWords().then(setWords).catch(console.error); }, []);

  function handleClear() {
    setArabic("");
    setHebrew("");
    setDescription("");
  }

  function handleClose() {
    handleClear();
    setShowModal(false);
  }

  function showToast(message, isError = false) {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleAdd() {
    if (!arabic.trim() || !hebrew.trim()) {
      showToast("Arabic and Hebrew fields are required.", true);
      return;
    }
    try {
      const newWord = await addWord(arabic.trim(), hebrew.trim(), description.trim());
      setWords((prev) => [newWord, ...prev]);
      handleClose();
      showToast("Word added successfully! ✅");
    } catch (err) {
      showToast("Failed to add word. Try again.", true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow text-white text-sm z-50 ${toast.isError ? "bg-red-500" : "bg-green-500"}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Words</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          + Add a new word
        </button>
      </div>

      {/* Word list */}
      {words.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">No words yet. Add your first one!</p>
      ) : (
        <ul className="space-y-3">
          {words.map((word) => (
            <li key={word.word_id} className="bg-white rounded shadow p-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">{word.word_arabic}</span>
                <span className="text-gray-600">{word.word_hebrew}</span>
              </div>
              {word.description && (
                <p className="text-sm text-gray-400 mt-1">{word.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add a new word</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Arabic <span className="text-red-500">*</span></label>
                <input
                  value={arabic}
                  onChange={(e) => setArabic(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. سمكة"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Hebrew <span className="text-red-500">*</span></label>
                <input
                  value={hebrew}
                  onChange={(e) => setHebrew(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. דג"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. חיה שחיה בים"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleAdd}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium"
              >
                ADD
              </button>
              <button
                onClick={handleClear}
                className="flex-1 border py-2 rounded hover:bg-gray-50 text-sm text-gray-600"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}