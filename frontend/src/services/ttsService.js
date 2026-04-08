// ─────────────────────────────────────────────────────────────────────────────
// ttsService.js — Korean Text-to-Speech
// Uses Google Translate TTS (free, no API key needed for basic use)
// Falls back to Web Speech API if Google TTS fails
// ─────────────────────────────────────────────────────────────────────────────

const ttsService = {

  // ── Speak Korean text using Google Translate TTS ───────────────────────────
  speak: (text, lang = 'ko') => {
    return new Promise((resolve, reject) => {
      try {
        // Google Translate TTS URL (free, no API key needed)
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

        const audio = new Audio(url);
        audio.volume = 1.0;

        audio.onended = () => resolve();
        audio.onerror = () => {
          // Fallback to browser Web Speech API
          ttsService.speakBrowser(text, lang).then(resolve).catch(reject);
        };

        audio.play().catch(() => {
          // If autoplay blocked, use browser TTS
          ttsService.speakBrowser(text, lang).then(resolve).catch(reject);
        });

      } catch (err) {
        ttsService.speakBrowser(text, lang).then(resolve).catch(reject);
      }
    });
  },

  // ── Browser Web Speech API fallback ───────────────────────────────────────
  speakBrowser: (text, lang = 'ko-KR') => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('No TTS available'));
        return;
      }

      window.speechSynthesis.cancel(); // stop any current speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ko' ? 'ko-KR' : lang;
      utterance.rate = 0.85;   // slightly slower for learning
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to find a Korean voice
      const voices = window.speechSynthesis.getVoices();
      const koreanVoice = voices.find(v => v.lang.startsWith('ko'));
      if (koreanVoice) utterance.voice = koreanVoice;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      window.speechSynthesis.speak(utterance);
    });
  },

  // ── Speak slowly (for beginners) ─────────────────────────────────────────
  speakSlow: (text) => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('No TTS available'));
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.6;    // much slower
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const koreanVoice = voices.find(v => v.lang.startsWith('ko'));
      if (koreanVoice) utterance.voice = koreanVoice;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      window.speechSynthesis.speak(utterance);
    });
  },

  // ── Stop any current speech ───────────────────────────────────────────────
  stop: () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  },

  // ── Get audio URL for Google TTS (can be used in <audio> tag) ─────────────
  getAudioUrl: (text, lang = 'ko') => {
    return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
  },
};

export default ttsService;