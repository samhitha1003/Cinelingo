package com.cinelingo.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardRank {
    private String userId;
    private String bestScoreId;
    private int rank;
    private int score;
}