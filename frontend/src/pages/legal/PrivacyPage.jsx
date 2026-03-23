import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#FDF8F3] px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2DA] w-full max-w-lg p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[#888780] mb-4 hover:text-[#D85A30] transition"
        >
            Back
        </button>

        <h1 className="text-lg font-semibold text-[#2C2C2A] mb-1">Privacy Policy</h1>
        <p className="text-sm text-[#888780] mb-6">Last updated: March 2026</p>

        <div className="space-y-4 text-sm text-[#2C2C2A]">
          <section>
            <h2 className="font-semibold mb-1">1. What We Collect</h2>
            <p className="text-[#888780]">We collect your email address and the words you add to your account. No other personal information is collected.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">2. How We Use It</h2>
            <p className="text-[#888780]">Your data is used solely to provide the app's functionality — storing and displaying your personal word list. We don't sell or share your data with third parties.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">3. Data Storage</h2>
            <p className="text-[#888780]">Your data is stored securely. Passwords are hashed and never stored in plain text.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">4. Cookies & Local Storage</h2>
            <p className="text-[#888780]">We use browser local storage to keep you logged in via a JWT token. No tracking cookies are used.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">5. Your Rights</h2>
            <p className="text-[#888780]">You can delete your words at any time from within the app. To request full account deletion, contact us directly.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">6. Contact</h2>
            <p className="text-[#888780]">Questions? Reach out at the GitHub repository linked in the app.</p>
          </section>
        </div>
      </div>

      <p className="text-xs text-[#B4B2A9] mt-6 tracking-wide">© 2026 Alex Naveh</p>
    </div>
  );
}