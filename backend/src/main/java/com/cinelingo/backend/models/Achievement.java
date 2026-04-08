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
@Document(collection = "achievements")
public class Achievement {

    @Id
    private String id;

    private String userId;
    private List<AchievementItem> achievements;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AchievementItem {
        private String type;
        private String title;
        private String description;
        private String iconUrl;
        private LocalDateTime unlockedAt;
        private String rarity;             // common/rare/legendary
    }
}