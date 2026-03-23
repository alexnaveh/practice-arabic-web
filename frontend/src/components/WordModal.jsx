export default function WordModal({ editingWord, arabic, hebrew, description, onArabicChange, onHebrewChange, onDescriptionChange, onSubmit, onClear, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2DA] p-6 w-full max-w-sm mx-4">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#2C2C2A]">{editingWord ? "Edit word" : "Add a new word"}</h2>
          <button onClick={onClose} className="text-[#888780] hover:text-[#2C2C2A] text-xl transition">✕</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-[#2C2C2A]">Arabic <span className="text-red-500">*</span></label>
            <input
              value={arabic}
              onChange={(e) => onArabicChange(e.target.value)}
              className="w-full border border-[#D3D1C7] rounded-lg px-4 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30] placeholder:text-gray-300"
              placeholder="كلمة أو جملة"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#2C2C2A]">Hebrew <span className="text-red-500">*</span></label>
            <input
              value={hebrew}
              onChange={(e) => onHebrewChange(e.target.value)}
              className="w-full border border-[#D3D1C7] rounded-lg px-4 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30] placeholder:text-gray-300"
              placeholder="מילה או משפט"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#2C2C2A]">Description <span className="text-[#888780] font-normal">(optional)</span></label>
            <input
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full border border-[#D3D1C7] rounded-lg px-4 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30] placeholder:text-gray-300"
              placeholder="insert an explanation or example"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onSubmit}
            className="flex-1 bg-[#D85A30] hover:bg-[#C24E27] text-white py-2.5 rounded-lg text-sm font-semibold transition"
          >
            {editingWord ? "SAVE" : "ADD"}
          </button>
          <button
            onClick={onClear}
            className="flex-1 border border-[#D3D1C7] py-2.5 rounded-lg hover:bg-[#FDF8F3] text-sm text-[#888780] transition"
          >
            CLEAR
          </button>
        </div>
      </div>
    </div>
  );
}
