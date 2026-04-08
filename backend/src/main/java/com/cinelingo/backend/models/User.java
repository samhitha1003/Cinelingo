package com.cinelingo.backend.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;
    private String nativeLanguage;
    private String targetLanguage;
    private String proficiencyLevel;    // beginner/intermediate/advanced
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime lastActive;
    private Streak streak;
    private Settings settings;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Streak {
        private int current;
        private int longest;
        private LocalDateTime lastStudied;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Settings {
        private String accentTarget;        // american/british/australian
        private int dailyGoalMinutes;
        private boolean notificationsEnabled;
    }
}