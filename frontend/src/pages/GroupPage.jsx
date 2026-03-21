import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getGroupWords, removeWordsFromGroup, deleteGroup, renameGroup } from "../api";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import WordCard from "../components/WordCard";
import ConfirmModal from "../components/ConfirmModal";

export default function GroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Words ──
  const [words, setWords] = useState([]);
  const [groupName, setGroupName] = useState(location.state?.groupName || "");
  // ── Selection mode ──
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // ── Modals ──
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newName, setNewName] = useState("");

  // ── Toast ──
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getGroupWords(id)
      .then((data) => {
        setWords(data);
        // If we didn't get the name from router state (e.g. direct URL access),
        // fall back to the groups cache written by GroupsPage
        if (!location.state?.groupName) {
          const cached = JSON.parse(localStorage.getItem("groups_cache") || "[]");
          const found = cached.find((g) => String(g.sublist_id) === String(id));
          if (found) setGroupName(found.name);
        }
      })
      .catch(console.error);
  }, [id]);

  function showToast(message, isError = false) {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 1500);
  }

  // ── Selection mode ──
  function handleEnterRemoveMode() {
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

  // ── Remove words from group ──
  async function executeRemoveWords() {
    try {
      await removeWordsFromGroup(id, [...selectedIds]);
      setWords((prev) => prev.filter((w) => !selectedIds.has(w.word_id)));
      showToast(`${selectedIds.size} word${selectedIds.size > 1 ? "s" : ""} removed. ✅`);
      setConfirmRemove(false);
      handleCancelSelection();
    } catch {
      showToast("Failed to remove words. Try again.", true);
    }
  }

  // ── Delete group ──
  async function executeDeleteGroup() {
    try {
      await deleteGroup(id);
      navigate("/groups");
    } catch {
      showToast("Failed to delete group. Try again.", true);
    }
  }

  // ── Rename group ──
  async function executeRename() {
    if (!newName.trim()) return;
    try {
      await renameGroup(id, newName.trim());
      setGroupName(newName.trim());
      setShowRenameModal(false);
      setNewName("");
      showToast("Group renamed. ✅");
    } catch {
      showToast("Failed to rename group. Try again.", true);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar
        mode="group"
        groupName={groupName}
        onBack={() => navigate("/groups")}
        onLogout={handleLogout}
        isSelecting={isSelecting}
        selectedCount={selectedIds.size}
        onCancelSelection={handleCancelSelection}
        onSelectAll={handleSelectAll}
        onRemoveSelected={() => setConfirmRemove(true)}
        onEnterRemoveMode={handleEnterRemoveMode}
        onDeleteGroup={() => setConfirmDeleteGroup(true)}
        onRenameGroup={() => { setNewName(groupName); setShowRenameModal(true); }}
      />

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
          <p className="text-gray-400 text-center mt-20">No words in this group yet.</p>
        ) : (
          <ul className="space-y-3 mt-4">
            {words.map((word) => (
              <WordCard
                key={word.word_id}
                word={word}
                isExpanded={false}
                isSelecting={isSelecting}
                isSelected={selectedIds.has(word.word_id)}
                onToggleExpand={() => {}}
                onToggleSelect={toggleSelectWord}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </ul>
        )}

      </div>

      {/* Remove words confirmation */}
      {confirmRemove && (
        <ConfirmModal
          title={`Remove ${selectedIds.size} word${selectedIds.size > 1 ? "s" : ""} from group?`}
          message="The words will stay in your main word list — they'll only be removed from this group."
          confirmLabel="Remove"
          onConfirm={executeRemoveWords}
          onCancel={() => setConfirmRemove(false)}
        />
      )}

      {/* Delete group confirmation */}
      {confirmDeleteGroup && (
        <ConfirmModal
          title="Delete group?"
          message={`"${groupName}" will be deleted. Your words will stay in your main list.`}
          confirmLabel="Delete"
          onConfirm={executeDeleteGroup}
          onCancel={() => setConfirmDeleteGroup(false)}
        />
      )}

      {/* Rename modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Rename Group</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Group name"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowRenameModal(false); setNewName(""); }}
                className="flex-1 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={executeRename}
                disabled={!newName.trim()}
                className="flex-1 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}