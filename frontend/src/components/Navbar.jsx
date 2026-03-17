import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({ wordCount, onAddClick, onLogout }) {
  const [phase, setPhase] = useState("title"); // "title" | "hamburger" | "menu"
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  function handleTitleAreaClick() {
    if (phase === "title") {
      setPhase("hamburger");
    } else if (phase === "hamburger") {
      setPhase("menu");
    } else if (phase === "menu") {
      setPhase("hamburger");
    }
  }

  const menuItems = [
    { label: "Sub-lists", icon: "📋" },
    { label: "Selection", icon: "✅" },
    { label: "Dark Mode", icon: "🌙" },
    { label: "Logout", icon: "🚪", action: onLogout },
  ];

  const titleExitDuration = 0.15;
  const hamburgerDelay = 0.18;

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md border-b border-gray-200"
      >
        <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">

          {/* Title / Hamburger toggle */}
          <div
            className="relative cursor-pointer h-7 flex items-center"
            style={{ minWidth: "140px" }}
            onClick={handleTitleAreaClick}
          >
            {/* Title */}
            <AnimatePresence mode="wait">
              {phase === "title" && (
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
              )}
            </AnimatePresence>

            {/* Hamburger */}
            <AnimatePresence mode="wait">
              {(phase === "hamburger" || phase === "menu") && (
                <motion.div
                  key="hamburger"
                  className="absolute flex flex-col justify-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: titleExitDuration }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="block h-0.5 bg-gray-800 rounded-full"
                      initial={{ width: 0, x: -10 }}
                      animate={{ width: 22, x: 0 }}
                      exit={{ width: 0, x: -10 }}
                      transition={{
                        duration: 0.2,
                        delay: hamburgerDelay + i * 0.08,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Word count */}
          <span className="text-xs text-gray-400 font-medium">{wordCount} words</span>

          {/* New Word button */}
          <button
            onClick={onAddClick}
            className="bg-green-600 text-white px-3 py-1.5 rounded-full hover:bg-green-700 text-sm font-medium"
          >
            New Word
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
    </>
  );
}