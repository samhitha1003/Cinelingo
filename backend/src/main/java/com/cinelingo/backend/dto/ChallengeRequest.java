package com.cinelingo.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeRequest {
    private String fromUserId;
    private String toUserId;
    private String scenarioId;
    private String gameMode;
    private String message;
}