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
@Document(collection = "grammar_patterns")
public class GrammarPattern {

    @Id
    private String id;

    private String name;                    // "Past Perfect Tense"
    private String language;
    private String explanation;
    private String formula;                 // "had + past participle"
    private List<Example> examples;
    private int difficultyLevel;
    private List<String> commonMistakes;
    private List<String> exerciseIds;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Example {
        private String sentence;
        private String translation;
        private String clipId;
        private long timestamp;
    }
}