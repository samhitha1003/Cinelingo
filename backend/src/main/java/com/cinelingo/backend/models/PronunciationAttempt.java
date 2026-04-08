package com.cinelingo.backend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PronunciationAttempt {
    private String phrase;
    private int score;
    private LocalDateTime timestamp;
}