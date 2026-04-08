package com.cinelingo.backend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_progress")
public class UserProgress {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    // XP & Level
    private int totalXp;
    private String currentLevel; // "beginner", "intermediate", "advanced"
    private int currentStreak;
    private LocalDateTime lastActiveDate;

    // Vocabulary Progress
    private Map<String, VocabularyProgress> vocabularyProgress; // wordId -> progress

    // Game Stats
    private List<Integer> completedLevels;
    private Map<String, Integer> gameModeStats; // "story" -> gamesPlayed

    // Pronunciation Tracking
    private List<PronunciationAttempt> pronunciationAttempts;
    private Double averagePronunciationScore;
    private Double bestPronunciationScore;

    // SRS & Learning
    private List<String> masteredWordIds;
    private List<String> strugglingWordIds;
    private Map<String, Integer> genrePreferences;

    // Social
    private List<String> friendIds;
    private List<String> challengeIds;

    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}