package com.cinelingo.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyPracticeRequest {
    private String userId;
    private String wordId;
    private int currentMastery;
    private int pronunciationScore;
    private boolean correct;
}