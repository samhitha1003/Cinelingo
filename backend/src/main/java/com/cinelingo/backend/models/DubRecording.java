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
@Document(collection = "dub_recordings")
public class DubRecording {

    @Id
    private String id;

    private String userId;
    private String clipId;
    private String recordingUrl;
    private String finalDubUrl;
    private Scores scores;
    private boolean isPublic;
    private int likes;
    private List<CommunityRating> communityRatings;
    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Scores {
        private double timingScore;
        private double pronunciationScore;
        private double accentScore;
        private double emotionMatchScore;
        private double overallScore;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommunityRating {
        private String userId;
        private double rating;
        private String comment;
    }
}