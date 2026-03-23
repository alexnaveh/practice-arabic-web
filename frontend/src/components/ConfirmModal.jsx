export default function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2DA] p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-semibold text-[#2C2C2A] mb-2">{title}</h2>
        <p className="text-sm text-[#888780] mb-5">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 text-sm font-semibold transition"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-[#D3D1C7] py-2.5 rounded-lg hover:bg-[#FDF8F3] text-sm text-[#888780] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
