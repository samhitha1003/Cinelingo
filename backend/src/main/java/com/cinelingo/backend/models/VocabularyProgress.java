package com.cinelingo.backend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyProgress {
    private int mastery;              // 0-100
    private int attempts;
    private int correctAttempts;
    private LocalDateTime lastPracticed;
    private LocalDateTime masteredAt;
    private int srsInterval;          // Days until next review
    private String lastMistakeType;   // "pronunciation", "grammar", "timing"
}