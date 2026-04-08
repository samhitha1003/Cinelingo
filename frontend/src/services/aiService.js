import axios from 'axios';

const AI_BASE_URL = 'http://localhost:8000/api';

const aiAPI = {

  // Analyze Korean text — get morphemes, particles, speech level
  analyzeText: (text, clipId = null) => {
    return axios.post(`${AI_BASE_URL}/nlp/analyze`, {
      text,
      clipId
    });
  },

  // Extract vocabulary from subtitle line
  extractVocabulary: (text, clipId = null) => {
    return axios.post(`${AI_BASE_URL}/nlp/extract-vocabulary`, {
      text,
      clipId
    });
  },

  // Detect formal vs informal Korean
  detectSpeechLevel: (text) => {
    return axios.post(`${AI_BASE_URL}/nlp/speech-level`, {
      text
    });
  },

  // Score pronunciation — sends audio file
  scorePronunciation: (audioBlob, expectedText, userId) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('expectedText', expectedText);
    formData.append('userId', userId || '');
    return axios.post(`${AI_BASE_URL}/pronunciation/score`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

};

export default aiAPI;