import { useState, useEffect } from "react";
import { addWord, getWords, editWord, deleteWord, getGroups, createGroup, addWordsToGroup } from "../api";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import WordCard from "../components/WordCard";
import WordModal from "../components/WordModal";
import ConfirmModal from "../components/ConfirmModal";
import GroupModal from "../components/GroupModal";

export default function HomePage() {
  const navigate = useNavigate();

  // ── Word list ──
  const [words, setWords] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // ── Add / Edit modal ──
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [arabic, setArabic] = useState("");
  const [hebrew, setHebrew] = useState("");
  const [description, setDescription] = useState("");

  // ── Delete confirmation (single word) ──
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ── Selection mode ──
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);

  // ── Group modal ──
  const [groupModalMode, setGroupModalMode] = useState(null); // null | "new" | "add"
  const [groups, setGroups] = useState([]);

  // ── Toast ──
  const [toast, setToast] = useState(null);

  useEffect(() => { getWords().then(setWords).catch(console.error); }, []);

  // ── Toast ──
  function showToast(message, isError = false) {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 1500);
  }

  // ── Modal helpers ──
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

  // ── Add / Edit submit ──
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
    } catch {
      showToast(editingWord ? "Failed to update word. Try again." : "Failed to add word. Try again.", true);
    }
  }

  // ── Single delete ──
  async function handleDelete(word) {
    try {
      await deleteWord(word.word_id);
      setWords((prev) => prev.filter((w) => w.word_id !== word.word_id));
      setConfirmDelete(null);
      setExpandedId(null);
      showToast("Word deleted. 🗑️");
    } catch {
      showToast("Failed to delete word. Try again.", true);
    }
  }

  // ── Selection mode ──
  function handleEnterSelection() {
    setIsSelecting(true);
    setExpandedId(null);
  }

  function handleCancelSelection() {
    setIsSelecting(false);
    setSelectedIds(new Set());
  }

  function toggleSelectWord(wordId) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(wordId) ? next.delete(wordId) : next.add(wordId);
      return next;
    });
  }

  function handleSelectAll() {
    if (selectedIds.size === words.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(words.map((w) => w.word_id)));
    }
  }

  // ── Multi-delete ──
  function handleDeleteSelected() {
    setConfirmDeleteSelected(true);
  }

  async function executeDeleteSelected() {
    try {
      await Promise.all([...selectedIds].map((id) => deleteWord(id)));
      setWords((prev) => prev.filter((w) => !selectedIds.has(w.word_id)));
      showToast(`${selectedIds.size} word${selectedIds.size > 1 ? "s" : ""} deleted. 🗑️`);
      setConfirmDeleteSelected(false);
      handleCancelSelection();
    } catch {
      showToast("Failed to delete some words. Try again.", true);
    }
  }

  // ── New Group ──
  function handleOpenNewGroup() {
    setGroupModalMode("new");
  }

  async function handleCreateGroup(name) {
    try {
      const newGroup = await createGroup(name, [...selectedIds]);
      showToast(`Group "${name}" created! ✅`);
      setGroupModalMode(null);
      handleCancelSelection();
      navigate(`/groups/${newGroup.sublist_id}`);
    } catch {
      showToast("Failed to create group. Try again.", true);
    }
  }

  // ── Add to Group ──
  async function handleOpenAddToGroup() {
    try {
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);
      setGroupModalMode("add");
    } catch {
      showToast("Failed to load groups. Try again.", true);
    }
  }

  async function handleAddToGroup(sublistId) {
    try {
      await addWordsToGroup(sublistId, [...selectedIds]);
      const group = groups.find((g) => g.sublist_id === sublistId);
      showToast(`Added to "${group?.name}"! ✅`);
      setGroupModalMode(null);
      handleCancelSelection();
    } catch {
      showToast("Failed to add words to group. Try again.", true);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <Navbar
        mode="home"
        wordCount={words.length}
        onAddClick={openAddModal}
        onLogout={handleLogout}
        onBack={() => navigate("/groups")}
        onSelectionClick={handleEnterSelection}
        onCancelSelection={handleCancelSelection}
        isSelecting={isSelecting}
        selectedCount={selectedIds.size}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleDeleteSelected}
        onAddToGroup={handleOpenAddToGroup}
        onNewGroup={handleOpenNewGroup}
      />

      {/* ── Page content ── */}
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
              className={`fixed top-4 left-4 px-4 py-2 rounded shadow text-sm z-50 bg-white border-l-4 ${
                toast.isError ? "border-red-500 text-red-700" : "border-green-500 text-green-700"
              }`}
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
              <WordCard
                key={word.word_id}
                word={word}
                isExpanded={expandedId === word.word_id}
                isSelecting={isSelecting}
                isSelected={selectedIds.has(word.word_id)}
                onToggleExpand={(id) => setExpandedId((prev) => (prev === id ? null : id))}
                onToggleSelect={toggleSelectWord}
                onEdit={openEditModal}
                onDelete={setConfirmDelete}
              />
            ))}
          </ul>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <WordModal
          editingWord={editingWord}
          arabic={arabic}
          hebrew={hebrew}
          description={description}
          onArabicChange={setArabic}
          onHebrewChange={setHebrew}
          onDescriptionChange={setDescription}
          onSubmit={handleSubmit}
          onClear={handleClear}
          onClose={handleClose}
        />
      )}

      {/* ── Group Modal (New Group / Add to Group) ── */}
      {groupModalMode && (
        <GroupModal
          mode={groupModalMode}
          groups={groups}
          onCreateGroup={handleCreateGroup}
          onAddToGroup={handleAddToGroup}
          onClose={() => setGroupModalMode(null)}
        />
      )}

      {/* ── Single delete confirmation ── */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete word?"
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">{confirmDelete.word_arabic}</span>{" "}
              ({confirmDelete.word_hebrew})?
            </>
          }
          confirmLabel="Delete"
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* ── Multi-delete confirmation ── */}
      {confirmDeleteSelected && (
        <ConfirmModal
          title={`Delete ${selectedIds.size} word${selectedIds.size > 1 ? "s" : ""}?`}
          message={`This will permanently delete ${selectedIds.size} selected word${selectedIds.size > 1 ? "s" : ""}. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={executeDeleteSelected}
          onCancel={() => setConfirmDeleteSelected(false)}
        />
      )}

    </div>
  );
}