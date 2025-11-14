import React from "react";

/**
 * ResultPanel
 * ---------------------------------------------------------
 * Shows:
 *  - Recognized speech
 *  - NLP intent + score
 *  - Top matched product
 *  - Loading state
 *  - Apply result feedback
 */

export default function ResultPanel({
  recognized,
  result,
  isLoading,
  error,
  lastRaw,
}) {
  return (
    <section className="mt-6">

      {/* Recognized Speech */}
      <div className="rounded-lg border p-3 bg-white">
        <div className="text-xs text-gray-500">Recognized Speech</div>
        <div className="text-sm text-gray-900 mt-1 min-h-[20px]">
          {recognized || lastRaw || (
            <span className="text-gray-400">Say something…</span>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-3 p-3 rounded-lg border border-dashed flex items-center gap-3 bg-gray-50">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm text-gray-600">Processing…</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* NLP Result */}
      {result && !isLoading && !error && (
        <div className="mt-3 p-4 rounded-lg bg-gray-50 border">

          {/* Intent */}
          <div>
            <div className="text-xs text-gray-500">Intent</div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm font-medium text-gray-900">
                {result.intent}
              </div>
              <div className="text-xs text-gray-500">
                score: {Math.round((result.intentScore || 0) * 100) / 100}
              </div>
            </div>
          </div>

          {/* Best match */}
          <div className="mt-3">
            <div className="text-xs text-gray-500">Best Match</div>

            {result.matches?.length > 0 ? (
              <div className="mt-2 bg-white p-3 rounded-md border">
                <div className="text-sm font-semibold">
                  {result.matches[0].name}
                </div>
                <div className="text-xs text-gray-500">
                  {result.matches[0].brand || "Generic"} •{" "}
                  {result.matches[0].category || "Unknown"}
                </div>
                <div className="text-sm text-indigo-600 mt-1">
                  ₹{result.matches[0].price ?? "—"}
                </div>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500">
                No product matched.
              </div>
            )}
          </div>

          {/* Applied Action Feedback */}
          {result.applied && (
            <div className="mt-3 p-3 rounded-md bg-green-50 border border-green-100 text-sm text-green-700">
              Updated: {result.applied.message || "Action applied"}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
