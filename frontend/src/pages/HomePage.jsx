import { useState, useEffect } from "react";
import { addWord, getWords, editWord, deleteWord } from "../api";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const [words, setWords] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const navigate = useNavigate();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [arabic, setArabic] = useState("");
  const [hebrew, setHebrew] = useState("");
  const [description, setDescription] = useState("");

  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => { getWords().then(setWords).catch(console.error); }, []);

  function showToast(message, isError = false) {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 1500);
  }

  function handleClear() {
    setArabic("");
    setHebrew("");
    setDescription("");
  }

  function handleClose() {
    handleClear();
    setShowModal(false);
    setEditingWord(null);
  }

  function openAddModal() {
    setEditingWord(null);
    handleClear();
    setShowModal(true);
  }

  function openEditModal(word) {
    setEditingWord(word);
    setArabic(word.word_arabic);
    setHebrew(word.word_hebrew);
    setDescription(word.description || "");
    setShowModal(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function handleSubmit() {
    if (!arabic.trim() || !hebrew.trim()) {
      showToast("Arabic and Hebrew fields are required.", true);
      return;
    }
    try {
      if (editingWord) {
        const updated = await editWord(editingWord.word_id, arabic.trim(), hebrew.trim(), description.trim());
        setWords((prev) => prev.map((w) => w.word_id === updated.word_id ? updated : w));
        showToast("Word updated successfully! ✅");
      } else {
        const newWord = await addWord(arabic.trim(), hebrew.trim(), description.trim());
        setWords((prev) => [newWord, ...prev]);
        showToast("Word added successfully! ✅");
      }
      handleClose();
    } catch (err) {
      showToast(editingWord ? "Failed to update word. Try again." : "Failed to add word. Try again.", true);
    }
  }

  async function handleDelete(word) {
    try {
      await deleteWord(word.word_id);
      setWords((prev) => prev.filter((w) => w.word_id !== word.word_id));
      setConfirmDelete(null);
      setExpandedId(null);
      showToast("Word deleted. 🗑️");
    } catch (err) {
      showToast("Failed to delete word. Try again.", true);
    }
  }

  function toggleExpand(wordId) {
    setExpandedId((prev) => (prev === wordId ? null : wordId));
  }

  function handleEnterSelection() {
    setIsSelecting(true);
    setExpandedId(null); // collapse any open card
  }

  function handleCancelSelection() {
    setIsSelecting(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <Navbar
        wordCount={words.length}
        onAddClick={openAddModal}
        onLogout={handleLogout}
        onSelectionClick={handleEnterSelection}
      />

      {/* ── Page content — padded so list starts below navbar ── */}
      <div className="pt-16 px-4 pb-6 max-w-lg mx-auto">

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "150%", opacity: 0 }}
              transition={{
                enter: { type: "spring", stiffness: 300, damping: 25 },
                exit: { type: "tween", ease: "easeIn", duration: 0.25 }
              }}
              className={`fixed top-4 left-4 px-4 py-2 rounded shadow text-sm z-50 bg-white border-l-4 ${toast.isError ? "border-red-500 text-red-700" : "border-green-500 text-green-700"}`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Word list */}
        {words.length === 0 ? (
          <p className="text-gray-400 text-center mt-20">No words yet. Add your first one!</p>
        ) : (
          <ul className="space-y-3 mt-4">
            {words.map((word) => (
              <li
                key={word.word_id}
                className="bg-white rounded shadow cursor-pointer"
                onClick={() => toggleExpand(word.word_id)}
              >
                <div className="p-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">{word.word_arabic}</span>
                    <span className="text-gray-600">{word.word_hebrew}</span>
                  </div>
                  {word.description && (
                    <p className="text-sm text-gray-400 mt-1">{word.description}</p>
                  )}
                </div>

                {expandedId === word.word_id && (
                  <div className="flex border-t">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(word); }}
                      className="flex-1 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Edit
                    </button>
                    <div className="w-px bg-gray-200" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(word); }}
                      className="flex-1 py-2 text-sm text-red-500 hover:bg-red-50 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editingWord ? "Edit word" : "Add a new word"}</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Arabic <span className="text-red-500">*</span></label>
                <input
                  value={arabic}
                  onChange={(e) => setArabic(e.target.value)}
                  className="w-full placeholder:text-gray-300 border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="كلمة أو جملة"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Hebrew <span className="text-red-500">*</span></label>
                <input
                  value={hebrew}
                  onChange={(e) => setHebrew(e.target.value)}
                  className="w-full placeholder:text-gray-300 border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="מילה או משפט"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full placeholder:text-gray-300 border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="insert an explanation or example"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium"
              >
                {editingWord ? "SAVE" : "ADD"}
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

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-2">Delete word?</h2>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to delete <span className="font-semibold text-gray-700">{confirmDelete.word_arabic}</span> ({confirmDelete.word_hebrew})?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border py-2 rounded hover:bg-gray-50 text-sm text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}