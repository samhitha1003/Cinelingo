package com.cinelingo.backend.controllers;

import com.cinelingo.backend.models.Score;
import com.cinelingo.backend.services.LeaderboardService;
import com.cinelingo.backend.services.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class LeaderboardController {

    private final LeaderboardService leaderboardService;
    private final ScoreService scoreService;

    // ── GET /api/leaderboard  (optional ?mode=story|survival|timeAttack) ─────
    @GetMapping
    public ResponseEntity<List<Score>> getLeaderboard(
            @RequestParam(required = false) String mode) {
        List<Score> scores = (mode != null && !mode.equals("all"))
                ? leaderboardService.getTopScoresByMode(mode, 50)
                : leaderboardService.getTopScores(50);
        return ResponseEntity.ok(scores);
    }

    // ── GET /api/leaderboard/global ───────────────────────────────────────────
    @GetMapping("/global")
    public ResponseEntity<List<Score>> getGlobal() {
        return ResponseEntity.ok(leaderboardService.getTopScores(50));
    }

    // ── GET /api/leaderboard/mode/{mode} ─────────────────────────────────────
    @GetMapping("/mode/{mode}")
    public ResponseEntity<List<Score>> getByMode(@PathVariable String mode) {
        return ResponseEntity.ok(leaderboardService.getTopScoresByMode(mode, 50));
    }

    // ── GET /api/leaderboard/rank/{userId} ───────────────────────────────────
    @GetMapping("/rank/{userId}")
    public ResponseEntity<Map<String, Object>> getUserRank(@PathVariable String userId) {
        long rank      = leaderboardService.getUserRank(userId);
        int  bestScore = leaderboardService.getUserBestScore(userId);
        return ResponseEntity.ok(Map.of(
                "rank",      rank > 0 ? rank : 0,
                "bestScore", bestScore
        ));
    }
}