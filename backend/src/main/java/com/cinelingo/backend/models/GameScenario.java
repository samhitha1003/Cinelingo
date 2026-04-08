package com.cinelingo.backend.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "game_scenarios")
public class GameScenario {

    @Id
    private String id;

    private String title;                  // "Hide from Thugs"
    private String type;                   // hiding/heist/spy/disaster/chase
    private String language;
    private int difficultyLevel;
    private String description;
    private String setting;
    private String videoBackgroundUrl;
    private List<Stage> stages;
    private int totalStages;
    private int estimatedMinutes;
    private int unlockedAtLevel;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Stage {
        private int stageNumber;
        private String situation;
        private String aiCharacterPrompt;
        private List<String> expectedVocabulary;
        private List<String> expectedGrammar;
        private String successCondition;
        private String failCondition;
        private Integer timeLimit;
        private Double volumeLimit;
    }
}