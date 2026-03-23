import { useNavigate } from "react-router-dom";

export default function TermsPage() {
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

        <h1 className="text-lg font-semibold text-[#2C2C2A] mb-1">Terms of Service</h1>
        <p className="text-sm text-[#888780] mb-6">Last updated: March 2026</p>

        <div className="space-y-4 text-sm text-[#2C2C2A]">
          <section>
            <h2 className="font-semibold mb-1">1. Acceptance</h2>
            <p className="text-[#888780]">By using Dhad Notes, you agree to these terms. If you don't agree, please don't use the app.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">2. Use of the App</h2>
            <p className="text-[#888780]">Dhad Notes is a personal vocabulary learning tool. You may use it for personal, non-commercial purposes. You're responsible for the content you add to your account.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">3. Accounts</h2>
            <p className="text-[#888780]">You are responsible for keeping your login credentials secure. We reserve the right to suspend accounts that misuse the service.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">4. Availability</h2>
            <p className="text-[#888780]">We aim to keep Dhad Notes available, but we can't guarantee uninterrupted service. We may update or discontinue features at any time.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">5. Limitation of Liability</h2>
            <p className="text-[#888780]">Dhad Notes is provided "as is" without warranties of any kind. We are not liable for any loss of data or damages arising from your use of the app.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-1">6. Changes</h2>
            <p className="text-[#888780]">We may update these terms occasionally. Continued use of the app means you accept the updated terms.</p>
          </section>
        </div>
      </div>

      <p className="text-xs text-[#B4B2A9] mt-6 tracking-wide">© 2026 Alex Naveh</p>
    </div>
  );
}