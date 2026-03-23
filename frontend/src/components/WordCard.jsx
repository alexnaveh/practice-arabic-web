export default function WordCard({ word, isExpanded, isSelecting, isSelected, onToggleExpand, onToggleSelect, onEdit, onDelete }) {
  function handleClick() {
    if (isSelecting) {
      onToggleSelect(word.word_id);
    } else {
      onToggleExpand(word.word_id);
    }
  }

  return (
    <li
      className={`rounded-2xl shadow-sm cursor-pointer transition-colors border ${
        isSelecting && isSelected
          ? "bg-[#FAECE7] border-[#D85A30]"
          : "bg-white border-[#E8E2DA]"
      }`}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex justify-between flex-1">
            <span className="text-lg font-semibold text-[#2C2C2A]">{word.word_arabic}</span>
            <span className="text-[#888780]">{word.word_hebrew}</span>
          </div>
        </div>
        {word.description && (
          <p className="text-sm text-[#888780] mt-1">{word.description}</p>
        )}
      </div>

      {/* Edit / Delete — only in normal mode when expanded */}
      {!isSelecting && isExpanded && (
        <div className="flex border-t border-[#E8E2DA]">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(word); }}
            className="flex-1 py-2 text-sm text-[#D85A30] hover:bg-[#FDF8F3] font-medium transition"
          >
            Edit
          </button>
          <div className="w-px bg-[#E8E2DA]" />
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(word); }}
            className="flex-1 py-2 text-sm text-red-500 hover:bg-red-50 font-medium transition"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
