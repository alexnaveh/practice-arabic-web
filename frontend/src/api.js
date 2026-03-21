const BASE_URL = "/api";

export async function loginUser(username) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) throw new Error("Login failed");
  return response.json();
}

export async function addWord(wordArabic, wordHebrew, description) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/words`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      word_arabic: wordArabic,
      word_hebrew: wordHebrew,
      description: description || null,
    }),
  });

  if (!response.ok) throw new Error("Failed to add word");
  return response.json();
}

export async function getWords() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/words`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch words");
  return response.json();
}

export async function editWord(wordId, wordArabic, wordHebrew, description) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/words/${wordId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      word_arabic: wordArabic,
      word_hebrew: wordHebrew,
      description: description || null,
    }),
  });

  if (!response.ok) throw new Error("Failed to edit word");
  return response.json();
}

export async function deleteWord(wordId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/words/${wordId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete word");
  return response.json();
}

// --- Group functions ---

export async function getGroups() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/groups`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch groups");
  return response.json();
}

export async function createGroup(name, wordIds) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ name, word_ids: wordIds }),
  });

  if (!response.ok) throw new Error("Failed to create group");
  return response.json();
}

export async function renameGroup(sublistId, name) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/groups/${sublistId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) throw new Error("Failed to rename group");
  return response.json();
}

export async function deleteGroup(sublistId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/groups/${sublistId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete group");
  return response.json();
}

export async function getGroupWords(sublistId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/groups/${sublistId}/words`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch group words");
  return response.json();
}

export async function addWordsToGroup(sublistId, wordIds) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/groups/${sublistId}/words`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ word_ids: wordIds }),
  });

  if (!response.ok) throw new Error("Failed to add words to group");
  return response.json();
}

export async function removeWordsFromGroup(sublistId, wordIds) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/groups/${sublistId}/words`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ word_ids: wordIds }),
  });

  if (!response.ok) throw new Error("Failed to remove words from group");
  return response.json();
}