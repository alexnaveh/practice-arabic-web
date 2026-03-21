// GroupModal is used for two flows:
//   mode="new"      → shows a name input, creates a new group
//   mode="add"      → shows a list of existing groups to pick from

export default function GroupModal({ mode, groups, onCreateGroup, onAddToGroup, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-5">

        {mode === "new" ? (
          <NewGroupForm onSubmit={onCreateGroup} onClose={onClose} />
        ) : (
          <AddToGroupList groups={groups} onSelect={onAddToGroup} onClose={onClose} />
        )}

      </div>
    </div>
  );
}

function NewGroupForm({ onSubmit, onClose }) {
  function handleSubmit(e) {
    e.preventDefault();
    const name = e.target.name.value.trim();
    if (name) onSubmit(name);
  }

  return (
    <>
      <h2 className="text-lg font-bold text-gray-800 mb-4">New Group</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Group name"
          autoFocus
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </form>
    </>
  );
}

function AddToGroupList({ groups, onSelect, onClose }) {
  return (
    <>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Add to Group</h2>
      {groups.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No groups yet. Create one first.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {groups.map((group) => (
            <li
              key={group.sublist_id}
              onClick={() => onSelect(group.sublist_id)}
              className="flex items-center justify-between px-3 py-2.5 rounded border border-gray-200 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
            >
              <span className="text-sm font-medium text-gray-700">{group.name}</span>
              <span className="text-xs text-gray-400">{group.word_count} words</span>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onClose}
        className="w-full mt-4 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
      >
        Cancel
      </button>
    </>
  );
}