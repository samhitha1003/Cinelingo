package com.cinelingo.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameScoreDTO {
    private String userId;
    private String gameMode;        // "story", "time_attack", "dub_battle", etc.
    private Integer levelId;
    private String scenarioId;
    private int totalScore;
    private int livesRemaining;
    private int timeRemaining;
    private int commandsCompleted;
    private int comboAchieved;
    private Double pronunciationAccuracy;
    private String status;          // "victory", "gameover", "time_up"
}