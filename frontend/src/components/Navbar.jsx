import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({
  wordCount, onAddClick, onLogout, onSelectionClick,
  isSelecting, selectedCount, onCancelSelection,
  onSelectAll, onDeleteSelected, onAddToGroup, onNewGroup
}) {
    const [phase, setPhase] = useState("title"); // "title" | "menu"
    const [navHeight, setNavHeight] = useState(0);
    const [selectionMenuOpen, setSelectionMenuOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        if (isSelecting) {
            setPhase("title");
        }
    }, [isSelecting]);

    useEffect(() => {
        if (!isSelecting) {
            setSelectionMenuOpen(false);
        }
    }, [isSelecting]);

    function handleTitleAreaClick() {
        if (phase === "title") {
            setPhase("menu");
        } else if (phase === "menu") {
            setPhase("title");
        }
    }

    const menuItems = [
        { label: "Sub-lists", icon: "📋" },
        { label: "Selection", icon: "✅", action: onSelectionClick },
        { label: "Dark Mode", icon: "🌙" },
        { label: "Logout", icon: "🚪", action: onLogout },
    ];

    const titleExitDuration = 0.15;

    return (
        <>
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md border-b border-gray-200"
        >
            <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">

            {/* Title */}
            <div
                className="relative cursor-pointer h-7 flex items-center"
                style={{ minWidth: "140px" }}
                onClick={isSelecting ? () => setSelectionMenuOpen((prev) => !prev) : handleTitleAreaClick}
            >
                {/* Title */}
                <AnimatePresence mode="wait">
                    {!isSelecting ? (
                        <motion.h1
                            key="title"
                            className="text-lg font-bold text-gray-800 absolute"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -30, opacity: 0 }}
                            transition={{ duration: titleExitDuration, ease: "easeInOut" }}
                        >
                            Word Arsenal
                        </motion.h1>
                    ) : (
                        <motion.span
                            key="selecting"
                            className="text-lg font-bold text-gray-800 absolute"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeInOut" }}
                        >
                            Word Selection
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Word count / Selected count */}
            <span className="text-xs text-gray-400 font-medium">
                {isSelecting ? `${selectedCount} selected` : `${wordCount} words`}
            </span>

            {/* New Word button */}
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
            </div>
        </nav>

        {/* Dropdown menu */}
        <AnimatePresence>
            {phase === "menu" && (
            <>
                {/* Backdrop */}
                <motion.div
                    key="backdrop"
                    className="fixed inset-0 z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleTitleAreaClick}
                />

                {/* Dropdown */}
                <motion.div
                    key="dropdown"
                    className="fixed left-0 right-0 max-w-lg mx-auto z-20 bg-white border-b border-gray-200 shadow-md overflow-hidden"
                    style={{ top: navHeight }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                <ul className="py-1">
                    {menuItems.map((item, index) => (
                    <motion.li
                        key={item.label}
                        initial={{ x: -15, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer active:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                            handleTitleAreaClick();
                            item.action?.();
                            }}
                    >
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </motion.li>
                    ))}
                </ul>
                </motion.div>
            </>
            )}
        </AnimatePresence>

        {/* Selection mode dropdown */}
        <AnimatePresence>
        {isSelecting && selectionMenuOpen && (
            <>
            {/* Backdrop */}
            <motion.div
                key="selection-backdrop"
                className="fixed inset-0 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectionMenuOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
                key="selection-dropdown"
                className="fixed left-0 right-0 max-w-lg mx-auto z-20 bg-white border-b border-gray-200 shadow-md overflow-hidden"
                style={{ top: navHeight }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
            >
                <ul className="py-1">
                {[
                    { label: "Select All", icon: "☑️", action: onSelectAll },
                    { label: "Delete", icon: "🗑️", action: onDeleteSelected },
                    { label: "Add to Group", icon: "📋", action: onAddToGroup },
                    { label: "New Group", icon: "✨", action: onNewGroup },
                ].map((item, index) => {
                    const isDisabled = item.label !== "Select All" && selectedCount === 0;
                    return (
                    <motion.li
                        key={item.label}
                        initial={{ x: -15, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className={`flex items-center gap-3 px-5 py-3 text-sm border-b border-gray-100 last:border-b-0 ${
                        isDisabled
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-50 cursor-pointer active:bg-gray-100"
                        }`}
                        onClick={() => {
                        if (!isDisabled) {
                            setSelectionMenuOpen(false);
                            item.action?.();
                        }
                        }}
                    >
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </motion.li>
                    );
                })}
                </ul>
            </motion.div>
            </>
        )}
        </AnimatePresence>
        </>
    );
}