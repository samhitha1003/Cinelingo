package com.cinelingo.backend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "challenges")
public class Challenge {
    @Id
    private String id;

    @Indexed
    private String fromUserId;

    @Indexed
    private String toUserId;

    private String scenarioId;
    private String gameMode;
    private String message;

    private String status; // "pending", "accepted", "declined", "completed"

    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;
    private LocalDateTime completedAt;

    private Integer winnerUserId; // Who won the challenge
    private Integer fromUserScore;
    private Integer toUserScore;
}