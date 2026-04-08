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
@Document(collection = "subtitles")
public class Subtitle {

    @Id
    private String id;

    private String clipId;
    private String language;
    private List<Line> lines;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Line {
        private long startTime;             // milliseconds
        private long endTime;
        private String text;
        private String speaker;
        private String emotion;             // angry/sad/excited
        private List<String> vocabularyIds;
        private List<String> grammarPatternIds;
    }
}