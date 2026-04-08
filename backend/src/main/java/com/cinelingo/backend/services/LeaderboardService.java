package com.cinelingo.backend.services;

import com.cinelingo.backend.models.Score;
import com.cinelingo.backend.repositories.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final ScoreRepository scoreRepository;

    // ── Top N scores globally ─────────────────────────────────────────────────
    public List<Score> getTopScores(int limit) {
        List<Score> all = scoreRepository.findAllByOrderByTotalScoreDesc();
        // Add rank field
        for (int i = 0; i < all.size(); i++) {
            all.get(i).setRank(i + 1);
        }
        return all.stream().limit(limit).toList();
    }

    // ── Top N scores by game mode ─────────────────────────────────────────────
    public List<Score> getTopScoresByMode(String mode, int limit) {
        List<Score> all = scoreRepository.findByGameModeOrderByTotalScoreDesc(mode);
        for (int i = 0; i < all.size(); i++) {
            all.get(i).setRank(i + 1);
        }
        return all.stream().limit(limit).toList();
    }

    // ── User's global rank ────────────────────────────────────────────────────
    public long getUserRank(String userId) {
        List<Score> all = scoreRepository.findAllByOrderByTotalScoreDesc();
        for (int i = 0; i < all.size(); i++) {
            if (userId.equals(all.get(i).getUserId())) return i + 1;
        }
        return 0;
    }

    // ── User's best score ─────────────────────────────────────────────────────
    public int getUserBestScore(String userId) {
        List<Score> scores = scoreRepository.findTopScoresByUserId(userId);
        return scores.isEmpty() ? 0 : scores.get(0).getTotalScore();
    }
}