package com.cinelingo.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PronunciationAnalysis {
    private int overallScore;           // 0-100
    private Map<String, Integer> phonemeScores;  // {"ㄱ": 85, "ㄴ": 92}
    private List<String> suggestions;   // ["Practice 'ㄹ' sound"]
    private String feedback;            // "Good effort!"
    private double accuracy;            // Alternative score format
    private Map<String, Object> metadata; // Timing, confidence, etc.
}