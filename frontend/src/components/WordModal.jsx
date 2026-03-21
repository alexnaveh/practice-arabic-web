export default function WordModal({ editingWord, arabic, hebrew, description, onArabicChange, onHebrewChange, onDescriptionChange, onSubmit, onClear, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{editingWord ? "Edit word" : "Add a new word"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Arabic <span className="text-red-500">*</span></label>
            <input
              value={arabic}
              onChange={(e) => onArabicChange(e.target.value)}
              className="w-full placeholder:text-gray-300 border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="كلمة أو جملة"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Hebrew <span className="text-red-500">*</span></label>
            <input
              value={hebrew}
              onChange={(e) => onHebrewChange(e.target.value)}
              className="w-full placeholder:text-gray-300 border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="מילה או משפט"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full placeholder:text-gray-300 border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="insert an explanation or example"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onSubmit}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            {editingWord ? "SAVE" : "ADD"}
          </button>
          <button
            onClick={onClear}
            className="flex-1 border py-2 rounded hover:bg-gray-50 text-sm text-gray-600"
          >
            CLEAR
          </button>
        </div>
      </div>
    </div>
  );
}
