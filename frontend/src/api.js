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