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
@Document(collection = "grammar_exercises")
public class GrammarExercise {

    @Id
    private String id;

    private String grammarPatternId;
    private String clipId;
    private String type;           // fillInBlanks/reorder/errorCorrection/dialogueComplete
    private String question;
    private List<String> options;
    private String correctAnswer;
    private String explanation;
    private int difficultyLevel;
    private List<String> hints;
}