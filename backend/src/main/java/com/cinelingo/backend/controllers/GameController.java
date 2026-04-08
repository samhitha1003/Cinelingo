package com.cinelingo.backend.controllers;

import com.cinelingo.backend.models.Score;
import com.cinelingo.backend.services.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class GameController {

    private final ScoreService scoreService;

    // ── POST /api/scores  ← Game.jsx calls this ───────────────────────────────
    @PostMapping("/api/scores")
    public ResponseEntity<Score> saveScore(@RequestBody Score score) {
        return ResponseEntity.ok(scoreService.saveScore(score));
    }

    // ── POST /api/game/score (legacy alias) ───────────────────────────────────
    @PostMapping("/api/game/score")
    public ResponseEntity<Score> saveScoreLegacy(@RequestBody Score score) {
        return ResponseEntity.ok(scoreService.saveScore(score));
    }

    // ── GET /api/game/scores/{userId} ─────────────────────────────────────────
    @GetMapping("/api/game/scores/{userId}")
    public ResponseEntity<List<Score>> getUserScores(@PathVariable String userId) {
        return ResponseEntity.ok(scoreService.getScoresByUser(userId));
    }

    // ── GET /api/game/stats/{userId} ──────────────────────────────────────────
    @GetMapping("/api/game/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable String userId) {
        long gamesPlayed = scoreService.getGamesPlayed(userId);
        long victories   = scoreService.getVictoryCount(userId);
        double winRate   = gamesPlayed > 0 ? (double) victories / gamesPlayed * 100 : 0;
        return ResponseEntity.ok(Map.of(
                "gamesPlayed", gamesPlayed,
                "victories",   victories,
                "winRate",     Math.round(winRate * 10.0) / 10.0
        ));
    }
}