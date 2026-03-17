export default function Navbar({ wordCount, onAddClick }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
        <h1 className="text-lg font-bold text-gray-800">Word Arsenal</h1>
        <span className="text-xs text-gray-400 font-medium">{wordCount} words</span>
        <button
          onClick={onAddClick}
          className="bg-green-600 text-white px-3 py-1.5 rounded-full hover:bg-green-700 text-sm font-medium"
        >
          New Word
        </button>
      </div>
    </nav>
  );
}