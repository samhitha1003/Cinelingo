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
@Document(collection = "recommendations")
public class Recommendation {
    @Id
    private String id;

    @Indexed
    private String userId;

    private Integer levelId;
    private String gameMode;
    private String scenarioId;

    private String reason;        // "Review struggling words"
    private Integer matchScore;   // 0-100 confidence

    private LocalDateTime createdAt;
    private Boolean viewed;
    private Boolean accepted;
}