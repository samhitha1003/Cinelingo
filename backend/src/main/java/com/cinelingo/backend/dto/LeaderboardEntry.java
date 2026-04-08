package com.cinelingo.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {
    private String scoreId;
    private String userId;
    private String username;
    private String avatar;
    private String level;
    private int totalScore;
    private double accuracyRate;
    private String gameMode;
    private LocalDateTime playedAt;
}