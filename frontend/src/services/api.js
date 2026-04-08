import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Attach JWT to every request ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinelingo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Global 401 handler ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cinelingo_token');
      localStorage.removeItem('cinelingo_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Users ────────────────────────────────────────────────────────────────────
export const userAPI = {
  register:      (data)         => api.post('/users/register', data),
  login:         (data)         => api.post('/users/login', data),
  getProfile:    (userId)       => api.get(`/users/${userId}`),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
  getStreak:     (userId)       => api.get(`/users/${userId}/streak`),
};

// ── Clips ────────────────────────────────────────────────────────────────────
export const clipAPI = {
  getAllClips:     ()            => api.get('/clips'),
  getClipById:    (clipId)      => api.get(`/clips/${clipId}`),
  getByDifficulty:(min, max)    => api.get(`/clips/difficulty/${min}/${max}`),
  getByGenre:     (genre)       => api.get(`/clips/genre/${genre}`),
  addClip:        (data)        => api.post('/clips', data),
  incrementView:  (clipId)      => api.put(`/clips/${clipId}/view`),
};

// ── Vocabulary ───────────────────────────────────────────────────────────────
export const vocabAPI = {
  getAllVocabulary: ()           => api.get('/vocabulary'),
  getById:         (id)         => api.get(`/vocabulary/${id}`),
  getByClip:       (clipId)     => api.get(`/vocabulary/clip/${clipId}`),
  addVocabulary:   (data)       => api.post('/vocabulary', data),
};

// ── Game / Scores ────────────────────────────────────────────────────────────
export const gameAPI = {
  saveScore:    (data)          => api.post('/game/score', data),
  getUserScores:(userId)        => api.get(`/game/scores/${userId}`),
  getBestScore: (userId)        => api.get(`/game/scores/${userId}/best`),
  getUserStats: (userId)        => api.get(`/game/stats/${userId}`),
};

// ── Leaderboard ──────────────────────────────────────────────────────────────
export const leaderboardAPI = {
  getGlobal:   ()               => api.get('/leaderboard'),
  getByMode:   (mode)           => api.get(`/leaderboard?mode=${mode}`),
  getUserRank: (userId)         => api.get(`/leaderboard/rank/${userId}`),
};

// ── Spaced Repetition ────────────────────────────────────────────────────────
export const srsAPI = {
  addWord:      (data)          => api.post('/srs/add', data),
  submitReview: (data)          => api.post('/srs/review', data),
  getDueWords:  (userId)        => api.get(`/srs/due/${userId}`),
  getDeck:      (userId)        => api.get(`/srs/deck/${userId}`),
  getStats:     (userId)        => api.get(`/srs/stats/${userId}`),
};

export default api;