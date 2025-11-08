export {};

declare global {
  // We don't actually need to model SpeechRecognition internals here.
  // Just tell TS these names exist.
  interface Window {
    webkitSpeechRecognition?: unknown;
    SpeechRecognition?: unknown;
  }

  const webkitSpeechRecognition: unknown;
  const SpeechRecognition: unknown;
}
