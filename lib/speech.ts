const PREFERRED_ENGLISH_VOICE_PARTS = [
  "aria",
  "jenny",
  "guy",
  "samantha",
  "alex",
  "google us english",
  "google uk english",
  "microsoft",
  "natural",
];

export type SpeakSelectedTextOptions = {
  onEnd?: () => void;
  onError?: () => void;
  onStart?: () => void;
};

function getLearningVoice(voices: SpeechSynthesisVoice[]) {
  const englishVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("en"),
  );

  return (
    englishVoices.find((voice) => {
      const name = voice.name.toLowerCase();
      return PREFERRED_ENGLISH_VOICE_PARTS.some((part) => name.includes(part));
    }) ??
    englishVoices[0] ??
    voices[0]
  );
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
}

export function speakSelectedText(text: string, options: SpeakSelectedTextOptions = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  const trimmed = text.trim();
  if (!trimmed) return false;

  const utterance = new SpeechSynthesisUtterance(trimmed);
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  utterance.lang = "en-US";
  utterance.rate = wordCount <= 3 ? 0.82 : 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => options.onEnd?.();
  utterance.onerror = () => {
    options.onError?.();
    options.onEnd?.();
  };

  const voice = getLearningVoice(window.speechSynthesis.getVoices());
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || utterance.lang;
  }

  stopSpeaking();
  window.speechSynthesis.speak(utterance);
  return true;
}
