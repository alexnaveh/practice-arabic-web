// GroupModal is used for two flows:
//   mode="new"  → shows a name input, creates a new group
//   mode="add"  → shows a list of existing groups to pick from

export default function GroupModal({ mode, groups, onCreateGroup, onAddToGroup, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2DA] w-full max-w-sm p-5">

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
      <h2 className="text-lg font-semibold text-[#2C2C2A] mb-4">New Group</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Group name"
          autoComplete="off"
          autoFocus
          className="w-full border border-[#D3D1C7] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30] placeholder:text-gray-300"
        />
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-[#D3D1C7] text-sm text-[#888780] hover:bg-[#FDF8F3] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 rounded-lg bg-[#D85A30] text-white text-sm font-semibold hover:bg-[#C24E27] transition"
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
      <h2 className="text-lg font-semibold text-[#2C2C2A] mb-4">Add to Group</h2>
      {groups.length === 0 ? (
        <p className="text-sm text-[#888780] text-center py-4">No groups yet. Create one first.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {groups.map((group) => (
            <li
              key={group.sublist_id}
              onClick={() => onSelect(group.sublist_id)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#E8E2DA] cursor-pointer hover:bg-[#FDF8F3] active:bg-[#EDE5DC] transition"
            >
              <span className="text-sm font-medium text-[#2C2C2A]">{group.name}</span>
              <span className="text-xs text-[#888780]">{group.word_count} words</span>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onClose}
        className="w-full mt-4 py-2 rounded-lg border border-[#D3D1C7] text-sm text-[#888780] hover:bg-[#FDF8F3] transition"
      >
        Cancel
      </button>
    </>
  );
}
