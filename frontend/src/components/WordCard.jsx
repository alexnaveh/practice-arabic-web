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
      className={`rounded shadow cursor-pointer transition-colors ${
        isSelecting && isSelected
          ? "bg-blue-50 border-l-4 border-blue-400"
          : "bg-white border-l-4 border-transparent"
      }`}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex justify-between flex-1">
            <span className="text-lg font-semibold">{word.word_arabic}</span>
            <span className="text-gray-600">{word.word_hebrew}</span>
          </div>
        </div>
        {word.description && (
          <p className="text-sm text-gray-400 mt-1">{word.description}</p>
        )}
      </div>

      {/* Edit / Delete — only in normal mode when expanded */}
      {!isSelecting && isExpanded && (
        <div className="flex border-t">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(word); }}
            className="flex-1 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
          >
            Edit
          </button>
          <div className="w-px bg-gray-200" />
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(word); }}
            className="flex-1 py-2 text-sm text-red-500 hover:bg-red-50 font-medium"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
