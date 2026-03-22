import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGroups, deleteGroup } from "../api";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";

export default function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  // ── Selection mode ──
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);

  // ── Toast ──
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getGroups()
      .then((data) => {
        setGroups(data);
        // Cache groups so GroupPage can read the group name without an extra endpoint
        localStorage.setItem("groups_cache", JSON.stringify(data));
      })
      .catch(console.error);
  }, []);

  function showToast(message, isError = false) {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 1500);
  }

  // ── Selection mode ──
  function handleEnterSelection() {
    setIsSelecting(true);
  }

  function handleCancelSelection() {
    setIsSelecting(false);
    setSelectedIds(new Set());
  }

  function toggleSelectGroup(sublistId) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(sublistId) ? next.delete(sublistId) : next.add(sublistId);
      return next;
    });
  }

  function handleSelectAll() {
    if (selectedIds.size === groups.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(groups.map((g) => g.sublist_id)));
    }
  }

  // ── Bulk delete ──
  async function executeDeleteSelected() {
    try {
      await Promise.all([...selectedIds].map((id) => deleteGroup(id)));
      setGroups((prev) => prev.filter((g) => !selectedIds.has(g.sublist_id)));
      showToast(`${selectedIds.size} group${selectedIds.size > 1 ? "s" : ""} deleted. 🗑️`);
      setConfirmDeleteSelected(false);
      handleCancelSelection();
    } catch {
      showToast("Failed to delete some groups. Try again.", true);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar
        mode="groups"
        onBack={() => navigate("/")}
        onLogout={handleLogout}
        isSelectingGroups={isSelecting}
        selectedGroupsCount={selectedIds.size}
        onGroupsSelectionClick={handleEnterSelection}
        onCancelGroupsSelection={handleCancelSelection}
        onSelectAllGroups={handleSelectAll}
        onDeleteSelectedGroups={() => setConfirmDeleteSelected(true)}
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

        {groups.length === 0 ? (
          <div className="flex flex-col items-center mt-24 text-center">
            <span className="text-4xl mb-4">📋</span>
            <p className="text-gray-500 font-medium">No word groups yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Go back to your word list, enter Selection mode, and create your first group.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {groups.map((group) => {
              const isSelected = selectedIds.has(group.sublist_id);
              return (
                <button
                  key={group.sublist_id}
                  onClick={() =>
                    isSelecting
                      ? toggleSelectGroup(group.sublist_id)
                      : navigate(`/groups/${group.sublist_id}`)
                  }
                  className={`rounded shadow p-4 text-left transition-colors ${
                    isSelecting && isSelected
                      ? "bg-blue-50 border-l-4 border-blue-400"
                      : "bg-white border-l-4 border-transparent hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <p className="font-semibold text-gray-800 truncate">{group.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{group.word_count} words</p>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* Bulk delete confirmation */}
      {confirmDeleteSelected && (
        <ConfirmModal
          title={`Delete ${selectedIds.size} group${selectedIds.size > 1 ? "s" : ""}?`}
          message={`This will delete ${selectedIds.size} selected group${selectedIds.size > 1 ? "s" : ""}. Your words will stay in your main list.`}
          confirmLabel="Delete"
          onConfirm={executeDeleteSelected}
          onCancel={() => setConfirmDeleteSelected(false)}
        />
      )}

    </div>
  );
}