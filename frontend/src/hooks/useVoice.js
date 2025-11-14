import { useEffect, useRef, useState } from "react";
import Api from "../api/Api";
import { useList } from "../contexts/ListContext";

export default function useVoice() {
  const { applyBackendAction } = useList();

  const recognitionRef = useRef(null);
  const hasStartedRef = useRef(false);  // prevents false restarts

  const [listening, setListening] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const [recognized, setRecognized] = useState("");
  const [lastRaw, setLastRaw] = useState(null);

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // iOS block
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isIOS) {
    return {
      listening: false,
      overlayOpen: false,
      isLoading: false,
      recognized: "",
      result: null,
      error: "Voice recognition not supported on iOS Safari.",
      startListening: () => {},
      stopListening: () => {},
      confirmAction: () => {},
    };
  }

  // ------------------------------------------------------
  // INIT RECOGNIZER
  // ------------------------------------------------------
  useEffect(() => {
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      setError("Speech recognition not supported.");
      return;
    }

    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.interimResults = false;

    // Debug log
    rec.onstart = () => {
      console.log("🎤 Recognition started");
      hasStartedRef.current = true;
    };

    // Fired when browser detects speech
    rec.onresult = async (event) => {
      const text =
        event.results[event.results.length - 1][0].transcript;

      console.log("🎤 Heard:", text);

      setRecognized(text);
      setLastRaw(text);

      await processSpeech(text);
    };

    rec.onerror = (e) => {
      console.log("❌ Speech error:", e.error);

      if (e.error === "not-allowed") {
        setError("Microphone permission denied.");
        stopListening();
        return;
      }

      // Chrome fake error when start() called twice — ignore
      if (e.error === "network") return;

      setError("Speech error: " + e.error);
      stopListening();
    };

    rec.onend = () => {
      console.log("⛔ Recognition ended");

      // restart only if user is still listening
      if (listening && hasStartedRef.current) {
        console.log("🔄 Restarting recognition...");
        try {
          rec.start();
        } catch (_) {}
      }
    };

    recognitionRef.current = rec;

    return () => rec.stop();
  }, [listening]);

  // ------------------------------------------------------
  // PROCESS SPEECH
  // ------------------------------------------------------
  async function processSpeech(text) {
    setIsLoading(true);
    setError(null);

    try {
      const translated = await Api.Translate.toEnglish(text);
      const english = translated.text;

      console.log("🌐 Translated:", english);

      const parsed = await Api.Voice.parse(english);
      console.log("🧠 Parsed:", parsed);

      setResult(parsed);
    } catch (err) {
      console.error("Parse Error:", err);
      setError(err.message || "Failed to process speech.");
    }

    setIsLoading(false);
  }

  // ------------------------------------------------------
  // CONFIRM BACKEND ACTION
  // ------------------------------------------------------
  async function confirmAction(payload) {
    setIsLoading(true);

    try {
      const res = await Api.Voice.apply(payload);

      console.log("🔁 Apply Response:", res);

      applyBackendAction(res);

      setResult((prev) =>
        prev ? { ...prev, applied: res } : { applied: res }
      );
    } catch (err) {
      setError("Action failed: " + err.message);
    }

    setIsLoading(false);
  }

  // ------------------------------------------------------
  // START LISTENING
  // ------------------------------------------------------
  function startListening() {
    if (!recognitionRef.current) return;

    console.log("▶️ startListening()");

    hasStartedRef.current = false;
    setListening(true);
    setOverlayOpen(true);

    setRecognized("");
    setResult(null);
    setError(null);

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log("start() error ignored:", e);
    }
  }

  // ------------------------------------------------------
  // STOP LISTENING
  // ------------------------------------------------------
  function stopListening() {
    if (!recognitionRef.current) return;
    console.log("⏹ stopListening()");

    setListening(false);
    setOverlayOpen(false);

    try {
      recognitionRef.current.stop();
    } catch (_) {}
  }

  return {
    listening,
    recognized,
    result,
    isLoading,
    error,
    lastRaw,
    overlayOpen,
    startListening,
    stopListening,
    confirmAction,
  };
}
