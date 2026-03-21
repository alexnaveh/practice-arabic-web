export default function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm font-medium"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border py-2 rounded hover:bg-gray-50 text-sm text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
