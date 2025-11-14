import React from "react";

/**
 * Floating mic button (bottom-right)
 * Pulses when listening.
 */

export default function VoiceButton({ listening, onStart, onStop }) {
  return (
    <button
      onClick={listening ? onStop : onStart}
      className={`fixed bottom-6 right-4 z-50 rounded-full shadow-2xl 
        flex items-center justify-center transition-all active:scale-95
        ${listening ? "w-16 h-16 bg-red-500 animate-pulse" : "w-14 h-14 bg-indigo-600"}
      `}
    >
      {listening ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M12 1v11m0 0a3 3 0 003-3V6a3 3 0 10-6 0v3a3 3 0 003 3zm-6 5v2a6 6 0 0012 0v-2"
          />
        </svg>
      )}
    </button>
  );
}
