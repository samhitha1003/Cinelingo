package com.cinelingo.backend.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pronunciation_sessions")
public class PronunciationSession {

    @Id
    private String id;

    private String userId;
    private String clipId;
    private String recordingUrl;
    private String targetText;
    private String transcribedText;
    private Scores scores;
    private List<PhonemeAnalysis> phonemeAnalysis;
    private String accentFeedback;
    private double improvedFrom;
    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Scores {
        private double accuracyScore;
        private double accentScore;
        private double fluencyScore;
        private double rhythmScore;
        private double overallScore;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PhonemeAnalysis {
        private String phoneme;
        private String expected;
        private String actual;
        private boolean correct;
        private String feedback;
    }
}