import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../api";
import Navbar from "../components/Navbar";

export default function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getGroups()
      .then((data) => {
        setGroups(data);
        // Cache groups so GroupPage can read the group name without an extra endpoint
        localStorage.setItem("groups_cache", JSON.stringify(data));
      })
      .catch(console.error);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar
        mode="groups"
        onBack={() => navigate("/")}
        onLogout={handleLogout}
      />

      <div className="pt-16 px-4 pb-6 max-w-lg mx-auto">

        {groups.length === 0 ? (
          <div className="flex flex-col items-center mt-24 text-center">
            <span className="text-4xl mb-4">📋</span>
            <p className="text-gray-500 font-medium">No word groups yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Go back to your word list, enter Selection mode, and create your first group.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {groups.map((group) => (
              <button
                key={group.sublist_id}
                onClick={() => navigate(`/groups/${group.sublist_id}`)}
                className="bg-white rounded shadow p-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <p className="font-semibold text-gray-800 truncate">{group.name}</p>
                <p className="text-sm text-gray-400 mt-1">{group.word_count} words</p>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}