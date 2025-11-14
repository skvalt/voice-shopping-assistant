import { useAuth } from "../hooks/useAuth";
import ShoppingList from "../components/ShoppingList/ShoppingList";
import VoiceButton from "../components/VoiceButton";
import VoiceOverlay from "../components/VoiceOverlay";
import ResultPanel from "../components/ResultPanel";
import useVoice from "../hooks/useVoice";
import Recommendations from "../components/Recommendations";

export default function Home() {
  const voice = useVoice() || {};

  const listening = voice.listening ?? false;
  const recognized = voice.recognized ?? "";
  const result = voice.result ?? null;
  const isLoading = voice.isLoading ?? false;
  const error = voice.error ?? null;
  const lastRaw = voice.lastRaw ?? null;
  const overlayOpen = voice.overlayOpen ?? false;

  const startListening = voice.startListening || (() => {});
  const stopListening = voice.stopListening || (() => {});
  const confirmAction = voice.confirmAction || (() => {});

  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-white relative pb-32">

      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md shadow-md px-6 py-4 sticky top-0 z-50 flex justify-between items-center rounded-b-xl">
        <h1 className="text-lg font-bold text-indigo-800 tracking-wide">
          Voice Shopping Assistant
        </h1>
        <button
          onClick={logout}
          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full shadow active:scale-95"
        >
          Logout
        </button>
      </header>

      <div className="px-4 mt-4 space-y-6">

        {/* RESULT PANEL */}
        <ResultPanel
          recognized={recognized}
          result={result}
          isLoading={isLoading}
          error={error}
          lastRaw={lastRaw}
        />

        {/* RECOMMENDATIONS */}
        <Recommendations />

        {/* SHOPPING LIST */}
        <ShoppingList />
      </div>

      {/* Floating Mic */}
      <VoiceButton
        listening={listening}
        onStart={startListening}
        onStop={stopListening}
      />

      {/* Overlay */}
      <VoiceOverlay
        open={overlayOpen}
        listening={listening}
        recognized={recognized}
        onClose={stopListening}
      />

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md py-3 shadow-inner text-center text-xs text-gray-600">
        © 2025 • Voice Shopping Assistant
      </footer>
    </div>
  );
}
