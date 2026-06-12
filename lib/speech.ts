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

export function speakSelectedText(text: string) {
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

  const voice = getLearningVoice(window.speechSynthesis.getVoices());
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || utterance.lang;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}
