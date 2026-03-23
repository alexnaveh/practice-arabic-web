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

  function handleEnterRemoveMode() {
    setIsSelecting(true);
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

  async function executeDeleteGroup() {
    try {
      await deleteGroup(id);
      navigate("/groups");
    } catch {
      showToast("Failed to delete group. Try again.", true);
    }
  }

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
    <div className="min-h-screen bg-[#FDF8F3]">

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
              className={`fixed top-4 left-4 px-4 py-2 rounded-lg shadow-sm text-sm z-50 bg-white border border-[#E8E2DA] border-l-4 ${
                toast.isError ? "border-l-red-500 text-red-700" : "border-l-[#D85A30] text-[#2C2C2A]"
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Word list */}
        {words.length === 0 ? (
          <p className="text-[#888780] text-center mt-20">No words in this group yet.</p>
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
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2DA] w-full max-w-sm p-5">
            <h2 className="text-lg font-semibold text-[#2C2C2A] mb-4">Rename Group</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Group name"
              className="w-full border border-[#D3D1C7] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30] placeholder:text-gray-300"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowRenameModal(false); setNewName(""); }}
                className="flex-1 py-2 rounded-lg border border-[#D3D1C7] text-sm text-[#888780] hover:bg-[#FDF8F3] transition"
              >
                Cancel
              </button>
              <button
                onClick={executeRename}
                disabled={!newName.trim()}
                className="flex-1 py-2 rounded-lg bg-[#D85A30] text-white text-sm font-semibold hover:bg-[#C24E27] disabled:opacity-40 transition"
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
