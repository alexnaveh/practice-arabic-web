const BASE_URL = "http://localhost:8000";

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