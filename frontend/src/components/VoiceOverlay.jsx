import React from "react";

/**
 * Fullscreen listening overlay.
 * Shows recognized speech + simple loader circle.
 */

export default function VoiceOverlay({ open, listening, recognized, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-6">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Listening…
          </h2>

          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        {/* Loader circle */}
        <div className="w-full flex justify-center my-4">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Status text */}
        <p className="text-center text-sm text-gray-600 mb-3">
          {listening ? "Speak your command." : "Not listening."}
        </p>

        {/* Recognized speech */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Recognized</div>
          <div className="min-h-[48px] border rounded-lg p-3 text-sm text-gray-800">
            {recognized || <span className="text-gray-400">No speech yet…</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
