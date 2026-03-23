import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function switchMode(newMode) {
    setMode(newMode);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit() {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data =
        mode === "login"
          ? await loginUser(email, password)
          : await registerUser(email, password);

      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong, please try again");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF8F3] px-4">

      {/* Logo circle */}
        <div className="w-20 h-20 rounded-full border-4 border-[#FAECE7] overflow-hidden mb-4 shadow-sm">
            <img src="/icon-192.png" alt="App logo" className="w-full h-full object-cover" />
        </div>

      {/* App name + subtitle */}
      <h1 className="text-lg font-semibold text-[#2C2C2A] mb-1">Practice Arabic</h1>
      <p className="text-sm text-[#888780] mb-6">Your personal word bank</p>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2DA] w-full max-w-sm p-6">

        {/* Toggle */}
        <div className="flex bg-[#EDE5DC] rounded-xl p-1 mb-5">
          <button
            onClick={() => switchMode("login")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              mode === "login"
                ? "bg-white text-[#D85A30] shadow-sm"
                : "text-[#888780]"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => switchMode("register")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              mode === "register"
                ? "bg-white text-[#D85A30] shadow-sm"
                : "text-[#888780]"
            }`}
          >
            Register
          </button>
        </div>

        {/* Fields */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#D3D1C7] rounded-lg px-4 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30] placeholder:text-gray-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#D3D1C7] rounded-lg px-4 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30] placeholder:text-gray-300"
        />
        {mode === "register" && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-[#D3D1C7] rounded-lg px-4 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30] placeholder:text-gray-300"
          />
        )}

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#D85A30] hover:bg-[#C24E27] text-white font-semibold py-2.5 rounded-lg transition text-sm"
        >
          {mode === "login" ? "Login" : "Create Account"}
        </button>
      </div>

      {/* Footer watermark */}
      <p className="text-xs text-[#B4B2A9] mt-6 tracking-wide">Made by Alex Naveh</p>
    </div>
  );
}