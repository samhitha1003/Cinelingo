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
@Document(collection = "game_sessions")
public class GameSession {

    @Id
    private String id;

    private String userId;
    private String mode;               // story/timeAttack/dubBattle/survival
    private int level;
    private String scenarioId;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String status;             // active/completed/failed
    private Scores scores;
    private List<Command> commands;
    private int hintsUsed;
    private List<String> mistakes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Scores {
        private double pronunciationScore;
        private double accentScore;
        private double grammarScore;
        private double fluencyScore;
        private double responseSpeed;
        private double taskCompletion;
        private double totalScore;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Command {
        private String spokenText;
        private LocalDateTime timestamp;
        private double volume;
        private String actionTriggered;
        private boolean correct;
    }
}