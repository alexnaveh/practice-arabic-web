import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Shared dropdown component used by all menus
function NavDropdown({ top, items, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Dropdown */}
      <motion.div
        key="dropdown"
        className="fixed left-0 right-0 max-w-lg mx-auto z-20 bg-white border-b border-gray-200 shadow-md overflow-hidden"
        style={{ top }}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <ul className="py-1">
          {items.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className={`flex items-center gap-3 px-5 py-3 text-sm border-b border-gray-100 last:border-b-0 ${
                item.disabled
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50 cursor-pointer active:bg-gray-100"
              }`}
              onClick={() => {
                if (!item.disabled) {
                  onClose();
                  item.action?.();
                }
              }}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}

export default function Navbar({
  // mode: "home" | "groups" | "group"
  mode = "home",

  // home mode props
  wordCount, onAddClick, onSelectionClick,
  isSelecting, selectedCount, onCancelSelection,
  onSelectAll, onDeleteSelected, onAddToGroup, onNewGroup,

  // groups mode props
  isSelectingGroups, selectedGroupsCount, onGroupsSelectionClick,
  onCancelGroupsSelection, onSelectAllGroups, onDeleteSelectedGroups,

  // group mode props
  groupName, onEnterRemoveMode, onRemoveSelected,
  onDeleteGroup, onRenameGroup,

  // shared props
  onBack, onLogout,
}) {
  const [phase, setPhase] = useState("title"); // "title" | "menu"
  const [selectionMenuOpen, setSelectionMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
  }, []);

  // Reset menus when switching selection mode
  useEffect(() => {
    setPhase("title");
    setSelectionMenuOpen(false);
  }, [isSelecting, isSelectingGroups]);

  function handleTitleAreaClick() {
    if ((mode === "home" && isSelecting) ||
        (mode === "group" && isSelecting) ||
        (mode === "groups" && isSelectingGroups)) {
      setSelectionMenuOpen((prev) => !prev);
    } else {
      setPhase((prev) => (prev === "title" ? "menu" : "title"));
    }
  }

  // ── Menu items per mode ──

  const homeNormalMenuItems = [
    { label: "Word Groups", icon: "📋", action: onBack }, // onBack = navigate("/groups") in home context
    { label: "Selection", icon: "✅", action: onSelectionClick },
    { label: "Dark Mode", icon: "🌙" },
    { label: "Logout", icon: "🚪", action: onLogout },
  ];

  const homeSelectionMenuItems = [
    { label: "Select All", icon: "☑️", action: onSelectAll },
    { label: "Delete", icon: "🗑️", action: onDeleteSelected, disabled: selectedCount === 0 },
    { label: "Add to Group", icon: "📋", action: onAddToGroup, disabled: selectedCount === 0 },
    { label: "New Group", icon: "✨", action: onNewGroup, disabled: selectedCount === 0 },
  ];

  const groupsMenuItems = [
    { label: "Selection", icon: "✅", action: onGroupsSelectionClick },
    { label: "Home", icon: "🏠", action: onBack },
    { label: "Logout", icon: "🚪", action: onLogout },
  ];

  const groupsSelectionMenuItems = [
    { label: "Select All", icon: "☑️", action: onSelectAllGroups },
    { label: "Delete", icon: "🗑️", action: onDeleteSelectedGroups, disabled: selectedGroupsCount === 0 },
  ];

  const groupNormalMenuItems = [
    { label: "Remove Words", icon: "➖", action: onEnterRemoveMode },
    { label: "Edit Group Name", icon: "✏️", action: onRenameGroup },
    { label: "Delete Group", icon: "🗑️", action: onDeleteGroup },
  ];

  const groupSelectionMenuItems = [
    { label: "Select All", icon: "☑️", action: onSelectAll },
    { label: "Remove from Group", icon: "➖", action: onRemoveSelected, disabled: selectedCount === 0 },
  ];

  // ── Resolve what's shown based on mode ──

  const isGroupMode = mode === "group";
  const isGroupsMode = mode === "groups";
  const isHomeMode = mode === "home";

  // Title text
  let titleText = "Word Arsenal";
  if (isGroupsMode) titleText = isSelectingGroups ? "Group Selection" : "Word Groups";
  if (isGroupMode) titleText = isSelecting ? "Word Selection" : (groupName || "Group");
  if (isHomeMode && isSelecting) titleText = "Word Selection";

  // Which normal menu to show
  let normalMenuItems = homeNormalMenuItems;
  if (isGroupsMode) normalMenuItems = groupsMenuItems;
  if (isGroupMode) normalMenuItems = groupNormalMenuItems;

  // Which selection menu to show
  let selectionMenuItems = homeSelectionMenuItems;
  if (isGroupsMode) selectionMenuItems = groupsSelectionMenuItems;
  if (isGroupMode) selectionMenuItems = groupSelectionMenuItems;

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md border-b border-gray-200"
      >
        <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">

          {/* Title area — clickable to open menu */}
          <div
            className="relative cursor-pointer h-7 flex items-center"
            style={{ minWidth: "140px" }}
            onClick={handleTitleAreaClick}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={titleText}
                className="text-lg font-bold text-gray-800 absolute"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
              >
                {titleText}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Center count */}
          <span className="text-xs text-gray-400 font-medium">
            {isHomeMode && (isSelecting ? `${selectedCount} selected` : `${wordCount} words`)}
            {isGroupMode && isSelecting && `${selectedCount} selected`}
            {isGroupsMode && isSelectingGroups && `${selectedGroupsCount} selected`}
          </span>

          {/* Right button */}
          {isHomeMode && (
            <button
              onClick={isSelecting ? onCancelSelection : onAddClick}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                isSelecting
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isSelecting ? "Cancel" : "New Word"}
            </button>
          )}

          {isGroupsMode && (
            <button
              onClick={isSelectingGroups ? onCancelGroupsSelection : onBack}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                isSelectingGroups
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isSelectingGroups ? "Cancel" : "Back"}
            </button>
          )}

          {isGroupMode && (
            <button
              onClick={isSelecting ? onCancelSelection : onBack}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                isSelecting
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isSelecting ? "Cancel" : "Back"}
            </button>
          )}

        </div>
      </nav>

      {/* Normal dropdown */}
      <AnimatePresence>
        {phase === "menu" && (
          <NavDropdown
            top={navHeight}
            items={normalMenuItems}
            onClose={() => setPhase("title")}
          />
        )}
      </AnimatePresence>

      {/* Selection dropdown (home + groups + group modes) */}
      <AnimatePresence>
        {((isHomeMode && isSelecting) || (isGroupsMode && isSelectingGroups) || (isGroupMode && isSelecting)) && selectionMenuOpen && (
          <NavDropdown
            top={navHeight}
            items={selectionMenuItems}
            onClose={() => setSelectionMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}