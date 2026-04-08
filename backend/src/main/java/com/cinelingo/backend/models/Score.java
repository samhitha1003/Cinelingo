package com.cinelingo.backend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "scores")
public class Score {

    @Id
    private String id;

    @Indexed
    private String userId;
    private String username;          // denormalized for fast leaderboard display

    // Game info
    private String gameMode;          // story | survival | timeAttack
    private int    level;
    private String scenarioId;        // for thriller/survival mode

    // Score data
    private int    totalScore;
    private int    livesRemaining;
    private int    timeRemaining;
    private int    commandsCompleted;
    private double accuracyRate;

    // Result
    private String status;            // victory | gameover
    private int    xpEarned;

    private LocalDateTime playedAt;

    // Transient — not stored in DB, only set during leaderboard fetch
    @Transient
    private int rank;
}