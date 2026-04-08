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
@Document(collection = "vocabulary")
public class Vocabulary {

    @Id
    private String id;

    private String word;
    private String language;
    private String partOfSpeech;            // noun/verb/adjective
    private List<Definition> definitions;
    private String pronunciationUrl;
    private String phonetic;                // IPA notation
    private int difficultyLevel;            // 1-10
    private List<String> clipIds;
    private List<String> synonyms;
    private List<String> antonyms;
    private String culturalNote;
    private boolean isIdiom;
    private String frequency;              // common/rare/academic

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Definition {
        private String meaning;
        private String exampleSentence;
        private String register;           // formal/informal/slang
    }
}